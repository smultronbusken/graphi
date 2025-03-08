import { Button } from "@radix-ui/themes";
import { Layout } from "@/graph/types";
import { Graphi } from "@/Graphi";

interface LayoutControlsProps {
    layout: Layout<any>;
    graphi: Graphi; 
}

export default function LayoutControls({ layout, graphi }: LayoutControlsProps) {
    return (
        <Button onClick={() => layout.run(graphi)}>
            Run
        </Button>
    );
}
