/* eslint-disable react/no-array-index-key */
import { Container, List, Text, Title, useMantineTheme } from "@mantine/core";
import { type NextPage } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";

import { Footer } from "src/components/Footer";
import { NavHeader } from "src/components/Header";
import { env } from "src/env/client.mjs";

/**
 * Privacy policy generated using freeprivacypolicy.com
 * @link https://app.freeprivacypolicy.com/download/3412a4cc-040b-4bba-abc3-e119fc5dc0ea
 */
const PrivacyPolicyPage: NextPage = () => {
    const theme = useMantineTheme();
    const t = useTranslations("privacyPolicy");
    const tCommon = useTranslations("common");

    return (
        <>
            <NextSeo description={t("seoDescription")} title={tCommon("privacyPolicy")} />
            <NavHeader showLoginButton />
            <Container py="lg" size="xl">
                <Title order={1}>{tCommon("privacyPolicy")}</Title>
                <Text color={theme.colors.dark[5]} mb="lg">
                    {t("lastUpdated", { date: "January 11, 2023" })}
                </Text>
                <Text>{t("desc1")}</Text>
                <Text>{t("desc2")}</Text>
                <Title order={2}>{t("interpretationAndDefinitions.title")}</Title>
                <Title order={3}>{t("interpretationAndDefinitions.interpretation.title")}</Title>
                <Text>{t("interpretationAndDefinitions.interpretation.content")}</Text>
                <Title order={3}>{t("interpretationAndDefinitions.definitions.title")}</Title>
                <Text>{t("interpretationAndDefinitions.definitions.subTitle")}</Text>
                <List>
                    {t
                        .raw("interpretationAndDefinitions.definitions.items")
                        .map((definition: { key: string; rest: string }) => (
                            <List.Item key={definition.key}>
                                <Text>
                                    <strong>{definition.key}</strong> {definition.rest}
                                    {definition.key === "Website" && (
                                        <Link href={env.NEXT_PUBLIC_PROD_URL} target="_blank">
                                            {env.NEXT_PUBLIC_PROD_URL}
                                        </Link>
                                    )}
                                </Text>
                            </List.Item>
                        ))}
                </List>
                <Title order={2}>{t("collectingPersonalData.title")}</Title>
                <Title order={3}>{t("collectingPersonalData.dataTypes.title")}</Title>
                <Title order={4}>{t("collectingPersonalData.dataTypes.personalData.title")}</Title>
                <Text>{t("collectingPersonalData.dataTypes.personalData.desc")}</Text>
                <List>
                    {t.raw("collectingPersonalData.dataTypes.personalData.types").map((item: string) => (
                        <List.Item key={item}>
                            <Text>{item}</Text>
                        </List.Item>
                    ))}
                </List>
                <Title order={4}>{t("collectingPersonalData.dataTypes.usageData.title")}</Title>
                <Text>{t("collectingPersonalData.dataTypes.usageData.desc")}</Text>
                {t.raw("collectingPersonalData.dataTypes.usageData.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={4}>{t("collectingPersonalData.dataTypes.trackingCookies.title")}</Title>
                <Text>{t("collectingPersonalData.dataTypes.trackingCookies.desc")}</Text>
                <List>
                    {t
                        .raw("collectingPersonalData.dataTypes.trackingCookies.cookieTypes")
                        .map((item: { key: string; rest: string }) => (
                            <List.Item key={item.key}>
                                <strong>{item.key}</strong> ${item.rest}
                            </List.Item>
                        ))}
                </List>
                <Text>{t("collectingPersonalData.dataTypes.trackingCookies.cookieDesc")}</Text>
                <Text>{t("collectingPersonalData.dataTypes.trackingCookies.purposeHeader")}</Text>
                <List>
                    {t
                        .raw("collectingPersonalData.dataTypes.trackingCookies.purposeList")
                        .map((item: { administeredBy: string; key: string; purpose: string; type: string }) => (
                            <List.Item key={item.key}>
                                <Text>
                                    <strong>{item.key}</strong>
                                </Text>
                                <Text>{item.type}</Text>
                                <Text>{item.administeredBy}</Text>
                                <Text>{item.purpose}</Text>
                            </List.Item>
                        ))}
                </List>
                <Text>{t("collectingPersonalData.dataTypes.trackingCookies.moreInfo")}</Text>
                <Title order={3}>{t("collectingPersonalData.useOfPersonalData.title")}</Title>
                <Text>{t("collectingPersonalData.useOfPersonalData.purposeDesc")}</Text>
                <List>
                    {t
                        .raw("collectingPersonalData.useOfPersonalData.purposeList")
                        .map((item: { key: string; rest: string }) => (
                            <List.Item key={item.key}>
                                <Text>
                                    <strong>{item.key}</strong> {item.rest}
                                </Text>
                            </List.Item>
                        ))}
                </List>
                <Text>{t("collectingPersonalData.useOfPersonalData.situationDesc")}</Text>
                <List>
                    {t
                        .raw("collectingPersonalData.useOfPersonalData.situationList")
                        .map((item: { key: string; rest: string }) => (
                            <List.Item key={item.key}>
                                <Text>
                                    <strong>{item.key}</strong> {item.rest}
                                </Text>
                            </List.Item>
                        ))}
                </List>
                <Title order={3}>{t("collectingPersonalData.retentionOfData.title")}</Title>
                {t.raw("collectingPersonalData.retentionOfData.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={3}>{t("collectingPersonalData.transferOfData.title")}</Title>
                {t.raw("collectingPersonalData.transferOfData.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={3}>{t("collectingPersonalData.deleteData.title")}</Title>
                {t.raw("collectingPersonalData.deleteData.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={3}>{t("collectingPersonalData.dataDisclosure.title")}</Title>
                <Title order={4}>{t("collectingPersonalData.dataDisclosure.businessTransactions.title")}</Title>
                <Text>{t("collectingPersonalData.dataDisclosure.businessTransactions.content")}</Text>
                <Title order={4}>{t("collectingPersonalData.dataDisclosure.lawEnforcement.title")}</Title>
                <Text>{t("collectingPersonalData.dataDisclosure.lawEnforcement.content")}</Text>
                <Title order={4}>{t("collectingPersonalData.dataDisclosure.otherLegalRequirements.title")}</Title>
                <Text>{t("collectingPersonalData.dataDisclosure.otherLegalRequirements.desc")}</Text>
                <List>
                    {t
                        .raw("collectingPersonalData.dataDisclosure.otherLegalRequirements.items")
                        .map((item: string, index: number) => (
                            <List.Item key={`${index}`}>{item}</List.Item>
                        ))}
                </List>
                <Title order={3}>{t("collectingPersonalData.dataSecurity.title")}</Title>
                <Text>{t("collectingPersonalData.dataSecurity.content")}</Text>
                <Title order={2}>{t("childrenPrivacy.title")}</Title>
                {t.raw("childrenPrivacy.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("websiteLinks.title")}</Title>
                {t.raw("websiteLinks.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("changesToPolicy.title")}</Title>
                {t.raw("changesToPolicy.items").map((item: string, index: number) => (
                    <Text key={`${index}`}>{item}</Text>
                ))}
                <Title order={2}>{t("contactUs.title")}</Title>
                <Text>{t("contactUs.desc")}</Text>
                <List>
                    <List.Item>
                        <Text>{t("contactUs.byEmail", { email: env.NEXT_PUBLIC_CONTACT_EMAIL })}</Text>
                    </List.Item>
                    <List.Item>
                        <Text>
                            {t("contactUs.viaWebsite")}
                            <Link href={env.NEXT_PUBLIC_PROD_URL} target="_blank">
                                {env.NEXT_PUBLIC_PROD_URL}
                            </Link>
                        </Text>
                    </List.Item>
                </List>
            </Container>
            <Footer />
        </>
    );
};

export const getStaticProps = async () => ({ props: { messages: (await import("src/lang/en.json")).default } });

export default PrivacyPolicyPage;
