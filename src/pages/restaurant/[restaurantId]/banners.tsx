import type { FC } from "react";
import { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Breadcrumbs, Center, Loader, SimpleGrid, Text } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import type { Image } from "@prisma/client";

import { AppShell } from "src/components/AppShell";
import { IconCard, ImageCard } from "src/components/Cards";
import { DeleteConfirmModal } from "src/components/DeleteConfirmModal";
import { BannerForm } from "src/components/Forms/BannerForm";
import { PublishButton } from "src/components/PublishButton";
import { env } from "src/env/client.mjs";
import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

/** ImageCard component that represents each banner with delete functionality */
const BannerCard: FC<{ index?: number; item: Image; restaurantName?: string }> = ({ item, restaurantName, index }) => {
    const trpcCtx = api.useContext();
    const router = useRouter();
    const [deleteFormOpen, setDeleteFormOpen] = useState(false);
    const restaurantId = router.query?.restaurantId as string;

    const { mutate: deleteRestaurant, isLoading: isDeleting } = api.restaurant.deleteBanner.useMutation({
        onError: (err) => showErrorToast("Failed to create banner", err),
        onSettled: () => setDeleteFormOpen(false),
        onSuccess: (data) => {
            trpcCtx.restaurant.getBanners.setData({ id: restaurantId }, (banners = []) =>
                banners.filter((bannerItem) => bannerItem.id !== data.id)
            );
            showSuccessToast("Successfully deleted", `Deleted the banner of the restaurant successfully`);
        },
    });

    return (
        <>
            <ImageCard
                editDeleteOptions={{ onDeleteClick: () => setDeleteFormOpen(true) }}
                image={item}
                imageAlt={`${restaurantName}-banner-${index}`}
            />
            <DeleteConfirmModal
                description="Are you sure, you want to delete this restaurant banner? This action action cannot be undone"
                loading={isDeleting}
                onClose={() => setDeleteFormOpen(false)}
                onDelete={() => deleteRestaurant({ id: item.id, restaurantId })}
                opened={deleteFormOpen}
                title="Delete restaurant banner?"
            />
        </>
    );
};

/** Page to manage banners of a selected restaurant */
const BannersPage: NextPage = () => {
    const router = useRouter();
    const [bannerFormOpen, setBannerFormOpen] = useState(false);
    const restaurantId = router.query?.restaurantId as string;
    const [gridItemParent] = useAutoAnimate<HTMLDivElement>();

    const { data: banners = [], isLoading: loadingBanners } = api.restaurant.getBanners.useQuery(
        { id: restaurantId },
        {
            enabled: !!restaurantId,
            onError: () => showErrorToast("Failed to retrieve banners"),
        }
    );

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
                <title>Menufic - Banners</title>
                <meta content="Manage the banners of your restaurant" name="description" />
            </Head>
            <main>
                <AppShell>
                    <Box>
                        {isLoading || loadingBanners ? (
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
                                        <Text>Banners</Text>
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
                                    ref={gridItemParent}
                                >
                                    {banners?.map((item, index) => (
                                        <BannerCard
                                            key={item.id}
                                            index={index}
                                            item={item}
                                            restaurantName={restaurant?.name}
                                        />
                                    ))}
                                    {banners &&
                                        banners?.length < Number(env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT) && (
                                            <IconCard
                                                key="add-new-banner"
                                                Icon={IconCirclePlus}
                                                onClick={() => setBannerFormOpen(true)}
                                                subTitle="Start creating a new restaurant menu by adding a new restaurant"
                                                title="Add new banner"
                                            />
                                        )}
                                </SimpleGrid>
                            </>
                        )}
                    </Box>
                </AppShell>

                {restaurant?.id && (
                    <BannerForm
                        onClose={() => setBannerFormOpen(false)}
                        opened={bannerFormOpen}
                        restaurantId={restaurant?.id}
                    />
                )}
            </main>
        </>
    );
};

export default BannersPage;
