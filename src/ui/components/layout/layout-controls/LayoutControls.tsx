import { Button } from "@radix-ui/themes";
import { Layout } from "@/graph/types";

interface LayoutControlsProps {
    layout: Layout<any>;
    graph: any; // replace with appropriate type if available
}

export default function LayoutControls({ layout, graph }: LayoutControlsProps) {
    return (
        <Button onClick={() => layout.run(graph)}>
            Run
        </Button>
    );
}
