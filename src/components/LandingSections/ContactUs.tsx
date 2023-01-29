import type { FC, MutableRefObject } from "react";

import {
    BackgroundImage,
    Box,
    Button,
    Container,
    Group,
    Overlay,
    SimpleGrid,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { env } from "src/env/client.mjs";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

import { useStyles } from "./style";

export const ContactUs: FC<{ contactUsRef: MutableRefObject<HTMLDivElement> }> = ({ contactUsRef }) => {
    const { classes, theme, cx } = useStyles();

    const form = useForm({
        initialValues: {
            email: "",
            message: "",
            name: "",
            subject: "",
        },
        validate: zodResolver(
            z.object({
                email: z.string().email(),
                message: z.string().min(1, "Message is required"),
                name: z.string().min(1, "Name is required"),
                subject: z.string().min(1, "Subject is required"),
            })
        ),
    });

    const { mutate: submitContactUs, isLoading: submittingContactUs } = useMutation(
        async (data: string) => {
            const formResponse = await fetch("https://api.web3forms.com/submit", {
                body: data,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            return formResponse.json();
        },
        {
            onError: () => showErrorToast("Failed to submit your message", { message: "Please try again in a while" }),
            onSuccess: () => {
                showSuccessToast("Successfully submitted your message", "Our team will get in touch with you soon.");
                form.reset();
            },
        }
    );

    return (
        <BackgroundImage className={classes.parallaxBg} src="landing-restaurant-bg.avif">
            <Container className={cx(classes.stepperWrap, classes.contactUsContainer)} ref={contactUsRef} size="xl">
                <Overlay blur={5} color={theme.white} opacity={0.7} zIndex={0} />
                <Box className={classes.stepperContents}>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            submitContactUs(
                                JSON.stringify({
                                    access_key: env.NEXT_PUBLIC_FORM_API_KEY,
                                    email: values.email,
                                    message: values.message,
                                    name: values.name,
                                    subject: `Menufic | ${values.subject}`,
                                })
                            );
                        })}
                    >
                        <Title className={classes.sectionTitle}>Get in touch</Title>

                        <SimpleGrid breakpoints={[{ cols: 1, maxWidth: "sm" }]} cols={2} mt="xl">
                            <TextInput
                                label="Name"
                                name="name"
                                placeholder="Your name"
                                {...form.getInputProps("name")}
                            />
                            <TextInput
                                label="Email"
                                name="email"
                                placeholder="Your email"
                                {...form.getInputProps("email")}
                            />
                        </SimpleGrid>

                        <TextInput
                            label="Subject"
                            mt="md"
                            name="subject"
                            placeholder="Subject"
                            {...form.getInputProps("subject")}
                        />
                        <Textarea
                            autosize
                            label="Message"
                            maxRows={10}
                            minRows={5}
                            mt="md"
                            name="message"
                            placeholder="Your message"
                            {...form.getInputProps("message")}
                        />

                        <Group mt="xl" position="center">
                            <Button loading={submittingContactUs} size="md" type="submit">
                                Send message
                            </Button>
                        </Group>
                    </form>
                </Box>
            </Container>
        </BackgroundImage>
    );
};
