import * as React from "react";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import "./Search.css"
import {
    Box,
    Flex,
    IconButton,
    Kbd,
    ScrollArea,
    Theme,
    Tooltip,
} from "@radix-ui/themes";
import { Dialog as DialogPrimitive } from "radix-ui";
import SearchNode from "../search-node/SearchNode";

export const Search = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const clearButtonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
            const isSlashKey = event.key === "/";
            if ((isSlashKey)) {
                triggerRef.current?.click();
                event.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <DialogPrimitive.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogPrimitive.Trigger asChild>
                <button
                    ref={triggerRef}
                    aria-label="Search. Press Slash key to search quickly."
                    className={"PrimitivesSearchDesktopButton"}
                    onKeyDown={(event) => {
                        if (
                            !event.metaKey &&
                            !event.ctrlKey &&
                            /^[a-z]$/i.test(event.key)
                        ) {
                            setDialogOpen(true);
                        }
                    }}
                >
                    <MagnifyingGlassIcon />
                    Search
                    <Tooltip
                        className="radix-themes-custom-fonts"
                        content="Press Slash key to search"
                    >
                        <Flex ml="auto" my="-2" aria-hidden>
                            <Kbd size="2">/</Kbd>
                        </Flex>
                    </Tooltip>
                </button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <Theme className="radix-themes-custom-fonts">
                    <DialogPrimitive.Overlay
                        className={"PrimitivesSearchDesktopDialogOverlay"}
                    >
                        <DialogPrimitive.Content
                            onEscapeKeyDown={() => {
                                if (inputRef.current?.value === "") {
                                    setDialogOpen(false);
                                } else {
                                    clearButtonRef.current?.click();
                                }
                            }}
                            className={"PrimitivesSearchDesktopDialogContent"}
                        >
                            <SearchNode onSelect={_ => setDialogOpen(false)} />
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Overlay>
                </Theme>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
