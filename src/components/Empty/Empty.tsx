import type { FC } from "react";

import { Box, Center, keyframes, Text, useMantineTheme } from "@mantine/core";
import { IconAtom2 } from "@tabler/icons";

interface Props {
    /** Height of the empty component */
    height?: string | number;
    /** Text to be display in the empty component */
    text: string;
}

const floatingAnimation = keyframes`
	0% { transform: translateY(0px) rotate(0deg) }
	50% { transform: translateY(-20px) rotate(15deg) }
	100% { transform: translateY(0px) rotate(0deg) }
`;

/** Component to be displayed if there isn't any date to be displayed */
export const Empty: FC<Props> = ({ text, height }) => {
    const theme = useMantineTheme();
    return (
        <Center
            data-testid="empty-placeholder"
            h={height}
            p="lg"
            sx={{ color: theme.colors.dark[5], flexDirection: "column" }}
        >
            <Box sx={{ animation: `${floatingAnimation} 6s ease-in-out infinite` }}>
                <IconAtom2 color={theme.colors.dark[3]} size={100} strokeWidth={1.5} />
            </Box>
            <Text align="center" maw={400} mt="lg" size="lg" weight="bolder">
                whoops, nothing to see here ...
            </Text>
            <Text align="center" maw={500} mt="xs" weight="lighter">
                {text}
            </Text>
        </Center>
    );
};
