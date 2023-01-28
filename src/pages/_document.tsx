import Document, { Head, Html, Main, NextScript } from "next/document";

const title = "Menufic - Digital menu generator";
const description =
    "A digital menu generator that lets you to create the best menu for your restaurant. Menufic is packed with several features that will boost the online presence of your restaurant with ease";
const bannerImage = "https://menufic.com/menufic_banner.png";

export default class _Document extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <meta name="theme-color" content="#c24152" />

                    <meta name="title" content={title} />
                    <meta name="description" content={description} />

                    <meta property="og:title" content={title} />
                    <meta property="og:site_name" content="menufic.com" />
                    <meta property="og:url" content="https://menufic.com" />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={bannerImage} />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://menufic.com" />
                    <meta property="twitter:title" content={title} />
                    <meta property="twitter:description" content={description} />
                    <meta property="twitter:image" content={bannerImage} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
