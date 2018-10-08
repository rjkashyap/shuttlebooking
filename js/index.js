//jQuery time

$(function() {
  // add input listeners
  google.maps.event.addDomListener(window, 'load', function() {
    // var autocomplete = new google.maps.places.Autocomplete(input);
    //
    //     // Set initial restrict to the greater list of countries.
    //     autocomplete.setComponentRestrictions(
    //         {'country': ['us', 'pr', 'vi', 'gu', 'mp']});
    //
    //     // Specify only the data fields that are needed.
    //     autocomplete.setFields(
    //         ['address_components', 'geometry', 'icon', 'name']);
    var original = document.getElementById('from_places');
    var destiny = document.getElementById('to_places');
    var from_places = new google.maps.places.Autocomplete(original).setComponentRestrictions({'country': ['nz'] });
    var to_places = new google.maps.places.Autocomplete(destiny).setComponentRestrictions({'country': ['nz'] });
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
  });
  // calculate distance
  function calculateDistance() {
    var origin = $('#origin').val();
    var destination = $('#destination').val();
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      //restricts to NZ only
      componentRestrictions: {
        country: "nz"
      },
      travelMode: google.maps.TravelMode.DRIVING,
      // unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
      unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
      avoidHighways: false,
      avoidTolls: false
    }, callback);
  }
  // get distance results
  function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      $('#result').html(err);
    } else {
      var origin = response.originAddresses[0];
      var destination = response.destinationAddresses[0];
      if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
        $('#result').html("Better get on a plane. There are no roads between " + origin + " and " + destination);
      } else {
        var distance = response.rows[0].elements[0].distance;
        var duration = response.rows[0].elements[0].duration;
        console.log(response.rows[0].elements[0].distance);
        var distance_in_kilo = distance.value / 1000; // the kilom
        var fare_calc = (distance.value / 1000) * 3; // the mile
        var duration_text = duration.text;
        var duration_value = duration.value;
        $('#fare_nzd').text(fare_calc.toFixed(2));
        $('#in_kilo').text(distance_in_kilo.toFixed(2));
        $('#duration_text').text(duration_text);
        $('#duration_value').text(duration_value);
        $('#from').text(origin);
        $('#to').text(destination);
      }
    }
  }
  // print results on submit the form
  $('#distance_form').submit(function(e) {
    e.preventDefault();
    calculateDistance();
  });
});

var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$('#datetimepicker1').datetimepicker();

$("#bookNow").click(function(e) {
  alert("this method");
  // resultSection = document.getElementById("msform");
  // e.preventDefault();
  // resultSection.style.display = "block";
  // return false;
})

$(".next").click(function() {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this).parent().next();

  //activate next step on progressbar using the index of next_fs
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  //show the next fieldset
  next_fs.show();
  //hide the current fieldset with style
  current_fs.animate({
    opacity: 0
  }, {
    step: function(now, mx) {
      //as the opacity of current_fs reduces to 0 - stored in "now"
      //1. scale current_fs down to 80%
      scale = 1 - (1 - now) * 0.2;
      //2. bring next_fs from the right(50%)
      left = (now * 50) + "%";
      //3. increase opacity of next_fs to 1 as it moves in
      opacity = 1 - now;
      current_fs.css({
        'transform': 'scale(' + scale + ')',
        'position': 'absolute'
      });
      next_fs.css({
        'left': left,
        'opacity': opacity
      });
    },
    duration: 800,
    complete: function() {
      current_fs.hide();
      animating = false;
    },
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
  });
});

$(".previous").click(function() {
  if (animating) return false;
  animating = true;
  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();

  //de-activate current step on progressbar
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

  //show the previous fieldset
  previous_fs.show();
  //hide the current fieldset with style
  current_fs.animate({
    opacity: 0
  }, {
    step: function(now, mx) {
      //as the opacity of current_fs reduces to 0 - stored in "now"
      //1. scale previous_fs from 80% to 100%
      scale = 0.8 + (1 - now) * 0.2;
      //2. take current_fs to the right(50%) - from 0%
      left = ((1 - now) * 50) + "%";
      //3. increase opacity of previous_fs to 1 as it moves in
      opacity = 1 - now;
      current_fs.css({
        'left': left
      });
      previous_fs.css({
        'transform': 'scale(' + scale + ')',
        'opacity': opacity
      });
    },
    duration: 1000,
    complete: function() {
      current_fs.hide();
      animating = false;
    },
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
  });
});

