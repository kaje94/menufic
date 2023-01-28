import { createStyles } from "@mantine/core";
import { Black } from "src/styles/theme";

export const useStyles = createStyles((theme, _params, getRef) => {
    const image = getRef("image");

    return {
        card: {
            position: "relative",
            height: 200,
            cursor: "pointer",
            transition: "background 500ms ease",
            backgroundColor: theme.white,
            borderColor: theme.colors.dark[3],
            [`&:hover .${image}`]: { transform: "scale(1.03)" },
            "&:hover": { backgroundColor: theme.colors.dark[0], boxShadow: theme.shadows.xs },
        },
        cardDisabled: { cursor: "not-allowed", opacity: 0.6 },
        cardNoCursor: { cursor: "unset" },
        imageWrap: {
            transition: "all 500ms ease",
            ref: image,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundImage: theme.fn.linearGradient(
                180,
                theme.fn.rgba(Black, 0),
                theme.fn.rgba(Black, 0.15),
                theme.fn.rgba(Black, 0.4),
                theme.fn.rgba(Black, 0.85)
            ),
        },
        content: {
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            zIndex: 1,
        },
        centerContent: { justifyContent: "center", alignItems: "center" },
        hoverAnimation: {
            transition: "transform 500ms ease",
            [`&:hover`]: { transform: "scale(1.03)" },
        },
        imageTitle: { color: "#fff", marginBottom: 5 },
        title: { color: theme.colors.dark[8], marginTop: 5, marginBottom: 5 },
        imageSubTitle: { color: "#fff", textAlign: "unset", opacity: 0.5 },
        subTitle: { color: theme.colors.dark[8], opacity: 0.7, textAlign: "center" },
    };
});
