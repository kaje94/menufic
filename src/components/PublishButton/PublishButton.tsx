import {
    Alert,
    Button,
    Box,
    Switch,
    Text,
    Flex,
    useMantineTheme,
    CopyButton,
    ActionIcon,
    Tooltip,
    Center,
} from "@mantine/core";
import type { Restaurant } from "@prisma/client";
import { IconAlertCircle, IconCheck, IconCopy, IconDownload, IconEye, IconEyeOff, IconTrophy } from "@tabler/icons";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import QRCode from "react-qr-code";
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

    const [modelVisible, setModalVisible] = useState(false);
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { mutate: setPublished } = api.restaurant.setPublished.useMutation({
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
        onError: (err, _newItem, context) => {
            showErrorToast("Failed to update status of the restaurant menu", err);
            trpcCtx.restaurant.get.setData({ id }, context?.previousRestaurant);
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
                onClick={() => setModalVisible(true)}
                leftIcon={isPublished ? <IconEye /> : <IconEyeOff />}
                variant={isPublished ? "filled" : "light"}
                w="max-content"
                sx={{ justifySelf: "flex-end" }}
            >
                {isPublished ? "Published" : "Not Published"}
            </Button>
            <Modal
                size="lg"
                opened={modelVisible}
                onClose={() => setModalVisible(false)}
                title="Publish and share your menu"
            >
                <Alert
                    icon={isPublished ? <IconTrophy /> : <IconAlertCircle />}
                    title={isPublished ? "Menu is published" : "Menu is not published"}
                    color={isPublished ? "green" : "orange"}
                    mb="lg"
                    radius="lg"
                >
                    {isPublished ? (
                        <>
                            <Text color={theme.black}>
                                Changes to the menu could take around 30 minutes to be reflected in the published menu
                                page
                            </Text>
                            <Text weight="bold" mt="sm" color={theme.black}>
                                Published menu URL
                            </Text>
                            <Flex justify="space-between" align="center">
                                <Link href={menuUrl} target="_blank">
                                    <Text color={theme.colors.green[9]}>{menuUrl}</Text>
                                </Link>

                                <CopyButton value={menuUrl}>
                                    {({ copied, copy }) => (
                                        <Tooltip
                                            label={copied ? "URL copied" : "Copy URL"}
                                            color={copied ? "green" : theme.black}
                                            position="left"
                                            withArrow
                                        >
                                            <ActionIcon onClick={copy} disabled={copied}>
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
                    justify="space-between"
                    align="center"
                    bg={theme.colors.dark[1]}
                    sx={{ borderRadius: theme.radius.lg }}
                    p="md"
                >
                    <Text color={theme.black}>Publish Menu</Text>
                    <Switch
                        checked={isPublished}
                        onChange={(event) => setPublished({ id, isPublished: event.target.checked })}
                        size="lg"
                    />
                </Flex>

                {isPublished && (
                    <>
                        <Box className="qr-code" p="md" mt="sm">
                            <QRCode value={menuUrl} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                        </Box>

                        <Center>
                            <Button variant="light" onClick={handleCaptureClick} leftIcon={<IconDownload />}>
                                Download QR code
                            </Button>
                        </Center>
                    </>
                )}

                <Box
                    bg={theme.colors.dark[1]}
                    sx={{ borderRadius: theme.radius.lg }}
                    p="md"
                    mt="lg"
                    opacity={restaurant.isPublished ? 0.75 : 1}
                >
                    <Text color={theme.black}>Preview URL</Text>
                    <Text color={theme.colors.dark[7]} size="sm">
                        The following URL can be used for testing purposes as it will mimic the interface of actual menu
                        while also updating in real time
                    </Text>

                    <Flex justify="space-between" align="center" mt="sm">
                        <Link href={previewMenuUrl} target="_blank">
                            <Text color={theme.colors.dark[9]} size="sm">
                                {previewMenuUrl}
                            </Text>
                        </Link>

                        <CopyButton value={previewMenuUrl}>
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={copied ? "URL copied" : "Copy URL"}
                                    color={copied ? "green" : theme.black}
                                    position="left"
                                    withArrow
                                >
                                    <ActionIcon onClick={copy} disabled={copied}>
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
