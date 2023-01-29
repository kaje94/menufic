import { useScrollIntoView } from "@mantine/hooks";
import { type NextPage } from "next";
import Head from "next/head";

import { Footer } from "src/components/Footer";
import { NavHeader } from "src/components/Header";
import { AboutUs, ContactUs, Features, Hero, Pricing, SampleMenu, Steps } from "src/components/LandingSections";

/** Landing page to showcase what menufic is and what are the features that menufic provides */
const LandingPage: NextPage = () => {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });

    return (
        <>
            <Head>
                <title>Menufic - Digital menu generator</title>
                <meta
                    content="A digital menu generator that lets you to create the best menu for your restaurant. Menufic is packed with several features that will boost the online presence of your restaurant with ease"
                    name="description"
                />
            </Head>

            <NavHeader showLoginButton withShadow />
            <Hero />
            <Steps />
            <Features />
            <SampleMenu />
            <Pricing scrollToContactUs={scrollIntoView} />
            <ContactUs contactUsRef={targetRef} />
            <AboutUs />
            <Footer />
        </>
    );
};

export default LandingPage;
