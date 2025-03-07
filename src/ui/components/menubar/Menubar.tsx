import {
    Button,
    DropdownMenu,
    Flex,
    Text
} from "@radix-ui/themes";
import "./Menubar.css";
1
const Menubar = () => {
  return (
    <Flex align="center" gap="4">
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
          <DropdownMenu.Item shortcut="⌘ I">Search</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default Menubar;
