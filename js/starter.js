var map; //create map as a global variable so that it is available inside the viewModel

// MODEL
var Model = [
    // Array containing location data
    {
        title: 'Marine Drive',
        location: {
            lat: 9.9825798,
            lng: 76.27542749999998
        }
    },
    {
        title: 'Subash Park',
        location: {
            lat: 9.971488299999999,
            lng: 76.27940949999993
        }
    }


];

//VIEW MODEL
var ViewModel = function() {
    // functions to add markers, show data, filter locations, update infowindow content etc.
    // Run API calls to get data
    var largeInfowindow = new google.map.InfoWindow(); //initialise the infowindow
    var markers = [];
    var self = this;
    //making the array containing the list of places an observable one
    self.placesList = ko.observableArray(Model);
    //creating a marker for each place
    self.placesList().forEach(function(place) {

        var marker = new google.maps.Marker({
            map: map,
            position: place.location,
            title: place.title

        });

        //adding the markers to the markers array
        place.marker = marker;
        markers.push(marker);
        //creating infowindow for each marker

        marker.addListener('click', function() {
            populateInfoWindow(self, largeInfowindow);
        });
    })

    function populateInfoWindow(marker, infowindow) {
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
    }

};

//Function to load map and start up app
var initMap = function() {
    // Load  Google Map:   map = new google.maps.Map(document.getElementById('map') etc.


    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.9669030,
            lng: 76.2983230
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
        ]

    });

    ko.applyBindings(new ViewModel);
    //Instantiate ViewModel
};

//ko.applyBindings(new ViewModel());
