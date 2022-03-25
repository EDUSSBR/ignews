import { Head, Html, Main, NextScript } from "next/document"
import Document, { DocumentContext } from 'next/document'

class MyDocument extends Document {
//   static async getInitialProps(ctx: DocumentContext) {
//     const initialProps = await Document.getInitialProps(ctx)

//     return initialProps
//   }
    render() {
        return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"} />
                <link rel="shortcut icon" href="/favicon.png" type="image/png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

}

export default MyDocument



// export default function Document() {
//     return (
//         <Html>
//             <Head>
//                 <link rel="preconnect" href="https://fonts.googleapis.com" />
//                 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"} />
//                 <link rel="shortcut icon" href="/favicon.png" type="image/png" />
//             </Head>
//             <body>
//                 <Main />
//                 <NextScript />
//             </body>
//         </Html>
//     )
// }