import type { FC } from "react";
import { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useTranslations } from "next-intl";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import type { Image, MenuItem } from "@prisma/client";

import { env } from "src/env/client.mjs";
import { api } from "src/utils/api";
import { reorderList, showErrorToast } from "src/utils/helpers";

import { MenuItemElement } from "./MenuItemElement";
import { MenuItemForm } from "../../Forms/MenuItemForm";

interface Props {
    /** Id of the category to which the items belong to */
    categoryId: string;
    /** Id of the menu to which the items belong to */
    menuId: string;
    /** List of exiting menu items of the category */
    menuItems: MenuItem[];
}

/** Draggable list of menu items with add, edit and delete options */
export const MenuItems: FC<Props> = ({ categoryId, menuItems, menuId }) => {
    const trpcCtx = api.useContext();
    const [menuItemFormOpen, setMenuItemFormOpen] = useState(false);
    const [itemsParent, enableAutoAnimate] = useAutoAnimate<HTMLElement>();
    const t = useTranslations("dashboard.editMenu.menuItem");

    const { mutate: updateMenuItemsPositions } = api.menuItem.updatePosition.useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err, _newItem, context: any) => {
            showErrorToast(t("positionUpdateError"), err);
            trpcCtx.category.getAll.setData({ menuId }, context?.previousCategories);
        },
        onMutate: async (reorderedList) => {
            await trpcCtx.category.getAll.cancel({ menuId });
            const previousCategories = trpcCtx.category.getAll.getData({ menuId });
            const reorderedCategories = previousCategories?.map((item) =>
                item.id === categoryId
                    ? {
                          ...item,
                          items: reorderedList.reduce((acc: (MenuItem & { image: Image | null })[], reorderedItem) => {
                              const matchingItem = item?.items?.find((menuItem) => menuItem.id === reorderedItem.id);
                              if (matchingItem) {
                                  return [...acc, { ...matchingItem, position: reorderedItem.newPosition }];
                              }
                              return acc;
                          }, []),
                      }
                    : item
            );
            trpcCtx.category.getAll.setData({ menuId }, reorderedCategories);
            return { previousCategories };
        },
    });

    return (
        <>
            <DragDropContext
                onBeforeDragStart={() => enableAutoAnimate(false)}
                onDragEnd={({ destination, source }) => {
                    if (source.index !== destination?.index) {
                        const reorderedList = reorderList(menuItems, source.index, destination?.index || 0);
                        updateMenuItemsPositions(
                            reorderedList.map((item, index) => ({ id: item.id, newPosition: index }))
                        );
                    }
                    setTimeout(() => enableAutoAnimate(true), 100);
                }}
            >
                <Droppable direction="vertical" droppableId={`dnd-menu-item-list-${categoryId}`}>
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={(ref) => {
                                provided.innerRef(ref);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (itemsParent as any).current = ref;
                            }}
                        >
                            {menuItems.map((item) => (
                                <MenuItemElement
                                    key={item.id}
                                    categoryId={categoryId}
                                    menuId={menuId}
                                    menuItem={item}
                                />
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
            {menuItems?.length < Number(env.NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY) && (
                <Flex justify="center">
                    <Button
                        key="add-new-menu-item"
                        data-testid="add-new-menu-item-button"
                        leftIcon={<IconPlus size={14} />}
                        mt="md"
                        my={menuItems?.length === 0 ? "lg" : 0}
                        onClick={() => setMenuItemFormOpen(true)}
                        variant={menuItems?.length === 0 ? "filled" : "default"}
                    >
                        {t("addMenuItemLabel")}
                    </Button>
                </Flex>
            )}

            <MenuItemForm
                categoryId={categoryId}
                menuId={menuId}
                onClose={() => setMenuItemFormOpen(false)}
                opened={menuItemFormOpen}
            />
        </>
    );
};
