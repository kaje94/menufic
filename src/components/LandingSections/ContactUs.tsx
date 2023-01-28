import {
    Container,
    Title,
    BackgroundImage,
    Box,
    Button,
    Group,
    Overlay,
    SimpleGrid,
    Textarea,
    TextInput,
} from "@mantine/core";
import type { FC, MutableRefObject } from "react";
import { useStyles } from "./style";
import { z } from "zod";
import { env } from "src/env/client.mjs";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "src/utils/helpers";

export const ContactUs: FC<{ contactUsRef: MutableRefObject<HTMLDivElement> }> = ({ contactUsRef }) => {
    const { classes, theme, cx } = useStyles();

    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        validate: zodResolver(
            z.object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email(),
                subject: z.string().min(1, "Subject is required"),
                message: z.string().min(1, "Message is required"),
            })
        ),
    });

    const { mutate: submitContactUs, isLoading: submittingContactUs } = useMutation(
        async (data: string) => {
            const formResponse = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: data,
            });
            return formResponse.json();
        },
        {
            onSuccess: () => {
                showSuccessToast("Successfully submitted your message", "Our team will get in touch with you soon.");
                form.reset();
            },
            onError: () => showErrorToast("Failed to submit your message", { message: "Please try again in a while" }),
        }
    );

    return (
        <BackgroundImage src="landing-restaurant-bg.avif" className={classes.parallaxBg}>
            <Container className={cx(classes.stepperWrap, classes.contactUsContainer)} size="xl" ref={contactUsRef}>
                <Overlay opacity={0.7} color={theme.white} blur={5} zIndex={0} />
                <Box className={classes.stepperContents}>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            submitContactUs(
                                JSON.stringify({
                                    email: values.email,
                                    name: values.name,
                                    message: values.message,
                                    subject: `Menufic | ${values.subject}`,
                                    access_key: env.NEXT_PUBLIC_FORM_API_KEY,
                                })
                            );
                        })}
                    >
                        <Title className={classes.sectionTitle}>Get in touch</Title>

                        <SimpleGrid cols={2} mt="xl" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                            <TextInput
                                label="Name"
                                placeholder="Your name"
                                name="name"
                                {...form.getInputProps("name")}
                            />
                            <TextInput
                                label="Email"
                                placeholder="Your email"
                                name="email"
                                {...form.getInputProps("email")}
                            />
                        </SimpleGrid>

                        <TextInput
                            label="Subject"
                            placeholder="Subject"
                            mt="md"
                            name="subject"
                            {...form.getInputProps("subject")}
                        />
                        <Textarea
                            mt="md"
                            label="Message"
                            placeholder="Your message"
                            maxRows={10}
                            minRows={5}
                            autosize
                            name="message"
                            {...form.getInputProps("message")}
                        />

                        <Group position="center" mt="xl">
                            <Button type="submit" size="md" loading={submittingContactUs}>
                                Send message
                            </Button>
                        </Group>
                    </form>
                </Box>
            </Container>
        </BackgroundImage>
    );
};
