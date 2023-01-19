import { Text, Center, useMantineTheme, keyframes, Box } from "@mantine/core";
import { IconAtom2 } from "@tabler/icons";
import type { FC } from "react";

interface Props {
    /** Text to be display in the empty component */
    text: string;
    /** Height of the empty component */
    height?: string | number;
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
        <Center p="lg" h={height} sx={{ flexDirection: "column", color: theme.colors.dark[5] }}>
            <Box sx={{ animation: `${floatingAnimation} 6s ease-in-out infinite` }}>
                <IconAtom2 size={100} strokeWidth={1.5} color={theme.colors.dark[3]} />
            </Box>
            <Text size="lg" mt="lg" weight="bolder" align="center" maw={400}>
                whoops, nothing to see here ...
            </Text>
            <Text align="center" mt="xs" maw={500} weight="lighter">
                {text}
            </Text>
        </Center>
    );
};
