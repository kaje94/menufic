import { BackgroundImage, Box, Center, createStyles } from "@mantine/core";
import { unstable_getServerSession } from "next-auth/next";

import type { GetServerSidePropsContext, NextPage } from "next";

import { LoginOptionsContent } from "src/components/LoginOptions";
import { Logo } from "src/components/Logo";

import { authOptions } from "../api/auth/[...nextauth]";

const useStyles = createStyles((theme) => {
    return {
        background: { height: "100vh", padding: 50 },
        contentWrap: {
            alignItems: "center",
            background: theme.colors.dark[0],
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.lg,
            display: "flex",
            flexDirection: "column",
            padding: `${theme.spacing.md}px ${theme.spacing.xs}px`,
        },
    };
});

/** Replace standard next-auth login page with custom login page */
const SignIn: NextPage = () => {
    const { classes } = useStyles();
    return (
        <BackgroundImage className={classes.background} src="/landing-hero-bg.svg">
            <Center h="100%">
                <Box className={classes.contentWrap}>
                    <Box my={10}>
                        <Logo />
                    </Box>
                    <LoginOptionsContent />
                </Box>
            </Center>
        </BackgroundImage>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    // If the user is already logged in, redirect.
    if (session) {
        const callbackUrl =
            context.query?.callbackUrl && !context.query?.callbackUrl?.includes("auth/signin")
                ? context.query?.callbackUrl
                : "/restaurant";
        return { redirect: { destination: callbackUrl } };
    }
    return { props: { messages: (await import("src/lang/en.json")).default } };
}

export default SignIn;
