import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

import { theme } from "src/styles/theme";

const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link href="/favicons/favicon.ico" rel="icon" />
                    <link href="/favicons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                    <link href="/favicons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                    <link href="/manifest.webmanifest" rel="manifest" />
                    <meta content={theme.dark.dark[0]} media="(prefers-color-scheme: dark)" name="theme-color" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
