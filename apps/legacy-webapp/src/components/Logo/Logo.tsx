import type { FC } from "react";

import { createStyles } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

const useStyles = createStyles((theme) => {
    return {
        image: {
            objectFit: "scale-down",
            width: 150,
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { width: 120 },
        },
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
    const { classes } = useStyles();

    return (
        <Link className={classes.titleLink} href="/">
            <Image alt="logo" className={classes.image} height={50} src="/logo.png" width={200} />
        </Link>
    );
};
