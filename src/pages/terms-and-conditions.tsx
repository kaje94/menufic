/* eslint-disable react/no-array-index-key */
import { Container, List, Text, Title, useMantineTheme } from "@mantine/core";
import { type NextPage } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";

import { Footer } from "src/components/Footer";
import { NavHeader } from "src/components/Header";
import { env } from "src/env/client.mjs";

/** Term & Conditions generated using https://policymaker.io/ */
const TermsAndConditionsPage: NextPage = () => {
    const theme = useMantineTheme();
    const t = useTranslations("termsAndConditions");
    const tCommon = useTranslations("common");

    return (
        <>
            <NextSeo description={t("seoDescription")} title={tCommon("terms&Conditions")} />
            <NavHeader showLoginButton />
            <Container py="lg" size="xl">
                <Title order={1}>{tCommon("terms&Conditions")}</Title>
                <Text color={theme.colors.dark[5]} mb="lg">
                    {t("lastUpdated", { date: "January 11, 2023" })}
                </Text>
                <Title order={2}>{t("introduction.title")}</Title>
                <Text>{t("introduction.line1", { url: "https://menufic.com" })}</Text>
                <Text>{t("introduction.line2")}</Text>
                <Text>{t("introduction.line3")}</Text>
                <Text>{t("introduction.line4", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                <Title order={2}>{t("communication.title")}</Title>
                <Text>{t("communication.content", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                <Title order={2}>{t("promotions.title")}</Title>
                <Text>{t("promotions.content")}</Text>
                <Title order={2}>{t("content.title")}</Title>
                {t.raw("content.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("prohibitedUses.title")}</Title>
                <Text>{t("prohibitedUses.desc")}</Text>
                <List styles={{ item: { color: theme.black } }}>
                    {t.raw("prohibitedUses.items").map((item: string, index: number) => (
                        <List.Item key={`${index}`}>{item}</List.Item>
                    ))}
                </List>
                <Text>{t("prohibitedUses.additionalDesc")}</Text>
                <List styles={{ item: { color: theme.black } }}>
                    {t.raw("prohibitedUses.additionalItems").map((item: string, index: number) => (
                        <List.Item key={`${index}`}>{item}</List.Item>
                    ))}
                </List>
                <Title order={2}>{t("analytics.title")}</Title>
                <Text>{t("analytics.content")}</Text>
                <Title order={2}>{t("usageByMinors.title")}</Title>
                <Text>{t("usageByMinors.content")}</Text>
                <Title order={2}>{t("accounts.title")}</Title>
                {t.raw("accounts.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("intellectualProperty.title")}</Title>
                <Text>{t("intellectualProperty.content")}</Text>
                <Title order={2}>{t("copyrightPolicy.title")}</Title>
                <Text>{t("copyrightPolicy.line1")}</Text>
                <Text>{t("copyrightPolicy.line2", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                <Text>{t("copyrightPolicy.line3")}</Text>
                <Title order={2}>{t("copyrightInfringement.title")}</Title>
                <Text>{t("copyrightInfringement.desc")}</Text>
                <List styles={{ item: { color: theme.black } }}>
                    {t.raw("copyrightInfringement.items").map((item: string, index: number) => (
                        <List.Item key={`${index}`}>{item}</List.Item>
                    ))}
                </List>
                <Text>{t("copyrightInfringement.contactEmail", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                <Title order={2}>{t("errorReporting.title")}</Title>
                <Text>{t("errorReporting.content", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                <Title order={2}>{t("otherSiteLinks.title")}</Title>
                {t.raw("otherSiteLinks.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("disclaimerOfWarranty.title")}</Title>
                {t.raw("disclaimerOfWarranty.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("limitationOfLiability.title")}</Title>
                <Text>{t("limitationOfLiability.content")}</Text>
                <Title order={2}>{t("termination.title")}</Title>
                {t.raw("termination.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("governingLaw.title")}</Title>
                {t.raw("governingLaw.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("changesToService.title")}</Title>
                <Text>{t("changesToService.content")}</Text>
                <Title order={2}>{t("amendmentsToTerms.title")}</Title>
                {t.raw("amendmentsToTerms.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("waiverAndSeverability.title")}</Title>
                {t.raw("waiverAndSeverability.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("acknowledgement.title")}</Title>
                <Text>{t("acknowledgement.content")}</Text>
                <Title order={2}>{t("contactUs.title")}</Title>
                <Text>{t("contactUs.content", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
            </Container>
            <Footer />
        </>
    );
};

export const getStaticProps = async () => ({ props: { messages: (await import("src/lang/en.json")).default } });

export default TermsAndConditionsPage;
