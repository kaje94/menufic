import type { FC } from "react";
import { useEffect } from "react";

import type { ModalProps } from "@mantine/core";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Category } from "@prisma/client";

import { api } from "src/utils/api";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";
import { categoryInput } from "src/utils/validators";

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
        onError: (err) => showErrorToast("Failed to create new category", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) => [...(categories || []), data]);
            if (onAddSuccess) {
                onAddSuccess(data);
            }
            showSuccessToast("Successfully created", `Created a new category ${data.name} successfully`);
        },
    });

    const { mutate: updateCategory, isLoading: isUpdating } = api.category.update.useMutation({
        onError: (err) => showErrorToast("Failed to update category", err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast("Successfully updated", `Updated details of ${data.name} category successfully`);
        },
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
            loading={loading}
            onClose={onClose}
            opened={opened}
            title={categoryItem ? "Update Category" : "Create Category"}
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
                        disabled={loading}
                        label="Name"
                        placeholder="Category Name"
                        withAsterisk
                        {...getInputProps("name")}
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
