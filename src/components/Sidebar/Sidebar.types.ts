import { BoxProps, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

export interface LinkItemProps {
  name: string;
  icon: IconType;
  link?: string;
}

export interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: any;
  link?: string;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
}
