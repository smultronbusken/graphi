import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <Flex direction="column" align="center">
        <Separator orientation="horizontal" size="4" mt="2" mb="2" />
        <Flex direction="row" align={"center"}>
          <Heading as="h1" size="3" className="header-heading">
            gra
          </Heading>
          <Text className="header-text">phi</Text>
        </Flex>
        <Separator orientation="horizontal" size="4" mt="2" mb="2" />
      </Flex>
    </header>
  );
}
