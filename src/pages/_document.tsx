import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link href="/favicon.ico" rel="icon" />
                    <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                    <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
