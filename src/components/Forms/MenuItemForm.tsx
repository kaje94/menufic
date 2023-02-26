import type { FC } from "react";
import { useEffect } from "react";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import type { ModalProps } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { menuItemInput } from "src/utils/validators";

import { ImageUpload } from "../ImageUpload";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Id of the category that the item belongs to */
    categoryId: string;
    /** Id of the menu that the item belongs to */
    menuId: string;
    /** Menu item to be edited */
    menuItem?: MenuItem & { image?: Image };
}

/** Form to be used when allowing users to add or edit menu items of restaurant menus categories */
export const MenuItemForm: FC<Props> = ({ opened, onClose, menuId, menuItem, categoryId, ...rest }) => {
    const trpcCtx = api.useContext();

    const { mutate: createMenuItem, isLoading: isCreating } = api.menuItem.create.useMutation({
        onError: (err) => showErrorToast("Failed to create menu item", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) => (item.id === categoryId ? { ...item, items: [...item.items, data] } : item))
            );
            showSuccessToast("Successfully created", `Created a new menu item ${data.name} successfully`);
        },
    });

    const { mutate: updateMenuItem, isLoading: isUpdating } = api.menuItem.update.useMutation({
        onError: (err) => showErrorToast("Failed to update menu item", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((categoryItem) =>
                    categoryItem.id === categoryId
                        ? {
                              ...categoryItem,
                              items: categoryItem.items?.map((item) => (item.id === data.id ? data : item)),
                          }
                        : categoryItem
                )
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} category successfully`);
        },
    });

    const { getInputProps, onSubmit, setValues, isDirty, resetDirty, values } = useForm({
        initialValues: {
            description: menuItem?.description || "",
            imageBase64: "",
            imagePath: menuItem?.image?.path || "",
            name: menuItem?.name || "",
            price: menuItem?.price || "",
        },
        validate: zodResolver(menuItemInput),
    });

    useEffect(() => {
        if (opened) {
            const newValues = {
                description: menuItem?.description || "",
                imageBase64: "",
                imagePath: menuItem?.image?.path || "",
                name: menuItem?.name || "",
                price: menuItem?.price || "",
            };
            setValues(newValues);
            resetDirty(newValues);
        }
    }, [menuItem, opened]);

    const loading = isCreating || isUpdating;

    return (
        <Modal
            loading={loading}
            onClose={onClose}
            opened={opened}
            title={menuItem ? "Update Menu Item" : "Create Menu Item"}
            {...rest}
        >
            <form
                onSubmit={onSubmit((formValues) => {
                    if (isDirty()) {
                        if (menuItem) {
                            updateMenuItem({ ...formValues, id: menuItem?.id });
                        } else if (categoryId) {
                            createMenuItem({ ...formValues, categoryId, menuId });
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
                        placeholder="Item Name"
                        withAsterisk
                        {...getInputProps("name")}
                        autoFocus
                    />
                    <TextInput
                        disabled={loading}
                        label="Price"
                        placeholder="$10.00"
                        withAsterisk
                        {...getInputProps("price")}
                    />
                    <Textarea disabled={loading} label="Description" minRows={3} {...getInputProps("description")} />
                    <ImageUpload
                        disabled={loading}
                        height={400}
                        imageHash={menuItem?.image?.blurHash}
                        imageUrl={values?.imagePath}
                        onImageCrop={(imageBase64, imagePath) => setValues({ imageBase64, imagePath })}
                        onImageDeleteClick={() => setValues({ imageBase64: "", imagePath: "" })}
                        width={400}
                    />
                    <Group mt="md" position="right">
                        <Button data-testid="save-menu-item-form" loading={loading} px="xl" type="submit">
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
