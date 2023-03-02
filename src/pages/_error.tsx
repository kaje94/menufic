import { Box, Button, Container, createStyles, Group, keyframes, Text, Title } from "@mantine/core";
import * as Sentry from "@sentry/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";

const floatingAnimation = keyframes`
	0% { transform: translateY(0px) }
	50% { transform: translateY(-20px) }
	100% { transform: translateY(0px) }
`;

const useStyles = createStyles((theme) => ({
    description: {
        color: theme.colors.dark[6],
        margin: "auto",
        marginBottom: theme.spacing.xl * 1.5,
        marginTop: theme.spacing.xl,
        maxWidth: 500,
    },
    label: {
        animation: `${floatingAnimation} 4s ease-in-out infinite`,
        color: theme.colors.dark[4],
        fontSize: 220,
        fontWeight: 900,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        [theme.fn.smallerThan("sm")]: { fontSize: 120 },
        textAlign: "center",
    },
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
    },
    title: { fontSize: 38, fontWeight: 900, textAlign: "center", [theme.fn.smallerThan("sm")]: { fontSize: 32 } },
}));

/** Generic error page to handle both server side errors and client side 404 errors */
const ErrorPage: NextPage = ({ statusCode = 0 }: { statusCode?: number }) => {
    const { classes } = useStyles();
    const t = useTranslations("errorPage");

    return (
        <Container className={classes.root}>
            <Box className={classes.label}>{statusCode}</Box>
            <Title className={classes.title}>
                {
                    {
                        401: t("401.title"),
                        404: t("404.title"),
                        500: t("500.title"),
                        default: t("defaultMessage"),
                    }[statusCode]
                }
            </Title>

            <Text align="center" className={classes.description} size="lg">
                {
                    {
                        401: t("401.description"),
                        404: t("404.description"),
                        500: t("500.description"),
                    }[statusCode]
                }
            </Text>
            <Group position="center">
                <Link href="/">
                    <Button size="md" variant="subtle">
                        {t("homePageButtonLabel")}
                    </Button>
                </Link>
            </Group>
        </Container>
    );
};

ErrorPage.getInitialProps = async (contextData) => {
    const { res, err, asPath } = contextData;
    await Sentry.captureUnderscoreErrorException(contextData);
    const errorAsPath = Number.isNaN(Number(asPath?.substring(1))) ? 0 : Number(asPath?.substring(1));
    const statusCode = res?.statusCode || err?.statusCode || errorAsPath || 404;
    const messages = (await import("src/lang/en.json")).default;
    return { messages, statusCode };
};

export default ErrorPage;
