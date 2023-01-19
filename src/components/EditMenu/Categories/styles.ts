import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    itemDragging: { boxShadow: theme.shadows.sm },
    dragHandle: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.colors.dark[6],
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },
    accordionControl: {
        background: theme.colors.dark[0],
        color: theme.black,
        transition: "background 500ms ease",
        "&:hover": { background: theme.colors.dark[2] },
    },
    accordionItem: { background: `${theme.colors.dark[0]} !important`, overflow: "hidden" },
}));
