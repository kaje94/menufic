import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Center, Loader, SimpleGrid, Text, Title, useMantineTheme } from "@mantine/core";
import { type NextPage } from "next";
import { NextSeo } from "next-seo";

import { AppShell } from "src/components/AppShell";
import { ImageCard } from "src/components/Cards";
import { Empty } from "src/components/Empty";
import { api } from "src/utils/api";
import { showErrorToast } from "src/utils/helpers";

/** Page that will allow logged in users to view all of the published restaurant menus */
const ExplorePage: NextPage = () => {
    const theme = useMantineTheme();
    const { data: restaurants = [], isLoading } = api.restaurant.getAllPublished.useQuery(undefined, {
        onError: () => showErrorToast("Failed to retrieve published restaurants"),
    });
    const [itemsParent] = useAutoAnimate<HTMLDivElement>();
    return (
        <>
            <NextSeo description="Explore restaurants created and published by others" title="Explore restaurants" />
            <main>
                <AppShell>
                    <Title order={1}>Explore Restaurants</Title>
                    <Text color={theme.colors.dark[6]}>Following are the restaurants published by all users</Text>
                    <Box ref={itemsParent}>
                        <SimpleGrid
                            breakpoints={[
                                { cols: 3, minWidth: "lg" },
                                { cols: 2, minWidth: "sm" },
                                { cols: 1, minWidth: "xs" },
                            ]}
                            mt="xl"
                        >
                            {restaurants?.map((item) => (
                                <ImageCard
                                    key={item.id}
                                    href={`/restaurant/${item.id}/menu`}
                                    image={item.image}
                                    subTitle={item.location}
                                    target="_blank"
                                    testId={`explore-card ${item.name}`}
                                    title={item.name}
                                />
                            ))}
                        </SimpleGrid>
                        {isLoading && (
                            <Center h="50vh" w="100%">
                                <Loader size="lg" />
                            </Center>
                        )}
                        {!isLoading && restaurants?.length === 0 && (
                            <Empty height="50vh" text="There aren't any published restaurants" />
                        )}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export default ExplorePage;
