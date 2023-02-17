import type { FC } from "react";
import { useEffect } from "react";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import type { ModalProps } from "@mantine/core";
import type { Menu } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { menuInput } from "src/utils/validators";

import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Menu to be edited */
    menu?: Menu;
    /** Id of the restaurant that the menu belongs to */
    restaurantId: string;
}

/** Form to be used when allowing users to add or edit menus of restaurant */
export const MenuForm: FC<Props> = ({ opened, onClose, restaurantId, menu: menuItem, ...rest }) => {
    const trpcCtx = api.useContext();

    const { mutate: createMenu, isLoading: isCreating } = api.menu.create.useMutation({
        onError: (err) => showErrorToast("Failed to create menu for restaurant", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.menu.getAll.setData({ restaurantId }, (menus) => [...(menus || []), data]);
            showSuccessToast("Successfully created", `Created a new menu ${data.name} successfully`);
        },
    });

    const { mutate: updateMenu, isLoading: isUpdating } = api.menu.update.useMutation({
        onError: (err) => showErrorToast("Failed to update menu", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.menu.getAll.setData({ restaurantId }, (menus) =>
                menus?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} menu successfully`);
        },
    });

    const { getInputProps, onSubmit, isDirty, resetDirty, setValues } = useForm({
        initialValues: { availableTime: menuItem?.availableTime || "", name: menuItem?.name || "" },
        validate: zodResolver(menuInput),
    });

    useEffect(() => {
        if (opened) {
            const values = { availableTime: menuItem?.availableTime || "", name: menuItem?.name || "" };
            setValues(values);
            resetDirty(values);
        }
    }, [menuItem, opened]);

    const loading = isCreating || isUpdating;

    return (
        <Modal
            loading={loading}
            onClose={onClose}
            opened={opened}
            title={menuItem ? "Update Menu" : "Create Menu"}
            {...rest}
        >
            <form
                onSubmit={onSubmit((values) => {
                    if (isDirty()) {
                        if (menuItem) {
                            updateMenu({ ...values, id: menuItem?.id });
                        } else {
                            createMenu({ ...values, restaurantId });
                        }
                    } else {
                        onClose();
                    }
                })}
            >
                <Stack spacing="sm">
                    <TextInput
                        disabled={loading}
                        label="Name"
                        placeholder="Menu Name"
                        withAsterisk
                        {...getInputProps("name")}
                    />
                    <TextInput
                        disabled={loading}
                        label="Available Time"
                        placeholder="10.00 AM - 9.00 PM"
                        {...getInputProps("availableTime")}
                    />
                    <Group mt="md" position="right">
                        <Button loading={loading} px="xl" type="submit">
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
