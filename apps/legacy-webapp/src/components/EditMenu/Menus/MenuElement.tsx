import type { FC } from "react";
import { useState } from "react";

import { Box, Center, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import { useTranslations } from "next-intl";
import { Draggable } from "react-beautiful-dnd";

import type { Menu } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

import { useStyles } from "./styles";
import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { EditDeleteOptions } from "../../EditDeleteOptions";
import { MenuForm } from "../../Forms/MenuForm";

interface Props {
    /** Menu which will be represented by the component */
    item: Menu;
    /** Index or the position  of the item */
    restaurantId: string;
    /** Selected Menu of the restaurant */
    selectedMenu: Menu | undefined;
    /** Callback to be fired when user selects a new menu */
    setSelectedMenu: (menu: Menu | undefined) => void;
}

/** Individual Menu selection component with an option to edit or delete */
export const MenuElement: FC<Props> = ({ item, selectedMenu, restaurantId, setSelectedMenu }) => {
    const trpcCtx = api.useContext();
    const { classes, cx, theme } = useStyles();
    const [deleteMenuModalOpen, setDeleteMenuModalOpen] = useState(false);
    const [menuFormOpen, setMenuFormOpen] = useState(false);
    const t = useTranslations("dashboard.editMenu.menu");
    const tCommon = useTranslations("common");

    const { mutate: deleteMenu, isLoading: isDeleting } = api.menu.delete.useMutation({
        onError: (err) => showErrorToast(t("deleteMenuError"), err),
        onSettled: () => setDeleteMenuModalOpen(false),
        onSuccess: (data) => {
            const filteredMenuData = trpcCtx.menu.getAll
                .getData({ restaurantId })
                ?.filter((menuItem) => menuItem.id !== data.id);
            trpcCtx.menu.getAll.setData({ restaurantId }, filteredMenuData);

            if (data.id === selectedMenu?.id && filteredMenuData) {
                setSelectedMenu(filteredMenuData?.length > 0 ? filteredMenuData[0] : undefined);
            }

            showSuccessToast(tCommon("deleteSuccess"), t("deleteSuccessToast", { name: data.name }));
        },
    });

    const isSelected = item.id === selectedMenu?.id;

    return (
        <>
            <Draggable key={item.id} draggableId={item.id} index={item.position}>
                {(provided, snapshot) => (
                    <Box
                        className={cx(classes.item, {
                            [classes.itemDragging]: snapshot.isDragging,
                            [classes.itemSelected]: isSelected,
                        })}
                        data-testid={`menu-item ${item.name}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onClick={() => setSelectedMenu(item)}
                    >
                        <Center {...provided.dragHandleProps} className={classes.dragHandle}>
                            <IconGripVertical
                                color={isSelected ? theme.colors.primary?.[7] : theme.colors.dark[6]}
                                size={18}
                            />
                        </Center>
                        <Box sx={{ flex: 1 }}>
                            <Text className={classes.itemTitle}>{item.name}</Text>
                            <Text className={classes.itemSubTitle}>{item.availableTime}</Text>
                        </Box>
                        <EditDeleteOptions
                            color={isSelected ? theme.colors?.primary?.[7] : theme.colors.dark[6]}
                            hoverColor={isSelected ? theme.black : theme.colors.primary?.[5]}
                            onDeleteClick={() => setDeleteMenuModalOpen(true)}
                            onEditClick={() => setMenuFormOpen(true)}
                        />
                    </Box>
                )}
            </Draggable>
            <MenuForm
                menu={item}
                onClose={() => setMenuFormOpen(false)}
                opened={menuFormOpen}
                restaurantId={restaurantId}
            />
            <DeleteConfirmModal
                description={t("deleteConfirmDesc")}
                loading={isDeleting}
                onClose={() => setDeleteMenuModalOpen(false)}
                onDelete={() => deleteMenu({ id: item.id })}
                opened={deleteMenuModalOpen}
                title={t("deleteConfirmTitle", { name: item.name })}
            />
        </>
    );
};
