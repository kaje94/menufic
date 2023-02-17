import { Expletus_Sans } from "@next/font/google";

import type { ColorScheme, MantineThemeOverride, Tuple } from "@mantine/core";

import { getStyles } from "./styles";

const font = Expletus_Sans({
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
    subsets: [],
    variable: "--expletus-sans-font",
});

export const Black = "#000000";
export const White = "#ffffff";

const theme: Record<ColorScheme, { dark: Tuple<string, 10>; primary: Tuple<string, 10> }> = {
    dark: {
        dark: [
            "#0c0809",
            "#181213",
            "#20191a",
            "#3d3032",
            "#58494b",
            "#756567",
            "#807274",
            "#a59394",
            "#dbcbce",
            "#faf8f8",
        ],
        primary: [
            "#91404b",
            "#a04752",
            "#944b54",
            "#92515a",
            "#ac6f77",
            "#c77b84",
            "#c78d94",
            "#c9989e",
            "#ddb4b6",
            "#ebd5d8",
        ],
    },

    light: {
        dark: [
            "#faf8f8",
            "#f5f1f2",
            "#e2dede",
            "#c7c2c3",
            "#a7a1a2",
            "#968d8e",
            "#7c7475",
            "#3f3839",
            "#302829",
            "#1d1718",
        ],
        primary: [
            "#fcf0f1",
            "#f1d3d7",
            "#e9afb7",
            "#e28b92",
            "#db6d7c",
            "#c75060",
            "#c24152",
            "#af3545",
            "#a1303f",
            "#832733",
        ],
    },
};

export const getMantineTheme = (colorScheme: ColorScheme): MantineThemeOverride => ({
    black: colorScheme === "light" ? Black : White,
    colorScheme,
    colors: theme[colorScheme],
    defaultGradient: { deg: 180, from: theme.light.primary[5], to: theme.light.primary[7] },
    defaultRadius: "lg",
    fontFamily: `${font.style.fontFamily} !important`,
    globalStyles: getStyles,
    loader: "dots",
    primaryColor: "primary",
    white: colorScheme === "light" ? White : Black,
});
