import type { ModalProps } from "@mantine/core";
import { createStyles, Button, Group, Box, Text, Stack } from "@mantine/core";
import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Point, Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { Slider } from "@mantine/core";
import { getCroppedImg } from "src/utils/helpers";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Path of the image to be cropped */
    imageUrl: string;
    /** Callback to be fired once cropping is complete */
    onCrop: (imageBlob: Blob) => void;
    /** Aspect ratio to be used when cropping */
    aspect?: number;
}

const useStyles = createStyles((theme) => ({
    cropArea: { borderRadius: theme.radius.lg },
    cropAreaWrap: {
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: 400,
        marginBottom: theme.spacing.md,
    },
}));

/** Modal to allow the user to zoom & crop the uploading image into appropriate aspect ratio */
export const CropModal: FC<Props> = ({ imageUrl, onCrop, aspect = 1, onClose, ...rest }) => {
    const { classes, theme } = useStyles();
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const finishCropImage = useCallback(async () => {
        if (croppedAreaPixels) {
            setCropping(true);
            try {
                const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
                if (croppedImage) {
                    onCrop(croppedImage);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setCropping(false);
            }
        }
    }, [croppedAreaPixels, rotation, imageUrl, onCrop]);

    return (
        <Modal size="lg" centered onClose={onClose} title="Crop Image" loading={cropping} {...rest}>
            <Stack spacing="md">
                <Box className={classes.cropAreaWrap}>
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        onCropChange={setCrop}
                        aspect={aspect}
                        onCropComplete={onCropComplete}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        rotation={rotation}
                        onRotationChange={setRotation}
                        classes={{ cropAreaClassName: classes.cropArea }}
                    />
                </Box>
                <Box>
                    <Text color={theme.black}>Zoom</Text>
                    <Slider label="Zoom" value={zoom} min={1} max={3} step={0.1} onChange={setZoom} />
                </Box>
                <Box>
                    <Text color={theme.black}>Rotation</Text>
                    <Slider label="Rotation" value={rotation} min={0} max={360} step={1} onChange={setRotation} />
                </Box>
            </Stack>

            <Group position="right" mt="md">
                <Button variant="subtle" onClick={onClose} disabled={cropping}>
                    Cancel
                </Button>
                <Button onClick={finishCropImage} loading={cropping}>
                    Crop
                </Button>
            </Group>
        </Modal>
    );
};
