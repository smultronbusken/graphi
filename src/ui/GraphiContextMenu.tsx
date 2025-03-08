// GraphiContextMenu.tsx
import { GraphiContext } from "@/main";
import { ContextMenu } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";

interface GraphiContextMenuProps {
    children: React.ReactNode;
}

export default function GraphiContextMenu({ children }: GraphiContextMenuProps) {
    const graphi = useContext(GraphiContext)

    const [selected, setSelected] = useState<string[]>([]);
    const [secondary, setScondary] = useState<string | null>(null);

    if (!graphi) return "loading";

    useEffect(() => {
        const handleSelectedChange = (selected: string[]) => {
            setSelected(selected)
        }
        const handleSecondaryChange = (secondary: string | null) => {
            setScondary(secondary)
            console.log(secondary)
        }
        graphi.events.on("onSelectedChange", handleSelectedChange);
        graphi.events.on("onSecondarySelectedChange", handleSecondaryChange);
        return () => {
            graphi.events.off("onSelectedChange", handleSelectedChange);
        };
    }, [graphi]);


    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
            <ContextMenu.Content variant="solid" size="1" className="data-[state=closed]:none">
                <ContextMenu.Item shortcut="⌘ E">Edit {secondary}</ContextMenu.Item>
                <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

                <ContextMenu.Sub>
                    <ContextMenu.SubTrigger>Path</ContextMenu.SubTrigger>
                    <ContextMenu.SubContent>
                        <ContextMenu.Item>Find between selected </ContextMenu.Item>
                    </ContextMenu.SubContent>
                </ContextMenu.Sub>

                <ContextMenu.Separator />
                <ContextMenu.Item>Share</ContextMenu.Item>
                <ContextMenu.Item>Add to favorites</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item shortcut="⌘ ⌫" color="red">
                    Delete
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Root>
    );
}
