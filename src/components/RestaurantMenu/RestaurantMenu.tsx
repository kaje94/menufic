import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Carousel } from "@mantine/carousel";
import {
    ActionIcon,
    Box,
    createStyles,
    Flex,
    MediaQuery,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import { IconMapPin, IconMoonStars, IconPhone, IconSun } from "@tabler/icons";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";

import type { Category, Image, Menu, MenuItem, Restaurant } from "@prisma/client";

import { Black, White } from "src/styles/theme";

import { MenuItemCard } from "./MenuItemCard";
import { Empty } from "../Empty";
import { ImageKitImage } from "../ImageKitImage";

const useStyles = createStyles((theme) => ({
    carousalOverlay: {
        backgroundImage: theme.fn.linearGradient(
            180,
            theme.fn.rgba(Black, 0),
            theme.fn.rgba(Black, 0.01),
            theme.fn.rgba(Black, 0.025),
            theme.fn.rgba(Black, 0.05),
            theme.fn.rgba(Black, 0.1),
            theme.fn.rgba(Black, 0.2),
            theme.fn.rgba(Black, 0.35),
            theme.fn.rgba(Black, 0.5)
        ),
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
    },
    carousalSubWrap: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        opacity: 0.8,
    },
    carousalTitle: {
        bottom: 0,
        color: White,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xl,
        position: "absolute",
        textShadow: `0px 0px 3px ${Black}`,
        width: "100%",
        zIndex: 1,
    },
    carousalTitleSubText: {
        flex: 1,
        fontSize: 22,
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 18 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 14 },
    },
    carousalTitleText: {
        fontSize: 40,
        fontWeight: "bold",
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 30 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 24 },
    },
    darkFontColor: { color: theme.colors.dark[7] },
    headerImageBox: {
        aspectRatio: "3",
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        position: "relative",
        [theme.fn.smallerThan("md")]: { aspectRatio: "2.5" },
        [theme.fn.smallerThan("sm")]: { aspectRatio: "2" },
    },
    mobileTitleWrap: { color: theme.black, gap: 8, marginTop: theme.spacing.lg },
    switchThumb: { background: theme.fn.lighten(Black, 0.2) },
    switchTrack: { background: `${theme.fn.darken(White, 0.1)} !important`, border: "unset" },
    themeSwitch: {
        "&:hover": { backgroundColor: theme.white, opacity: 1 },
        backgroundColor: theme.white,
        boxShadow: theme.shadows.md,
        color: theme.black,
        opacity: 0.8,
        position: "absolute",
        right: 12,
        top: 10,
        transition: "all 500ms ease",
        zIndex: 1,
    },
}));

interface Props {
    restaurant: Restaurant & {
        banners: Image[];
        image: Image | null;
        menus: (Menu & { categories: (Category & { items: (MenuItem & { image: Image | null })[] })[] })[];
    };
}

