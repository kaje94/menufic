import { Box, clsx, Card, Text } from "@mantine/core";
import type { TablerIcon } from "@tabler/icons";
import Link from "next/link";
import type { MouseEventHandler, FC } from "react";
import { useStyles } from "./styles";

interface Props {
    /** Title of the card */
    title: string;
    /** Subtitle of the card */
    subTitle?: string;
    /** Tabler icon that is displayed in the card */
    Icon: TablerIcon;
    /** Size of the icon displayed in the card */
    iconSize?: number;
    /** Path that needs to be opened, when clicked */
    href?: string;
    /** Onclick event handler if href props is not provided */
    onClick?: MouseEventHandler<HTMLDivElement>;
}

/** Card item with an icon in the middle  */
export const IconCard: FC<Props> = ({ title, subTitle, Icon, href, iconSize = 60, onClick }) => {
    const { classes, theme } = useStyles();

    const cardContent = (
        <Box className={clsx(classes.content, classes.centerContent, classes.hoverAnimation)}>
            <Icon size={iconSize} color={theme.colors.dark[8]} stroke={1.5} />

            <Text size="lg" className={classes.title} weight={500}>
                {title}
            </Text>

            <Text size="sm" px="xl" className={classes.subTitle}>
                {subTitle}
            </Text>
        </Box>
    );

    if (href) {
        return (
            <Card p="lg" className={classes.card} withBorder>
                <Link href={href}>{cardContent}</Link>
            </Card>
        );
    }

    return (
        <Card p="lg" className={clsx(classes.card, !onClick && classes.cardDisabled)} withBorder onClick={onClick}>
            {cardContent}
        </Card>
    );
};
