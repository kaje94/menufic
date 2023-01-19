import { Text, createStyles, Paper, Stack, Box } from "@mantine/core";
import { ImageKitImage } from "../ImageKitImage";
import type { Image, MenuItem } from "@prisma/client";
import type { FC } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { ViewMenuItemModal } from "./ViewMenuItemModal";

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
        cardItem: {
            display: "flex",
            border: `1px solid ${theme.colors.dark[3]}`,
            color: theme.colors.dark[8],
            cursor: "pointer",
            padding: "0 !important",
            backgroundColor: bgColor,
            transition: "all 500ms ease",
            overflow: "hidden",
            "&:hover": {
                backgroundColor:
                    theme.colorScheme === "light" ? theme.fn.darken(bgColor, 0.05) : theme.fn.lighten(bgColor, 0.05),
                boxShadow: theme.shadows.xs,
            },
            [`&:hover .${image}`]: { transform: "scale(1.05)" },
        },
        cardImageWrap: {
            borderRadius: theme.radius.lg,
            height: 150,
            width: 150,
            overflow: "hidden",
            position: "relative",
        },
        cardImage: { ref: image, transition: "transform 500ms ease", height: 150, width: 150 },
        cardDescWrap: { gap: 0, overflow: "hidden", flex: 1, padding: theme.spacing.lg },
        cardItemDesc: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            whiteSpace: "normal",
            color: theme.colors.dark[7],
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
            <Paper h={150} className={classes.cardItem} onClick={() => setModalVisible(true)}>
                {item?.image?.path && (
                    <Box className={classes.cardImageWrap}>
                        <Box className={classes.cardImage}>
                            <ImageKitImage
                                height={150}
                                width={150}
                                imagePath={item?.image?.path}
                                blurhash={item?.image?.blurHash}
                                color={item?.image?.color}
                                imageAlt={item.name}
                            />
                        </Box>
                    </Box>
                )}

                <Stack className={classes.cardDescWrap}>
                    <Text size="lg" weight={700}>
                        {item.name}
                    </Text>
                    <Text size="sm" color="red">
                        {item.price}
                    </Text>
                    <Text size="xs" opacity={0.7} color={theme.black} className={classes.cardItemDesc}>
                        {item.description}
                    </Text>
                </Stack>
            </Paper>
            <ViewMenuItemModal opened={modalVisible} onClose={() => setModalVisible(false)} menuItem={item} />
        </>
    );
};
