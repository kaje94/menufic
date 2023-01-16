import { Text, Center, useMantineTheme } from "@mantine/core";
import { IconGlass } from "@tabler/icons";
import type { FC } from "react";

interface Props {
    /** Text to be display in the empty component */
    text: string;
    /** Height of the empty component */
    height?: string | number;
}

/** Component to be displayed if there isn't any date to be displayed */
export const Empty: FC<Props> = ({ text, height }) => {
    const theme = useMantineTheme();
    return (
        <Center p="lg" h={height} sx={{ flexDirection: "column", color: theme.colors.dark[5] }}>
            <IconGlass size={100} />
            <Text mt="lg" align="center">
                {text}
            </Text>
        </Center>
    );
};
