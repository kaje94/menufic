import { createStyles, Group, Text, Container, Footer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import type { FC } from "react";

const useStyles = createStyles((theme) => ({
    footer: {
        background: theme.colors.dark[0],
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
        color: theme.colors.dark[8],
        [theme.fn.smallerThan("xs")]: { marginTop: theme.spacing.md },
    },
    linkItem: { marginLeft: 10, marginRight: 10 },
    copyRights: { fontSize: theme.fontSizes.sm, color: theme.colors.dark[8] },
}));

const footerLinks = [
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Terms & Conditions", link: "/terms-and-conditions" },
];

/** Footer to be shown throughout the app */
export const CustomFooter: FC = () => {
    const { classes } = useStyles();
    const isNotMobile = useMediaQuery("(min-width: 600px)");

    const items = footerLinks.map((link) => (
        <Link key={link.label} href={link.link} className={classes.linkItem}>
            {link.label}
        </Link>
    ));

    return (
        <Footer height={isNotMobile ? 50 : 90} className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Link href="/" className={classes.copyRights}>
                    © 2023 Copyright: Menufic
                </Link>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </Footer>
    );
};
