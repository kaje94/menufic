import type { FC } from "react";

import { Badge, Card, Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconBrightness2, IconClick, IconDevices, IconGauge, IconQrcode, IconSlideshow } from "@tabler/icons";
import { useTranslations } from "next-intl";

import { useStyles } from "./style";

const featuresData = [
    { icon: IconGauge, key: "webOptimized" },
    { icon: IconBrightness2, key: "themeSupport" },
    { icon: IconSlideshow, key: "banners" },
    { icon: IconClick, key: "organize" },
    { icon: IconDevices, key: "responsiveDesign" },
    { icon: IconQrcode, key: "qrCode" },
];

export const Features: FC = () => {
    const { classes, theme } = useStyles();
    const t = useTranslations("landing.features");
    const featureItemsTranslation: { description: string; key: string; title: string }[] = t.raw("featuresItems");

    return (
        <Container py={theme.spacing.xl * 4} size="lg">
            <Group position="center">
                <Badge size="lg" variant="filled">
                    {t("tagLine")}
                </Badge>
            </Group>

            <Title align="center" className={classes.title} mt="sm" order={2}>
                {t("title")}
            </Title>

            <Text className={classes.description}>{t("subTitle")}</Text>

            <SimpleGrid breakpoints={[{ cols: 1, maxWidth: "md" }]} cols={3} mt={50} spacing="xl">
                {featuresData.map((feature) => {
                    const tItem = featureItemsTranslation.find((item) => item.key === feature.key);
                    if (!tItem) {
                        return null;
                    }
                    return (
                        <Card key={tItem.title} className={classes.card} p="xl" radius="md" shadow="md">
                            <feature.icon className={classes.cardIcon} />
                            <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                                {tItem.title}
                            </Text>
                            <Text color={theme.black} mt="sm" opacity={0.6} size="sm">
                                {tItem.description}
                            </Text>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </Container>
    );
};
