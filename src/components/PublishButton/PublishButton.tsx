import type { FC } from "react";
import { useState } from "react";

import {
    ActionIcon,
    Alert,
    Box,
    Button,
    Center,
    CopyButton,
    Flex,
    Switch,
    Text,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle, IconCheck, IconCopy, IconDownload, IconEye, IconEyeOff, IconTrophy } from "@tabler/icons";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Link from "next/link";
import QRCode from "react-qr-code";

import type { Restaurant } from "@prisma/client";

import { api } from "src/utils/api";

import { showErrorToast } from "../../utils/helpers";
import { Modal } from "../Modal";

interface Props {
    /** Selected restaurant for which the published state needs to be managed */
    restaurant: Restaurant;
}

/** Button to handle the published state of the restaurant menu */
export const PublishButton: FC<Props> = ({ restaurant }: Props) => {
    const trpcCtx = api.useContext();
    const theme = useMantineTheme();
    const { isPublished, id, name } = restaurant;
    const isNotMobile = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);

    const [modelVisible, setModalVisible] = useState(false);
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { mutate: setPublished } = api.restaurant.setPublished.useMutation({
        onError: (err, _newItem, context: { previousRestaurant: Restaurant | undefined } | undefined) => {
            showErrorToast("Failed to update status of the restaurant menu", err);
            trpcCtx.restaurant.get.setData({ id }, context?.previousRestaurant);
        },
        onMutate: async (setPublishedReq) => {
            await trpcCtx.restaurant.get.cancel({ id });
            const previousRestaurant = trpcCtx.restaurant.get.getData({ id });
            if (previousRestaurant) {
                trpcCtx.restaurant.get.setData(
                    { id },
                    { ...previousRestaurant, isPublished: setPublishedReq.isPublished }
                );
            }

            return { previousRestaurant };
        },
    });

    const handleCaptureClick = async () => {
        const qrCodeElement = document.querySelector<HTMLElement>(".qr-code");
        if (!qrCodeElement) return;

        const canvas = await html2canvas(qrCodeElement);
        const dataURL = canvas.toDataURL("image/png");
        downloadjs(dataURL, `${name}-menu-qr-code.png`, "image/png");
    };

    const menuUrl = `${origin}/restaurant/${restaurant.id}/menu`;
    const previewMenuUrl = `${origin}/restaurant/${restaurant.id}/preview`;

    return (
        <>
            <Button
                data-testid="publish-button"
                leftIcon={isPublished ? <IconEye /> : <IconEyeOff />}
                onClick={() => setModalVisible(true)}
                sx={{ justifySelf: isNotMobile ? "flex-end" : "auto" }}
                variant={isPublished ? "filled" : "light"}
            >
                {isPublished ? "Published" : "Not Published"}
            </Button>
            <Modal
                onClose={() => setModalVisible(false)}
                opened={modelVisible}
                size="lg"
                title="Publish and share your menu"
            >
                <Alert
                    color={isPublished ? "green" : "orange"}
                    icon={isPublished ? <IconTrophy /> : <IconAlertCircle />}
                    mb="lg"
                    radius="lg"
                    title={isPublished ? "Menu is published" : "Menu is not published"}
                >
                    {isPublished ? (
                        <>
                            <Text color={theme.black}>
                                Changes to the menu could take around 30 minutes to be reflected in the published menu
                                page
                            </Text>
                            <Text color={theme.black} mt="sm" weight="bold">
                                Published menu URL
                            </Text>
                            <Flex align="center" justify="space-between">
                                <Link data-testid="restaurant-menu-url" href={menuUrl} target="_blank">
                                    <Text color={theme.colors.green[9]}>{menuUrl}</Text>
                                </Link>

                                <CopyButton value={menuUrl}>
                                    {({ copied, copy }) => (
                                        <Tooltip
                                            color={copied ? "green" : theme.black}
                                            label={copied ? "URL copied" : "Copy URL"}
                                            position="left"
                                            withArrow
                                        >
                                            <ActionIcon disabled={copied} onClick={copy}>
                                                {copied ? <IconCheck /> : <IconCopy />}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Flex>
                        </>
                    ) : (
                        <Text color={theme.black}>
                            "Please publish the menu once you have finalized your changes. Once published, you will be
                            able to either share the direct URL or the QR code for your menu, with your customers"
                        </Text>
                    )}
                </Alert>

                <Flex
                    align="center"
                    bg={theme.colors.dark[1]}
                    justify="space-between"
                    p="md"
                    sx={{ borderRadius: theme.radius.lg }}
                >
                    <Text color={theme.black}>Publish Menu</Text>
                    <Switch
                        checked={isPublished}
                        data-testid="publish-menu-switch"
                        onChange={(event) => setPublished({ id, isPublished: event.target.checked })}
                        size="lg"
                    />
                </Flex>

                {isPublished && (
                    <>
                        <Box className="qr-code" mt="sm" p="md">
                            <QRCode style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={menuUrl} />
                        </Box>

                        <Center>
                            <Button leftIcon={<IconDownload />} onClick={handleCaptureClick} variant="light">
                                Download QR code
                            </Button>
                        </Center>
                    </>
                )}

                <Box
                    bg={theme.colors.dark[1]}
                    mt="lg"
                    opacity={restaurant.isPublished ? 0.75 : 1}
                    p="md"
                    sx={{ borderRadius: theme.radius.lg }}
                >
                    <Text color={theme.black}>Preview URL</Text>
                    <Text color={theme.colors.dark[7]} size="sm">
                        The following URL can be used for testing purposes as it will mimic the interface of actual menu
                        while also updating in real time
                    </Text>

                    <Flex align="center" justify="space-between" mt="sm">
                        <Link data-testid="restaurant-preview-url" href={previewMenuUrl} target="_blank">
                            <Text color={theme.colors.dark[9]} size="sm">
                                {previewMenuUrl}
                            </Text>
                        </Link>

                        <CopyButton value={previewMenuUrl}>
                            {({ copied, copy }) => (
                                <Tooltip
                                    color={copied ? "green" : theme.black}
                                    label={copied ? "URL copied" : "Copy URL"}
                                    position="left"
                                    withArrow
                                >
                                    <ActionIcon disabled={copied} onClick={copy}>
                                        {copied ? <IconCheck /> : <IconCopy />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Flex>
                </Box>
            </Modal>
        </>
    );
};
