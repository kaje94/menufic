import {
    Text,
    Burger,
    MediaQuery,
    Header,
    useMantineTheme,
    Avatar,
    Flex,
    ActionIcon,
    Menu,
    Button,
    Group,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Dispatch, FC, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
    /** Whether or not the hamburger menu is open when on mobile device */
    opened?: boolean;
    /** Update the state of the hamburger menu opened state */
    setOpened?: Dispatch<SetStateAction<boolean>>;
    /**
     * Whether or not to show the login button in the header.
     * Since this button on only relaxant on screens that are publicly accessible
     */
    showLoginButton?: boolean;
}

/** Header to be used throughout the app */
export const NavHeader: FC<Props> = ({ opened = false, setOpened, showLoginButton }) => {
    const theme = useMantineTheme();
    const { data: sessionData, status } = useSession();

    return (
        <Header height={{ base: 50, md: 70 }} p="md" bg={theme.colors.dark[0]}>
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                {setOpened && (
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="sm"
                            color={theme.colors.dark[6]}
                            mr="xl"
                        />
                    </MediaQuery>
                )}

                <Flex w="100%" justify="space-between" align="center">
                    <Flex align="center">
                        <Image src="/logo.svg" height={25} width={25} alt="logo" />
                        <Text
                            variant="gradient"
                            gradient={{ from: theme.colors.primary[7], to: theme.colors.primary[5] }}
                            ta="center"
                            fz="xl"
                            fw={700}
                            ml="sm"
                        >
                            Menufic
                        </Text>
                    </Flex>
                    {status !== "loading" && (
                        <Group align="center" spacing="lg">
                            {showLoginButton && (
                                <>
                                    {status === "authenticated" ? (
                                        <Link href="/restaurant">
                                            <Button size="md">Go to Dashboard</Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
                                            size="md"
                                        >
                                            Login
                                        </Button>
                                    )}
                                </>
                            )}
                            {status === "authenticated" && (
                                <Menu shadow="xl">
                                    <Menu.Target>
                                        <ActionIcon>
                                            <Avatar src={sessionData?.user?.image} color={theme.colors.primary[8]}>
                                                {sessionData?.user?.name?.[0]}
                                            </Avatar>
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Text px="md" py="sm" color="dimmed">
                                            {sessionData?.user?.name}
                                        </Text>

                                        <Menu.Item
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            icon={<IconLogout stroke={1.5} />}
                                        >
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </Group>
                    )}
                </Flex>
            </div>
        </Header>
    );
};
