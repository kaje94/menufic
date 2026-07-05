import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Center, Loader, SimpleGrid, Text, Title, useMantineTheme } from "@mantine/core";
import { type NextPage } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";

import { AppShell } from "src/components/AppShell";
import { ImageCard } from "src/components/Cards";
import { Empty } from "src/components/Empty";
import { api } from "src/utils/api";
import { showErrorToast } from "src/utils/helpers";

/** Page that will allow logged in users to view all of the published restaurant menus */
const ExplorePage: NextPage = () => {
    const theme = useMantineTheme();
    const t = useTranslations("dashboard.explore");
    const [itemsParent] = useAutoAnimate<HTMLDivElement>();

    const { data: restaurants = [], isLoading } = api.restaurant.getAllPublished.useQuery(undefined, {
        onError: () => showErrorToast(t("fetchError")),
    });

    return (
        <>
            <NextSeo description={t("seoDescription")} title={t("seoTitle")} />
            <main>
                <AppShell>
                    <Title order={1}>{t("pageTitle")}</Title>
                    <Text color={theme.colors.dark[6]}>{t("pageSubTitle")}</Text>
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
                        {!isLoading && restaurants?.length === 0 && <Empty height="50vh" text={t("noContent")} />}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export const getStaticProps = async () => ({ props: { messages: (await import("src/lang/en.json")).default } });

export default ExplorePage;
