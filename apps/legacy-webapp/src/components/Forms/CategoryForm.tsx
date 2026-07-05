import type { FC } from "react";
import { useEffect } from "react";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { ModalProps } from "@mantine/core";
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
    const t = useTranslations("dashboard.editMenu.category");
    const tCommon = useTranslations("common");

    const { mutate: createCategory, isLoading: isCreating } = api.category.create.useMutation({
        onError: (err) => showErrorToast(t("createError"), err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) => [...(categories || []), data]);
            if (onAddSuccess) {
                onAddSuccess(data);
            }
            showSuccessToast(tCommon("createSuccess"), t("createSuccessDesc", { name: data.name }));
        },
    });

    const { mutate: updateCategory, isLoading: isUpdating } = api.category.update.useMutation({
        onError: (err) => showErrorToast(t("updateError"), err),
        onSuccess: (data) => {
            onClose();
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
            showSuccessToast(tCommon("updateSuccess"), t("updateSuccessDesc", { name: data.name }));
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
            title={categoryItem ? t("updateModalTitle") : t("createModalTitle")}
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
                        label={t("inputNameLabel")}
                        placeholder={t("inputNamePlaceholder")}
                        withAsterisk
                        {...getInputProps("name")}
                    />
                    <Group mt="md" position="right">
                        <Button data-testid="save-category-form" loading={loading} px="xl" type="submit">
                            {tCommon("save")}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
