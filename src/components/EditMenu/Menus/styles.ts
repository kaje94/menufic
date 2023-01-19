import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    item: {
        display: "flex",
        alignItems: "center",
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.dark[3]}`,
        padding: theme.spacing.sm,
        backgroundColor: theme.white,
        marginBottom: theme.spacing.sm,
        cursor: "pointer",
        position: "relative",
        transition: "all 500ms ease",
        "&:hover": { boxShadow: theme.shadows.xs },
    },
    itemTitle: { fontWeight: 600 },
    itemSubTitle: { fontSize: theme.fontSizes.xs, opacity: 0.7 },
    itemDragging: { boxShadow: theme.shadows.sm },
    itemSelected: {
        border: `1px solid ${theme.colors.primary[4]}`,
        color: theme.colors.primary[9],
        backgroundColor: theme.colors.primary[0],
        "&:hover": { boxShadow: theme.shadows.xs },
    },
    dragHandle: { ...theme.fn.focusStyles(), height: "100%", color: theme.colors.dark[6], padding: theme.spacing.sm },
    addItem: { color: theme.colors.primary[7] },
    initialAdd: {
        backgroundColor: theme.colors.primary[4],
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.primary[5] },
    },
}));
