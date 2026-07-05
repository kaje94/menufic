import type { FC } from "react";
import { useMemo } from "react";

import { Box, Stack, Text, useMantineTheme } from "@mantine/core";

import type { ModalProps } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";

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
            centered
            data-testid="menu-item-card-modal"
            styles={{ modal: { background: bgColor } }}
            title={
                <Text color={theme.black} size="xl" weight="bold">
                    {menuItem?.name}
                </Text>
            }
            {...rest}
        >
            <Stack spacing="sm">
                {menuItem?.image?.path && (
                    <Box sx={{ borderRadius: theme.radius.lg, overflow: "hidden" }}>
                        <ImageKitImage
                            blurhash={menuItem?.image?.blurHash}
                            height={400}
                            imageAlt={menuItem?.name}
                            imagePath={menuItem?.image?.path}
                            width={400}
                        />
                    </Box>
                )}
                <Text color="red" mt="sm" size="lg">
                    {menuItem?.price}
                </Text>
                <Text color={theme.black} opacity={0.6}>
                    {menuItem?.description}
                </Text>
            </Stack>
        </Modal>
    );
};
