import type { CSSObject, MantineTheme } from "@mantine/styles";

export const getStyles = (theme: MantineTheme): CSSObject => ({
    "*, *::before, *::after": { boxSizing: "border-box" },
    ".mantine-1n2375h:disabled": { backgroundColor: "unset", color: "unset" },
    ".mantine-Breadcrumbs-separator": { color: theme.colors.dark[6] },
    ".mantine-Button-root,.mantine-ActionIcon-root": { transition: "all 500ms ease" },
    ".mantine-Modal-title": { color: theme.colors.dark[9] },
    ".mantine-Notification-root": { backgroundColor: theme.white },
    ".mantine-Notification-title,.mantine-Notification-description,.mantine-Textarea-label,.mantine-TextInput-label": {
        color: theme.black,
    },
    ".mantine-TextInput-input,.mantine-Textarea-input": {
        backgroundColor: theme.white,
        color: theme.black,
    },
    a: {
        ":hover": { color: theme.colors.primary[5] },
        color: "inherit",
        textDecoration: "none",
        transition: "color 500ms ease",
    },
    body: {
        ...theme.fn.fontStyles(),
        backgroundColor: theme.white,
        color: theme.colors.dark[9],
        lineHeight: theme.lineHeight,
        margin: 0,
        padding: 0,
    },
    "body::-webkit-scrollbar": { backgroundColor: theme.colors.dark[4], width: "5px" },
    "body::-webkit-scrollbar-thumb": {
        backgroundColor: theme.colors.primary[6],
        outline: `1px solid ${theme.colors.primary[6]}`,
    },
});
