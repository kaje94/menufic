import { type NextPage } from "next";
import Head from "next/head";
import { Breadcrumbs, Grid, Text, SimpleGrid, Box, Center, Loader } from "@mantine/core";
import { AppShell } from "src/components/AppShell";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "src/utils/api";
import Link from "next/link";
import type { Menu } from "@prisma/client";
import { Menus } from "src/components/EditMenu/Menus";
import { Categories } from "src/components/EditMenu/Categories";
import { PublishButton } from "src/components/PublishButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { showErrorToast } from "src/utils/helpers";

/** Page to manage all the menus and related items of a selected restaurant */
const EditMenuPage: NextPage = () => {
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState<Menu | undefined>();
    const [gridItemParent] = useAutoAnimate<HTMLDivElement>();
    const [rootParent] = useAutoAnimate<HTMLDivElement>();
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
            <Head>
                <title>Menufic - Edit Menu</title>
                <meta name="description" content="Manage the menus of your restaurant" />
            </Head>
            <main>
                <AppShell>
                    <Box ref={rootParent}>
                        {isLoading ? (
                            <Center w="100%" h="50vh">
                                <Loader size="lg" />
                            </Center>
                        ) : (
                            <>
                                <SimpleGrid
                                    breakpoints={[
                                        { minWidth: "sm", cols: 2 },
                                        { minWidth: "xs", cols: 1 },
                                    ]}
                                >
                                    <Breadcrumbs>
                                        <Link href="/restaurant">Restaurant</Link>
                                        <Link href={`/restaurant/${restaurant?.id}`}>{restaurant?.name}</Link>
                                        <Text>Menu</Text>
                                    </Breadcrumbs>
                                    {restaurant && <PublishButton restaurant={restaurant} />}
                                </SimpleGrid>
                                <Grid gutter="lg" mt="lg" justify="center" ref={gridItemParent}>
                                    <Grid.Col sm={12} md={4} lg={3}>
                                        {router.query?.restaurantId && (
                                            <Menus
                                                restaurantId={restaurantId}
                                                selectedMenu={selectedMenu}
                                                setSelectedMenu={setSelectedMenu}
                                            />
                                        )}
                                    </Grid.Col>
                                    {selectedMenu && (
                                        <Grid.Col sm={12} md={8} lg={9}>
                                            <Categories menuId={selectedMenu?.id} />
                                        </Grid.Col>
                                    )}
                                </Grid>
                            </>
                        )}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export default EditMenuPage;
