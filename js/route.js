var routeMap;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var originAddress = new google.maps.LatLng(6.470, -73.261);
var destinationAdress = new google.maps.LatLng(6.466, -73.261);

var routeMapOptions = {
      zoom: 20,
      center: originAddress,
      // new google.maps.LatLng(51.5, -0.12),
    };
routeMap = new google.maps.Map(document.getElementById("map-route"), routeMapOptions);
directionsDisplay.setMap(routeMap);

function calculateRoute() {
  var request = {
    origin: originAddress,
    destination: destinationAdress,
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function (result, status){
    console.log("route results"+ result, status);

    if (status=='OK') {
      //render the direction here
      directionsDisplay.setDirections(result);
    }
  })
};

$("#get").click(function(){
  calculateRoute();
});
