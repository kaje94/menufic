import type { FC } from "react";

import { BackgroundImage, Box, Button, Container, Stack, Title, Transition } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useStyles } from "./style";
import { LoginOptions } from "../LoginOptions";

export const Hero: FC = () => {
    const { classes, theme } = useStyles();
    const { status } = useSession();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const t = useTranslations("landing.hero");
    const tCommon = useTranslations("common");

    return (
        <BackgroundImage className={classes.headerBg} mih="calc(100vh - 60px)" src="/landing-hero-bg.svg">
            <Container h="100%" size="lg">
                <Stack className={classes.containerStack}>
                    <Title className={classes.titleText} color={theme.colors.dark[5]} weight="lighter">
                        {t("tagLine1")}
                    </Title>
                    <Title
                        className={classes.titleText}
                        gradient={theme.defaultGradient}
                        variant="gradient"
                        weight="bold"
                    >
                        {t("tagLine2")}
                    </Title>
                    <Title className={classes.titleText} color={theme.black} weight="normal">
                        {t("tagLine3")}
                    </Title>

                    <Box mih={60} mt="xl">
                        <Transition mounted={status !== "loading"} transition="slide-up">
                            {(styles) => (
                                <Box style={styles}>
                                    {status === "authenticated" ? (
                                        <Link href="/restaurant">
                                            <Button size="xl" variant="outline">
                                                {tCommon("openDashboard")}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <LoginOptions position={isMobile ? "top" : "bottom"}>
                                            <Button className={classes.getStartedButton} size="xl">
                                                {t("getStarted")}
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
