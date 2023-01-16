import { createStyles, Group, Text, Container, Footer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import type { FC } from "react";
import { useCommonStyles } from "../../styles/common";

const useStyles = createStyles((theme) => ({
    footer: {
        borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        background: theme.white,
        height: "100%",
    },
    inner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        opacity: 0.6,
        fontSize: theme.fontSizes.sm,
        [theme.fn.smallerThan("xs")]: { flexDirection: "column" },
    },
    links: {
        [theme.fn.smallerThan("xs")]: { marginTop: theme.spacing.md },
    },
    copyRights: { fontSize: theme.fontSizes.sm, color: theme.colors.dark[7] },
}));

const footerLinks = [
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Terms & Conditions", link: "/terms-and-conditions" },
];

/** Footer to be shown throughout the app */
export const CustomFooter: FC = () => {
    const { classes } = useStyles();
    const { classes: commonClasses } = useCommonStyles();
    const isMobile = useMediaQuery("(min-width: 600px)");

    const items = footerLinks.map((link) => (
        <Link key={link.label} href={link.link} className={commonClasses.link}>
            {link.label}
        </Link>
    ));

    return (
        <Footer height={isMobile ? 50 : 85} className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Text size="sm" className={classes.copyRights}>
                    © 2023 Copyright: Menufic
                </Text>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </Footer>
    );
};
