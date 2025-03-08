import {
  Button,
  Container,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Link,
  SegmentedControl,
  Separator,
  TabNav,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import "./header.css";
import { GitHubLogoIcon, Share1Icon } from "@radix-ui/react-icons";
import Menubar from "../menubar/Menubar";

export default function Header() {
  const githubLink = "https://github.com/smultronbusken/graphi";

  return (
    <div className={"HeaderRoot"}>
      <div className={"HeaderInner"}>
        <Flex
          align="center"
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          pl="4"
        >
          <Share1Icon />

          <Heading as="h1" size="3" className="default-font" >
            gra
          </Heading>
          <Text className="default-font" weight={"light"}>
            phi
          </Text>

          <Separator orientation="vertical" ml="4" mr="4" />
          <Menubar />
        </Flex>

        <div className={"HeaderProductLinksContainer"}>
          <SegmentedControl.Root defaultValue="explorer" variant="surface">
            <SegmentedControl.Item value="explorer">
              Explorer
            </SegmentedControl.Item>
            <SegmentedControl.Item value="data">Data</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>

        <Flex
          display={{ initial: "none", md: "flex" }}
          align="center"
          gap="5"
          position="absolute"
          top="0"
          bottom="0"
          right="0"
          pr="4"
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size="3" variant="ghost" color="gray">
                <Text size={"1"}>Help</Text>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item >Cassieeee</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Tooltip content="View GitHub">
            <IconButton asChild size="3" variant="ghost" color="gray">
              <a href={githubLink} target="_blank" aria-label="View GitHub">
                <GitHubLogoIcon width="16" height="16" />
              </a>
            </IconButton>
          </Tooltip>
        </Flex>
      </div>
    </div>
  );
}
