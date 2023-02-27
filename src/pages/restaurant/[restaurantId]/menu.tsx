import { Container } from "@mantine/core";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import superjson from "superjson";

import type { GetStaticPropsContext, NextPage } from "next";

import { Empty } from "src/components/Empty";
import { Footer } from "src/components/Footer";
import { RestaurantMenu } from "src/components/RestaurantMenu";
import { env } from "src/env/client.mjs";
import { appRouter } from "src/server/api/root";
import { createInnerTRPCContext } from "src/server/api/trpc";
import { api } from "src/utils/api";

/** Restaurant menu page that will be shared publicly */
const RestaurantMenuPage: NextPage = () => {
    const router = useRouter();
    const { status } = useSession();
    const restaurantId = router.query?.restaurantId as string;

    const { data: restaurant } = api.restaurant.getDetails.useQuery(
        { id: restaurantId },
        { enabled: status === "authenticated" && !!restaurantId }
    );

    return (
        <>
            <NextSeo
                description={`Menu of restaurant ${restaurant?.name}. Location: ${restaurant?.location}. ${
                    restaurant?.contactNo ? `Contact Number: ${restaurant.contactNo}.` : ""
                } This menu was generated using Menufic.com`}
                openGraph={{
                    images: [{ url: `${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${restaurant?.image?.path}` }],
                    type: "restaurant.menu",
                }}
                themeColor={restaurant?.image?.color}
                title={`${restaurant?.name} Menu`}
            />
            <main>
                <Container py="lg" size="xl">
                    {restaurant && restaurant?.isPublished === true ? (
                        <RestaurantMenu restaurant={restaurant} />
                    ) : (
                        <Empty
                            height="calc(100vh - 100px)"
                            text="This restaurant details are unavailable at the moment. We are sorry for the inconvenience. Please try again in a while"
                        />
                    )}
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default RestaurantMenuPage;

export async function getStaticProps(context: GetStaticPropsContext<{ restaurantId: string }>) {
    const ssg = createProxySSGHelpers({
        ctx: createInnerTRPCContext({ session: null }),
        router: appRouter,
        transformer: superjson,
    });
    const restaurantId = context.params?.restaurantId as string;
    try {
        const restaurant = await ssg.restaurant.getDetails.fetch({ id: restaurantId });
        if (restaurant.isPublished) {
            // Only return restaurants that are published
            return { props: { restaurantId, trpcState: ssg.dehydrate() }, revalidate: 1800 }; // revalidate in 30 mins
        }
        return { props: { restaurantId }, revalidate: 60 };
    } catch {
        return { props: { restaurantId }, revalidate: 1800 };
    }
}

export async function getStaticPaths() {
    // Skip building pages during build time
    return { fallback: "blocking", paths: [] };
}
