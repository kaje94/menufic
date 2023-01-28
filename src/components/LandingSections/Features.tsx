import { Container, Title, SimpleGrid, Text, Card, Badge, Group } from "@mantine/core";
import type { FC } from "react";
import { useStyles } from "./style";
import { IconBrightness2, IconClick, IconDevices, IconGauge, IconQrcode, IconSlideshow } from "@tabler/icons";

const featuresData = [
    {
        title: "Optimized for the web",
        description:
            "The generated menu page has been optimized for search engines as well as for social media crawlers and this will assure that your restaurant menu has a higher reach.",
        icon: IconGauge,
    },
    {
        title: "Dark and Light themes",
        description:
            "As Menufic supports both Light and dark themes, you and your restaurant customers will have the independence to switch between these two modes.",
        icon: IconBrightness2,
    },
    {
        title: "Promotions using banners",
        description:
            "Add multiple banners to your restaurant which can help you to convey details such as offers or promotions to your customers.",
        icon: IconSlideshow,
    },
    {
        title: "Organize your data easily",
        description:
            "Menufic provides an intuitive interface to easily manage your menus. Each restaurant can have multiple menus with multiple sub categories.",
        icon: IconClick,
    },
    {
        title: "View from any device",
        description:
            "Customers can view your digital menu from the safety of their personal devices at any time, without any app install. The menu is built to adapt its layout based on the user's device.",
        icon: IconDevices,
    },
    {
        title: "QR code",
        description:
            "Generate a QR code, print and share it with your customers by simply placing it on your restaurant tables, entrance, food packaging or delivery vehicles.",
        icon: IconQrcode,
    },
];

export const Features: FC = () => {
    const { classes, theme } = useStyles();

    return (
        <Container size="lg" py={theme.spacing.xl * 4}>
            <Group position="center">
                <Badge variant="filled" size="lg">
                    Why Menufic?
                </Badge>
            </Group>

            <Title order={2} className={classes.title} align="center" mt="sm">
                Build your restaurant's menu with ease
            </Title>

            <Text className={classes.description}>
                Menufic has several awesome features that makes it perfect to take your restaurant's menu to the next
                level
            </Text>

            <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                {featuresData.map((feature) => (
                    <Card key={feature.title} shadow="md" radius="md" className={classes.card} p="xl">
                        <feature.icon className={classes.cardIcon} />
                        <Text size="lg" weight={500} className={classes.cardTitle} color={theme.black} mt="md">
                            {feature.title}
                        </Text>
                        <Text size="sm" color={theme.black} opacity={0.6} mt="sm">
                            {feature.description}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
};
