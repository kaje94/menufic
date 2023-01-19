import type { ModalProps } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Modal as MantineModal } from "@mantine/core";
import type { FC } from "react";

interface Props extends ModalProps {
    loading?: boolean;
}

export const Modal: FC<Props> = ({ loading = false, ...rest }) => {
    const theme = useMantineTheme();
    return (
        <MantineModal
            overlayOpacity={0.1}
            overlayBlur={5}
            styles={{ modal: { background: theme.white } }}
            withCloseButton={!loading}
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
            {...rest}
        />
    );
};
