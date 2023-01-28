import { Container, Grid, Center, Title, Text, Image } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Link from "next/link";
import type { FC } from "react";
import { useStyles } from "./style";

export const AboutUs: FC = () => {
    const { classes, theme } = useStyles();

    return (
        <Container size="lg">
            <Grid gutter={0}>
                <Grid.Col md={6} sm={12} order={2} orderMd={1}>
                    <Image src="/landing-about-us.svg" width="100%" alt="menufic-open-source" />
                </Grid.Col>
                <Grid.Col md={6} sm={12} order={1} orderMd={2}>
                    <Center className={classes.githubContent}>
                        <Title className={classes.sectionTitle}>About Us</Title>
                        <Text size="xl" mb="sm">
                            Menufic is an{" "}
                            <Link href="https://github.com/kaje94/menufic" target="_blank">
                                open source
                            </Link>{" "}
                            project built with{" "}
                            <Text component="span" color="red">
                                &hearts;
                            </Text>
                            .
                        </Text>
                        <Text color={theme.black} opacity={0.6} mb="sm">
                            Our goal is to provide a simple and effective solution that restaurants could use to improve
                            their reach and enhance how their customers interact with them.
                        </Text>
                        <Text color={theme.black} opacity={0.6} mb="sm">
                            We highly appreciate any feedback or contribution that could help us improve.
                        </Text>
                        <Link href="https://github.com/kaje94/menufic" target="_blank" className={classes.githubLink}>
                            <IconBrandGithub size={30} />
                            <Text>Github</Text>
                        </Link>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
