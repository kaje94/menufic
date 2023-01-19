import { createStyles, clsx, Box } from "@mantine/core";
import { Blurhash } from "react-blurhash";
import Image from "next/image";
import { env } from "../../env/client.mjs";
import type { FC } from "react";
import { useState } from "react";

const useStyles = createStyles(() => ({
    itemImageWrap: { overflow: "hidden", position: "relative", display: "block" },
    imagePlaceholder: {
        overflow: "hidden",
        position: "absolute !important" as "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },
    itemImage: {
        zIndex: 1,
        position: "relative",
        objectFit: "cover",
        width: "100%",
        height: "100%",
        opacity: 0,
        transition: "all 200ms ease",
    },
    itemImageLoaded: { opacity: 1 },
}));

interface Props {
    /** Blurhash string used to generate the blurred image before the actual image loads */
    blurhash?: string;
    /** Background color to be displayed before js hydration of if blurhash is not available */
    color?: string;
    /** Alt text of the image */
    imageAlt?: string;
    /** Path of the image which will be appended to imageKit base url */
    imagePath?: string;
    /** Height of the image */
    height: number;
    /** Width of the image */
    width: number;
}

/** Optimized image component to display images stored in imageKit. */
export const ImageKitImage: FC<Props> = ({ blurhash, color, imagePath, imageAlt, height, width }) => {
    const { classes } = useStyles();
    const [loaded, setLoaded] = useState(false);

    return (
        <Box className={classes.itemImageWrap} w="100%" h="100%" bg={color}>
            {blurhash && (
                <Blurhash
                    hash={blurhash}
                    width="100%"
                    height="100%"
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                    className={clsx(classes.imagePlaceholder)}
                />
            )}
            {imagePath && (
                <Image
                    alt={`${imageAlt} image`}
                    src={`${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${imagePath}?tr=f-avif,w-${width}`}
                    height={height}
                    width={width}
                    className={clsx(classes.itemImage, loaded && classes.itemImageLoaded)}
                    onLoadingComplete={() => setLoaded(true)}
                />
            )}
        </Box>
    );
};
