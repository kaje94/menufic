import { createStyles } from "@mantine/core";

// TODO: decide whether or not separate styles is needed
export const useCommonStyles = createStyles((theme) => ({
    link: {
        color: theme.colors.dark[7],
        transition: "color 500ms ease",
        ":hover": { color: theme.colors.primary[7] },
    },
}));
