import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Breadcrumbs, Center, Loader, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import { IconChartDots, IconSlideshow, IconStars, IconToolsKitchen } from "@tabler/icons";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

import { AppShell } from "src/components/AppShell";
import { IconCard } from "src/components/Cards";
import { PublishButton } from "src/components/PublishButton";
import { api } from "src/utils/api";
import { showErrorToast } from "src/utils/helpers";

/** Page to manage all the options under the restaurant */
const RestaurantManagePage: NextPage = () => {
    const router = useRouter();
    const theme = useMantineTheme();
    const [itemsParent] = useAutoAnimate<HTMLDivElement>();
    const restaurantId = router.query?.restaurantId as string;

    const { data: restaurant, isLoading } = api.restaurant.get.useQuery(
        { id: restaurantId },
        {
            enabled: !!restaurantId,
            onError: () => {
                showErrorToast("Failed to retrieve restaurant details");
                router.push("/restaurant");
            },
        }
    );

    return (
        <>
            <NextSeo description="Manage your restaurant's menus and banners" title="Manage Restaurant" />
            <main>
                <AppShell>
                    <Box ref={itemsParent}>
                        {isLoading ? (
                            <Center h="50vh" w="100%">
                                <Loader size="lg" />
                            </Center>
                        ) : (
                            <>
                                <SimpleGrid
                                    breakpoints={[
                                        { cols: 2, minWidth: "sm" },
                                        { cols: 1, minWidth: "xs" },
                                    ]}
                                >
                                    <Breadcrumbs color={theme.black}>
                                        <Link href="/restaurant">Restaurant</Link>
                                        <Text>{restaurant?.name}</Text>
                                    </Breadcrumbs>
                                    {restaurant && <PublishButton restaurant={restaurant} />}
                                </SimpleGrid>
                                <SimpleGrid
                                    breakpoints={[
                                        { cols: 3, minWidth: "lg" },
                                        { cols: 2, minWidth: "sm" },
                                        { cols: 1, minWidth: "xs" },
                                    ]}
                                    mt="xl"
                                >
                                    <IconCard
                                        Icon={IconToolsKitchen}
                                        href={`/restaurant/${router.query?.restaurantId}/edit-menu`}
                                        subTitle="Manage the menus, categories and individual menu items of your restaurant"
                                        testId="manage-menus-card"
                                        title="Menus"
                                    />
                                    <IconCard
                                        Icon={IconSlideshow}
                                        href={`/restaurant/${router.query?.restaurantId}/banners`}
                                        subTitle="Manage banners that could be used to display promotional content in your restaurant menu"
                                        testId="manage-banners-card"
                                        title="Banners"
                                    />
                                    <IconCard
                                        Icon={IconStars}
                                        subTitle="View feedback received from your restaurant customers"
                                        title="Feedback (Coming Soon)"
                                    />
                                    <IconCard
                                        Icon={IconChartDots}
                                        subTitle="Gain insights on how many people view your published menu and which items are most popular"
                                        title="Stats (Coming Soon)"
                                    />
                                </SimpleGrid>
                            </>
                        )}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export default RestaurantManagePage;
