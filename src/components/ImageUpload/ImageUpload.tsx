import { Text, Box, ActionIcon, AspectRatio, Stack, Image as MantineImage, useMantineTheme } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconTrash, IconUpload, IconX, IconPhoto } from "@tabler/icons";
import type { FC } from "react";
import { ImageKitImage } from "../ImageKitImage";

interface Props {
    /** ImageKit path of the previously uploaded image or temporary path of the image to be uploaded */
    imageUrl?: string;
    /** Blurhash of the previously uploaded image */
    imageHash?: string;
    /** Height of the image */
    height: number;
    /** Width of the image */
    width: number;
    /** To show the upload component in an error state */
    error?: boolean;
    /** Callback to be fired when a new image is uploaded */
    onImageDrop: (file: FileWithPath) => void;
    /** Callback to be fired when the image is deleted */
    onImageDeleteClick: () => void;
}

/** Image dropzone component to allow users to upload image within forms */
export const ImageUpload: FC<Props> = ({
    imageUrl,
    imageHash,
    height,
    width,
    error,
    onImageDrop,
    onImageDeleteClick,
}) => {
    const theme = useMantineTheme();

    return (
        <>
            {imageUrl ? (
                <Box sx={{ borderRadius: theme.radius.lg, overflow: "hidden", position: "relative", display: "block" }}>
                    {imageUrl?.startsWith("blob") ? (
                        <MantineImage src={imageUrl} fit="cover" />
                    ) : (
                        <ImageKitImage imagePath={imageUrl} blurhash={imageHash} width={width} height={height} />
                    )}

                    <ActionIcon
                        sx={{ position: "absolute", top: 5, right: 5, background: theme.white, zIndex: 10 }}
                        onClick={onImageDeleteClick}
                    >
                        <IconTrash size={24} color="red" />
                    </ActionIcon>
                </Box>
            ) : (
                <Dropzone
                    onDrop={(files) => {
                        if (files[0]) {
                            onImageDrop(files[0]);
                        }
                    }}
                    accept={[MIME_TYPES.jpeg]}
                    multiple={false}
                    p={0}
                >
                    <AspectRatio
                        ratio={width / height}
                        bg={error ? theme.colors.red[1] : theme.colors.dark[1]}
                        sx={{ borderRadius: theme.radius.lg }}
                    >
                        <Stack spacing="md">
                            <Dropzone.Accept>
                                <IconUpload size={50} stroke={1.5} color={theme.black} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={50} stroke={1.5} color={theme.colors.red[6]} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={50} stroke={1.5} color={theme.black} />
                            </Dropzone.Idle>
                            <Text size="md" inline align="center" px="xl" color={theme.black}>
                                Drag a jpeg image here or click to select a jpeg image files
                            </Text>
                        </Stack>
                    </AspectRatio>
                </Dropzone>
            )}
        </>
    );
};
