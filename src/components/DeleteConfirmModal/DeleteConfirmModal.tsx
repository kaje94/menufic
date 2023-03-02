import type { FC } from "react";

import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { ModalProps } from "@mantine/core";

import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Description to be shown  */
    description: string;
    /** Show a loader while performing the delete mutation */
    loading?: boolean;
    /** Call back to be fired when user confirms the delete action */
    onDelete: () => void;
}

/** Modal to be shown in order to get confirmation from user before deleting any data */
export const DeleteConfirmModal: FC<Props> = ({ title, description, loading, onDelete, ...rest }) => {
    const theme = useMantineTheme();
    const t = useTranslations("common");

    return (
        <Modal loading={loading} size="sm" title={title} {...rest}>
            <Text color={theme.black} component="p">
                {description}
            </Text>
            <Group mt="md" position="right">
                <Button color="red" data-testid="confirm-delete-modal-btn" loading={loading} onClick={onDelete} px="xl">
                    {t("confirmDelete")}
                </Button>
            </Group>
        </Modal>
    );
};
