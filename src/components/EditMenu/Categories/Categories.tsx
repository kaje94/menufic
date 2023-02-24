import type { FC } from "react";
import { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Accordion, Box, Button, Center, Loader } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import type { Category, Image, MenuItem } from "@prisma/client";

import { api } from "src/utils/api";
import { reorderList, showErrorToast } from "src/utils/helpers";

import { CategoryElement } from "./CategoryElement";
import { useStyles } from "./styles";
import { env } from "../../../env/client.mjs";
import { CategoryForm } from "../../Forms/CategoryForm";

interface Props {
    /** Id of the menu to which the categories belong to */
    menuId: string;
}

/** Draggable list of categories items with add, edit and delete options */
export const Categories: FC<Props> = ({ menuId }) => {
    const trpcCtx = api.useContext();
    const { classes } = useStyles();
    const [categoryFormOpen, setCategoryFormOpen] = useState(false);
    const [openedCategories, setOpenedCategories] = useState<string[]>([]);
    const [categoriesParent, enableAutoAnimate] = useAutoAnimate<HTMLElement>();
    const [rootParent] = useAutoAnimate<HTMLDivElement>();

    const { isLoading: categoriesLoading, data: categories = [] } = api.category.getAll.useQuery(
        { menuId },
        {
            enabled: !!menuId,
            onError: () => showErrorToast("Failed to retrieve categories and menu items"),
            onSuccess: (data) => {
                const newSelected = openedCategories.filter((item) =>
                    data.map((category) => category.id).includes(item)
                );
                if (newSelected.length === 0) {
                    setOpenedCategories(data[0] ? [data[0]?.id] : []);
                }
            },
        }
    );

    const { mutate: updateCategoryPositions } = api.category.updatePosition.useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (_err, _newItem, context: any) => {
            showErrorToast("Failed to update category position");
            trpcCtx.category.getAll.setData({ menuId }, context?.previousCategories);
        },
        onMutate: async (reorderedList) => {
            await trpcCtx.category.getAll.cancel({ menuId });
            const previousCategories = trpcCtx.category.getAll.getData({ menuId });
            const reorderedCategories = reorderedList?.reduce(
                (
                    acc: (Category & {
                        items: (MenuItem & { image: Image | null })[];
                    })[],
                    item
                ) => {
                    const matchingItem = previousCategories?.find((prev) => prev.id === item.id);
                    if (matchingItem) {
                        acc.push({ ...matchingItem, position: item.newPosition });
                    }
                    return acc;
                },
                []
            );
            trpcCtx.category.getAll.setData({ menuId }, reorderedCategories);
            return { previousCategories };
        },
    });

    return (
        <>
            <Box ref={rootParent}>
                <Accordion
                    chevronPosition="right"
                    classNames={{ control: classes.accordionControl, item: classes.accordionItem }}
                    multiple
                    onChange={setOpenedCategories}
                    value={openedCategories}
                    variant="contained"
                >
                    <DragDropContext
                        onBeforeDragStart={() => enableAutoAnimate(false)}
                        onDragEnd={({ destination, source }) => {
                            if (source.index !== destination?.index) {
                                const reorderedList = reorderList(categories, source.index, destination?.index || 0);
                                updateCategoryPositions(
                                    reorderedList.map((item, index) => ({
                                        id: item.id,
                                        newPosition: index,
                                    }))
                                );
                            }
                            setTimeout(() => enableAutoAnimate(true), 100);
                        }}
                    >
                        <Droppable direction="vertical" droppableId={`dnd-category-list-${menuId}`}>
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={(ref) => {
                                        provided.innerRef(ref);
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (categoriesParent as any).current = ref;
                                    }}
                                >
                                    {categories.map((item) => (
                                        <CategoryElement key={item.id} categoryItem={item} menuId={menuId} />
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Accordion>
                {categoriesLoading && (
                    <Center h="50vh" w="100%">
                        <Loader size="lg" />
                    </Center>
                )}

                {!categoriesLoading && categories?.length < Number(env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU) && (
                    <Button
                        key="add-new-category"
                        data-testid="add-new-category-button"
                        leftIcon={<IconPlus size={20} />}
                        loading={categoriesLoading}
                        mt={categories?.length === 0 ? 0 : "md"}
                        onClick={() => setCategoryFormOpen(true)}
                        px="lg"
                        size={categories?.length === 0 ? "lg" : "md"}
                        variant={categories?.length === 0 ? "filled" : "default"}
                    >
                        Add Category
                    </Button>
                )}
            </Box>
            <CategoryForm
                menuId={menuId}
                onAddSuccess={(newItem) => setOpenedCategories((items) => [...items, newItem?.id])}
                onClose={() => setCategoryFormOpen(false)}
                opened={categoryFormOpen}
            />
        </>
    );
};
