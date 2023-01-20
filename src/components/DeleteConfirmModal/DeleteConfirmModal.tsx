import type { ModalProps } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Button, Group, Text } from "@mantine/core";
import type { FC } from "react";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Description to be shown  */
    description: string;
    /** Call back to be fired when user confirms the delete action */
    onDelete: () => void;
    /** Show a loader while performing the delete mutation */
    loading?: boolean;
}

/** Modal to be shown in order to get confirmation from user before deleting any data */
export const DeleteConfirmModal: FC<Props> = ({ title, description, loading, onDelete, ...rest }) => {
    const theme = useMantineTheme();
    return (
        <Modal size="sm" title={title} loading={loading} {...rest}>
            <Text component="p" color={theme.black}>
                {description}
            </Text>
            <Group position="right" mt="md">
                <Button color="red" onClick={onDelete} px="xl" loading={loading}>
                    Confirm Delete
                </Button>
            </Group>
        </Modal>
    );
};
