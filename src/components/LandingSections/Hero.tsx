import type { FC } from "react";

import { BackgroundImage, Box, Button, Container, Stack, Title, Transition } from "@mantine/core";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { useStyles } from "./style";

export const Hero: FC = () => {
    const { classes, theme } = useStyles();
    const { status } = useSession();

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
                                        <Button
                                            className={classes.getStartedButton}
                                            onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
                                            size="xl"
                                        >
                                            Get started for free
                                        </Button>
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
