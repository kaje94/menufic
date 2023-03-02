import type { FC } from "react";

import { Button, Card, Container, Flex, SimpleGrid, Text, Title } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { env } from "src/env/client.mjs";

import { useStyles } from "./style";
import { LoginOptions } from "../LoginOptions";

export const Pricing: FC<{ scrollToContactUs: () => void }> = ({ scrollToContactUs }) => {
    const { classes, theme } = useStyles();
    const { status } = useSession();
    const t = useTranslations("landing.pricing");

    const pricingFreeCard = [
        t("freeTier.maxRestaurantCount", { count: env.NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER }),
        t("freeTier.maxMenuCount", { count: env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT }),
        t("freeTier.maxCategoryCount", { count: env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU }),
        t("freeTier.maxMenuItemCount", { count: env.NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY }),
        t("freeTier.maxBannerCount", { count: env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT }),
        t("freeTier.supportType"),
    ];

    const pricingEnterpriseCard = [
        t("enterpriseTier.maxRestaurantCount"),
        t("enterpriseTier.maxMenuCount"),
        t("enterpriseTier.maxCategoryCount"),
        t("enterpriseTier.maxMenuItemCount"),
        t("enterpriseTier.maxBannerCount"),
        t("enterpriseTier.supportType"),
    ];

    return (
        <Container py={theme.spacing.xl * 3} size="md">
            <Title className={classes.sectionTitle}>{t("title")}</Title>

            <SimpleGrid breakpoints={[{ cols: 1, maxWidth: "md" }]} cols={2} mt={50} spacing="xl">
                <Card className={classes.card} p="xl" radius="md" shadow="md">
                    <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                        {t("freeTier.label")}
                    </Text>
                    {pricingFreeCard.map((item) => (
                        <Flex key={item} align="center" gap={10} mt="sm">
                            <IconCheckbox color={theme.black} />
                            <Text color={theme.black} opacity={0.8} size="md">
                                {item}
                            </Text>
                        </Flex>
                    ))}
                    {status === "unauthenticated" && (
                        <LoginOptions position="top">
                            <Button fullWidth mt="xl" size="lg" variant="outline">
                                {t("freeTier.getStartedBtnLabel")}
                            </Button>
                        </LoginOptions>
                    )}
                </Card>
                <Card className={classes.card} p="xl" radius="md" shadow="md">
                    <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                        {t("enterpriseTier.label")}
                    </Text>
                    {pricingEnterpriseCard.map((item) => (
                        <Flex key={item} align="center" gap={10} mt="sm">
                            <IconCheckbox color={theme.black} />
                            <Text color={theme.black} opacity={0.8} size="md">
                                {item}
                            </Text>
                        </Flex>
                    ))}
                    <Button fullWidth mt="xl" onClick={() => scrollToContactUs()} size="lg">
                        {t("enterpriseTier.contactUsButtonLabel")}
                    </Button>
                </Card>
            </SimpleGrid>
        </Container>
    );
};
