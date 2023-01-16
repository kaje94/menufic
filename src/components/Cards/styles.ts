import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => {
    const image = getRef("image");

    return {
        card: {
            position: "relative",
            height: 250,
            cursor: "pointer",
            transition: "background 500ms ease",
            backgroundColor: theme.colors.dark[1],
            borderColor: theme.colors.dark[3],
            [`&:hover .${image}`]: { transform: "scale(1.03)" },
        },
        cardDisabled: { cursor: "not-allowed" },
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
            top: "20%",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            // todo: extract this linear gradient
            backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
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
        subTitle: { color: theme.colors.dark[6], textAlign: "center" },
    };
});
