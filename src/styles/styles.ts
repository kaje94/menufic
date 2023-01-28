import type { CSSObject, MantineTheme } from "@mantine/styles";

export const getStyles = (theme: MantineTheme): CSSObject => ({
    "*, *::before, *::after": { boxSizing: "border-box" },
    body: {
        ...theme.fn.fontStyles(),
        backgroundColor: theme.white,
        color: theme.colors.dark[9],
        margin: 0,
        padding: 0,
        lineHeight: theme.lineHeight,
    },
    "body::-webkit-scrollbar": { width: "5px", backgroundColor: theme.colors.dark[4] },
    "body::-webkit-scrollbar-thumb": {
        backgroundColor: theme.colors.primary[6],
        outline: `1px solid ${theme.colors.primary[6]}`,
    },
    a: {
        color: "inherit",
        textDecoration: "none",
        transition: "color 500ms ease",
        ":hover": { color: theme.colors.primary[5] },
    },
    ".mantine-Breadcrumbs-separator": { color: theme.colors.dark[6] },
    ".mantine-Modal-title": { color: theme.colors.dark[9] },
    ".mantine-TextInput-input,.mantine-Textarea-input": {
        backgroundColor: theme.white,
        color: theme.black,
    },
    ".mantine-Notification-root": { backgroundColor: theme.white },
    ".mantine-Notification-title,.mantine-Notification-description,.mantine-Textarea-label,.mantine-TextInput-label": {
        color: theme.black,
    },
    ".mantine-1n2375h:disabled": { backgroundColor: "unset", color: "unset" },
    ".mantine-Button-root,.mantine-ActionIcon-root": { transition: "all 500ms ease" },
});
