import type { ModalProps } from "@mantine/core";
import { TextInput, Textarea, Button, Stack, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { MenuItem, Image } from "@prisma/client";
import type { FC } from "react";
import { useEffect } from "react";
import { api } from "src/utils/api";
import { menuItemInput } from "src/utils/validators";
import { ImageUpload } from "../ImageUpload";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Id of the menu that the item belongs to */
    menuId: string;
    /** Menu item to be edited */
    menuItem?: MenuItem & { image?: Image };
    /** Id of the category that the item belongs to */
    categoryId: string;
}

/** Form to be used when allowing users to add or edit menu items of restaurant menus categories */
export const MenuItemForm: FC<Props> = ({ opened, onClose, menuId, menuItem, categoryId, ...rest }) => {
    const trpcCtx = api.useContext();

    const { mutate: createMenuItem, isLoading: isCreating } = api.menuItem.create.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) => (item.id === categoryId ? { ...item, items: [...item.items, data] } : item))
            );
            showSuccessToast("Successfully created", `Created a new menu item ${data.name} successfully`);
        },
        onError: (err) => showErrorToast("Failed to create menu item", err),
    });

    const { mutate: updateMenuItem, isLoading: isUpdating } = api.menuItem.update.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) =>
                    item.id === categoryId
                        ? {
                              ...item,
                              items: item.items?.map((menuItem) => (menuItem.id === data.id ? data : menuItem)),
                          }
                        : item
                )
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} category successfully`);
        },
        onError: (err) => showErrorToast("Failed to update menu item", err),
    });

    const { getInputProps, onSubmit, setValues, isDirty, resetDirty, values } = useForm({
        initialValues: {
            name: menuItem?.name || "",
            price: menuItem?.price || "",
            description: menuItem?.description || "",
            imageBase64: "",
            imagePath: menuItem?.image?.path || "",
        },
        validate: zodResolver(menuItemInput),
    });

    useEffect(() => {
        if (opened) {
            const values = {
                name: menuItem?.name || "",
                price: menuItem?.price || "",
                description: menuItem?.description || "",
                imageBase64: "",
                imagePath: menuItem?.image?.path || "",
            };
            setValues(values);
            resetDirty(values);
        }
    }, [menuItem, opened]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={menuItem ? "Update Menu Item" : "Create Menu Item"}
            loading={isCreating || isUpdating}
            {...rest}
        >
            <form
                onSubmit={onSubmit((values) => {
                    if (isDirty()) {
                        if (menuItem) {
                            updateMenuItem({ ...values, id: menuItem?.id });
                        } else if (categoryId) {
                            createMenuItem({ ...values, categoryId, menuId });
                        }
                    } else {
                        onClose();
                    }
                })}
            >
                <Stack spacing="sm">
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Item Name"
                        {...getInputProps("name")}
                        autoFocus={true}
                    />
                    <TextInput withAsterisk label="Price" placeholder="$10.00" {...getInputProps("price")} />
                    <Textarea label="Description" {...getInputProps("description")} />
                    <ImageUpload
                        width={400}
                        height={400}
                        imageUrl={values?.imagePath}
                        imageHash={menuItem?.image?.blurHash}
                        onImageCrop={(imageBase64, imagePath) => setValues({ imageBase64, imagePath })}
                        onImageDeleteClick={() => setValues({ imageBase64: "", imagePath: "" })}
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
