import { type NextPage } from "next";
import { Title, Text, Button, Container, createStyles, Group } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    root: { paddingTop: 80, paddingBottom: 80 },
    label: {
        textAlign: "center",
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        // todo: check this in dark mode
        color: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        [theme.fn.smallerThan("sm")]: { fontSize: 120 },
    },
    title: { textAlign: "center", fontWeight: 900, fontSize: 38, [theme.fn.smallerThan("sm")]: { fontSize: 32 } },
    description: {
        maxWidth: 500,
        margin: "auto",
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colors.dark[6],
    },
}));

/** Generic error page to handle both server side errors and client side 404 errors */
const ErrorPage: NextPage = ({ statusCode = 0 }: { statusCode?: number }) => {
    const { classes } = useStyles();

    return (
        <Container className={classes.root}>
            <div className={classes.label}>{statusCode}</div>
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

            <Text size="lg" align="center" className={classes.description}>
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
                    <Button variant="subtle" size="md">
                        Take me back to home page
                    </Button>
                </Link>
            </Group>
        </Container>
    );
};

ErrorPage.getInitialProps = ({ res, err, asPath }) => {
    const errorAsPath = isNaN(Number(asPath?.substring(1))) ? 0 : Number(asPath?.substring(1));
    const statusCode = res?.statusCode || err?.statusCode || errorAsPath || 404;
    return { statusCode };
};

export default ErrorPage;
