import type { ModalProps } from "@mantine/core";
import { Text, Box, Stack, useMantineTheme, Modal } from "@mantine/core";
import type { MenuItem, Image } from "@prisma/client";
import type { FC } from "react";
import { ImageKitImage } from "../ImageKitImage";

interface Props extends ModalProps {
    /** Menu item for which the modal needs to be displayed */
    menuItem?: MenuItem & { image: Image | null };
}

/** Modal to view details of a selected menu item */
export const ViewMenuItemModal: FC<Props> = ({ menuItem, ...rest }) => {
    const theme = useMantineTheme();
    return (
        <Modal title={<Text size="lg">{menuItem?.name}</Text>} overlayOpacity={0.1} overlayBlur={5} {...rest}>
            <Stack spacing="sm">
                {menuItem?.image?.path && (
                    <Box sx={{ overflow: "hidden", borderRadius: theme.radius.lg }}>
                        <ImageKitImage
                            height={400}
                            width={400}
                            imagePath={menuItem?.image?.path}
                            blurhash={menuItem?.image?.blurHash}
                        />
                    </Box>
                )}
                <Text size="lg" color="red">
                    {menuItem?.price}
                </Text>
                <Text color="dimmed">{menuItem?.description}</Text>
            </Stack>
        </Modal>
    );
};
