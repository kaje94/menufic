import type { FC } from "react";
import { useMemo, useState } from "react";

import { Box, createStyles, Paper, Stack, Text } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";

import { ViewMenuItemModal } from "./ViewMenuItemModal";
import { ImageKitImage } from "../ImageKitImage";

export interface StyleProps {
    imageColor?: string;
}

const useStyles = createStyles((theme, { imageColor }: StyleProps, getRef) => {
    const image = getRef("image");

    const bgColor = useMemo(() => {
        if (imageColor) {
            if (theme.colorScheme === "light") {
                return theme.fn.lighten(imageColor, 0.95);
            }
            return theme.fn.darken(imageColor, 0.95);
        }
        return theme.colors.dark[0];
    }, [imageColor, theme.colorScheme]);

    return {
        cardDescWrap: { flex: 1, gap: 0, overflow: "hidden", padding: theme.spacing.lg },
        cardImage: { height: 150, ref: image, transition: "transform 500ms ease", width: 150 },
        cardImageWrap: {
            borderRadius: theme.radius.lg,
            height: 150,
            overflow: "hidden",
            position: "relative",
            width: 150,
        },
        cardItem: {
            "&:hover": {
                backgroundColor:
                    theme.colorScheme === "light" ? theme.fn.darken(bgColor, 0.05) : theme.fn.lighten(bgColor, 0.05),
                boxShadow: theme.shadows.xs,
            },
            backgroundColor: bgColor,
            border: `1px solid ${theme.colors.dark[3]}`,
            color: theme.colors.dark[8],
            cursor: "pointer",
            display: "flex",
            overflow: "hidden",
            padding: "0 !important",
            transition: "all 500ms ease",
            [`&:hover .${image}`]: { transform: "scale(1.05)" },
        },
        cardItemDesc: {
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            color: theme.colors.dark[7],
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
        },
    };
});

interface Props {
    /** Menu item to be displayed in the card */
    item: MenuItem & { image: Image | null };
}

/** Display each menu item as a card in the full restaurant menu */
export const MenuItemCard: FC<Props> = ({ item }) => {
    const { classes, theme } = useStyles({ imageColor: item?.image?.color });
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Paper className={classes.cardItem} h={150} onClick={() => setModalVisible(true)}>
                {item?.image?.path && (
                    <Box className={classes.cardImageWrap}>
                        <Box className={classes.cardImage}>
                            <ImageKitImage
                                blurhash={item?.image?.blurHash}
                                color={item?.image?.color}
                                height={150}
                                imageAlt={item.name}
                                imagePath={item?.image?.path}
                                width={150}
                            />
                        </Box>
                    </Box>
                )}

                <Stack className={classes.cardDescWrap}>
                    <Text size="lg" weight={700}>
                        {item.name}
                    </Text>
                    <Text color="red" size="sm">
                        {item.price}
                    </Text>
                    <Text className={classes.cardItemDesc} color={theme.black} opacity={0.7} size="xs">
                        {item.description}
                    </Text>
                </Stack>
            </Paper>
            <ViewMenuItemModal menuItem={item} onClose={() => setModalVisible(false)} opened={modalVisible} />
        </>
    );
};
