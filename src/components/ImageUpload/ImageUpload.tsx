import type { FC } from "react";
import { useCallback, useState } from "react";

import { ActionIcon, AspectRatio, Box, Image as MantineImage, Stack, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons";
import imageCompression from "browser-image-compression";

import { toBase64 } from "src/utils/helpers";

import { CropModal } from "./CropModal";
import { ImageKitImage } from "../ImageKitImage";

interface Props {
    /** To show a disabled overlay to prevent interaction with the component */
    disabled?: boolean;
    /** To show the upload component in an error state */
    error?: boolean;
    /** Height of the image */
    height: number;
    /** Blurhash of the previously uploaded image */
    imageHash?: string;
    /** To show the red asterisk next to the label or not */
    imageRequired?: boolean;
    /** ImageKit path of the previously uploaded image or temporary path of the image to be uploaded */
    imageUrl?: string;
    /** Callback to be fired when a new image is uploaded */
    onImageCrop: (imageBase64: string, imagePath: string) => void;
    /** Callback to be fired when the image is deleted */
    onImageDeleteClick: () => void;
    /** Width of the image */
    width: number;
}

/** Image dropzone component to allow users to upload image within forms */
export const ImageUpload: FC<Props> = ({
    imageUrl,
    imageHash,
    height,
    width,
    error,
    imageRequired,
    disabled,
    onImageCrop,
    onImageDeleteClick,
}) => {
    const theme = useMantineTheme();
    const [imageCropModalOpen, setImageCropModalOpen] = useState(false);
    const [newUploadedImageUrl, setNewUploadedImageUrl] = useState("");

    const onCropComplete = useCallback(
        async (croppedImageBlob: Blob) => {
            setImageCropModalOpen(false);
            setNewUploadedImageUrl("");

            const compressedFile = await imageCompression(
                new File([croppedImageBlob], "image.jpeg", {
                    type: croppedImageBlob.type,
                }),
                { initialQuality: 0.75, maxWidthOrHeight: width, useWebWorker: true }
            );
            const base64File = await toBase64(compressedFile);
            onImageCrop(base64File as string, URL.createObjectURL(compressedFile));
        },
        [width, onImageCrop, setImageCropModalOpen]
    );

    return (
        <>
            <Text color={theme.black} mt="md" size="md">
                Image
                {imageRequired && (
                    <Text color="red" component="span">
                        *
                    </Text>
                )}
            </Text>
            <Box sx={{ position: "relative" }}>
                {disabled && (
                    <Box
                        bg={theme.white}
                        h="100%"
                        opacity={0.3}
                        pos="absolute"
                        sx={{ cursor: "not-allowed", zIndex: 20 }}
                        w="100%"
                    />
                )}
                {imageUrl ? (
                    <Box sx={{ borderRadius: theme.radius.lg, display: "block", overflow: "hidden" }}>
                        {imageUrl?.startsWith("blob") ? (
                            <MantineImage fit="cover" src={imageUrl} />
                        ) : (
                            <ImageKitImage blurhash={imageHash} height={height} imagePath={imageUrl} width={width} />
                        )}

                        <ActionIcon
                            disabled={disabled}
                            onClick={onImageDeleteClick}
                            opacity={disabled ? 0.6 : 1}
                            sx={{ background: theme.white, position: "absolute", right: 5, top: 5, zIndex: 10 }}
                        >
                            <IconTrash color="red" size={24} />
                        </ActionIcon>
                    </Box>
                ) : (
                    <Dropzone
                        accept={[MIME_TYPES.jpeg]}
                        disabled={disabled}
                        multiple={false}
                        onDrop={(files) => {
                            if (files[0]) {
                                setImageCropModalOpen(true);
                                setNewUploadedImageUrl(URL.createObjectURL(files[0]));
                            }
                        }}
                        p={0}
                    >
                        <AspectRatio
                            bg={error ? theme.colors.red[6] : theme.colors.dark[0]}
                            ratio={width / height}
                            sx={{ borderRadius: theme.radius.lg }}
                        >
                            <Stack spacing="md">
                                <Dropzone.Accept>
                                    <IconUpload color={theme.black} size={50} stroke={1.5} />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX color={theme.colors.red[6]} size={50} stroke={1.5} />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto color={theme.black} size={50} stroke={1.5} />
                                </Dropzone.Idle>
                                <Text align="center" color={theme.black} inline px="xl" size="md">
                                    Drag a jpeg image here or click to select a jpeg image file
                                </Text>
                            </Stack>
                        </AspectRatio>
                    </Dropzone>
                )}
            </Box>
            <CropModal
                aspect={width / height}
                imageUrl={newUploadedImageUrl}
                onClose={() => setImageCropModalOpen(false)}
                onCrop={onCropComplete}
                opened={imageCropModalOpen}
            />
        </>
    );
};
