import { Accordion, Flex, Text, Box } from "@mantine/core";
import type { Category, MenuItem } from "@prisma/client";
import { IconGripVertical } from "@tabler/icons";
import type { FC } from "react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { api } from "src/utils/api";
import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { MenuItems } from "../MenuItems/MenuItems";
import { EditDeleteOptions } from "../../EditDeleteOptions";
import { CategoryForm } from "../../Forms/CategoryForm";
import { useStyles } from "./styles";

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
        onSuccess: (data) => {
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.filter((item) => item.id !== data.id)
            );
            showSuccessToast(
                "Successfully deleted",
                `Deleted the category ${data.name} and related menu items successfully`
            );
        },
        onError: (err) => showErrorToast("Failed to delete category", err),
    });

    return (
        <>
            <Draggable key={categoryItem.id} index={categoryItem.position} draggableId={categoryItem.id}>
                {(provided, snapshot) => (
                    <Accordion.Item
                        value={categoryItem.id}
                        className={cx({
                            [classes.itemDragging]: snapshot.isDragging,
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <Accordion.Control>
                            <Flex justify="space-between" align="center">
                                <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                                    <IconGripVertical size={18} stroke={1.5} />
                                </Box>
                                <Text sx={{ flex: 1 }}>{categoryItem.name}</Text>
                                <EditDeleteOptions
                                    loading={isDeleting}
                                    onEditClick={() => setCategoryFormOpen(true)}
                                    onDeleteClick={() => setDeleteCategoryModalOpen(true)}
                                />
                            </Flex>
                        </Accordion.Control>
                        <Accordion.Panel bg={theme.colors.dark[0]}>
                            <MenuItems menuItems={categoryItem?.items} categoryId={categoryItem.id} menuId={menuId} />
                        </Accordion.Panel>
                    </Accordion.Item>
                )}
            </Draggable>
            <CategoryForm
                opened={categoryFormOpen}
                onClose={() => setCategoryFormOpen(false)}
                menuId={menuId}
                categoryItem={categoryItem}
            />
            <DeleteConfirmModal
                opened={deleteCategoryModalOpen}
                onClose={() => setDeleteCategoryModalOpen(false)}
                onDelete={() => {
                    deleteCategory({ id: categoryItem?.id });
                    setDeleteCategoryModalOpen(false);
                }}
                title={`Delete ${categoryItem?.name} category`}
                description="Are you sure, you want to delete this category? This action will also delete all the items associated with this category and cannot be undone"
            />
        </>
    );
};
