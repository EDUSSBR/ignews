import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/home.module.scss'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ignews</title>
      </Head>
      <div className={styles.title}>
        <h1>Hello World</h1>
      </div>

    </>)
}

export default Home
