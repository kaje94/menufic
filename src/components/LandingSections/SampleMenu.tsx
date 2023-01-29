import type { FC } from "react";
import { useEffect, useState } from "react";

import { BackgroundImage, Box, Button, Center, Container, Overlay, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import QRCode from "react-qr-code";

import { env } from "src/env/client.mjs";

import { useStyles } from "./style";

export const SampleMenu: FC = () => {
    const { classes, theme } = useStyles();
    const [sampleRestaurantLink, setSampleLink] = useState("");
    useEffect(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setSampleLink(`${origin}/restaurant/${env.NEXT_PUBLIC_SAMPLE_MENU_ID}/menu`);
    }, []);

    return (
        <BackgroundImage className={classes.parallaxBg} src="landing-restaurant-bg.avif">
            <Center mih="65vh">
                <Container className={classes.stepperWrap} size="xs">
                    <Overlay blur={4} color={theme.white} opacity={0.5} zIndex={0} />

                    <Stack align="center" className={classes.stepperContents} pb="xl">
                        <Title className={classes.sectionTitle}>What is your digital menu going to look like?</Title>
                        <Box bg={theme.white} p="md" sx={{ borderRadius: theme.radius.lg }}>
                            <QRCode style={{ height: 250, width: 250 }} value={sampleRestaurantLink} />
                        </Box>
                        <Text align="center" color={theme.black} size="lg" weight="bold">
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
