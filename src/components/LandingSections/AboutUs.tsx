import type { FC } from "react";

import { Center, Container, Grid, Image, Text, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Link from "next/link";

import { useStyles } from "./style";

export const AboutUs: FC = () => {
    const { classes, theme } = useStyles();

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
                        <Title className={classes.sectionTitle}>About Us</Title>
                        <Text mb="sm" size="xl">
                            Menufic is an{" "}
                            <Link href="https://github.com/kaje94/menufic" target="_blank">
                                open source
                            </Link>{" "}
                            project built with{" "}
                            <Text color="red" component="span">
                                &hearts;
                            </Text>
                            .
                        </Text>
                        <Text color={theme.black} mb="sm" opacity={0.6}>
                            Our goal is to provide a simple and effective solution that restaurants could use to improve
                            their reach and enhance how their customers interact with them.
                        </Text>
                        <Text color={theme.black} mb="sm" opacity={0.6}>
                            We highly appreciate any feedback or contribution that could help us improve.
                        </Text>
                        <Link className={classes.githubLink} href="https://github.com/kaje94/menufic" target="_blank">
                            <IconBrandGithub size={30} />
                            <Text>Github</Text>
                        </Link>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
