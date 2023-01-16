import type { ModalProps } from "@mantine/core";
import { Button, Group, Modal, Text } from "@mantine/core";
import type { FC } from "react";

interface Props extends ModalProps {
    /** Description to be shown  */
    description: string;
    /** Call back to be fired when user confirms the delete action */
    onDelete: () => void;
}

/** Modal to be shown in order to get confirmation from user before deleting any data */
export const DeleteConfirmModal: FC<Props> = ({ title, description, onDelete, ...rest }) => (
    <Modal size="sm" title={<Text size="lg">{title}</Text>} overlayOpacity={0.1} overlayBlur={5} {...rest}>
        <Text component="p">{description}</Text>
        <Group position="right" mt="md">
            <Button color="red" onClick={onDelete} px="xl">
                Confirm Delete
            </Button>
        </Group>
    </Modal>
);
