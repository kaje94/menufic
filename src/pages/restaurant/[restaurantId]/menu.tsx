import { Container, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import superjson from "superjson";

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
    const theme = useMantineTheme();
    const isNotMobile = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);

    const { data: restaurant } = api.restaurant.getDetails.useQuery(
        { id: restaurantId },
        { enabled: status === "authenticated" && !!restaurantId }
    );

    const titleTag = `${restaurant?.name} Menu`;
    const descriptionTag = `Menu of restaurant ${restaurant?.name}. Location: ${restaurant?.location}. ${
        restaurant?.contactNo ? `Contact Number: ${restaurant.contactNo}.` : ""
    } This menu was generated using Menufic.com`;
    const imageTag = `${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${restaurant?.image?.path}`;

    return (
        <>
            <Head>
                <title>{titleTag}</title>
                <meta content={descriptionTag} name="description" />
                <meta content={titleTag} name="title" />

                <meta content={titleTag} property="og:title" />
                <meta content={descriptionTag} property="og:description" />
                <meta content={imageTag} property="og:image" />
                <meta content="restaurant.menu" property="og:type" />

                <meta content={titleTag} property="twitter:title" />
                <meta content={descriptionTag} property="twitter:description" />
                <meta content={imageTag} property="twitter:image" />
            </Head>
            <main>
                <Container py="lg" size="xl">
                    {restaurant && restaurant?.isPublished === true ? (
                        <RestaurantMenu restaurant={restaurant} />
                    ) : (
                        <Empty
                            height={`calc(100vh - ${isNotMobile ? 100 : 135}px)`}
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
