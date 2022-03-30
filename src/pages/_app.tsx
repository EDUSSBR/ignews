import '../styles/global.scss'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Header from '../components/Header'

function MyApp({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return (
  <NextAuthProvider session={pageProps.session}>
  <Header />
  <Component {...pageProps} />
  </NextAuthProvider>
  )
}
// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
