const express = require('express');
const { ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key');
const connectDB = require('../mongo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'COMPARE Premium Subscription',
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription?canceled=true`,
      client_reference_id: req.user.id,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session.' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'your-stripe-webhook-secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    try {
      const db = await connectDB();
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            subscription: {
              type: 'premium',
              startDate: new Date(),
              endDate: null,
            } 
          } 
        }
      );
      console.log(`User ${userId} has subscribed to premium.`);
    } catch (error) {
      console.error("Failed to update user subscription in DB", error);
    }
  }

  res.json({ received: true });
});

module.exports = router;