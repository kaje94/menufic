import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import { useMemo } from "react";

import { Button, Popover, Stack } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import type { ButtonProps as MantineButtonProps, PopoverBaseProps } from "@mantine/core";

import { White } from "src/styles/theme";

import { GoogleIcon } from "./GoogleIcon";

interface ButtonProps extends MantineButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const GoogleButton = (props: ButtonProps) => {
    return (
        <Button
            {...props}
            color="gray"
            data-testid="google-login-button"
            leftIcon={<GoogleIcon />}
            radius="sm"
            size="lg"
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
                "&:hover": { backgroundColor: theme.colors.gray[8] },
                backgroundColor: theme.colors.gray[8],
                borderRadius: theme.radius.sm,
                color: White,
            })}
        />
    );
};

export const LoginOptionsContent: FC = () => {
    const router = useRouter();
    const callbackUrl = useMemo(() => {
        if (typeof router.query?.callbackUrl === "string" && !router.query?.callbackUrl?.includes("auth/signin")) {
            // if callbackUrl exists and its not the signin url, use it
            return router.query?.callbackUrl;
        }
        return "/restaurant";
    }, [router.query]);
    // todo: add a loading local state. Use mutation not good
    return (
        <Stack px="xl" py="md" sx={{ gap: 20 }}>
            <GoogleButton onClick={() => signIn("google", { callbackUrl })}>Sign in with Google</GoogleButton>
            <GithubButton onClick={() => signIn("github", { callbackUrl })}>Sign in with GitHub</GithubButton>
        </Stack>
    );
};

/** Popover component to allow users to login using multiple providers */
export const LoginOptions: FC<PopoverBaseProps & PropsWithChildren> = ({ children, ...rest }) => {
    return (
        <Popover shadow="xl" withArrow {...rest}>
            <Popover.Target>{children}</Popover.Target>
            <Popover.Dropdown>
                <LoginOptionsContent />
            </Popover.Dropdown>
        </Popover>
    );
};