// Create a Stripe client.
var stripe = Stripe('pk_test_HE1s14IaKi3E336JKWbWvjWP');
// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '18px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};
// Create an instance of the card Element.
var card = elements.create('card', {
  hidePostalCode: true,
  style: style
});
// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');
// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
/* This function should create the order in stripe before the Payment
 * the order generates an orderId Token that must be used to execute the Payment
 */
var orderId;
$(".confirmBooking").click(function() {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this).parent().next();

  //activate next step on progressbar using the index of next_fs
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
  //show the next fieldset
  next_fs.show();
  //hide the current fieldset with style
  current_fs.animate({
    opacity: 0
  }, {
    step: function(now, mx) {
      //as the opacity of current_fs reduces to 0 - stored in "now"
      //1. scale current_fs down to 80%
      scale = 1 - (1 - now) * 0.2;
      //2. bring next_fs from the right(50%)
      left = (now * 50) + "%";
      //3. increase opacity of next_fs to 1 as it moves in
      opacity = 1 - now;
      current_fs.css({
        'transform': 'scale(' + scale + ')',
        'position': 'absolute'
      });
      next_fs.css({
        'left': left,
        'opacity': opacity
      });
    },
    duration: 3000,
    complete: function() {
      current_fs.hide();
      animating = false;
    },
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
  });

  var url = 'https://wt-d749cf576d85c30c2e189db327f4a390-0.sandbox.auth0-extend.com/wt-book-shuttle';
  var order = JSON.stringify({
    "email": "aleon1220@mail.com",
    "attributes": ["house of Matet", "Auckland Airport"]
  });
  console.log("show order before POST: " + order);
  $.post(url, order, function(data, status) {
      console.log("executing POST call");
      orderId = data.order.id;
      console.log("info of data + status" + data, status);
      console.log("captured tokenwith id: " + orderId);
      console.log('bookOrderStripe created');
    })
    .fail(function() {
      alert("error in POST request");
    })
    .always(function() {
      alert("Shuttle Booking successfully created please perform payment");
    });
  // Perform other work here ...
}); //end of confirmBooking event action

//this section invokes the Web-task microservices to handle the create order and finalize Payment
// based on https://www.youtube.com/watch?v=12iA-xSuM4E&t=1s AND
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// function createOrderStripe() {
// var url = 'https://example.com/profile';
// var data = {username: 'example'};
//
// consportOrder = fetch(url, {
//   method: 'POST', // or 'PUT'
//   body: JSON.stringify(data), // data can be `string` or {object}!
//   headers:{
//     'Content-Type': 'application/json'
//   }
// })
// consportOrder
//     .then(res => res.json())
//     .then(response => console.log('Success:', JSON.stringify(response)))
//     .catch(error => console.error('Error:', error));
// }
$("#add-order").click(function() {
  //perform the POST call to create the order
  // var order = {
  // 	email: 'aleon1220@mail.com',
  // 	attributes: [
  //   	"flat of Matet",
  //   	"Auckland Airport"
  // 	]
  // };
  // $.ajax({
  // 	type: 'POST',
  // 	url: 'https://wt-d749cf576d85c30c2e189db327f4a390-0.sandbox.auth0-extend.com/wt-book-shuttle',
  // 	data: order,
  // 	sucess: function(newOrder){
  // 		console.log("successfully created order in Stripe");
  // 	},
  // 	error:function(){
  // 		alert('some problems on REST invocation');
  // 	}
  // });
});
// Handle form submission.
//for testing use card 4242 4242 4242 4242 which is a US card. refer to https://stripe.com/docs/testing#cards
//NZ card: 4000005540000008
var form = document.getElementById('msform');
var token;
form.addEventListener('submit', function(event) {
  event.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      token = result.token;
      console.log("value of token from stripe result: " + token)
      console.log("sending parameters to function payment: " + orderId, token);
      payOrderStripe(orderId, token);
      //stripeTokenHandler(result.token);
    }
  });
});

function payOrderStripe(orderId, token) {
  var paymentURL = 'https://wt-d749cf576d85c30c2e189db327f4a390-0.sandbox.auth0-extend.com/wt-stripe-payment';
  // var payToken = token;
  // var order = orderId;
  var payment = JSON.stringify({
    order: orderId,
    token
  });
  console.log("Payment Method Invoking with Ids: " + orderId, token.id);
  console.log("JSON representation of stripe payment token:" + JSON.stringify(token));
  console.log("payment object to be sent to WT in JSON:" + payment);
  $.post(paymentURL, payment, function(data) {
    console.log("executing POST call");
    //console.log("show order Payment in POST method:"+JSON.stringify(data));
    //console.log("prints status"+ status);
    //alert("Ajax post status is " + status);
  }, "json");
}
