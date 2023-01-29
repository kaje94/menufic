import type { FC } from "react";

import { Badge, Card, Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconBrightness2, IconClick, IconDevices, IconGauge, IconQrcode, IconSlideshow } from "@tabler/icons";

import { useStyles } from "./style";

const featuresData = [
    {
        description:
            "The generated menu page has been optimized for search engines as well as for social media crawlers and this will assure that your restaurant menu has a higher reach.",
        icon: IconGauge,
        title: "Optimized for the web",
    },
    {
        description:
            "As Menufic supports both Light and dark themes, you and your restaurant customers will have the independence to switch between these two modes.",
        icon: IconBrightness2,
        title: "Dark and Light themes",
    },
    {
        description:
            "Add multiple banners to your restaurant which can help you to convey details such as offers or promotions to your customers.",
        icon: IconSlideshow,
        title: "Promotions using banners",
    },
    {
        description:
            "Menufic provides an intuitive interface to easily manage your menus. Each restaurant can have multiple menus with multiple sub categories.",
        icon: IconClick,
        title: "Organize your data easily",
    },
    {
        description:
            "Customers can view your digital menu from the safety of their personal devices at any time, without any app install. The menu is built to adapt its layout based on the user's device.",
        icon: IconDevices,
        title: "View from any device",
    },
    {
        description:
            "Generate a QR code, print and share it with your customers by simply placing it on your restaurant tables, entrance, food packaging or delivery vehicles.",
        icon: IconQrcode,
        title: "QR code",
    },
];

export const Features: FC = () => {
    const { classes, theme } = useStyles();

    return (
        <Container py={theme.spacing.xl * 4} size="lg">
            <Group position="center">
                <Badge size="lg" variant="filled">
                    Why Menufic?
                </Badge>
            </Group>

            <Title align="center" className={classes.title} mt="sm" order={2}>
                Build your restaurant's menu with ease
            </Title>

            <Text className={classes.description}>
                Menufic has several awesome features that makes it perfect to take your restaurant's menu to the next
                level
            </Text>

            <SimpleGrid breakpoints={[{ cols: 1, maxWidth: "md" }]} cols={3} mt={50} spacing="xl">
                {featuresData.map((feature) => (
                    <Card key={feature.title} className={classes.card} p="xl" radius="md" shadow="md">
                        <feature.icon className={classes.cardIcon} />
                        <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                            {feature.title}
                        </Text>
                        <Text color={theme.black} mt="sm" opacity={0.6} size="sm">
                            {feature.description}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
};
