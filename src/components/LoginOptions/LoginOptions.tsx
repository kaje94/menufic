import type { FC, MouseEventHandler, PropsWithChildren } from "react";

import { Button, Popover, Stack } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import { signIn } from "next-auth/react";

import type { ButtonProps as MantineButtonProps, PopoverBaseProps } from "@mantine/core";

import { White } from "src/styles/theme";

import { GoogleIcon } from "./GoogleIcon";

interface ButtonProps extends MantineButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const GoogleButton = (props: ButtonProps) => {
    return <Button {...props} color="gray" leftIcon={<GoogleIcon />} radius="sm" size="lg" variant="default" />;
};

const GithubButton = (props: ButtonProps) => {
    return (
        <Button
            {...props}
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

/** Popover component to allow users to login using multiple providers */
export const LoginOptions: FC<PopoverBaseProps & PropsWithChildren> = ({ children, ...rest }) => {
    return (
        <Popover shadow="xl" withArrow {...rest}>
            <Popover.Target>{children}</Popover.Target>
            <Popover.Dropdown>
                <Stack px="xl" py="md" sx={{ gap: 20 }}>
                    <GoogleButton onClick={() => signIn("google", { callbackUrl: "/restaurant" })}>
                        Sign in with Google
                    </GoogleButton>
                    <GithubButton onClick={() => signIn("github", { callbackUrl: "/restaurant" })}>
                        Sign in with GitHub
                    </GithubButton>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};
