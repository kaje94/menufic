import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ColorScheme } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { api } from "src/utils/api";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { getMantineTheme } from "src/styles/theme";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const preferredColorScheme = useColorScheme();

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "mantine-color-scheme",
        defaultValue: preferredColorScheme,
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={getMantineTheme(colorScheme)}>
                <NotificationsProvider>
                    <SessionProvider session={session}>
                        <Component {...pageProps} />
                    </SessionProvider>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default api.withTRPC(MyApp);
