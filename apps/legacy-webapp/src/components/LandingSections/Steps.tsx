import type { FC } from "react";

import { BackgroundImage, Box, Container, Overlay, Stepper, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import { useStyles } from "./style";

export const Steps: FC = () => {
    const { classes, theme } = useStyles();
    const t = useTranslations("landing.steps");

    const steps = t.raw("stepItems");

    return (
        <BackgroundImage className={classes.parallaxBg} src="landing-restaurant-bg.avif">
            <Container className={classes.stepperWrap} size="xl">
                <Overlay blur={4} color={theme.white} opacity={0.5} zIndex={0} />

                <Box className={classes.stepperContents}>
                    <Title className={classes.sectionTitle}>{t("title")}</Title>
                    <Stepper
                        active={-1}
                        breakpoint="sm"
                        classNames={{
                            separator: classes.stepSeparator,
                            stepDescription: classes.stepperDesc,
                            stepIcon: classes.stepIcon,
                            stepLabel: classes.stepperLabel,
                        }}
                        mb="lg"
                        size="lg"
                    >
                        {steps.map((step: { description: string; title: string }) => (
                            <Stepper.Step key={step.title} description={step.description} label={step.title} />
                        ))}
                    </Stepper>
                </Box>
            </Container>
        </BackgroundImage>
    );
};
