//TO DO:
//Error Messages
//Make it responsive
'use strict';

var map; //create map as a global variable so that it is available inside the viewModel
var icon = "images/pin.png";
var defaultIcon = "images/redpin.png";
var flag = 0; //for checking sidebar open-close action
var navOpen=ko.observable(true);
// MODEL
var Model = [
    // Array containing location data
    {
        title: 'Bolgatty Palace',
        location: {
            lat: 9.9842,
            lng: 76.2672
        },

    },
    {
        title: 'Fort Kochi Beach',
        location: {
            lat: 9.9637,
            lng: 76.2375
        },

    },
    {
        title: 'Mattanchery Palace',
        location: {
            lat: 9.9583,
            lng: 76.2593
        },

    },
    {
        title: 'Hill Palace',
        location: {
            lat: 9.9526,
            lng: 76.3639
        },

    },
    {
        title: 'Paradesi Synagogue',
        location: {
            lat: 9.9575,
            lng: 76.2594
        },

    }



];

//VIEW MODEL
var ViewModel = function() {
    // functions to add markers, show data, filter locations, update infowindow content etc.
    // Run API calls to get data

    var largeInfowindow = new google.maps.InfoWindow(); //initialise the infowindow
    var markers = [];
    var self = this;
    self.filter = ko.observable('');


    //making the array containing the list of places an observable one
    self.placesList = ko.observableArray(Model);




    //creating a marker for each place
    self.placesList().forEach(function(place) {

        var marker = new google.maps.Marker({
            map: map,
            position: place.location,
            title: place.title,
            icon: defaultIcon

        });

        //adding the markers to the markers array
        place.marker = marker;
        markers.push(marker);
        //creating infowindow for each marker

        marker.addListener('click', function() {
            populateInfoWindow(place.marker, largeInfowindow);
        });

        //marker animations while hovering
        google.maps.event.addListener(place.marker, 'mouseover', function() {
            marker.setIcon(icon);
        });
        google.maps.event.addListener(place.marker, 'mouseout', function() {
            marker.setIcon(defaultIcon);
        });

    })

    //when an item in the list is clicked, the corresponding marker bounces and opens the infowindow
    self.markerBounce = function(placeClicked) {
        google.maps.event.trigger(placeClicked.marker, 'click');
        placeClicked.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            placeClicked.marker.setAnimation(null);
        }, 1000);

    };


    self.myFunction = function() {

      flag = flag + 1;
      if(flag===1){
      navOpen(true);
      console.log("It");
    }else
      if (flag === 2) { //checks if this is the second click-TO CLOSE the side bar
          console.log("worked");
          navOpen(false);
          flag = 0; //sets the flag back to 0
      }


       //PREVIOUS FUNCTION
      //   flag = flag + 1;
      //   var myElem = document.getElementsByClassName('options-box');
      //   if(flag===1){
      //   myElem[0].style.transform = "translate(0, 0)"; //upon the first click, it opens the side bar
      //   console.log("It");
      // }else
      //   if (flag === 2) { //checks if this is the second click-TO CLOSE the side bar
      //       console.log("worked");
      //       myElem[0].style.transform = "translate(-500px,0)"; //if yes, pushes it back off-screen
      //       flag = 0; //sets the flag back to 0

    };




    //live filtering function
    //1. If the filter holds no value, then the entire list is displayed
    //2. When the user enters a value, the whole placesList array and the entered value is passed
    //   the matched place is displayed

    self.filteredTitles = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            for (var i = 0; i < markers.length;)
                return self.placesList();
        } else {
            return ko.utils.arrayFilter(self.placesList(), function(place) {
                var match = place.title.toLowerCase().indexOf(filter) !== -1; // return place.title.toLowerCase().indexOf(filter) !== -1;


                place.marker.setVisible(match);
                return match;


            });
        }


    });


    function populateInfoWindow(marker, infowindow) {

        var $wikiElem = $('#wikipedia-links');
        $wikiElem.text("");
        var disName = 'kochi';
        var address = disName + marker.title; //to fetch the links related to the locations in kochi

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }


        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        //code for wikipedia ajax request.


        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
        var wikiTimeoutRequest = setTimeout(function() {
            $wikiElem.text("failed to load wikipedia resources");
        }, 8000);
        $.ajax({
            url: wikiURL,
            dataType: "jsonp",
            success: function(response) {
                var articleStr = response[1];
                var URL = 'http://en.wikipedia.org/wiki/' + articleStr;
                // Use streetview service to get the closest streetview image within
                // 50 meters of the markers position
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                infowindow.setContent('<div>' + marker.title + '</div><a href ="' + URL + '">' + URL + '</a><hr><div id="pano"></div>');

                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
                console.log(URL);
                console.log(marker.title);
                // getStreetView();
                clearTimeout(wikiTimeoutRequest);

            }
        });
    }
};

//Function to load map and start up app
var initMap = function() {
    // Load  Google Map:   map = new google.maps.Map(document.getElementById('map') etc.


    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.98,
            lng: 76.323
        },
        zoom: 13,
        mapTypeControl: false,
        styles: [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37'
                }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c'
                }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948'
                }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                }]
            }
        ],

    });

    ko.applyBindings(new ViewModel);
    //Instantiate ViewModel

};

//ko.applyBindings(new ViewModel());
