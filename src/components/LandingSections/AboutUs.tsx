import type { FC } from "react";

import { Center, Container, Grid, Image, Text, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useStyles } from "./style";

export const AboutUs: FC = () => {
    const { classes, theme } = useStyles();
    const t = useTranslations("landing.aboutUs");

    return (
        <Container size="lg">
            <Grid gutter={0}>
                <Grid.Col md={5} order={2} orderMd={1} sm={12}>
                    <Center>
                        <Image alt="menufic-open-source" height={350} src="/landing-about-us.svg" width={350} />
                    </Center>
                </Grid.Col>
                <Grid.Col md={7} order={1} orderMd={2} sm={12}>
                    <Center className={classes.githubContent}>
                        <Title className={classes.sectionTitle}>{t("title")}</Title>
                        <Text mb="sm" size="xl">
                            {t("subtitle.line1")}
                            <Link href="https://github.com/kaje94/menufic" target="_blank">
                                {t("subtitle.line2")}
                            </Link>
                            {t("subtitle.line3")}
                            <Text color="red" component="span">
                                &hearts;
                            </Text>
                            .
                        </Text>
                        <Text color={theme.black} mb="sm" opacity={0.6}>
                            {t("goal")}
                        </Text>
                        <Text color={theme.black} mb="sm" opacity={0.6}>
                            {t("appreciation")}
                        </Text>
                        <Link className={classes.githubLink} href="https://github.com/kaje94/menufic" target="_blank">
                            <IconBrandGithub size={30} />
                            <Text>{t("githubButtonLabel")}</Text>
                        </Link>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
