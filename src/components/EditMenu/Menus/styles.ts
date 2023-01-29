import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    addItem: { color: theme.colors.primary[7] },
    dragHandle: { ...theme.fn.focusStyles(), color: theme.colors.dark[6], height: "100%", padding: theme.spacing.sm },
    initialAdd: {
        "&:hover": { backgroundColor: theme.colors.primary[5] },
        backgroundColor: theme.colors.primary[4],
        color: theme.white,
    },
    item: {
        "&:hover": { boxShadow: theme.shadows.xs },
        alignItems: "center",
        backgroundColor: theme.white,
        border: `1px solid ${theme.colors.dark[3]}`,
        borderRadius: theme.radius.lg,
        cursor: "pointer",
        display: "flex",
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.sm,
        position: "relative",
        transition: "all 500ms ease",
    },
    itemDragging: { boxShadow: theme.shadows.sm },
    itemSelected: {
        "&:hover": { boxShadow: theme.shadows.xs },
        backgroundColor: theme.colors.primary[0],
        border: `1px solid ${theme.colors.primary[4]}`,
        color: theme.colors.primary[9],
    },
    itemSubTitle: { fontSize: theme.fontSizes.xs, opacity: 0.7 },
    itemTitle: { fontWeight: 600 },
}));
