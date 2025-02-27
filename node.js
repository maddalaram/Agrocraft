const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-payment', async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.json({ paymentUrl: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
