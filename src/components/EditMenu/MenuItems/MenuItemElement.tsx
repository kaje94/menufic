import type { FC } from "react";
import { useState } from "react";

import { ActionIcon, Box, createStyles, Grid, Text } from "@mantine/core";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons";
import { Draggable } from "react-beautiful-dnd";

import type { Image, MenuItem } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { MenuItemForm } from "../../Forms/MenuItemForm";
import { ImageKitImage } from "../../ImageKitImage";

const useStyles = createStyles((theme) => ({
    actionButtons: {
        display: "flex",
        gap: 10,
        justifyContent: "center",
    },
    dragHandleTable: {
        ...theme.fn.focusStyles(),
        alignItems: "center",
        color: theme.colors.dark[6],
        display: "flex",
        height: "100%",
        justifyContent: "center",
    },
    elementItem: {
        [`&:hover`]: { background: theme.colors.dark[1] },
        borderRadius: theme.radius.lg,
        transition: "background 500ms ease",
    },
    emptyImage: {
        alignItems: "center",
        border: `1px solid ${theme.colors.dark[2]}`,
        borderRadius: theme.radius.md,
        color: theme.colors.dark[5],
        display: "flex",
        fontSize: theme.fontSizes.xs,
        height: 50,
        overflow: "hidden",
        textAlign: "center",
        verticalAlign: "center",
        width: 50,
    },
    itemDragging: { background: theme.colors.dark[1], boxShadow: theme.shadows.sm },
}));

interface Props {
    /** Id of the Category to which the item belongs to */
    categoryId: string;
    /** Id of the menu to which the item belongs to  */
    menuId: string;
    /** Item which will be represented by the component */
    menuItem: MenuItem & { image?: Image };
}

/** Individual menu item component with an option to edit or delete */
export const MenuItemElement: FC<Props> = ({ menuItem, menuId, categoryId }) => {
    const trpcCtx = api.useContext();
    const { classes, cx, theme } = useStyles();
    const [deleteMenuItemModalOpen, setDeleteMenuItemModalOpen] = useState(false);
    const [menuItemFormOpen, setMenuItemFormOpen] = useState(false);

    const { mutate: deleteMenuItem, isLoading: isDeleting } = api.menuItem.delete.useMutation({
        onError: (err) => showErrorToast("Failed to delete menu item", err),
        onSettled: () => setDeleteMenuItemModalOpen(false),
        onSuccess: (data) => {
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((categoryItem) =>
                    categoryItem.id === categoryId
                        ? {
                              ...categoryItem,
                              items: categoryItem.items?.filter((item) => item.id !== data.id),
                          }
                        : categoryItem
                )
            );
            showSuccessToast("Successfully deleted", `Deleted the menu item ${data.name}`);
        },
    });

    return (
        <>
            <Draggable key={menuItem.id} draggableId={menuItem.id} index={menuItem.position}>
                {(provided, snapshot) => (
                    <Grid
                        align="center"
                        className={cx([classes.elementItem, snapshot.isDragging && classes.itemDragging])}
                        gutter="lg"
                        my="sm"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <Grid.Col
                            className={classes.dragHandleTable}
                            md={1}
                            sm={2}
                            span={1}
                            {...provided.dragHandleProps}
                        >
                            <IconGripVertical size={18} stroke={1.5} />
                        </Grid.Col>

                        <Grid.Col md={1} sm={2} span={2}>
                            <Box className={classes.emptyImage}>
                                {menuItem.image?.path ? (
                                    <ImageKitImage
                                        blurhash={menuItem.image?.blurHash}
                                        color={menuItem.image?.color}
                                        height={50}
                                        imageAlt={menuItem.name}
                                        imagePath={menuItem.image?.path}
                                        width={50}
                                    />
                                ) : (
                                    <Text>No Image</Text>
                                )}
                            </Box>
                        </Grid.Col>

                        <Grid.Col md={2} sm={5} span={6}>
                            <Text align="center" weight={700}>
                                {menuItem.name}
                            </Text>
                        </Grid.Col>
                        <Grid.Col md={2} sm={3} span={3}>
                            <Text align="center" color="red" opacity={0.8}>
                                {menuItem.price}
                            </Text>
                        </Grid.Col>
                        <Grid.Col lg={5} sm={9} span={12}>
                            <Text color={menuItem.description ? theme.colors.dark[6] : theme.colors.dark[3]}>
                                {menuItem.description || "No Description"}
                            </Text>
                        </Grid.Col>
                        <Grid.Col className={classes.actionButtons} lg={1} sm={3} span={12}>
                            <ActionIcon onClick={() => setMenuItemFormOpen(true)}>
                                <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon color="red" onClick={() => setDeleteMenuItemModalOpen(true)}>
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Grid.Col>
                    </Grid>
                )}
            </Draggable>

            <DeleteConfirmModal
                description="Are you sure, you want to delete this menu item? This action cannot be undone"
                loading={isDeleting}
                onClose={() => setDeleteMenuItemModalOpen(false)}
                onDelete={() => deleteMenuItem({ id: menuItem?.id })}
                opened={deleteMenuItemModalOpen}
                title={`Delete ${menuItem?.name} item`}
            />

            <MenuItemForm
                categoryId={categoryId}
                menuId={menuId}
                menuItem={menuItem}
                onClose={() => setMenuItemFormOpen(false)}
                opened={menuItemFormOpen}
            />
        </>
    );
};
