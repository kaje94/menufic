import { Container, Title, Button, BackgroundImage, Box, Stack, Transition } from "@mantine/core";
import type { FC } from "react";
import { useStyles } from "./style";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const Hero: FC = () => {
    const { classes, theme } = useStyles();
    const { status } = useSession();

    return (
        <BackgroundImage src="/landing-hero-bg.svg" className={classes.headerBg} mih="calc(100vh - 60px)">
            <Container size="lg" h="100%">
                <Stack className={classes.containerStack}>
                    <Title color={theme.colors.dark[5]} className={classes.titleText} weight="lighter">
                        The best way to create
                    </Title>
                    <Title
                        variant="gradient"
                        weight="bold"
                        className={classes.titleText}
                        gradient={theme.defaultGradient}
                    >
                        Digital Menus
                    </Title>
                    <Title color={theme.black} className={classes.titleText} weight="normal">
                        for your restaurant
                    </Title>

                    <Box mt="xl" mih={60}>
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
                                            size="xl"
                                            className={classes.getStartedButton}
                                            onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
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
