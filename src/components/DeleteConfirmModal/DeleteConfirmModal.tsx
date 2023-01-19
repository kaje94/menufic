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
}

/** Modal to be shown in order to get confirmation from user before deleting any data */
export const DeleteConfirmModal: FC<Props> = ({ title, description, onDelete, ...rest }) => {
    const theme = useMantineTheme();
    return (
        <Modal size="sm" title={title} {...rest}>
            <Text component="p" color={theme.black}>
                {description}
            </Text>
            <Group position="right" mt="md">
                <Button color="red" onClick={onDelete} px="xl">
                    Confirm Delete
                </Button>
            </Group>
        </Modal>
    );
};
