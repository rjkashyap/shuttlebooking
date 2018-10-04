//webtask-stripe-bookingOrder

/**
* @param context {WebtaskContext}
*/

//stripe JS
var stripe = require('stripe');

module.exports = function(ctx, cb) {

//calls the API from stripe to create order
stripe(ctx.secrets.secre-stripeTestPrivate-key).orders.create({
  currency:'nzd',
  email=ctx.body.email,
  metadata:{
    phone=ctx.body.phone
  },items: [
    {
      type: 'sku',
      parent: ctx.body.product,
      quantity: ctx.body.quantity
    }
    ]
  }, function(err, order) {
    // Return a new order Stripe's object created !
    // asynchronously called
    cb(null, { order: order || err });
  });
}

//webtask-stripe-payment

// Dont forget to import Stripe.js
var stripe = require('stripe@6.10.0');

module.exports = function(ctx, cb) {

    // Call Stripe API to pay an order
    // Pass order id and stripe credit card token (POST variables)
    stripe(ctx.secrets.stripe_private_api_key).orders.pay(ctx.body.order, {
    source: ctx.body.token
    }, function(err, paid_order) {
        // called asynchronously
        // Return the result of the Stripe payment process
        cb(null, { paid_order: paid_order || err });
    });
};

//webtask-stripe-shuttleBooking

/**
* @param context {WebtaskContext}
*/

'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import stripe from 'stripe';

bodyParser.urlencoded();

var app = express();
app.use(bodyParser.urlencoded());

app.post('/payment', (req,res) => {
  var ctx = req.webtaskContext;
  var STRIPE_SECRET_KEY = ctx.secrets.stripe_private_api_key;

  stripe(STRIPE_SECRET_KEY).charges.create({
    amount: req.query.amount,
    currency: req.query.currency,
    source: req.body.stripeToken,
    description: req.query.description
  }, (err, charge) => {
    const status = err ? 400: 200;
    const message = err ? err.message: 'Payment done!';
    res.writeHead(status, { 'Content-Type': 'text/html' });
    return res.end('<h1>' + message + '</h1>');
  });
});

// comment this to disable the test form
app.get('/', (req, res) => {
  var ctx = req.webtaskContext;
  res.send(renderView(ctx));
});

function renderView(ctx) {
  //change /stripe-payment below to your task name
  return `
  <form action="/stripe-payment/payment?currency=USD&amount=2000&description=Test%20item" method="POST">
    <script
      src="https://checkout.stripe.com/checkout.js" class="stripe-button"
      data-key="${ctx.secrets.STRIPE_PUBLISHABLE_KEY}"
      data-amount="2000"
      data-name="Stripe.com"
      data-description="Test item"
      data-locale="auto">
    </script>
  </form>
  `;
}

module.exports = fromExpress(app);

//stripe_private_api_key: sk_test_90mDtHmeub76YWkaHyUc2Feh
//access/FWSailesh
