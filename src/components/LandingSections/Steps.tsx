import { Container, Title, BackgroundImage, Box, Overlay, Stepper } from "@mantine/core";
import type { FC } from "react";
import { useStyles } from "./style";

const steps = [
    { label: "Create restaurant", description: "Create your restaurant with basic details" },
    { label: "Add content", description: "Add menu related content to your restaurant" },
    { label: "Publish restaurant", description: "Publish your restaurant in order to make it accessible by anyone" },
    { label: "Share", description: "Share the generated QR code or the menu URL with the rest of the world" },
];

export const Steps: FC = () => {
    const { classes, theme } = useStyles();

    return (
        <BackgroundImage src="landing-restaurant-bg.avif" className={classes.parallaxBg}>
            <Container className={classes.stepperWrap} size="xl">
                <Overlay opacity={0.5} color={theme.white} blur={4} zIndex={0} />

                <Box className={classes.stepperContents}>
                    <Title className={classes.sectionTitle}>How it works?</Title>
                    <Stepper
                        size="lg"
                        active={-1}
                        breakpoint="sm"
                        classNames={{
                            stepLabel: classes.stepperLabel,
                            stepDescription: classes.stepperDesc,
                            separator: classes.stepSeparator,
                            stepIcon: classes.stepIcon,
                        }}
                        mb="lg"
                    >
                        {steps.map((step) => (
                            <Stepper.Step key={step.label} label={step.label} description={step.description} />
                        ))}
                    </Stepper>
                </Box>
            </Container>
        </BackgroundImage>
    );
};
