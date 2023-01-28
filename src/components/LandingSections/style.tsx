import { createStyles, keyframes } from "@mantine/core";
import { Black } from "src/styles/theme";

export const useStyles = createStyles((theme) => {
    const pulseAnimation = keyframes`
        0% { box-shadow: 0 0 0 0 ${theme.fn.rgba(theme.colors.primary[4], 0.5)}; }
        70% { box-shadow: 0 0 0 25px ${theme.fn.rgba(Black, 0.01)}; }
        100% { box-shadow: 0 0 0 0 ${theme.fn.rgba(Black, 0.01)}; }
    `;
    return {
        headerBg: {
            display: "flex !important",
            alignItems: "center !important",
            justifyContent: "center !important",
            p: 50,
        },

        titleText: {
            fontSize: 90,
            textAlign: "center",
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 65 },
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 50 },
        },

        getStartedButton: {
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
        },

        parallaxBg: {
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",

            minHeight: "65vh",

            display: "flex !important",
            justifyContent: "center",
            alignItems: "center",
            // flex-direction: column;
        },
        parallaxText: {
            position: "relative",
            zIndex: 2,
            textAlign: "center",
        },

        containerStack: {
            alignItems: "center",
            height: "100%",
            gap: 10,
            padding: theme.spacing.xl,
        },

        stepperWrap: {
            position: "relative",
            padding: theme.spacing.lg,
            borderRadius: theme.radius.lg,
            overflow: "hidden",
            marginTop: theme.spacing.xl * 2,
            marginBottom: theme.spacing.xl * 2,
            marginRight: theme.spacing.md,
            marginLeft: theme.spacing.md,
        },
        stepperContents: { zIndex: 2, position: "relative" },
        stepperLabel: { color: theme.black, opacity: 0.9 },
        stepperDesc: { color: theme.black, opacity: 0.7 },
        stepSeparator: { background: theme.black },
        stepIcon: { background: theme.white, color: theme.black, borderColor: theme.colors.primary[4] },

        githubLink: {
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: theme.spacing.lg,
            color: theme.colors.dark[6],
            fontWeight: "bold",
            fontSize: 20,
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { marginTop: theme.spacing.lg * 2 },
        },
        githubContent: {
            padding: theme.spacing.md,
            flexDirection: "column",
            textAlign: "center",
            height: "100%",
        },

        //features
        title: {
            fontSize: 34,
            fontWeight: 900,
            [theme.fn.smallerThan("sm")]: {
                fontSize: 24,
            },
        },
        description: {
            maxWidth: 600,
            margin: "auto",
            color: theme.black,
            opacity: 0.6,
            textAlign: "center",
            marginTop: theme.spacing.md,

            "&::after": {
                content: '""',
                display: "block",
                backgroundColor: theme.fn.primaryColor(),
                width: 45,
                height: 2,
                marginTop: theme.spacing.sm,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        card: {
            border: `1px solid ${theme.colors.dark[5]}`,
            transition: "transform 500ms ease",
            [`&:hover`]: { transform: "scale(1.03)" },
            background: theme.white,
        },
        cardTitle: {
            "&::after": {
                content: '""',
                display: "block",
                backgroundColor: theme.fn.primaryColor(),
                width: 45,
                height: 2,
                marginTop: theme.spacing.sm,
            },
        },
        cardIcon: {
            width: 50,
            height: 50,
            color: theme.colors.primary[4],
        },

        sectionTitle: {
            color: theme.black,
            textAlign: "center",
            margin: "auto",
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,

            "&::after": {
                content: '""',
                display: "block",
                backgroundColor: theme.fn.primaryColor(),
                width: 45,
                height: 2,
                marginTop: theme.spacing.sm,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },

        contactUsContainer: {
            width: 700,
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { width: "100%" },
        },
    };
});
