import { createStyles } from "@mantine/core";

import { Black } from "src/styles/theme";

export const useStyles = createStyles((theme, _params, getRef) => {
    const image = getRef("image");

    return {
        card: {
            "&:hover": { backgroundColor: theme.colors.dark[0], boxShadow: theme.shadows.xs },
            backgroundColor: theme.white,
            borderColor: theme.colors.dark[3],
            cursor: "pointer",
            height: 200,
            position: "relative",
            [`&:hover .${image}`]: { transform: "scale(1.03)" },
            transition: "background 500ms ease",
        },
        cardDisabled: { cursor: "not-allowed", opacity: 0.6 },
        cardNoCursor: { cursor: "unset" },
        centerContent: { alignItems: "center", justifyContent: "center" },
        content: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-end",
            position: "relative",
            zIndex: 1,
        },
        hoverAnimation: {
            [`&:hover`]: { transform: "scale(1.03)" },
            transition: "transform 500ms ease",
        },
        imageSubTitle: { color: "#fff", opacity: 0.5, textAlign: "unset" },
        imageTitle: { color: "#fff", marginBottom: 5 },
        imageWrap: {
            bottom: 0,
            left: 0,
            position: "absolute",
            ref: image,
            right: 0,
            top: 0,
            transition: "all 500ms ease",
        },
        overlay: {
            backgroundImage: theme.fn.linearGradient(
                180,
                theme.fn.rgba(Black, 0),
                theme.fn.rgba(Black, 0.15),
                theme.fn.rgba(Black, 0.4),
                theme.fn.rgba(Black, 0.85)
            ),
            bottom: 0,
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 1,
        },
        subTitle: { color: theme.colors.dark[8], opacity: 0.7, textAlign: "center" },
        title: { color: theme.colors.dark[8], marginBottom: 5, marginTop: 5 },
    };
});
