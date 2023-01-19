import type { FC } from "react";
import { ImageKitImage } from "../ImageKitImage";
import type { Image } from "@prisma/client";
import type { HTMLAttributeAnchorTarget } from "react";
import { Card, Text, clsx, Box, Flex } from "@mantine/core";
import { useStyles } from "./styles";
import Link from "next/link";
import type { EditDeleteOptionsProps } from "../EditDeleteOptions";
import { EditDeleteOptions } from "../EditDeleteOptions";
import { White } from "src/styles/theme";

interface Props {
    /** Image to be displayed in the card */
    image?: Image | null;
    /** Title of the card */
    title?: string;
    /** Subtitle of the card */
    subTitle?: string;
    /** Path that needs to be opened, when clicked */
    href?: string;
    /** To decided whether the link needs to be opened in the same tab or different one */
    target?: HTMLAttributeAnchorTarget;
    /** To show the three dot menu for the card */
    editDeleteOptions?: EditDeleteOptionsProps;
    /** Alt text of the image */
    imageAlt?: string;
}

/** Card item with an image as its background */
export const ImageCard: FC<Props> = ({ image, title, subTitle, editDeleteOptions, target, href }) => {
    const { classes } = useStyles();

    const content = (
        <>
            <Box className={classes.imageWrap}>
                <ImageKitImage
                    height={150}
                    width={450}
                    imagePath={image?.path}
                    blurhash={image?.blurHash}
                    color={image?.color}
                    imageAlt={title}
                />
            </Box>

            <Box className={classes.overlay} />

            <Box className={classes.content}>
                <Flex align="flex-end">
                    <Box sx={{ flex: 1 }}>
                        <Text size="lg" className={classes.imageTitle} weight={500}>
                            {title}
                        </Text>

                        <Text size="sm" className={clsx(classes.subTitle, classes.imageSubTitle)}>
                            {subTitle}
                        </Text>
                    </Box>
                    {editDeleteOptions && (
                        <EditDeleteOptions {...editDeleteOptions} color={editDeleteOptions.color || White} />
                    )}
                </Flex>
            </Box>
        </>
    );

    if (href && editDeleteOptions?.loading !== true) {
        return (
            <Card p="lg" className={classes.card} withBorder>
                <Link href={href} target={target}>
                    {content}
                </Link>
            </Card>
        );
    }

    return (
        <Card p="lg" className={clsx(classes.card, classes.cardNoCursor)} withBorder>
            {content}
        </Card>
    );
};
