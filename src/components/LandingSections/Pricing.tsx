import { Container, Title, Button, SimpleGrid, Text, Card, Flex } from "@mantine/core";
import type { FC } from "react";
import { useStyles } from "./style";
import { IconCheckbox } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";

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
        <Container size="md" py={theme.spacing.xl * 3}>
            <Title className={classes.sectionTitle}>Pricing</Title>

            <SimpleGrid cols={2} spacing="xl" mt={50} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                <Card shadow="md" radius="md" className={classes.card} p="xl">
                    <Text size="lg" weight={500} className={classes.cardTitle} color={theme.black} mt="md">
                        Free
                    </Text>
                    {pricingFreeCard.map((item) => (
                        <Flex gap={10} align="center" key={item} mt="sm">
                            <IconCheckbox color={theme.black} />
                            <Text size="md" color={theme.black} opacity={0.8}>
                                {item}
                            </Text>
                        </Flex>
                    ))}
                    {status === "unauthenticated" && (
                        <Button
                            fullWidth
                            mt="xl"
                            size="lg"
                            variant="outline"
                            onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
                        >
                            Get Started
                        </Button>
                    )}
                </Card>
                <Card shadow="md" radius="md" className={classes.card} p="xl">
                    <Text size="lg" weight={500} className={classes.cardTitle} color={theme.black} mt="md">
                        Enterprise
                    </Text>
                    {pricingEnterpriseCard.map((item) => (
                        <Flex gap={10} align="center" key={item} mt="sm">
                            <IconCheckbox color={theme.black} />
                            <Text size="md" color={theme.black} opacity={0.8}>
                                {item}
                            </Text>
                        </Flex>
                    ))}
                    <Button fullWidth mt="xl" size="lg" onClick={() => scrollToContactUs()}>
                        Contact us
                    </Button>
                </Card>
            </SimpleGrid>
        </Container>
    );
};
