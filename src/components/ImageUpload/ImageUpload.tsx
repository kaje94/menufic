import { Text, Box, ActionIcon, AspectRatio, Stack, Image as MantineImage, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconTrash, IconUpload, IconX, IconPhoto } from "@tabler/icons";
import imageCompression from "browser-image-compression";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { toBase64 } from "src/utils/helpers";
import { CropModal } from "./CropModal";
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
    /** To show the red asterisk next to the label or not*/
    imageRequired?: boolean;
    /** To show a disabled overlay to prevent interaction with the component */
    disabled?: boolean;
    /** Callback to be fired when a new image is uploaded */
    onImageCrop: (imageBase64: string, imagePath: string) => void;
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
                { maxWidthOrHeight: width, useWebWorker: true, initialQuality: 0.75 }
            );
            const base64File = await toBase64(compressedFile);
            onImageCrop(base64File as string, URL.createObjectURL(compressedFile));
        },
        [width, onImageCrop, setImageCropModalOpen]
    );

    return (
        <>
            <Text size="md" mt="md" color={theme.black}>
                Image
                {imageRequired && (
                    <Text component="span" color="red">
                        *
                    </Text>
                )}
            </Text>
            <Box sx={{ position: "relative" }}>
                {disabled && (
                    <Box
                        h="100%"
                        w="100%"
                        bg={theme.white}
                        opacity={0.3}
                        pos="absolute"
                        sx={{ zIndex: 20, cursor: "not-allowed" }}
                    />
                )}
                {imageUrl ? (
                    <Box sx={{ borderRadius: theme.radius.lg, overflow: "hidden", display: "block" }}>
                        {imageUrl?.startsWith("blob") ? (
                            <MantineImage src={imageUrl} fit="cover" />
                        ) : (
                            <ImageKitImage imagePath={imageUrl} blurhash={imageHash} width={width} height={height} />
                        )}

                        <ActionIcon
                            sx={{ position: "absolute", top: 5, right: 5, background: theme.white, zIndex: 10 }}
                            onClick={onImageDeleteClick}
                            disabled={disabled}
                            opacity={disabled ? 0.6 : 1}
                        >
                            <IconTrash size={24} color="red" />
                        </ActionIcon>
                    </Box>
                ) : (
                    <Dropzone
                        onDrop={(files) => {
                            if (files[0]) {
                                setImageCropModalOpen(true);
                                setNewUploadedImageUrl(URL.createObjectURL(files[0]));
                            }
                        }}
                        accept={[MIME_TYPES.jpeg]}
                        multiple={false}
                        p={0}
                        disabled={disabled}
                    >
                        <AspectRatio
                            ratio={width / height}
                            bg={error ? theme.colors.red[6] : theme.colors.dark[0]}
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
                                    Drag a jpeg image here or click to select a jpeg image file
                                </Text>
                            </Stack>
                        </AspectRatio>
                    </Dropzone>
                )}
            </Box>
            <CropModal
                opened={imageCropModalOpen}
                onClose={() => setImageCropModalOpen(false)}
                onCrop={onCropComplete}
                imageUrl={newUploadedImageUrl}
                aspect={width / height}
            />
        </>
    );
};
