import type { FC } from "react";
import { useRef } from "react";
import { Box, Text, SimpleGrid, Tabs, createStyles, useMantineColorScheme, ActionIcon, Flex } from "@mantine/core";
import type { Category, Image, Menu, MenuItem, Restaurant } from "@prisma/client";
import { useMemo, useState } from "react";
import { ImageKitImage } from "../ImageKitImage";
import { MenuItemCard } from "./MenuItemCard";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { IconSun, IconMoonStars, IconMapPin, IconPhone } from "@tabler/icons";
import { Empty } from "../Empty";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Black, White } from "src/styles/theme";

const useStyles = createStyles((theme) => ({
    headerImageBox: { borderRadius: theme.radius.lg, overflow: "hidden", position: "relative" },
    carousalOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
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
    },
    carousalTitle: {
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xl,
        zIndex: 1,
        position: "absolute",
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
    },
    carousalTitleText: {
        color: White,
        opacity: 0.85,
        fontWeight: "bold",
        fontSize: 40,
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 30 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 24 },
    },
    carousalTitleSubText: {
        color: White,
        fontSize: 22,
        flex: 1,
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 18 },
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 14 },
    },
    carousalSubWrap: {
        opacity: 0.65,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "grid", gap: 2 },
    },
    themeSwitch: {
        position: "absolute",
        top: 10,
        right: 12,
        zIndex: 1,
        color: theme.black,
        boxShadow: theme.shadows.md,
        backgroundColor: theme.white,
        opacity: 0.6,
        transition: "all 500ms ease",
        "&:hover": { opacity: 1, backgroundColor: theme.white },
    },
    switchTrack: { background: `${theme.fn.darken(White, 0.1)} !important`, border: "unset" },
    switchThumb: { background: theme.fn.lighten(Black, 0.2) },
}));

interface Props {
    restaurant: Restaurant & {
        menus: (Menu & { categories: (Category & { items: (MenuItem & { image: Image | null })[] })[] })[];
        image: Image | null;
        banners: Image[];
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
                    mx="auto"
                    withIndicators={images.length > 1}
                    withControls={images.length > 1}
                    height={300}
                    plugins={[bannerCarousalRef.current]}
                    onMouseEnter={bannerCarousalRef.current.stop}
                    onMouseLeave={bannerCarousalRef.current.reset}
                    className={classes.headerImageBox}
                    slideGap="md"
                    loop
                    styles={{ indicator: { background: White } }}
                >
                    {images?.map((banner, index) => (
                        <Carousel.Slide key={banner.id}>
                            <ImageKitImage
                                width={750}
                                height={300}
                                imagePath={banner.path}
                                blurhash={banner.blurHash}
                                color={banner.color}
                                imageAlt={`${restaurant.name}-banner-${index}`}
                            />
                            <Box className={classes.carousalOverlay} />
                        </Carousel.Slide>
                    ))}
                </Carousel>
                <Box className={classes.carousalTitle}>
                    <Text className={classes.carousalTitleText}>{restaurant?.name}</Text>
                    <Box className={classes.carousalSubWrap}>
                        <Flex gap={10} align="center">
                            <IconMapPin color={White} />
                            <Text className={classes.carousalTitleSubText}>{restaurant?.location}</Text>
                        </Flex>
                        {restaurant?.contactNo && (
                            <Flex gap={10} align="center">
                                <IconPhone color={White} />
                                <Text className={classes.carousalTitleSubText}>{restaurant?.contactNo}</Text>
                            </Flex>
                        )}
                    </Box>
                </Box>
                <ActionIcon onClick={() => toggleColorScheme()} size="lg" className={classes.themeSwitch}>
                    {colorScheme === "dark" ? <IconSun strokeWidth={2.5} size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
            </Box>

            <Tabs value={selectedMenu} onTabChange={setSelectedMenu} my={40}>
                <Tabs.List>
                    {restaurant?.menus?.map((menu) => (
                        <Tabs.Tab value={menu.id} key={menu.id} px="lg">
                            <Text size="lg" weight={selectedMenu === menu.id ? "bold" : "normal"} color={theme.black}>
                                {menu.name}
                            </Text>
                            <Text size="xs" opacity={selectedMenu === menu.id ? 1 : 0.5} color={theme.colors.dark[8]}>
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
                            <Text size="lg" my="lg" weight={600}>
                                {category.name}
                            </Text>
                            <SimpleGrid
                                breakpoints={[
                                    { minWidth: "lg", cols: 3 },
                                    { minWidth: "sm", cols: 2 },
                                    { minWidth: "xs", cols: 1 },
                                ]}
                                mb={30}
                            >
                                {category.items?.map((item) => (
                                    <MenuItemCard item={item} key={item.id} />
                                ))}
                            </SimpleGrid>
                        </Box>
                    ))}
                {restaurant?.menus?.length === 0 && !haveMenuItems && (
                    <Empty
                        text="There aren't any menus available for this restaurant. Try checking out later"
                        height={400}
                    />
                )}
                {!!restaurant?.menus?.length && !haveMenuItems && (
                    <Empty
                        text="There aren't any menu items for the chosen restaurant menu. Try checking out later."
                        height={400}
                    />
                )}
            </Box>
        </Box>
    );
};
