import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        )
    }
    return Buffer.concat(chunks)
}
//necessário pro next habilitar o stream
export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']
        let event: Stripe.Event
        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        } catch(e) {
            return res.status(400).send(`Webhook error: ${e.message}`)
        }
        // console.log("evento recebido.")
        const {type} = event
        //CONTOLADOR DE EVENTOS     //OLHAR O PATTERN CHAIN OF RESPONSABILITY
        if (relevantEvents.has(type)){
            try {
            switch(type) {
                case 'customer.subscription.created': // se a unica forma de fazer uma subscription é pelo site esse evento não é necessario
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':

                    const subscription = event.data.object as Stripe.Subscription

                    await saveSubscription(
                        subscription.id,
                        subscription.customer.toString(),
                        type === 'customer.subscription.created'
                    )
                    break
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session
                    await saveSubscription(
                        checkoutSession.subscription?.toString(),
                        checkoutSession.customer?.toString(),
                        true
                        )
                    break;
                default:
                    throw new Error('Unhandled event.')
            }
    } catch (e) {
        // sentry bugsnag (loggers)
        return res.json({error: 'Webhook handle failed'})
    }




            console.log('Evento recebido', event)
        }
        
        res.json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }

}