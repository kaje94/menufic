import type { GetStaticPropsContext } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { Container } from "@mantine/core";
import { useRouter } from "next/router";
import { api } from "src/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "src/server/api/root";
import superjson from "superjson";
import { RestaurantMenu } from "src/components/RestaurantMenu";
import { useSession } from "next-auth/react";
import { Footer } from "src/components/Footer";
import { Empty } from "src/components/Empty";
import { useMediaQuery } from "@mantine/hooks";
import { createInnerTRPCContext } from "src/server/api/trpc";

/** Restaurant menu page that will be shared publicly */
const RestaurantMenuPage: NextPage = () => {
    const router = useRouter();
    const { status } = useSession();
    const restaurantId = router.query?.restaurantId as string;
    const isNotMobile = useMediaQuery("(min-width: 600px)");

    const { data: restaurant } = api.restaurant.getDetails.useQuery(
        { id: restaurantId },
        { enabled: status === "authenticated" && !!restaurantId }
    );

    return (
        <>
            <Head>
                <title>{`${restaurant?.name} Menu`}</title>
                <meta name="description" content={`Menu of restaurant ${restaurant?.name} created using Menufic`} />
            </Head>
            <main>
                <Container size="xl" py="lg">
                    {restaurant && restaurant?.isPublished === true ? (
                        <RestaurantMenu restaurant={restaurant} />
                    ) : (
                        <Empty
                            text="This restaurant details are unavailable at the moment. We are sorry for the inconvenience. Please try again in a while"
                            height={`calc(100vh - ${isNotMobile ? 100 : 135}px)`}
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
        router: appRouter,
        ctx: createInnerTRPCContext({ session: null }),
        transformer: superjson,
    });
    const restaurantId = context.params?.restaurantId as string;
    try {
        const restaurant = await ssg.restaurant.getDetails.fetch({ id: restaurantId });
        if (restaurant.isPublished) {
            // Only return restaurants that are published
            return { props: { trpcState: ssg.dehydrate(), restaurantId }, revalidate: 1800 }; // revalidate in 30 mins
        }
        return { props: { restaurantId }, revalidate: 60 };
    } catch {
        return { props: { restaurantId }, revalidate: 1800 };
    }
}

export async function getStaticPaths() {
    // Skip building pages during build time
    return { paths: [], fallback: "blocking" };
}
