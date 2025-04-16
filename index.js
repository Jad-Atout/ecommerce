import 'dotenv/config';
import express from 'express';
import initApp from './src/app.router.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
initApp(app, express);

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const checkoutSessionCompleted = event.data.object;
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
});

app.listen(PORT, () => {
    console.log(`server is running .... ${PORT}`);
});
