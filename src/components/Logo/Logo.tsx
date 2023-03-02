import type { FC } from "react";

import { createStyles, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const useStyles = createStyles(() => {
    return {
        titleLink: {
            "&:hover": { filter: "brightness(90%)" },
            alignItems: "center",
            display: "flex",
            marginBottom: 20,
            marginTop: 20,
            transition: "all 500ms ease",
        },
    };
});

/** Logo link component to be used to display Menufic branding */
export const Logo: FC = () => {
    const { classes, theme } = useStyles();
    const t = useTranslations("common");

    return (
        <Link className={classes.titleLink} href="/">
            <Image alt="logo" height={36} src="/logo.svg" width={36} />
            <Text fw="bold" fz="xl" gradient={theme.defaultGradient} ml="sm" ta="center" variant="gradient">
                {t("title")}
            </Text>
        </Link>
    );
};
