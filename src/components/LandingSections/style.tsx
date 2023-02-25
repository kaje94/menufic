import { createStyles, keyframes } from "@mantine/core";

import { Black } from "src/styles/theme";

export const useStyles = createStyles((theme) => {
    const pulseAnimation = keyframes`
        0% { box-shadow: 0 0 0 0 ${theme.fn.rgba(theme.colors.primary[4], 0.5)}; }
        70% { box-shadow: 0 0 0 25px ${theme.fn.rgba(Black, 0.01)}; }
        100% { box-shadow: 0 0 0 0 ${theme.fn.rgba(Black, 0.01)}; }
    `;
    return {
        card: {
            [`&:hover`]: { transform: "scale(1.03)" },
            background: theme.white,
            border: `1px solid ${theme.colors.dark[5]}`,
            transition: "transform 500ms ease",
        },
        cardIcon: {
            color: theme.colors.primary[4],
            height: 50,
            width: 50,
        },
        cardTitle: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginTop: theme.spacing.sm,
                width: 45,
            },
        },
        contactUsContainer: {
            width: 700,
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { width: "100%" },
        },
        containerStack: {
            alignItems: "center",
            gap: 10,
            height: "100%",
            padding: theme.spacing.xl,
        },
        description: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: theme.spacing.sm,
                width: 45,
            },
            color: theme.black,
            margin: "auto",
            marginTop: theme.spacing.md,
            maxWidth: 600,
            opacity: 0.6,
            textAlign: "center",
        },
        getStartedButton: { animation: `${pulseAnimation} 2s ease-in-out infinite` },
        githubContent: {
            flexDirection: "column",
            height: "100%",
            padding: theme.spacing.md,
            textAlign: "center",
        },
        githubLink: {
            alignItems: "center",
            color: theme.colors.dark[6],
            display: "flex",
            fontSize: 20,
            fontWeight: "bold",
            gap: 16,
            marginBottom: theme.spacing.lg,
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { marginTop: theme.spacing.lg * 2 },
        },
        headerBg: {
            alignItems: "center !important",
            display: "flex !important",
            justifyContent: "center !important",
        },
        parallaxBg: {
            alignItems: "center",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex !important",
            justifyContent: "center",
            minHeight: "65vh",
            position: "relative",
        },
        parallaxText: {
            position: "relative",
            textAlign: "center",
            zIndex: 2,
        },
        sectionTitle: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: theme.spacing.sm,
                width: 45,
            },
            color: theme.black,
            margin: "auto",
            marginBottom: theme.spacing.md,
            marginTop: theme.spacing.md,
            textAlign: "center",
        },
        stepIcon: { background: theme.white, borderColor: theme.colors.primary[4], color: theme.black },
        stepSeparator: { background: theme.black },
        stepperContents: { position: "relative", zIndex: 2 },
        stepperDesc: { color: theme.black, opacity: 0.7 },
        stepperLabel: { color: theme.black, opacity: 0.9 },
        stepperWrap: {
            borderRadius: theme.radius.lg,
            marginBottom: theme.spacing.xl * 2,
            marginLeft: theme.spacing.md,
            marginRight: theme.spacing.md,
            marginTop: theme.spacing.xl * 2,
            overflow: "hidden",
            padding: theme.spacing.lg,
            position: "relative",
        },
        title: {
            fontSize: 34,
            fontWeight: 900,
            [theme.fn.smallerThan("sm")]: { fontSize: 24 },
        },
        titleText: {
            fontSize: 90,
            textAlign: "center",
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 65 },
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 45 },
        },
    };
});