/** Component to display all the menus and banners of the restaurant */
export const RestaurantMenu: FC<Props> = ({ restaurant }) => {
    const { classes, theme } = useStyles();
    const bannerCarousalRef = useRef(Autoplay({ delay: 5000 }));
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [menuParent] = useAutoAnimate<HTMLDivElement>();
    const [selectedMenu, setSelectedMenu] = useState<string | null | undefined>(restaurant?.menus?.[0]?.id);
    const t = useTranslations("menu");

    const menuDetails = useMemo(
        () => restaurant?.menus?.find((item) => item.id === selectedMenu),
        [selectedMenu, restaurant]
    );

    const images: Image[] = useMemo(() => {
        const banners = restaurant?.banners;
        if (restaurant?.image) {
            return [restaurant?.image, ...banners];
        }
        return banners;
    }, [restaurant]);

    const haveMenuItems = menuDetails?.categories?.some((category) => category?.items?.length > 0);

    return (
        <Box mih="calc(100vh - 100px)">
            <Box pos="relative">
                <Carousel
                    className={classes.headerImageBox}
                    data-testid="restaurant-banner"
                    height="100%"
                    loop
                    mx="auto"
                    onMouseEnter={bannerCarousalRef.current.stop}
                    onMouseLeave={bannerCarousalRef.current.reset}
                    plugins={[bannerCarousalRef.current]}
                    slideGap="md"
                    styles={{ indicator: { background: White } }}
                    withControls={false}
                    withIndicators={images.length > 1}
                >
                    {images?.map((banner, index) => (
                        <Carousel.Slide key={banner.id}>
                            <ImageKitImage
                                blurhash={banner.blurHash}
                                color={banner.color}
                                height={400}
                                imageAlt={`${restaurant.name}-banner-${index}`}
                                imagePath={banner.path}
                                width={1000}
                            />
                            <Box className={classes.carousalOverlay} />
                        </Carousel.Slide>
                    ))}
                </Carousel>
                <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                    <Box className={classes.carousalTitle}>
                        <Text className={classes.carousalTitleText}>{restaurant?.name}</Text>
                        <Box className={classes.carousalSubWrap}>
                            <Flex align="center" gap={10}>
                                <IconMapPin />
                                <Text className={classes.carousalTitleSubText}>{restaurant?.location}</Text>
                            </Flex>
                            {restaurant?.contactNo && (
                                <Flex align="center" gap={10}>
                                    <IconPhone />
                                    <Text className={classes.carousalTitleSubText}>{restaurant?.contactNo}</Text>
                                </Flex>
                            )}
                        </Box>
                    </Box>
                </MediaQuery>
                <ActionIcon className={classes.themeSwitch} onClick={() => toggleColorScheme()} size="lg">
                    {colorScheme === "dark" ? <IconSun size={18} strokeWidth={2.5} /> : <IconMoonStars size={18} />}
                </ActionIcon>
            </Box>

            <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                <Stack className={classes.mobileTitleWrap}>
                    <Text className={classes.carousalTitleText}>{restaurant?.name}</Text>
                    <Flex align="center" gap={10} opacity={0.6}>
                        <IconMapPin />
                        <Text className={classes.carousalTitleSubText}>{restaurant?.location}</Text>
                    </Flex>
                    {restaurant?.contactNo && (
                        <Flex align="center" gap={10} opacity={0.6}>
                            <IconPhone />
                            <Text className={classes.carousalTitleSubText}>{restaurant?.contactNo}</Text>
                        </Flex>
                    )}
                </Stack>
            </MediaQuery>
            <Tabs my={40} onTabChange={setSelectedMenu} value={selectedMenu}>
                <Tabs.List>
                    {restaurant?.menus?.map((menu) => (
                        <Tabs.Tab key={menu.id} px="lg" value={menu.id}>
                            <Text color={theme.black} size="lg" weight={selectedMenu === menu.id ? "bold" : "normal"}>
                                {menu.name}
                            </Text>
                            <Text color={theme.colors.dark[8]} opacity={selectedMenu === menu.id ? 1 : 0.5} size="xs">
                                {menu.availableTime}
                            </Text>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>
            <Box ref={menuParent}>
                {menuDetails?.categories
                    ?.filter((category) => category?.items.length)
                    ?.map((category) => (
                        <Box key={category.id}>
                            <Text my="lg" size="lg" weight={600}>
                                {category.name}
                            </Text>
                            <SimpleGrid
                                breakpoints={[
                                    { cols: 3, minWidth: "lg" },
                                    { cols: 2, minWidth: "sm" },
                                    { cols: 1, minWidth: "xs" },
                                ]}
                                mb={30}
                            >
                                {category.items?.map((item) => (
                                    <MenuItemCard key={item.id} item={item} />
                                ))}
                            </SimpleGrid>
                        </Box>
                    ))}
                {restaurant?.menus?.length === 0 && !haveMenuItems && (
                    <Empty height={400} text={t("noMenusForRestaurant")} />
                )}
                {!!restaurant?.menus?.length && !haveMenuItems && <Empty height={400} text={t("noItemsForMenu")} />}
            </Box>
        </Box>
    );
};
