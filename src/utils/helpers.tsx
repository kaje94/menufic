import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons";
import type { Area } from "react-easy-crop";

export const showErrorToast = (title: string, err?: { message: string }) => {
    showNotification({
        title,
        message: err?.message,
        color: "red",
        icon: <IconAlertCircle />,
    });
};

export const showSuccessToast = (title: string, message?: string) => {
    showNotification({ title, message, icon: <IconCheck /> });
};

export function reorderList<T>(current: T[], from: number, to: number) {
    const cloned = [...current];
    const item = current[from];
    if (item) {
        cloned.splice(from, 1);
        cloned.splice(to, 0, item);
    }
    return cloned;
}

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180;

const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
};

export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    fileType = "image/jpeg"
): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As a blob
    return new Promise((resolve) => {
        canvas.toBlob((file) => resolve(file), fileType);
    });
};
