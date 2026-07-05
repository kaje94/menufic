import type { FC, MouseEventHandler } from "react";

import { Box, Card, clsx, Text } from "@mantine/core";
import Link from "next/link";

import type { TablerIcon } from "@tabler/icons";

import { useStyles } from "./styles";

interface Props {
    /** Tabler icon that is displayed in the card */
    Icon: TablerIcon;
    /** Path that needs to be opened, when clicked */
    href?: string;
    /** Size of the icon displayed in the card */
    iconSize?: number;
    /** Onclick event handler if href props is not provided */
    onClick?: MouseEventHandler<HTMLDivElement>;
    /** Subtitle of the card */
    subTitle?: string;
    /** Test Id to be used in testing */
    testId?: string;
    /** Title of the card */
    title: string;
}

/** Card item with an icon in the middle  */
export const IconCard: FC<Props> = ({ title, subTitle, Icon, href, testId, iconSize = 50, onClick }) => {
    const { classes, theme } = useStyles();

    const cardContent = (
        <Box
            className={clsx(classes.content, classes.centerContent, (onClick || href) && classes.hoverAnimation)}
            data-testid={testId}
        >
            <Icon color={theme.colors.dark[8]} size={iconSize} stroke={1.5} />

            <Text className={classes.title} size="lg" weight={500}>
                {title}
            </Text>

            <Text className={classes.subTitle} px="xl" size="sm">
                {subTitle}
            </Text>
        </Box>
    );

    if (href) {
        return (
            <Card className={classes.card} p="lg" withBorder>
                <Link href={href}>{cardContent}</Link>
            </Card>
        );
    }

    return (
        <Card className={clsx(classes.card, !onClick && classes.cardDisabled)} onClick={onClick} p="lg" withBorder>
            {cardContent}
        </Card>
    );
};
