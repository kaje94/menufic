import { useMemo } from "react";

import { Alert, BackgroundImage, Box, Button, Center, createStyles, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { z } from "zod";

import type { GetServerSidePropsContext, NextPage } from "next";

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
            padding: theme.spacing.xl,
        },
    };
});

/** Custom login page to allow automated test runners to login using a login key */
const SignInTestUser: NextPage = () => {
    const { classes } = useStyles();
    const router = useRouter();

    const callbackUrl = useMemo(() => {
        if (
            typeof router.query?.callbackUrl === "string" &&
            !router.query?.callbackUrl?.includes("auth/signin-test-user")
        ) {
            // if callbackUrl exists and its not the signin-test-user url, use it
            return router.query?.callbackUrl;
        }
        return "/restaurant";
    }, [router.query]);

    const { getInputProps, onSubmit } = useForm({
        initialValues: { loginKey: "" },
        validate: zodResolver(z.object({ loginKey: z.string().min(1, "Key is required") })),
    });

    const { mutate, isLoading, error } = useMutation(
        (loginKey: string) => signIn("credentials", { callbackUrl, loginKey, redirect: false }),
        {
            onSettled: (data, err) => {
                if (data?.error || err) {
                    throw new Error("Failed to sign in");
                }
                if (data?.ok && data.url) {
                    router.push(data.url);
                }
            },
        }
    );

    return (
        <BackgroundImage className={classes.background} src="/landing-hero-bg.svg">
            <Center h="100%">
                <Box className={classes.contentWrap}>
                    <Text>{(error as Error)?.message}</Text>
                    <Box mb={10}>
                        <Logo />
                    </Box>
                    <form onSubmit={onSubmit(({ loginKey }) => mutate(loginKey))}>
                        <Stack spacing="sm" w={250}>
                            <>
                                {error && (
                                    <Alert color="red" icon={<IconAlertCircle />} mb="lg" radius="lg">
                                        {(error as Error)?.message}
                                    </Alert>
                                )}
                            </>

                            <PasswordInput
                                description="Login key is only used for testing purposes"
                                label="Login Key"
                                placeholder="Paste login key here"
                                withAsterisk
                                {...getInputProps("loginKey")}
                                autoFocus
                            />
                            <Button data-testid="submit-test-login" loading={isLoading} px="xl" type="submit">
                                Login
                            </Button>
                        </Stack>
                    </form>
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
            context.query?.callbackUrl && !context.query?.callbackUrl?.includes("auth/signin-test-user")
                ? context.query?.callbackUrl
                : "/restaurant";
        return { redirect: { destination: callbackUrl } };
    }
    return { props: {} };
}

export default SignInTestUser;
