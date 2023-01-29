import type { FC } from "react";

import { BackgroundImage, Box, Container, Overlay, Stepper, Title } from "@mantine/core";

import { useStyles } from "./style";

const steps = [
    { description: "Create your restaurant with basic details", label: "Create restaurant" },
    { description: "Add menu related content to your restaurant", label: "Add content" },
    { description: "Publish your restaurant in order to make it accessible by anyone", label: "Publish restaurant" },
    { description: "Share the generated QR code or the menu URL with the rest of the world", label: "Share" },
];

export const Steps: FC = () => {
    const { classes, theme } = useStyles();

    return (
        <BackgroundImage className={classes.parallaxBg} src="landing-restaurant-bg.avif">
            <Container className={classes.stepperWrap} size="xl">
                <Overlay blur={4} color={theme.white} opacity={0.5} zIndex={0} />

                <Box className={classes.stepperContents}>
                    <Title className={classes.sectionTitle}>How it works?</Title>
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
                        {steps.map((step) => (
                            <Stepper.Step key={step.label} description={step.description} label={step.label} />
                        ))}
                    </Stepper>
                </Box>
            </Container>
        </BackgroundImage>
    );
};
