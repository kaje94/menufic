import { Container, Title, Button, Text, BackgroundImage, Box, Center, Overlay, Stack } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useStyles } from "./style";
import { env } from "src/env/client.mjs";
import Link from "next/link";
import QRCode from "react-qr-code";

export const SampleMenu: FC = () => {
    const { classes, theme } = useStyles();
    const [sampleRestaurantLink, setSampleLink] = useState("");
    useEffect(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setSampleLink(`${origin}/restaurant/${env.NEXT_PUBLIC_SAMPLE_MENU_ID}/menu`);
    }, []);

    return (
        <BackgroundImage src="landing-restaurant-bg.avif" className={classes.parallaxBg}>
            <Center mih="65vh">
                <Container className={classes.stepperWrap} size="xs">
                    <Overlay opacity={0.5} color={theme.white} blur={4} zIndex={0} />

                    <Stack className={classes.stepperContents} align="center" pb="xl">
                        <Title className={classes.sectionTitle}>What is your digital menu going to look like?</Title>
                        <Box p="md" sx={{ borderRadius: theme.radius.lg }} bg={theme.white}>
                            <QRCode value={sampleRestaurantLink} style={{ height: 250, width: 250 }} />
                        </Box>
                        <Text color={theme.black} size="lg" align="center" weight="bold">
                            Scan this QR code or click the following button to view a sample menu
                        </Text>
                        <Link href={sampleRestaurantLink} target="_blank">
                            <Button size="lg">Sample Menu</Button>
                        </Link>
                    </Stack>
                </Container>
            </Center>
        </BackgroundImage>
    );
};
