import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlProvider } from "next-intl";
import { DefaultSeo } from "next-seo";

import type { ColorScheme } from "@mantine/core";
import type { AbstractIntlMessages } from "next-intl";

import { env } from "src/env/client.mjs";
import { CustomFonts } from "src/styles/CustomFonts";
import { getMantineTheme, theme } from "src/styles/theme";
import { api } from "src/utils/api";

const MyApp: AppType<{ messages?: AbstractIntlMessages; session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const preferredColorScheme = useColorScheme();

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        defaultValue: preferredColorScheme,
        getInitialValueInEffect: true,
        key: "mantine-color-scheme",
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return (
        <>
            <DefaultSeo
                additionalMetaTags={[
                    { content: "minimum-scale=1, initial-scale=1, width=device-width", name: "viewport" },
                ]}
                openGraph={{
                    images: [{ url: `${env.NEXT_PUBLIC_PROD_URL}/menufic_banner.jpg` }],
                    siteName: "menufic.com",
                    type: "website",
                    url: env.NEXT_PUBLIC_PROD_URL,
                }}
                themeColor={theme.light.primary[6]}
                titleTemplate="Menufic - %s"
                twitter={{ cardType: "summary_large_image" }}
            />
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider theme={getMantineTheme(colorScheme)} withGlobalStyles withNormalizeCSS>
                    <CustomFonts />
                    <NotificationsProvider>
                        <SessionProvider session={session}>
                            <NextIntlProvider messages={pageProps.messages}>
                                <Component {...pageProps} />
                            </NextIntlProvider>
                            <Analytics />
                        </SessionProvider>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
};

export default api.withTRPC(MyApp);
