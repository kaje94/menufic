import { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Breadcrumbs, Center, Grid, Loader, SimpleGrid, Text } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import type { Menu } from "@prisma/client";

import { AppShell } from "src/components/AppShell";
import { Categories } from "src/components/EditMenu/Categories";
import { Menus } from "src/components/EditMenu/Menus";
import { PublishButton } from "src/components/PublishButton";
import { api } from "src/utils/api";
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
                <meta content="Manage the menus of your restaurant" name="description" />
            </Head>
            <main>
                <AppShell>
                    <Box ref={rootParent}>
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
                                    <Breadcrumbs>
                                        <Link href="/restaurant">Restaurant</Link>
                                        <Link href={`/restaurant/${restaurant?.id}`}>{restaurant?.name}</Link>
                                        <Text>Menu</Text>
                                    </Breadcrumbs>
                                    {restaurant && <PublishButton restaurant={restaurant} />}
                                </SimpleGrid>
                                <Grid gutter="lg" justify="center" mt="xl" ref={gridItemParent}>
                                    <Grid.Col lg={3} md={4} sm={12}>
                                        {router.query?.restaurantId && (
                                            <Menus
                                                restaurantId={restaurantId}
                                                selectedMenu={selectedMenu}
                                                setSelectedMenu={setSelectedMenu}
                                            />
                                        )}
                                    </Grid.Col>
                                    {selectedMenu && (
                                        <Grid.Col lg={9} md={8} sm={12}>
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
