import type { ModalProps } from "@mantine/core";
import { Text, Box, Stack, useMantineTheme } from "@mantine/core";
import type { MenuItem, Image } from "@prisma/client";
import type { FC } from "react";
import { useMemo } from "react";
import { ImageKitImage } from "../ImageKitImage";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Menu item for which the modal needs to be displayed */
    menuItem?: MenuItem & { image: Image | null };
}

/** Modal to view details of a selected menu item */
export const ViewMenuItemModal: FC<Props> = ({ menuItem, ...rest }) => {
    const theme = useMantineTheme();
    const bgColor = useMemo(() => {
        if (menuItem?.image?.color) {
            if (theme.colorScheme === "light") {
                return theme.fn.lighten(menuItem?.image?.color, 0.85);
            }
            return theme.fn.darken(menuItem?.image?.color, 0.85);
        }
        return theme.white;
    }, [menuItem?.image?.color, theme.colorScheme]);

    return (
        <Modal
            title={
                <Text size="xl" weight="bold" color={theme.black}>
                    {menuItem?.name}
                </Text>
            }
            {...rest}
            styles={{ modal: { background: bgColor } }}
        >
            <Stack spacing="sm">
                {menuItem?.image?.path && (
                    <Box sx={{ overflow: "hidden", borderRadius: theme.radius.lg }}>
                        <ImageKitImage
                            height={400}
                            width={400}
                            imagePath={menuItem?.image?.path}
                            blurhash={menuItem?.image?.blurHash}
                            imageAlt={menuItem?.name}
                        />
                    </Box>
                )}
                <Text size="lg" color="red" mt="sm">
                    {menuItem?.price}
                </Text>
                <Text opacity={0.6} color={theme.black}>
                    {menuItem?.description}
                </Text>
            </Stack>
        </Modal>
    );
};
