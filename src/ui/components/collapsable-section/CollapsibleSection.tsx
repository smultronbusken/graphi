import React, { useState } from "react";
import { Collapsible } from "radix-ui";
import { Flex, Heading, Button, Separator } from "@radix-ui/themes";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="CollapsibleRoot"
    >
      <Flex dir="row" align="center" justify="between">
        <Heading size="1" mr={"4px"}>
          {title}
        </Heading>
        <Collapsible.Trigger asChild>
          <Button variant="outline" size="1" radius="full">
            {open ? <CaretUpIcon /> : <CaretDownIcon />}
          </Button>
        </Collapsible.Trigger>
      </Flex>

      <Collapsible.Content>
        <Separator orientation="horizontal" size="4" mt="2" mb="2" />
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
