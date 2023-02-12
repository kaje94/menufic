import Document, { Head, Html, Main, NextScript } from "next/document";

const title = "Menufic - Digital menu generator";
const description =
    "A digital menu generator that lets you to create the best menu for your restaurant. Menufic is packed with several features that will boost the online presence of your restaurant with ease";
const bannerImage = "https://menufic.com/menufic_banner.jpg";

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link href="/favicon.ico" rel="icon" />
                    <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                    <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                    <meta content="#c24152" name="theme-color" />

                    <meta content={title} name="title" />
                    <meta content={description} name="description" />

                    <meta content={title} property="og:title" />
                    <meta content="menufic.com" property="og:site_name" />
                    <meta content="https://menufic.com" property="og:url" />
                    <meta content={description} property="og:description" />
                    <meta content={bannerImage} property="og:image" />

                    <meta content="summary_large_image" property="twitter:card" />
                    <meta content="https://menufic.com" property="twitter:url" />
                    <meta content={title} property="twitter:title" />
                    <meta content={description} property="twitter:description" />
                    <meta content={bannerImage} property="twitter:image" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
