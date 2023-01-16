import { AppShell, Box, Center, Loader } from "@mantine/core";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
// todo: absalute paths
import { Footer } from "../Footer";
import { NavHeader } from "../Header";
import { NavPanel } from "./NavPanel";
import { useSession } from "next-auth/react";

/** Shell to hold all the contents for all of the dashboard views */
export const CustomAppShell: FC<PropsWithChildren> = ({ children }) => {
    const [opened, setOpened] = useState(false);
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
            navbar={<NavPanel opened={opened} />}
            header={<NavHeader opened={opened} setOpened={setOpened} />}
            footer={<Footer />}
        >
            <Box pos="relative">{children}</Box>
        </AppShell>
    );
};
