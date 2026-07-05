import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    accordionControl: {
        "&:hover": { background: theme.colors.dark[2] },
        background: theme.colors.dark[0],
        color: theme.black,
        transition: "background 500ms ease",
    },
    accordionItem: { background: `${theme.colors.dark[0]} !important`, overflow: "hidden" },
    dragHandle: {
        ...theme.fn.focusStyles(),
        alignItems: "center",
        color: theme.colors.dark[6],
        display: "flex",
        height: "100%",
        justifyContent: "center",
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },
    itemDragging: { boxShadow: theme.shadows.sm },
}));
