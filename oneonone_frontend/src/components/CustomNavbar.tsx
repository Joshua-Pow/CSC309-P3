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
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserDetails } from "@/context/AuthContext";

type Props = { isLoggedIn: boolean; userDetails: UserDetails | null };

const CustomNavbar = (props: Props) => {
  const { logout, isLoggedIn, userDetails } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const path = usePathname();

  const menuItems = ["About", "Schedule", "Contacts", "Logout"];

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
      {isLoggedIn ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={userDetails?.firstName + " " + userDetails?.lastName}
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {userDetails?.firstName} {userDetails?.lastName}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Link href="/auth/login">Login</Link>
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
      )}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                item.toLowerCase() === "logout"
                  ? "danger"
                  : path === `/${item.toLowerCase()}`
                    ? "primary"
                    : "foreground"
              }
              className="w-full"
              href={`/${item.toLowerCase()}`}
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
