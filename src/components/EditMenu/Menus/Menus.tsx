import type { FC } from "react";
import { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Center, Loader, Text } from "@mantine/core";
import type { Menu } from "@prisma/client";
import { IconCirclePlus } from "@tabler/icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { env } from "src/env/client.mjs";
import { api } from "src/utils/api";
import { reorderList, showErrorToast } from "src/utils/helpers";

import { MenuElement } from "./MenuElement";
import { useStyles } from "./styles";
import { Empty } from "../../Empty";
import { MenuForm } from "../../Forms/MenuForm";

interface Props {
    /** Id of the restaurant to which the menus belong to */
    restaurantId: string;
    /** Selected Menu of the restaurant */
    selectedMenu: Menu | undefined;
    /** Callback to be fired when user selects a new menu */
    setSelectedMenu: (menu: Menu | undefined) => void;
}

/** Draggable list of menus with add, edit and delete options */
export const Menus: FC<Props> = ({ restaurantId, selectedMenu, setSelectedMenu }) => {
    const trpcCtx = api.useContext();
    const { classes, cx } = useStyles();
    const [rootParent] = useAutoAnimate<HTMLDivElement>();
    const [menuFormOpen, setMenuFormOpen] = useState(false);

    const { isLoading: menusLoading, data: menus = [] } = api.menu.getAll.useQuery(
        { restaurantId },
        {
            enabled: !!restaurantId,
            onError: () => showErrorToast("Failed to retrieve menus"),
            onSuccess: (menusRes) => {
                if (!selectedMenu || !menusRes.some((item) => item.id === selectedMenu.id)) {
                    setSelectedMenu(menusRes.length > 0 ? menusRes[0] : undefined);
                }
            },
        }
    );

    useEffect(() => {
        if (!selectedMenu || !menus.some((item) => item.id === selectedMenu.id)) {
            setSelectedMenu(menus.length > 0 ? menus[0] : undefined);
        }
    }, [selectedMenu, setSelectedMenu, menus]);

    const { mutate: updateMenuPositions } = api.menu.updatePosition.useMutation({
        onError: (err, _newItem, context: { previousMenus: Menu[] | undefined } | undefined) => {
            showErrorToast("Failed to update the position of menu", err);
            trpcCtx.menu.getAll.setData({ restaurantId }, context?.previousMenus);
        },
        onMutate: async (reorderedList) => {
            await trpcCtx.menu.getAll.cancel({ restaurantId });

            const previousMenus = trpcCtx.menu.getAll.getData({ restaurantId });
            const reorderedMenus: Menu[] = [];
            reorderedList.forEach((item) => {
                const matchingItem = previousMenus?.find((prev) => prev.id === item.id);
                if (matchingItem) {
                    reorderedMenus.push({ ...matchingItem, position: item.newPosition });
                }
            });

            trpcCtx.menu.getAll.setData({ restaurantId }, reorderedMenus);
            return { previousMenus };
        },
    });

    return (
        <>
            <Box ref={rootParent}>
                <DragDropContext
                    onDragEnd={({ destination, source }) => {
                        if (source.index !== destination?.index) {
                            const reorderedList = reorderList(menus, source.index, destination?.index || 0);
                            updateMenuPositions(
                                reorderedList.map((item, index) => ({
                                    id: item.id,
                                    newPosition: index,
                                }))
                            );
                        }
                    }}
                >
                    <Droppable droppableId="dnd-list">
                        {(provided) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef}>
                                {menus?.map((item) => (
                                    <MenuElement
                                        key={item.id}
                                        item={item}
                                        restaurantId={restaurantId}
                                        selectedMenu={selectedMenu}
                                        setSelectedMenu={setSelectedMenu}
                                    />
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
                {menusLoading && (
                    <Center h="50vh">
                        <Loader size="lg" />
                    </Center>
                )}
                {!menusLoading && !selectedMenu && (
                    <Empty height={300} text="Get started by adding the first menu for your restaurant" />
                )}
                {!menusLoading && menus?.length < Number(env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT) && (
                    <Box
                        key="add-new-menu"
                        className={cx(classes.item, classes.addItem, menus?.length === 0 && classes.initialAdd)}
                        onClick={() => setMenuFormOpen(true)}
                    >
                        <Center p="sm">
                            <IconCirclePlus size={24} />
                        </Center>
                        <Text className={classes.itemTitle}>Add Menu</Text>
                    </Box>
                )}
            </Box>

            <MenuForm onClose={() => setMenuFormOpen(false)} opened={menuFormOpen} restaurantId={restaurantId} />
        </>
    );
};
