import type { ColorScheme, MantineThemeOverride, Tuple } from "@mantine/core";
import { Expletus_Sans } from "@next/font/google";

const font = Expletus_Sans({
    variable: "--expletus-sans-font",
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
    // todo: check purpose of subsets
    subsets: [],
});

export const Black = "#000000";
export const White = "#ffffff";

// todo: Change purple theme
const theme: Record<ColorScheme, { dark: Tuple<string, 10>; primary: Tuple<string, 10> }> = {
    light: {
        dark: [
            "#faf8fa",
            "#f4f1f5",
            "#e2dee2",
            "#c5c2c7",
            "#a5a1a7",
            "#948d96",
            "#79747c",
            "#3e383f",
            "#2f2830",
            "#1c171d",
        ],
        primary: [
            "#F8F0FC",
            "#ebd3f1",
            "#ddafe9",
            "#d28be2",
            "#c56ddb",
            "#af50c7",
            "#a841c2",
            "#9735af",
            "#8b30a1",
            "#702783",
        ],
    },

    dark: {
        dark: [
            "#0b080c",
            "#181218",
            "#1f1920",
            "#3c303d",
            "#3d323f",
            "#514453",
            "#6f6572",
            "#a799aa",
            "#ded7e0",
            "#faf8fa",
        ],
        primary: [
            "#a653bb",
            "#bb63d1",
            "#c36fd8",
            "#d787eb",
            "#de98f0",
            "#ebbef5",
            "#eec5f7",
            "#f2e0f7",
            "#f4ecf7",
            "#f7f2fa",
        ],
    },
};

export const getMantineTheme = (colorScheme: ColorScheme): MantineThemeOverride => ({
    defaultGradient: { from: "#702783", to: "#af50c7", deg: 45 },
    colorScheme,
    primaryColor: "primary",
    defaultRadius: "lg",
    colors: theme[colorScheme],
    white: colorScheme === "light" ? White : Black,
    black: colorScheme === "light" ? Black : White,
    loader: "dots",
    fontFamily: `${font.style.fontFamily} !important`,
    globalStyles: (theme) => ({
        "*, *::before, *::after": { boxSizing: "border-box" },
        body: {
            ...theme.fn.fontStyles(),
            backgroundColor: theme.white,
            color: theme.colors.dark[9],
            margin: 0,
            padding: 0,
            lineHeight: theme.lineHeight,
        },
        a: { color: "inherit", textDecoration: "none" },
    }),
});
