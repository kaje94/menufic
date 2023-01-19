import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { Container, Text, Alert, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { api } from "src/utils/api";
import { getSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "src/server/api/root";
import superjson from "superjson";
import { IconAlertCircle } from "@tabler/icons";
import { RestaurantMenu } from "src/components/RestaurantMenu";
import { createInnerTRPCContext } from "src/server/api/trpc";
import { Footer } from "src/components/Footer";

/** Page that can be used to preview how the published menu would look like */
const RestaurantMenuPreviewPage: NextPage = () => {
    const router = useRouter();
    const theme = useMantineTheme();
    const { data: restaurant } = api.restaurant.getDetails.useQuery(
        { id: router.query?.restaurantId as string },
        { enabled: false }
    );

    return (
        <>
            <Head>
                <title>Menufic - Restaurant Preview</title>
                <meta name="description" content="Preview how the published restaurant menu would look like" />
            </Head>
            <main>
                <Container size="xl" py="lg">
                    <Alert icon={<IconAlertCircle size={16} />} title="Preview mode" color="red" mb="lg" radius="lg">
                        <Text weight="bold" color={theme.black}>
                            This preview URL is not meant to be shared with anyone.
                        </Text>
                        <Text color={theme.black}>
                            Once you have finalized your changes, you will be able to publish your restaurant menu and
                            generate a sharable URL which can then be shared with your customers.
                        </Text>
                    </Alert>
                    {restaurant && <RestaurantMenu restaurant={restaurant} />}
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default RestaurantMenuPreviewPage;

export const getServerSideProps = async (context: GetServerSidePropsContext<{ restaurantId: string }>) => {
    const session = await getSession(context);
    if (!session) {
        // This page should be only accessible once you are logged in
        return { redirect: { destination: "/" } };
    }
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });
    const restaurantId = context.params?.restaurantId as string;
    try {
        // Hydrate trpc context from server side
        const restaurant = await ssg.restaurant.getDetails.fetch({ id: restaurantId });
        if (restaurant.userId === session.user?.id) {
            // Preview page should only be accessible by the user who manages the restaurant
            return { props: { trpcState: ssg.dehydrate() } };
        }
        return { redirect: { destination: "/" } };
    } catch {
        return { redirect: { destination: "/404" } };
    }
};
