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
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserDetails } from "@/context/AuthContext";

type Props = { isLoggedIn: boolean; userDetails: UserDetails | null };

const CustomNavbar = ({ isLoggedIn, userDetails }: Props) => {
  const router = useRouter();
  const { logout } = useAuth();
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
          <Link href="/" className="font-bold text-inherit">
            1on1
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={path === "/about"}>
          <Link
            className={path === "/about" ? "font-bold text-primary" : ""}
            href="/about"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={path === "/schedule"}>
          <Link
            className={path === "/schedule" ? "font-bold text-primary" : ""}
            href="/schedule"
          >
            Schedule
          </Link>
        </NavbarItem>
        <NavbarItem isActive={path === "/contacts"}>
          <Link
            className={path === "/contacts" ? "font-bold text-primary" : ""}
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
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue={`signed in as ${userDetails?.firstName} ${userDetails?.lastName}`}
              >
                <p className="font-semibold">Signed in as:</p>
                <p className="font-semibold">
                  {userDetails?.firstName} {userDetails?.lastName}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
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
              className={
                item.toLowerCase() === "logout"
                  ? "w-full text-danger"
                  : path === `/${item.toLowerCase()}`
                    ? "w-full font-bold text-primary"
                    : "w-full text-foreground"
              }
              href={`/${item.toLowerCase()}`}
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
