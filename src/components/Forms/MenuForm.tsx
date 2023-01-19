import type { ModalProps } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "src/utils/api";
import type { Menu } from "@prisma/client";
import type { FC } from "react";
import { useEffect } from "react";
import { menuInput } from "src/utils/validators";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
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
    const theme = useMantineTheme();

    const { mutate: createMenu, isLoading: isCreating } = api.menu.create.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.menu.getAll.setData({ restaurantId }, (menus) => [...(menus || []), data]);
            showSuccessToast("Successfully created", `Created a new menu ${data.name} successfully`);
        },
        onError: (err) => showErrorToast("Failed to create menu for restaurant", err),
    });

    const { mutate: updateMenu, isLoading: isUpdating } = api.menu.update.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.menu.getAll.setData({ restaurantId }, (menus) =>
                menus?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} menu successfully`);
        },
        onError: (err) => showErrorToast("Failed to update menu", err),
    });

    const { getInputProps, onSubmit, isDirty, resetDirty, setValues } = useForm({
        initialValues: { name: menuItem?.name || "", availableTime: menuItem?.availableTime || "" },
        validate: zodResolver(menuInput),
    });

    useEffect(() => {
        if (opened) {
            const values = { name: menuItem?.name || "", availableTime: menuItem?.availableTime || "" };
            setValues(values);
            resetDirty(values);
        }
    }, [menuItem, opened]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={menuItem ? "Update Menu" : "Create Menu"}
            loading={isCreating || isUpdating}
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
                    <TextInput withAsterisk label="Name" placeholder="Menu Name" {...getInputProps("name")} />
                    <TextInput
                        label="Available Time"
                        placeholder="10.00 AM - 9.00 PM"
                        {...getInputProps("availableTime")}
                    />
                    <Group position="right" mt="md">
                        <Button type="submit" loading={isCreating || isUpdating} px="xl">
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
