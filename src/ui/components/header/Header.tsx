import { Flex, Heading, Text } from '@radix-ui/themes';
import './header.css';

export default function Header() {
    return (
        <header className="header">
            <Flex align={"center"}>
                <Heading as="h1" size="3" className="header-heading">
                    gra
                </Heading>
                <Text className="header-text">
                    phi
                </Text>
            </Flex>
        </header>
    );
}
