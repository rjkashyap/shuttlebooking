// add input listeners
// google.maps.event.addDomListener(window, 'load', function() {
//   //text in notepad was here
// });

$( document ).ready(function() {

  google.maps.event.addDomListener(window, 'load', initMap());

  function initMap() {

    var mapOptions = {
      zoom: 10,
      //restricts to NZ only
      componentRestrictions: {
        country: "nz"
      },
      center: {
        lat: -36.848461,
        lng: 174.763336
      },
      mapTypeId: google.maps.MapTypeId.HYBRID
      // new google.maps.LatLng(51.5, -0.12),
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({
      // The below line is equivalent to writing= position: new google.maps.LatLng(-34.397, 150.644)
      position: {
        lat: -37.007215,
        lng: 174.787837
      },
      map: map
    });
    // You can use a LatLng literal in place of a google.maps.LatLng object when
    // creating the Marker object. Once the Marker object is instantiated, its
    // position will be available as a google.maps.LatLng object. In this case,
    // we retrieve the marker's position using the
    // google.maps.LatLng.getPosition() method.
    var infowindow = new google.maps.InfoWindow({
      // content: '<p> Auckland Airport :' + marker.getlabel + '</p>'
      content: '<a href= https://www.aucklandairport.co.nz target=_blank> Auckland Airport Page </a>'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
    var from = document.getElementById('from_places');
    var to = document.getElementById('to_places');
    var from_places = new google.maps.places.Autocomplete(from, mapOptions);
    var to_places = new google.maps.places.Autocomplete(to, mapOptions);
    // var from_places = new google.maps.places.Autocomplete(document.getElementById('from_places'), options);
    // var to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'), options);
    google.maps.event.addListener(from_places, 'place_changed', function() {
      var from_place = from_places.getPlace();
      var from_address = from_place.formatted_address;
      $('#origin').val(from_address);
    });

    google.maps.event.addListener(to_places, 'place_changed', function() {
      var to_place = to_places.getPlace();
      var to_address = to_place.formatted_address;
      $('#destination').val(to_address);
    });
  };// end of initMap

// calculate distance
function calculateDistance() {
  var origin = $('#origin').val();
  var destination = $('#destination').val();
  var service = new google.maps.DistanceMatrixService();
  console.log("inside calculateDistance() getting data" + origin, destination, origin);
  console.log("inside calculateDistance() showing service Matrix" + service);
  var mapsDistanceMatrix = service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    // unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
    unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
    avoidHighways: false,
    avoidTolls: false
  }, callback);
  console.log("inside calculateDistance() mapsDistanceMatrix " + mapsDistanceMatrix);
} //end of calculateDistance()

// get distance results
function callback(response, status) {
  console.log("ready inside callback()!");
  console.log("callback()! with response " + response);
  console.log("callback()! with status " + status);
  var err = '<h3> Error in callback from google maps </h3>';
  if (status != google.maps.DistanceMatrixStatus.OK) {
    $('#result').html(err);
  } else {
    var origin = response.originAddresses[0];
    var destination = response.destinationAddresses[0];
    var currency = ' NZD';
    if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
      $('#result').html("Better get on a plane. There are no roads between " + origin + " and " + destination);
    } else {
      var distance = response.rows[0].elements[0].distance;
      var duration = response.rows[0].elements[0].duration;
      console.log(response.rows[0].elements[0].distance);
      var distance_in_kilo = distance.value / 1000; // the kilometer
      var fare_calc = (distance.value / 1000) * 3; // the mile
      var duration_text = duration.text;
      var duration_value = duration.value;
      console.log("calculations" + distance_in_kilo, fare_calc, duration_text, duration_value);
      $('#fare_nzd').text(fare_calc.toFixed(2) + currency);
      $('#in_kilo').text(distance_in_kilo.toFixed(2));
      $('#duration_text').text(duration_text);
      $('#duration_value').text(duration_value);
      $('#from').text(origin);
      $('#to').text(destination);
      console.log("data from vars" + fare_calc);
      console.log(destination);
    }
  }
}

// print results on submitting the form
$('#distance_form').submit(function() {
  calculateDistance();
  console.log("has invoked calculateDistance()");
});
});//end of jQuery exec
