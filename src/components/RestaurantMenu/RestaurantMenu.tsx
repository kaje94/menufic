import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Box, createStyles, Flex, SimpleGrid, Tabs, Text, useMantineColorScheme } from "@mantine/core";
import { IconMapPin, IconMoonStars, IconPhone, IconSun } from "@tabler/icons";
import Autoplay from "embla-carousel-autoplay";

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
        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "grid", gap: 2 },
    },
    carousalTitle: {
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xl,
        position: "absolute",
        textShadow: `0px 0px 2px ${Black}`,
        width: "100%",
        zIndex: 1,
    },
    carousalTitleSubText: {
        color: White,
        flex: 1,
        fontSize: 22,
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 18 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 14 },
    },
    carousalTitleText: {
        color: White,
        fontSize: 40,
        fontWeight: "bold",
        opacity: 0.85,
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 30 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 24 },
    },
    headerImageBox: { borderRadius: theme.radius.lg, overflow: "hidden", position: "relative" },
    switchThumb: { background: theme.fn.lighten(Black, 0.2) },
    switchTrack: { background: `${theme.fn.darken(White, 0.1)} !important`, border: "unset" },
    themeSwitch: {
        "&:hover": { backgroundColor: theme.white, opacity: 1 },
        backgroundColor: theme.white,
        boxShadow: theme.shadows.md,
        color: theme.black,
        opacity: 0.6,
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
                    height={300}
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
                                height={300}
                                imageAlt={`${restaurant.name}-banner-${index}`}
                                imagePath={banner.path}
                                width={750}
                            />
                            <Box className={classes.carousalOverlay} />
                        </Carousel.Slide>
                    ))}
                </Carousel>
                <Box className={classes.carousalTitle}>
                    <Text className={classes.carousalTitleText}>{restaurant?.name}</Text>
                    <Box className={classes.carousalSubWrap}>
                        <Flex align="center" gap={10}>
                            <IconMapPin color={White} />
                            <Text className={classes.carousalTitleSubText}>{restaurant?.location}</Text>
                        </Flex>
                        {restaurant?.contactNo && (
                            <Flex align="center" gap={10}>
                                <IconPhone color={White} />
                                <Text className={classes.carousalTitleSubText}>{restaurant?.contactNo}</Text>
                            </Flex>
                        )}
                    </Box>
                </Box>
                <ActionIcon className={classes.themeSwitch} onClick={() => toggleColorScheme()} size="lg">
                    {colorScheme === "dark" ? <IconSun size={18} strokeWidth={2.5} /> : <IconMoonStars size={18} />}
                </ActionIcon>
            </Box>

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
                    <Empty
                        height={400}
                        text="There aren't any menus available for this restaurant. Try checking out later"
                    />
                )}
                {!!restaurant?.menus?.length && !haveMenuItems && (
                    <Empty
                        height={400}
                        text="There aren't any menu items for the chosen restaurant menu. Try checking out later."
                    />
                )}
            </Box>
        </Box>
    );
};
