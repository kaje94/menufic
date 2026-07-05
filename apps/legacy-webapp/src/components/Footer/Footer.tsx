import type { FC } from "react";

import { Container, createStyles, Footer, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useTranslations } from "next-intl";

const useStyles = createStyles((theme) => ({
    copyRights: { color: theme.colors.dark[9], fontSize: theme.fontSizes.sm },
    footer: { background: theme.colors.dark[0], height: "100%" },
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
    links: { color: theme.colors.dark[9], [theme.fn.smallerThan("xs")]: { marginTop: theme.spacing.md } },
}));

/** Footer to be shown throughout the app */
export const CustomFooter: FC = () => {
    const { classes, theme } = useStyles();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const t = useTranslations("common");

    const footerLinks = [
        { label: t("privacyPolicy"), link: "/privacy-policy" },
        { label: t("terms&Conditions"), link: "/terms-and-conditions" },
    ];

    const items = footerLinks.map((link) => (
        <Link key={link.label} className={classes.linkItem} href={link.link}>
            {link.label}
        </Link>
    ));

    return (
        <Footer className={classes.footer} height={isMobile ? 90 : 50}>
            <Container className={classes.inner} size="xl">
                <Link className={classes.copyRights} href="/">
                    {t("footerCopyright")}
                </Link>
                <Group className={classes.links}>{items}</Group>
            </Container>
        </Footer>
    );
};
