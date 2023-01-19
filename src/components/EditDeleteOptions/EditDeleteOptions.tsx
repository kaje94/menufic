import { ActionIcon, useMantineTheme, Loader, Menu } from "@mantine/core";
import { IconTrash, IconDotsVertical, IconEdit } from "@tabler/icons";
import type { FC } from "react";

export interface EditDeleteOptionsProps {
    /** Whether or not to show the loader instead of the three dot menu */
    loading?: boolean;
    /** Event handler when edit option is clicked in the menu */
    onEditClick?: () => void;
    /** Event handler when delete option is clicked in the menu */
    onDeleteClick?: () => void;
    /** Color of the menu icon */
    color?: string;
    /** Color of the menu icon when its hovered */
    hoverColor?: string;
}

/** Three dot menu to be shown in cards/items to allow users to trigger edit or delete form */
export const EditDeleteOptions: FC<EditDeleteOptionsProps> = ({
    loading,
    onEditClick,
    onDeleteClick,
    color,
    hoverColor,
}) => {
    const theme = useMantineTheme();
    return (
        <>
            {loading ? (
                <Loader size="sm" variant="oval" />
            ) : (
                <Menu shadow="md" width={150} styles={{ dropdown: { background: theme.white } }}>
                    <Menu.Target>
                        <ActionIcon
                            component="span"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                            sx={{
                                cursor: "pointer",
                                color: color || theme.colors.dark[5],
                                transition: "color 500ms ease",
                                "&:hover": { color: hoverColor || theme.colors.primary[5], background: "unset" },
                            }}
                        >
                            <IconDotsVertical size={18} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {onEditClick && (
                            <Menu.Item
                                color={theme.black}
                                icon={<IconEdit size={14} />}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    onEditClick();
                                }}
                            >
                                Edit
                            </Menu.Item>
                        )}
                        {onDeleteClick && (
                            <Menu.Item
                                icon={<IconTrash size={14} />}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    onDeleteClick();
                                }}
                                color="red"
                            >
                                Delete
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>
            )}
        </>
    );
};
