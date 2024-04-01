"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

const CustomNavbar = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname();

  const menuItems = ["About", "Schedules", "Contacts", "Logout"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} disableAnimation={false}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink href="/" className="font-bold text-inherit">
            1on1
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={path === "/about"}>
          <Link
            color={path === "/about" ? "primary" : "foreground"}
            href="/about"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={path === "/schedule"}>
          <Link
            color={path === "/schedule" ? "primary" : "foreground"}
            href="/schedule"
          >
            Schedule
          </Link>
        </NavbarItem>
        <NavbarItem isActive={path === "/contacts"}>
          <Link
            color={path === "/contacts" ? "primary" : "foreground"}
            href="/contacts"
          >
            Contacts
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/auth/register"
            variant="flat"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomNavbar;
