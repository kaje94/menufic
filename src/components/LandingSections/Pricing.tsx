import type { FC } from "react";

import { Button, Card, Container, Flex, SimpleGrid, Text, Title } from "@mantine/core";
import { IconCheckbox } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";

import { useStyles } from "./style";

const pricingFreeCard = [
    "Create upto 5 restaurants",
    "Add upto 5 menus per restaurant",
    "Add upto 10 categories per menu",
    "Add upto 20 items per category",
    "Add upto 5 banners per restaurant",
    "Basic support",
];

const pricingEnterpriseCard = [
    "Create any number of restaurants",
    "Add any number of menus per restaurant",
    "Add any number of categories per menu",
    "Add any number of items per category",
    "Add any number of banners per restaurant",
    "24/7 premium support",
];

export const Pricing: FC<{ scrollToContactUs: () => void }> = ({ scrollToContactUs }) => {
    const { classes, theme } = useStyles();
    const { status } = useSession();

    return (
        <Container py={theme.spacing.xl * 3} size="md">
            <Title className={classes.sectionTitle}>Pricing</Title>

            <SimpleGrid breakpoints={[{ cols: 1, maxWidth: "md" }]} cols={2} mt={50} spacing="xl">
                <Card className={classes.card} p="xl" radius="md" shadow="md">
                    <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                        Free
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
                        <Button
                            fullWidth
                            mt="xl"
                            onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
                            size="lg"
                            variant="outline"
                        >
                            Get Started
                        </Button>
                    )}
                </Card>
                <Card className={classes.card} p="xl" radius="md" shadow="md">
                    <Text className={classes.cardTitle} color={theme.black} mt="md" size="lg" weight={500}>
                        Enterprise
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
                        Contact us
                    </Button>
                </Card>
            </SimpleGrid>
        </Container>
    );
};
