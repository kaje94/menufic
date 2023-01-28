import { type NextPage } from "next";
import Head from "next/head";
import { SimpleGrid, Text, Breadcrumbs, Box, Center, Loader } from "@mantine/core";
import { AppShell } from "src/components/AppShell";
import { ImageCard, IconCard } from "src/components/Cards";
import { BannerForm } from "src/components/Forms/BannerForm";
import type { FC } from "react";
import { useState } from "react";
import { api } from "src/utils/api";
import { DeleteConfirmModal } from "src/components/DeleteConfirmModal";
import type { Image } from "@prisma/client";
import Link from "next/link";
import { PublishButton } from "src/components/PublishButton";
import { useRouter } from "next/router";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { env } from "src/env/client.mjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IconCirclePlus } from "@tabler/icons";

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
                <meta name="description" content="Manage the banners of your restaurant" />
            </Head>
            <main>
                <AppShell>
                    <Box>
                        {isLoading || loadingBanners ? (
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
                                        <Text>Banners</Text>
                                    </Breadcrumbs>
                                    {restaurant && <PublishButton restaurant={restaurant} />}
                                </SimpleGrid>
                                <SimpleGrid
                                    mt="xl"
                                    breakpoints={[
                                        { minWidth: "lg", cols: 3 },
                                        { minWidth: "sm", cols: 2 },
                                        { minWidth: "xs", cols: 1 },
                                    ]}
                                    ref={gridItemParent}
                                >
                                    {banners?.map((item, index) => (
                                        <BannerCard
                                            key={item.id}
                                            item={item}
                                            restaurantName={restaurant?.name}
                                            index={index}
                                        />
                                    ))}
                                    {banners &&
                                        banners?.length < Number(env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT) && (
                                            <IconCard
                                                key="add-new-banner"
                                                title="Add new banner"
                                                subTitle="Start creating a new restaurant menu by adding a new restaurant"
                                                onClick={() => setBannerFormOpen(true)}
                                                Icon={IconCirclePlus}
                                            />
                                        )}
                                </SimpleGrid>
                            </>
                        )}
                    </Box>
                </AppShell>

                {restaurant?.id && (
                    <BannerForm
                        opened={bannerFormOpen}
                        onClose={() => setBannerFormOpen(false)}
                        restaurantId={restaurant?.id}
                    />
                )}
            </main>
        </>
    );
};

/** ImageCard component that represents each banner with delete functionality */
const BannerCard: FC<{ item: Image; restaurantName?: string; index?: number }> = ({ item, restaurantName, index }) => {
    const trpcCtx = api.useContext();
    const router = useRouter();
    const [deleteFormOpen, setDeleteFormOpen] = useState(false);
    const restaurantId = router.query?.restaurantId as string;

    const { mutate: deleteRestaurant, isLoading: isDeleting } = api.restaurant.deleteBanner.useMutation({
        onSuccess: (data) => {
            trpcCtx.restaurant.getBanners.setData({ id: restaurantId }, (banners = []) =>
                banners.filter((item) => item.id !== data.id)
            );
            showSuccessToast("Successfully deleted", `Deleted the banner of the restaurant successfully`);
        },
        onError: (err) => showErrorToast("Failed to create banner", err),
        onSettled: () => setDeleteFormOpen(false),
    });

    return (
        <>
            <ImageCard
                image={item}
                editDeleteOptions={{ onDeleteClick: () => setDeleteFormOpen(true) }}
                imageAlt={`${restaurantName}-banner-${index}`}
            />
            <DeleteConfirmModal
                opened={deleteFormOpen}
                onClose={() => setDeleteFormOpen(false)}
                onDelete={() => deleteRestaurant({ id: item.id, restaurantId })}
                loading={isDeleting}
                title="Delete restaurant banner?"
                description="Are you sure, you want to delete this restaurant banner? This action action cannot be undone"
            />
        </>
    );
};

export default BannersPage;
