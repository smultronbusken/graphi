import * as React from "react";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  FileIcon,
} from "@radix-ui/react-icons";
import "./Menubar.css";
import {
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  Section,
  Text,
} from "@radix-ui/themes";

const RADIO_ITEMS = ["Andy", "Benoît", "Luis"];
const CHECK_ITEMS = ["Always Show Bookmarks Bar", "Always Show Full URLs"];

const Menubar = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton asChild size="3" variant="ghost" color="gray">
          <FileIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Import</DropdownMenu.Item>
        <DropdownMenu.Item>Export</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Menubar;
