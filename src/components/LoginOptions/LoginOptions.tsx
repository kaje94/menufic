import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import { useMemo, useState } from "react";

import { Button, LoadingOverlay, Popover, Stack, useMantineTheme } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import type { ButtonProps as MantineButtonProps, PopoverBaseProps } from "@mantine/core";
import type { BuiltInProviderType } from "next-auth/providers";
import type { LiteralUnion } from "next-auth/react";

import { White } from "src/styles/theme";

import { GoogleIcon } from "./GoogleIcon";

interface ButtonProps extends MantineButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface LoginOptionsProps {
    loading?: boolean;
    setLoading?: (loading: boolean) => void;
}

const GoogleButton = (props: ButtonProps) => {
    return (
        <Button
            {...props}
            bg={White}
            data-testid="google-login-button"
            leftIcon={<GoogleIcon />}
            radius="sm"
            size="lg"
            sx={(theme) => ({ "&:hover": { backgroundColor: theme.colors.gray[2], boxShadow: theme.shadows.md } })}
            variant="default"
        />
    );
};

const GithubButton = (props: ButtonProps) => {
    return (
        <Button
            {...props}
            data-testid="github-login-button"
            leftIcon={<IconBrandGithub size={16} />}
            size="lg"
            sx={(theme) => ({
                "&:hover": { backgroundColor: theme.colors.gray[7], boxShadow: theme.shadows.md },
                backgroundColor: theme.colors.gray[8],
                borderRadius: theme.radius.sm,
                color: White,
            })}
        />
    );
};

export const LoginOptionsContent: FC<LoginOptionsProps> = ({ loading = false, setLoading }) => {
    const router = useRouter();
    const callbackUrl = useMemo(() => {
        if (typeof router.query?.callbackUrl === "string" && !router.query?.callbackUrl?.includes("auth/signin")) {
            // if callbackUrl exists and its not the signin url, use it
            return router.query?.callbackUrl;
        }
        return "/restaurant";
    }, [router.query]);

    const clickLoginOption = (provider: LiteralUnion<BuiltInProviderType, string>) => {
        signIn(provider, { callbackUrl });
        if (setLoading) {
            setLoading(true);
        }
    };

    return (
        <Stack px="xl" py="md" sx={{ gap: 20 }}>
            <LoadingOverlay overlayBlur={2} visible={loading} />
            <GoogleButton onClick={() => clickLoginOption("google")}>Sign in with Google</GoogleButton>
            <GithubButton onClick={() => clickLoginOption("github")}>Sign in with GitHub</GithubButton>
        </Stack>
    );
};

/** Popover component to allow users to login using multiple providers */
export const LoginOptions: FC<PopoverBaseProps & PropsWithChildren> = ({ children, ...rest }) => {
    const [loading, setLoading] = useState(false);
    const theme = useMantineTheme();
    return (
        <Popover
            onOpen={() => setLoading(false)}
            shadow="xl"
            styles={{ dropdown: { background: theme.white } }}
            withArrow
            {...rest}
        >
            <Popover.Target>{children}</Popover.Target>
            <Popover.Dropdown>
                <LoginOptionsContent loading={loading} setLoading={setLoading} />
            </Popover.Dropdown>
        </Popover>
    );
};
