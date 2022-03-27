import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb'
import { stripe } from "../../../services/stripe";
export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    //buscar usuario no fauna com id {customer id do stripe}
    //trás apenas a referencia do usuario
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id', customerId)
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id // 0 por que nosso sistema só tem 1 produto
    }
    //salvar os dados da subscription do usuario no banco fauna 
    if (createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else {

        //replace troca todos dados do fauna e update para apenas um campo se quiser alterar apenas status por exemplo
        await fauna.query(
            q.Replace(
                q.Select('ref',
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId,
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}