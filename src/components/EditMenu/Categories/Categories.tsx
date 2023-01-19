import { IconPlus } from "@tabler/icons";
import { Button, Accordion, Box, Center, Loader } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { reorderList, showErrorToast } from "src/utils/helpers";
import { api } from "src/utils/api";
import { CategoryForm } from "../../Forms/CategoryForm";
import { CategoryElement } from "./CategoryElement";
import type { Category, MenuItem, Image } from "@prisma/client";
import { env } from "../../../env/client.mjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStyles } from "./styles";

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
        { menuId: menuId },
        {
            enabled: !!menuId,
            onSuccess: (data) => {
                const newSelected = openedCategories.filter((item) =>
                    data.map((category) => category.id).includes(item)
                );
                if (newSelected.length === 0) {
                    setOpenedCategories(data[0] ? [data[0]?.id] : []);
                }
            },
            onError: () => showErrorToast("Failed to retrieve categories and menu items"),
        }
    );

    const { mutate: updateCategoryPositions } = api.category.updatePosition.useMutation({
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
        onError: (_err, _newItem, context) => {
            showErrorToast("Failed to update category position");
            trpcCtx.category.getAll.setData({ menuId }, context?.previousCategories);
        },
    });

    return (
        <>
            <Box ref={rootParent}>
                <Accordion
                    variant="contained"
                    chevronPosition="right"
                    multiple={true}
                    value={openedCategories}
                    onChange={setOpenedCategories}
                    classNames={{ control: classes.accordionControl, item: classes.accordionItem }}
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
                        <Droppable droppableId={`dnd-category-list-${menuId}`} direction="vertical">
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
                    <Center w="100%" h="50vh">
                        <Loader size="lg" />
                    </Center>
                )}

                {!categoriesLoading && categories?.length < Number(env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU) && (
                    <Button
                        key="add-new-category"
                        leftIcon={<IconPlus size={20} />}
                        mt={categories?.length === 0 ? 0 : "md"}
                        variant={categories?.length === 0 ? "filled" : "default"}
                        onClick={() => setCategoryFormOpen(true)}
                        loading={categoriesLoading}
                        px="lg"
                        size={categories?.length === 0 ? "lg" : "md"}
                    >
                        Add Category
                    </Button>
                )}
            </Box>
            <CategoryForm
                opened={categoryFormOpen}
                onClose={() => setCategoryFormOpen(false)}
                menuId={menuId}
                onAddSuccess={(newItem) => setOpenedCategories((items) => [...items, newItem?.id])}
            />
        </>
    );
};
