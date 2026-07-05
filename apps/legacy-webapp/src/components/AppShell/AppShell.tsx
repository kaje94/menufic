import type { FC, PropsWithChildren } from "react";
import { useState } from "react";

import { AppShell, Center, Container, Loader, Overlay, useMantineTheme } from "@mantine/core";
import { useSession } from "next-auth/react";

import { Footer } from "../Footer";
import { NavHeader } from "../Header";

/** Shell to hold all the contents for all of the dashboard views */
export const CustomAppShell: FC<PropsWithChildren> = ({ children }) => {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    // Will redirect user to auth page if user is not logged in
    const { status } = useSession({ required: true });
    if (status === "loading") {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        );
    }
    return (
        <AppShell
            asideOffsetBreakpoint="sm"
            footer={<Footer />}
            header={<NavHeader opened={opened} setOpened={setOpened} showInternalLinks />}
            navbarOffsetBreakpoint="sm"
        >
            <Container pos="relative" py="md" size="xl">
                {opened && <Overlay blur={5} color={theme.white} zIndex={2} />}
                {children}
            </Container>
        </AppShell>
    );
};
