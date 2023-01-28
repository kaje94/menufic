import { AppShell, Center, Container, Loader, Overlay, useMantineTheme } from "@mantine/core";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { Footer } from "../Footer";
import { NavHeader } from "../Header";
import { useSession } from "next-auth/react";

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
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            header={<NavHeader opened={opened} setOpened={setOpened} showInternalLinks />}
            footer={<Footer />}
        >
            <Container size="xl" pos="relative" py="md">
                {opened && <Overlay color={theme.white} blur={5} zIndex={2} />}
                {children}
            </Container>
        </AppShell>
    );
};
