import type { ModalProps } from "@mantine/core";
import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "src/utils/api";
import type { Category } from "@prisma/client";
import type { FC } from "react";
import { useEffect } from "react";
import { categoryInput } from "src/utils/validators";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Category item that needs to be edited */
    categoryItem?: Category;
    /** Id of the menu that the category belongs to */
    menuId: string;
    /** Callback to be fired after category has been successfully added. can be used to automatically expand the newly added category */
    onAddSuccess?: (newItem: Category) => void;
}

/** Form to be used when allowing users to add or edit categories of restaurant menus */
export const CategoryForm: FC<Props> = ({ opened, onClose, menuId, categoryItem, onAddSuccess, ...rest }) => {
    const trpcCtx = api.useContext();

    const { mutate: createCategory, isLoading: isCreating } = api.category.create.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) => [...(categories || []), data]);
            if (onAddSuccess) {
                onAddSuccess(data);
            }
            showSuccessToast("Successfully created", `Created a new category ${data.name} successfully`);
        },
        onError: (err) => showErrorToast("Failed to create new category", err),
    });

    const { mutate: updateCategory, isLoading: isUpdating } = api.category.update.useMutation({
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} category successfully`);
        },
        onError: (err) => showErrorToast("Failed to update category", err),
    });

    const { getInputProps, onSubmit, isDirty, resetDirty, setValues } = useForm({
        initialValues: { name: categoryItem?.name || "" },
        validate: zodResolver(categoryInput),
    });

    useEffect(() => {
        if (opened) {
            const values = { name: categoryItem?.name || "" };
            setValues(values);
            resetDirty(values);
        }
    }, [categoryItem, opened]);

    const loading = isCreating || isUpdating;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={categoryItem ? "Update Category" : "Create Category"}
            loading={loading}
            {...rest}
        >
            <form
                onSubmit={onSubmit((values) => {
                    if (isDirty()) {
                        if (categoryItem) {
                            updateCategory({ ...values, id: categoryItem?.id });
                        } else {
                            createCategory({ ...values, menuId });
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
                        placeholder="Category Name"
                        disabled={loading}
                        {...getInputProps("name")}
                    />
                    <Group position="right" mt="md">
                        <Button type="submit" loading={loading} px="xl">
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
