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
    useMantineColorScheme,
    Popover,
    createStyles,
    Container,
    Transition,
} from "@mantine/core";
import { IconEyeglass2, IconHome, IconLogin, IconLogout, IconMoonStars, IconPizza, IconSun } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Dispatch, FC, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";

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
    withShadow?: boolean;
    showInternalLinks?: boolean;
}

const useStyles = createStyles((theme, params: { withShadow?: boolean }) => ({
    popoverWrap: { width: "100% !important" },
    header: {
        padding: theme.spacing.md,
        background: theme.colors.dark[0],
        boxShadow: params.withShadow ? theme.shadows.xs : undefined,
    },
    headerContainer: { display: "flex", alignItems: "center", height: "100%" },
    themeSwitch: {
        color: theme.colorScheme === "dark" ? theme.colors.yellow[3] : theme.colors.gray[7],
        border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[5]}`,
        "&:hover": { boxShadow: theme.shadows.xs },
    },
    avatarIcon: { border: `1px solid ${theme.colors.dark[3]}`, "&:hover": { boxShadow: theme.shadows.xs } },
    dashboardActionIcon: {
        backgroundColor: theme.colors.primary[5],
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.primary[6], boxShadow: theme.shadows.xs },
    },
    popoverLink: {
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.lg,
    },
    linkActive: { color: theme.colors.primary[6] },
    titleLink: {
        display: "flex",
        alignItems: "center",
        transition: "all 500ms ease",
        "&:hover": { filter: "brightness(90%)" },
    },
    headerLinksWrap: {
        flex: 1,
        alignItems: "center",
        paddingLeft: 50,
        paddingTop: 5,
    },
}));

const linkOptions = [
    { link: "/restaurant", label: "Restaurants", icon: IconPizza },
    { link: "/explore", label: "Explore", icon: IconEyeglass2 },
];

/** Header to be used throughout the app */
export const NavHeader: FC<Props> = ({
    opened = false,
    setOpened,
    showLoginButton,
    withShadow,
    showInternalLinks = false,
}) => {
    const theme = useMantineTheme();
    const { data: sessionData, status } = useSession();
    const isNotMobile = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { classes, cx } = useStyles({ withShadow });
    const router = useRouter();

    return (
        <Header height={60} className={classes.header}>
            <Container size="xl" className={classes.headerContainer}>
                {showInternalLinks && setOpened && (
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                        <Popover
                            width={200}
                            position="bottom"
                            shadow="md"
                            opened={opened}
                            onChange={setOpened}
                            radius="xs"
                            transition="scale-y"
                        >
                            <Popover.Target>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.dark[6]}
                                    mr="xl"
                                />
                            </Popover.Target>
                            <Popover.Dropdown className={classes.popoverWrap}>
                                {linkOptions.map((link) => (
                                    <Link
                                        href={link.link}
                                        key={link.link}
                                        className={cx({
                                            [classes.linkActive]: router.pathname.startsWith(link.link),
                                        })}
                                    >
                                        <Text size="lg" className={classes.popoverLink}>
                                            {link.label}
                                        </Text>
                                    </Link>
                                ))}
                            </Popover.Dropdown>
                        </Popover>
                    </MediaQuery>
                )}

                <Flex w="100%" justify="space-between" align="center">
                    <Link href="/" className={classes.titleLink}>
                        <Image src="/logo.svg" height={36} width={36} alt="logo" />
                        <Text variant="gradient" gradient={theme.defaultGradient} ta="center" fz="xl" fw="bold" ml="sm">
                            Menufic
                        </Text>
                    </Link>
                    {showInternalLinks && (
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <Flex className={classes.headerLinksWrap}>
                                {linkOptions.map((link) => (
                                    <Link
                                        href={link.link}
                                        key={link.link}
                                        className={cx({
                                            [classes.linkActive]: router.pathname.startsWith(link.link),
                                        })}
                                    >
                                        <Text size="md" className={classes.popoverLink}>
                                            {link.label}
                                        </Text>
                                    </Link>
                                ))}
                            </Flex>
                        </MediaQuery>
                    )}

                    <Transition mounted={status !== "loading"} transition="fade">
                        {(styles) => (
                            <Group align="center" spacing="lg" style={styles}>
                                {status !== "loading" && showLoginButton && (
                                    <>
                                        {status === "authenticated" ? (
                                            <Link href="/restaurant">
                                                {isNotMobile ? (
                                                    <Button size="md">Go to Dashboard</Button>
                                                ) : (
                                                    <ActionIcon size={36} className={classes.dashboardActionIcon}>
                                                        <IconHome />
                                                    </ActionIcon>
                                                )}
                                            </Link>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={() => signIn("google", { callbackUrl: "/restaurant" })}
                                                    size={isNotMobile ? "md" : "sm"}
                                                    leftIcon={<IconLogin />}
                                                >
                                                    Login
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}

                                <ActionIcon
                                    onClick={() => toggleColorScheme()}
                                    size={36}
                                    className={classes.themeSwitch}
                                >
                                    {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                                </ActionIcon>

                                {status === "authenticated" && (
                                    <Menu
                                        shadow="xl"
                                        styles={{ dropdown: { background: theme.white } }}
                                        position="top-end"
                                    >
                                        <Menu.Target>
                                            <ActionIcon>
                                                <Avatar
                                                    src={sessionData?.user?.image}
                                                    color="primary"
                                                    className={classes.avatarIcon}
                                                    imageProps={{ referrerpolicy: "no-referrer" }}
                                                >
                                                    {sessionData?.user?.name?.[0]}
                                                </Avatar>
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Text px="md" py="sm" color={theme.colors.dark[7]}>
                                                {sessionData?.user?.name}
                                            </Text>

                                            <Menu.Item
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                                icon={<IconLogout stroke={1.5} />}
                                                color="red"
                                            >
                                                Logout
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                )}
                            </Group>
                        )}
                    </Transition>
                </Flex>
            </Container>
        </Header>
    );
};
