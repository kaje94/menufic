import type { FC } from "react";

import { BackgroundImage, Box, Button, Container, Stack, Title, Transition } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useStyles } from "./style";
import { LoginOptions } from "../LoginOptions";

export const Hero: FC = () => {
    const { classes, theme } = useStyles();
    const { status } = useSession();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

    return (
        <BackgroundImage className={classes.headerBg} mih="calc(100vh - 60px)" src="/landing-hero-bg.svg">
            <Container h="100%" size="lg">
                <Stack className={classes.containerStack}>
                    <Title className={classes.titleText} color={theme.colors.dark[5]} weight="lighter">
                        The best way to create
                    </Title>
                    <Title
                        className={classes.titleText}
                        gradient={theme.defaultGradient}
                        variant="gradient"
                        weight="bold"
                    >
                        Digital Menus
                    </Title>
                    <Title className={classes.titleText} color={theme.black} weight="normal">
                        for your restaurant
                    </Title>

                    <Box mih={60} mt="xl">
                        <Transition mounted={status !== "loading"} transition="slide-up">
                            {(styles) => (
                                <Box style={styles}>
                                    {status === "authenticated" ? (
                                        <Link href="/restaurant">
                                            <Button size="xl" variant="outline">
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                    ) : (
                                        <LoginOptions position={isMobile ? "top" : "bottom"}>
                                            <Button className={classes.getStartedButton} size="xl">
                                                Get started for free
                                            </Button>
                                        </LoginOptions>
                                    )}
                                </Box>
                            )}
                        </Transition>
                    </Box>
                </Stack>
            </Container>
        </BackgroundImage>
    );
};
