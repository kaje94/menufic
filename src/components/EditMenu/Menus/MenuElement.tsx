import { Center, Text, Box, createStyles } from "@mantine/core";
import type { Menu } from "@prisma/client";
import { IconGripVertical } from "@tabler/icons";
import type { FC } from "react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { api } from "src/utils/api";
import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { EditDeleteOptions } from "../../EditDeleteOptions";
import { MenuForm } from "../../Forms/MenuForm";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

const useStyles = createStyles((theme) => ({
    item: {
        display: "flex",
        alignItems: "center",
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.gray[2]}`,
        padding: theme.spacing.sm,
        backgroundColor: theme.white,
        marginBottom: theme.spacing.sm,
        cursor: "pointer",
        position: "relative",

        transition: "background 500ms ease",
        "&:hover": { backgroundColor: theme.colors.dark[0] },
    },
    itemTitle: { fontWeight: 600 },
    itemSubTitle: { fontSize: theme.fontSizes.xs },
    itemDragging: { boxShadow: theme.shadows.sm },
    itemSelected: {
        backgroundColor: theme.colors.primary[2],
        "&:hover": { backgroundColor: theme.colors.primary[2] },
    },
    dragHandle: {
        ...theme.fn.focusStyles(),
        height: "100%",
        color: theme.colors.dark[6],
        padding: theme.spacing.sm,
    },
}));

interface Props {
    /** Menu which will be represented by the component */
    item: Menu;
    /** Index or the position  of the item */
    index: number; // todo: check if this can be replaced by menuitem.position
    /** Id of the restaurant to which the menus belong to */
    restaurantId: string;
    /** Selected Menu of the restaurant */
    selectedMenu: Menu | undefined;
    /** Callback to be fired when user selects a new menu */
    setSelectedMenu: (menu: Menu | undefined) => void;
}

/** Individual Menu selection component with an option to edit or delete */
export const MenuElement: FC<Props> = ({ item, index, selectedMenu, restaurantId, setSelectedMenu }) => {
    const trpcCtx = api.useContext();
    const { classes, cx } = useStyles();
    const [deleteMenuModalOpen, setDeleteMenuModalOpen] = useState(false);
    const [menuFormOpen, setMenuFormOpen] = useState(false);

    const { mutate: deleteMenu, isLoading: isDeleting } = api.menu.delete.useMutation({
        onSuccess: (data) => {
            const filteredMenuData = trpcCtx.menu.getAll
                .getData({ restaurantId })
                ?.filter((item) => item.id !== data.id);
            trpcCtx.menu.getAll.setData({ restaurantId }, filteredMenuData);

            if (data.id === selectedMenu?.id && filteredMenuData) {
                setSelectedMenu(filteredMenuData?.length > 0 ? filteredMenuData[0] : undefined);
            }

            showSuccessToast("Successfully deleted", `Deleted the menu ${data.name} and related details successfully`);
        },
        onError: (err) => showErrorToast("Failed to delete restaurant menu", err),
    });

    return (
        <>
            <Draggable key={item.id} index={index} draggableId={item.id}>
                {(provided, snapshot) => (
                    <Box
                        className={cx(classes.item, {
                            [classes.itemDragging]: snapshot.isDragging,
                            [classes.itemSelected]: item.id === selectedMenu?.id,
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onClick={() => setSelectedMenu(item)}
                    >
                        <Center {...provided.dragHandleProps} className={classes.dragHandle}>
                            <IconGripVertical size={18} stroke={1.5} />
                        </Center>
                        <Box sx={{ flex: 1 }}>
                            <Text className={classes.itemTitle}>{item.name}</Text>
                            <Text className={classes.itemSubTitle}>{item.availableTime}</Text>
                        </Box>
                        <EditDeleteOptions
                            loading={isDeleting}
                            onEditClick={() => setMenuFormOpen(true)}
                            onDeleteClick={() => setDeleteMenuModalOpen(true)}
                        />
                    </Box>
                )}
            </Draggable>
            <MenuForm
                opened={menuFormOpen}
                onClose={() => setMenuFormOpen(false)}
                restaurantId={restaurantId}
                menu={item}
            />
            <DeleteConfirmModal
                opened={deleteMenuModalOpen}
                onClose={() => setDeleteMenuModalOpen(false)}
                onDelete={() => {
                    deleteMenu({ id: item.id });
                    setDeleteMenuModalOpen(false);
                }}
                title={`Delete ${item.name} menu`}
                description="Are you sure, you want to delete this menu? This action will also delete all the categories & items associated with this menu and cannot be undone"
            />
        </>
    );
};
