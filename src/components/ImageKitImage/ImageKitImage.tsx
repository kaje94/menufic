import type { FC } from "react";
import { useState } from "react";

import { Box, clsx, createStyles } from "@mantine/core";
import Image from "next/image";
import { Blurhash } from "react-blurhash";

import { env } from "../../env/client.mjs";

const useStyles = createStyles(() => ({
    imagePlaceholder: {
        bottom: 0,
        height: "100%",
        left: 0,
        overflow: "hidden",
        position: "absolute !important" as "absolute",
        right: 0,
        top: 0,
        width: "100%",
    },
    itemImage: {
        height: "100%",
        objectFit: "cover",
        opacity: 0,
        position: "relative",
        transition: "all 200ms ease",
        width: "100%",
        zIndex: 1,
    },
    itemImageLoaded: { opacity: 1 },
    itemImageWrap: { display: "block", overflow: "hidden", position: "relative" },
}));

interface Props {
    /** Blurhash string used to generate the blurred image before the actual image loads */
    blurhash?: string;
    /** Background color to be displayed before js hydration of if blurhash is not available */
    color?: string;
    /** Height of the image */
    height: number;
    /** Alt text of the image */
    imageAlt?: string;
    /** Path of the image which will be appended to imageKit base url */
    imagePath?: string;
    /** Width of the image */
    width: number;
}

/** Optimized image component to display images stored in imageKit. */
export const ImageKitImage: FC<Props> = ({ blurhash, color, imagePath, imageAlt, height, width }) => {
    const { classes } = useStyles();
    const [loaded, setLoaded] = useState(false);

    return (
        <Box bg={color} className={classes.itemImageWrap} h="100%" w="100%">
            {blurhash && (
                <Blurhash
                    className={clsx(classes.imagePlaceholder)}
                    hash={blurhash}
                    height="100%"
                    punch={1}
                    resolutionX={32}
                    resolutionY={32}
                    width="100%"
                />
            )}
            {imagePath && (
                <Image
                    alt={`${imageAlt} image`}
                    className={clsx(classes.itemImage, loaded && classes.itemImageLoaded)}
                    height={height}
                    onLoadingComplete={() => setLoaded(true)}
                    src={`${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${imagePath}?tr=f-avif,w-${width}`}
                    width={width}
                />
            )}
        </Box>
    );
};
