import { Box, Button, Container, createStyles, Group, keyframes, Text, Title } from "@mantine/core";
import * as Sentry from "@sentry/nextjs";
import { type NextPage } from "next";
import Link from "next/link";

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

    return (
        <Container className={classes.root}>
            <Box className={classes.label}>{statusCode}</Box>
            <Title className={classes.title}>
                {
                    {
                        401: "No authorization found",
                        404: "You have found a secret place.",
                        500: "Internal server error",
                        default: "Aaaah! Something went wrong",
                    }[statusCode]
                }
            </Title>

            <Text align="center" className={classes.description} size="lg">
                {
                    {
                        401: "You do not have permission to access the requested page. Please login and try again",
                        404: "Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.",
                        500: "Oops, something went wrong in the server",
                    }[statusCode]
                }
            </Text>
            <Group position="center">
                <Link href="/">
                    <Button size="md" variant="subtle">
                        Take me back to home page
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
    return { statusCode };
};

export default ErrorPage;
