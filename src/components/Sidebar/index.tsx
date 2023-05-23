import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import {
  BENEFITS,
  FIND_BUYER,
  MY_LISTINGS,
  PRICE_FEEDS,
  VERIFY,
} from "../../../constants/paths";

interface LinkItemProps {
  name: string;
  icon: IconType;
  link?: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "My listings", icon: FiHome, link: MY_LISTINGS },
  { name: "Find buyer", icon: FiTrendingUp, link: FIND_BUYER },
  { name: "Price feeds", icon: FiCompass, link: PRICE_FEEDS },
  { name: "Verify", icon: FiStar, link: VERIFY },
  { name: "Benefits", icon: FiSettings, link: BENEFITS },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h={{ base: 20, md: 0 }}
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((item) => (
        <NavItem key={item.name} icon={item.icon} link={item.link}>
          {item.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: any;
  link?: string;
}
const NavItem = ({ icon, children, link = "", ...rest }: NavItemProps) => {
  const router = useRouter();

  return (
    <Link href={link}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "green.400",
          color: "white",
        }}
        {...(router.pathname === link
          ? {
              bg: "green.400",
              color: "white",
            }
          : {})}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};
