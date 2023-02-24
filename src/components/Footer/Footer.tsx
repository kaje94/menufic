import type { FC } from "react";

import { Container, createStyles, Footer, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    copyRights: { color: theme.colors.dark[9], fontSize: theme.fontSizes.sm },
    footer: {
        background: theme.colors.dark[0],
        height: "100%",
    },
    inner: {
        alignItems: "center",
        display: "flex",
        fontSize: theme.fontSizes.sm,
        justifyContent: "space-between",
        opacity: 0.6,
        paddingBottom: theme.spacing.md,
        paddingTop: theme.spacing.md,
        [theme.fn.smallerThan("xs")]: { flexDirection: "column" },
    },
    linkItem: { marginLeft: 10, marginRight: 10 },
    links: {
        color: theme.colors.dark[9],
        [theme.fn.smallerThan("xs")]: { marginTop: theme.spacing.md },
    },
}));

const footerLinks = [
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Terms & Conditions", link: "/terms-and-conditions" },
];

/** Footer to be shown throughout the app */
export const CustomFooter: FC = () => {
    const { classes, theme } = useStyles();
    const isNotMobile = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);

    const items = footerLinks.map((link) => (
        <Link key={link.label} className={classes.linkItem} href={link.link}>
            {link.label}
        </Link>
    ));

    return (
        <Footer className={classes.footer} height={isNotMobile ? 50 : 90}>
            <Container className={classes.inner} size="xl">
                <Link className={classes.copyRights} href="/">
                    © 2023 Copyright: Menufic
                </Link>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </Footer>
    );
};
