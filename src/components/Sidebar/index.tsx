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
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { FiList, FiMenu, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import { HiOutlineEmojiHappy } from "react-icons/hi";

import {
  BENEFITS,
  FIND_BUYER,
  FIND_FARMERS,
  LISTINGS,
  MARKET_PRICES,
  MY_LISTINGS,
  DEMAND_FEEDS,
} from "../../../constants/paths";

import {
  LinkItemProps,
  MobileProps,
  NavItemProps,
  SidebarProps,
} from "./Sidebar.types";

import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Flex gap="10" direction={{ base: "column", md: "row" }}>
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
        <Box w="full">{children}</Box>
      </Flex>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { state } = useAuthContext() as AuthContextProps;
  const { role } = state;

  const linkItems: Array<LinkItemProps> = [
    ...(role === "farmer"
      ? [
          { name: "My listings", icon: FiList, link: MY_LISTINGS },
          { name: "Find buyer", icon: GiReceiveMoney, link: FIND_BUYER },
          { name: "Demand feeds", icon: FiDollarSign, link: DEMAND_FEEDS },
          { name: "Benefits", icon: HiOutlineEmojiHappy, link: BENEFITS },
        ]
      : []),
    ...(role === "buyer"
      ? [
          { name: "Listings", icon: FiList, link: LISTINGS },
          { name: "Find farmer", icon: GiReceiveMoney, link: FIND_FARMERS },
          { name: "Demand feeds", icon: FiDollarSign, link: DEMAND_FEEDS },
          { name: "Market prices", icon: FiTrendingUp, link: MARKET_PRICES },
        ]
      : []),
  ];

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      w={{ base: "full", md: 60 }}
      maxH="full"
      h="full"
      py={6}
      px={4}
      rounded="xl"
      position="sticky"
      top={10}
      {...rest}
    >
      <Flex
        h={{ base: 20, md: 0 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex gap="1" direction="column">
        {linkItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} link={item.link}>
            {item.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

const NavItem = ({ icon, children, link = "", ...rest }: NavItemProps) => {
  const router = useRouter();

  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        py={2}
        px={3}
        borderRadius="md"
        role="group"
        cursor="pointer"
        _hover={{
          bg: router.pathname === link ? "green.400" : "green.100",
        }}
        bg={router.pathname === link ? "green.400" : ""}
        color={router.pathname === link ? "white" : ""}
        fontWeight={router.pathname === link ? "semibold" : ""}
        {...rest}
      >
        {icon && <Icon boxSize={5} mr={2} as={icon} />}
        <Text fontSize="md">{children}</Text>
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
      justifyContent="flex-start"
      position={"sticky"}
      top={0}
      zIndex={9}
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
