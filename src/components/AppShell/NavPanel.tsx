import { createStyles, Navbar, useMantineTheme, useMantineColorScheme, Switch, Text, Flex } from "@mantine/core";
import { IconMoonStars, IconSun, IconEyeglass2, IconPizza } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";

const linkOptions = [
    { link: "/restaurant", label: "Restaurants", icon: IconPizza },
    { link: "/explore", label: "Explore", icon: IconEyeglass2 },
];

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef("icon");
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colors.dark[3]}`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.dark[3]}`,
        },

        link: {
            // todo check focusStyles
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color: theme.colors.dark[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,
            transition: "all 500ms ease",
            cursor: "pointer",

            "&:hover": {
                backgroundColor: theme.colors.dark[2],
                color: theme.black,
                [`& .${icon}`]: { color: theme.black },
            },
        },

        linkIcon: {
            ref: icon,
            color: theme.colors.dark[6],
            marginRight: theme.spacing.sm,
            transition: "all 500ms ease",
        },

        linkActive: {
            "&, &:hover": {
                backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
                color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    // todo: check variant functions
                    color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
                },
            },
        },
    };
});

interface Props {
    opened: boolean;
}

/** Side panel to be shown within the appShell */
export const NavPanel: FC<Props> = ({ opened }) => {
    const { classes, cx } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const router = useRouter();

    const links = linkOptions.map((item) => (
        <Link
            className={cx(classes.link, { [classes.linkActive]: router.pathname.startsWith(item.link) })}
            key={item.link}
            href={item.link}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));
    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} bg={theme.colors.dark[0]}>
            <Navbar.Section grow>{links}</Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <Flex align="center" justify="space-between">
                    <Text color={theme.colors.dark[6]} size="sm">
                        Theme
                    </Text>
                    <Switch
                        checked={colorScheme === "dark"}
                        onChange={() => toggleColorScheme()}
                        size="lg"
                        onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
                        offLabel={<IconMoonStars color={theme.colors.dark[7]} size={20} stroke={1.5} />}
                    />
                </Flex>
            </Navbar.Section>
        </Navbar>
    );
};
