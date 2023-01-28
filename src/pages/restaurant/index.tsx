import { type NextPage } from "next";
import Head from "next/head";
import { SimpleGrid, Title, Flex, Center, Loader, Box } from "@mantine/core";

import { AppShell } from "src/components/AppShell";
import { ImageCard, IconCard } from "src/components/Cards";
import { RestaurantForm } from "src/components/Forms/RestaurantForm";
import type { FC } from "react";
import { useState } from "react";
import { api } from "src/utils/api";
import { DeleteConfirmModal } from "src/components/DeleteConfirmModal";
import type { Restaurant, Image } from "@prisma/client";
import { env } from "src/env/client.mjs";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IconCirclePlus } from "@tabler/icons";

/** Page to view all the restaurants that were created by you */
const RestaurantsListPage: NextPage = () => {
    const [restaurantFormOpen, setRestaurantFormOpen] = useState(false);
    const { data: restaurants, isLoading } = api.restaurant.getAll.useQuery(undefined, {
        onError: () => showErrorToast("Failed to retrieve restaurants"),
    });
    const [gridItemParent] = useAutoAnimate<HTMLDivElement>();
    const [rootParent] = useAutoAnimate<HTMLDivElement>();

    return (
        <>
            <Head>
                <title>Menufic - Restaurants</title>
                <meta name="description" content="Manage all of the restaurants that you've created" />
            </Head>
            <main>
                <AppShell>
                    <Flex align="center" justify="space-between">
                        <Title order={1}>My Restaurants</Title>
                    </Flex>
                    <Box ref={rootParent} mt="xl">
                        {isLoading ? (
                            <Center w="100%" h="50vh">
                                <Loader size="lg" />
                            </Center>
                        ) : (
                            <SimpleGrid
                                mt="md"
                                breakpoints={[
                                    { minWidth: "lg", cols: 3 },
                                    { minWidth: "sm", cols: 2 },
                                    { minWidth: "xs", cols: 1 },
                                ]}
                                ref={gridItemParent}
                            >
                                {restaurants?.map((item) => (
                                    <RestaurantCard key={item.id} item={item} />
                                ))}
                                {restaurants &&
                                    restaurants?.length < Number(env.NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER) && (
                                        <IconCard
                                            key="add-new-restaurant"
                                            title="Add new restaurant"
                                            subTitle="Start creating a new digital menu by adding a new restaurant"
                                            onClick={() => setRestaurantFormOpen(true)}
                                            Icon={IconCirclePlus}
                                        />
                                    )}
                            </SimpleGrid>
                        )}
                    </Box>
                </AppShell>
                <RestaurantForm opened={restaurantFormOpen} onClose={() => setRestaurantFormOpen(false)} />
            </main>
        </>
    );
};

/** Image card that will represent each restaurant that the user created */
const RestaurantCard: FC<{ item: Restaurant & { image: Image | null } }> = ({ item }) => {
    const trpcCtx = api.useContext();
    const [restaurantFormOpen, setRestaurantFormOpen] = useState(false);
    const [deleteFormOpen, setDeleteFormOpen] = useState(false);

    const { mutate: deleteRestaurant, isLoading: isDeleting } = api.restaurant.delete.useMutation({
        onSuccess: (data) => {
            trpcCtx.restaurant.getAll.setData(undefined, (restaurants) =>
                restaurants?.filter((item) => item.id !== data.id)
            );
            showSuccessToast(
                "Successfully deleted",
                `Deleted the ${data.name} restaurant and related details successfully`
            );
        },
        onError: (err) => showErrorToast("Failed to delete restaurant", err),
        onSettled: () => setDeleteFormOpen(false),
    });
    return (
        <>
            <ImageCard
                image={item.image}
                href={`/restaurant/${item.id}`}
                title={item.name}
                subTitle={item.location}
                editDeleteOptions={{
                    onDeleteClick: () => setDeleteFormOpen(true),
                    onEditClick: () => setRestaurantFormOpen(true),
                }}
            />
            <RestaurantForm
                opened={restaurantFormOpen}
                onClose={() => setRestaurantFormOpen(false)}
                restaurant={item}
            />
            <DeleteConfirmModal
                opened={deleteFormOpen}
                onClose={() => setDeleteFormOpen(false)}
                onDelete={() => deleteRestaurant({ id: item.id || "" })}
                loading={isDeleting}
                title={`Delete restaurant ${item.name}`}
                description="Are you sure, you want to delete this restaurant? This action will also delete all the items associated with this restaurant and cannot be undone"
            />
        </>
    );
};

export default RestaurantsListPage;
