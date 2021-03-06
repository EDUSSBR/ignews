import type { NextPage, GetServerSideProps, GetStaticProps } from 'next'
import Head from 'next/head'
import { stripe } from '../services/stripe'
import { SubscribeButton } from '../components/SubscribeButton'
import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home({product}: HomeProps) {

  return (
    <>
      <Head>
        <title>Home | Ignews</title>

      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>Get access to all publications <br />
            <span>for {product.amount} month</span>

          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>)
}

// export const getServerSideProps: GetServerSideProps = async()=>{
export const getStaticProps: GetStaticProps = async()=>{
  const product = await stripe.prices.retrieve('price_1KhXdsAT60vYj7KrLr41ZAhU')

  return {
    props: {
      product: {
        priceId: product.id,
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(product.unit_amount!/100)
      }
    },
    revalidate: 60 * 60 * 24, //24 horas
  }
}
