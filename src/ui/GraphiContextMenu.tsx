// GraphiContextMenu.tsx
import { AllPathsBetweenManyQuery, AllRelevantPathsQuery, ShortestPathBetweenManyQuery, SingleSourceQuery } from "@/graph/QueryManager";
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

    const [shouldReset, setShouldReset] = useState<boolean>(false);

    if (!graphi) return "loading";

    useEffect(() => {
        const handleSelectedChange = (selected: string[]) => {
            setSelected(selected)
        }
        const handleSecondaryChange = (secondary: string | null) => {
            setShouldReset(false)
            setScondary(secondary)
        }
        graphi.events.on("onSelectedChange", handleSelectedChange);
        graphi.events.on("onSecondarySelectedChange", handleSecondaryChange);
        return () => {
            graphi.events.off("onSelectedChange", handleSelectedChange);
        };
    }, [graphi]);


    return (
        <ContextMenu.Root modal={false} onOpenChange={(open) => {
            if (open) {
                setShouldReset(true)
            }
            if (!open) {
                if (shouldReset) {
                    graphi.resetSecondary()
                }
                return
            }
        }}>
            <ContextMenu.Trigger >{children}</ContextMenu.Trigger>
            <ContextMenu.Content variant="solid" size="1" className="data-[state=closed]:none">
                {secondary ? (<>
                    <ContextMenu.Item color="indigo">Info / Edit</ContextMenu.Item>
                    <ContextMenu.Item color="indigo" onClick={() => graphi.hide(secondary)}>Hide</ContextMenu.Item>
                    <ContextMenu.Item color="indigo" onClick={() => graphi.expand(secondary)}>Expand</ContextMenu.Item>
                    <ContextMenu.Item color="indigo" onClick={() => {
                        graphi.queries.runQuery(SingleSourceQuery(secondary))
                    }}>Path as Parent</ContextMenu.Item>
                    <ContextMenu.Item color="indigo" onClick={() => {
                        graphi.queries.runQuery(AllRelevantPathsQuery(secondary))
                    }}>Relevant paths</ContextMenu.Item>

                    <ContextMenu.Separator />
                </>) : <></>}

                <ContextMenu.Sub>
                    <ContextMenu.SubTrigger>Path</ContextMenu.SubTrigger>
                    <ContextMenu.SubContent>
                        <ContextMenu.Item color="amber"onClick={() => {
                        graphi.queries.runQuery(ShortestPathBetweenManyQuery(graphi.selected))
                    }} >Shortest path between </ContextMenu.Item>
                                                <ContextMenu.Item color="amber"onClick={() => {
                        graphi.queries.runQuery(AllPathsBetweenManyQuery(graphi.selected))
                    }} >ALL paths between </ContextMenu.Item>
                        
                    </ContextMenu.SubContent>
                </ContextMenu.Sub>
                {secondary ? (<>
                    <ContextMenu.Separator />
                    <ContextMenu.Item color="red" onClick={() => graphi.graph.dropNode(secondary)}>
                        Delete
                    </ContextMenu.Item>
                </>) : <></>}

            </ContextMenu.Content>
        </ContextMenu.Root>
    );
}
