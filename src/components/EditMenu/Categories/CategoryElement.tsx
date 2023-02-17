import type { FC } from "react";
import { useState } from "react";

import { Accordion, Box, Flex, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import { Draggable } from "react-beautiful-dnd";

import type { Category, MenuItem } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

import { useStyles } from "./styles";
import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { EditDeleteOptions } from "../../EditDeleteOptions";
import { CategoryForm } from "../../Forms/CategoryForm";
import { MenuItems } from "../MenuItems/MenuItems";

interface Props {
    /** Category which will be represented by the component */
    categoryItem: Category & { items: MenuItem[] };
    /** Id of the menu to which the categories belong to */
    menuId: string;
}

/** Individual category component with an option to edit or delete */
export const CategoryElement: FC<Props> = ({ categoryItem, menuId }) => {
    const trpcCtx = api.useContext();
    const { classes, cx, theme } = useStyles();
    const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
    const [categoryFormOpen, setCategoryFormOpen] = useState(false);

    const { mutate: deleteCategory, isLoading: isDeleting } = api.category.delete.useMutation({
        onError: (err) => showErrorToast("Failed to delete category", err),
        onSettled: () => setDeleteCategoryModalOpen(false),
        onSuccess: (data) => {
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.filter((item) => item.id !== data.id)
            );
            showSuccessToast(
                "Successfully deleted",
                `Deleted the category ${data.name} and related menu items successfully`
            );
        },
    });

    return (
        <>
            <Draggable key={categoryItem.id} draggableId={categoryItem.id} index={categoryItem.position}>
                {(provided, snapshot) => (
                    <Accordion.Item
                        className={cx({
                            [classes.itemDragging]: snapshot.isDragging,
                        })}
                        ref={provided.innerRef}
                        value={categoryItem.id}
                        {...provided.draggableProps}
                    >
                        <Accordion.Control>
                            <Flex align="center" justify="space-between">
                                <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                                    <IconGripVertical size={18} stroke={1.5} />
                                </Box>
                                <Text sx={{ flex: 1 }}>{categoryItem.name}</Text>
                                <EditDeleteOptions
                                    onDeleteClick={() => setDeleteCategoryModalOpen(true)}
                                    onEditClick={() => setCategoryFormOpen(true)}
                                />
                            </Flex>
                        </Accordion.Control>
                        <Accordion.Panel bg={theme.colors.dark[0]}>
                            <MenuItems categoryId={categoryItem.id} menuId={menuId} menuItems={categoryItem?.items} />
                        </Accordion.Panel>
                    </Accordion.Item>
                )}
            </Draggable>
            <CategoryForm
                categoryItem={categoryItem}
                menuId={menuId}
                onClose={() => setCategoryFormOpen(false)}
                opened={categoryFormOpen}
            />
            <DeleteConfirmModal
                description="Are you sure, you want to delete this category? This action will also delete all the items associated with this category and cannot be undone"
                loading={isDeleting}
                onClose={() => setDeleteCategoryModalOpen(false)}
                onDelete={() => deleteCategory({ id: categoryItem?.id })}
                opened={deleteCategoryModalOpen}
                title={`Delete ${categoryItem?.name} category`}
            />
        </>
    );
};
