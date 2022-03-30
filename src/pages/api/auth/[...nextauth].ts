import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from '../../../services/fauna'
import { query as q } from "faunadb"
import toast from "react-hot-toast"


//global config
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({session}) {
      const {email} = session.user
      console.log(email)
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select('ref', q.Get(         //daqui pra baixo seleciona o ref do usuario e a query acima busca usndo esse index
                  q.Match(q.Index('user_by_email'),
                    q.Casefold(email as string)
                  )
                )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'), 'active'
              )])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    } ,
    async signIn( {user, profile, account}  ) {
      const { email } = user

     
      try {
        const teste = await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(email))
              )
            ),
            q.Create(q.Collection('users'), { data: { email }}),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email)))
          )
        )
        return true
      } catch {
        toast.error('An internal error has occurred. Try again later.');
        return false;
      }

    }
  }
})