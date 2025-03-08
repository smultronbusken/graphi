import {
  Button,
  DropdownMenu,
  Flex,
  Text
} from "@radix-ui/themes";
import "./Menubar.css";
import { useContext, useEffect, useState } from "react";
import { GraphiContext, PixiContext } from "@/main";
import input from "@/input/input";
import { execArgv } from "process";
import generateGraph from "@/util/generate-graph";


const Menubar = () => {
  const graphi = useContext(GraphiContext);
  const app = useContext(PixiContext);
  const [nodeKey, setNodeKey] = useState("");

  if (!graphi || !app) return <Text>Loading Graphi...</Text>;

  const hideAll = () => {
    graphi.hideAll();
  };

  const hideAllExceptSelected = () => {
    graphi.hideAll();
    for(const selected of graphi.selected)
      graphi.expand(selected)
  };

  const showAll = () => {
    graphi.showAll();
  };

  const goToSelected = () => {
    if (!graphi.selected) return
    const { x, y } = graphi.graph.getNodeAttributes(graphi.selected)
    app.camera.moveTo(x, y)
    app.camera.zoomTo()
  }

  const setGraph = async (name: string) => {
    const graph = await generateGraph(name)
    graphi.setGraph(graph)
  }

  useEffect(() => {

    const handleHKeyDown = (event: KeyboardEvent) => {

      if (event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        hideAll()
      }
      if (event.ctrlKey && event.shiftKey && !event.altKey) {
        event.preventDefault();
        showAll()
      }
      if (!event.ctrlKey && !event.shiftKey && event.altKey) {
        event.preventDefault();
        hideAllExceptSelected()
      }
    }



    input.keyboard.on("KeyH", handleHKeyDown);
    return () => input.keyboard.off("KeyH", handleHKeyDown);
  }, []);


  return (
    <Flex align="center" gap="5">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="3" variant="ghost" color="gray">
            <Text size={"1"}>File</Text>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>New</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Import from file</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>Existing</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item onClick={() => setGraph("animals")}> Animals graph </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => setGraph("flowchart")}> Flowchart graph </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator />
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>Generate</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item onClick={() => setGraph("flowchartRandom")}> Flowchart graph </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => setGraph("random")}> Random graph </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="3" variant="ghost" color="gray">
            <Text size={"1"}>Graph</Text>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={hideAll} shortcut="Ctrl H">Hide all</DropdownMenu.Item>
          <DropdownMenu.Item onClick={showAll} shortcut="Ctrl Shift H">Show all</DropdownMenu.Item>
          <DropdownMenu.Item onClick={hideAllExceptSelected} shortcut="Alt H">Hide all except selected</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={goToSelected} shortcut="Ctrl Space">Go to selected</DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="3" variant="ghost" color="gray">
            <Text size={"1"}>Edit</Text>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default Menubar;
