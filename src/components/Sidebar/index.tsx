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
import { FiList, FiCheckCircle, FiMenu, FiDollarSign } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IconType } from "react-icons";
import {
  BENEFITS,
  FIND_BUYER,
  FIND_FARMERS,
  LISTINGS,
  MY_LISTINGS,
  PRICE_FEEDS,
  VERIFY,
} from "../../../constants/paths";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

interface LinkItemProps {
  name: string;
  icon: IconType;
  link?: string;
}

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
  const { state } = useAuthContext() as AuthContextProps;
  const { role } = state;

  const linkItems: Array<LinkItemProps> = [
    ...(role === "farmer"
      ? [
          { name: "My listings", icon: FiList, link: MY_LISTINGS },
          { name: "Find buyer", icon: GiReceiveMoney, link: FIND_BUYER },
          { name: "Price feeds", icon: FiDollarSign, link: PRICE_FEEDS },
          { name: "Verify", icon: FiCheckCircle, link: VERIFY },
          { name: "Benefits", icon: HiOutlineEmojiHappy, link: BENEFITS },
        ]
      : []),
    ...(role === "buyer"
      ? [
          { name: "Listings", icon: FiList, link: LISTINGS },
          { name: "Find farmer", icon: GiReceiveMoney, link: FIND_FARMERS },
        ]
      : []),
  ];

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
      {linkItems.map((item) => (
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
