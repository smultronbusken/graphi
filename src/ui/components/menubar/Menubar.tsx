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
    if (graphi.selected)
      graphi.expand(graphi.selected)
  };

  const showAll = () => {
    graphi.showAll();
  };

  const goToSelected = () => {
    if (!graphi.selected) return
    const { x, y } = graphi.graph.getNodeAttributes(graphi.selected)
    app.camera.moveTo(x, y)
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
          <DropdownMenu.Item shortcut="⌘ I">Import</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="⌘ S">Export</DropdownMenu.Item>
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
          <DropdownMenu.Item onClick={hideAllExceptSelected} shortcut="Ctrl Shift H">Hide all except selected</DropdownMenu.Item>
          <DropdownMenu.Item onClick={showAll} shortcut="Ctrl Alt H">Show all</DropdownMenu.Item>
          <DropdownMenu.Item onClick={goToSelected} shortcut="Ctrl Space">Go to selected</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="Ctrl G">Generate graph</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default Menubar;
