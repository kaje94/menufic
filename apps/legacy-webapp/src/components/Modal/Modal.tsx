import type { FC } from "react";

import { Modal as MantineModal, useMantineTheme } from "@mantine/core";

import type { ModalProps } from "@mantine/core";

interface Props extends ModalProps {
    loading?: boolean;
}

export const Modal: FC<Props> = ({ loading = false, ...rest }) => {
    const theme = useMantineTheme();
    return (
        <MantineModal
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
            overlayBlur={5}
            overlayOpacity={0.1}
            styles={{ modal: { background: theme.white } }}
            withCloseButton={!loading}
            {...rest}
        />
    );
};
