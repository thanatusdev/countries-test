"use client";

import { ReactNode, useRef } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useQuery } from "@apollo/client";
import { GET_USER, GetUserQuery } from "@/operations/queries/getUser";
import { userMutations } from "@/operations/mutations";
import { useRouter } from "next/navigation";
import UserModal from "./UserModal";

const Links = ["Dashboard"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const { push } = useRouter();
  const finalRef = useRef(null);
  const userData = useQuery<GetUserQuery>(GET_USER, {
    fetchPolicy: "cache-and-network",
  });

  const onLogout = () => {
    userMutations.mutateUser({
      username: "",
      jobTitle: "",
    });

    push("/");
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex gap={2} alignItems={"center"}>
            <span>
              {userData.data?.user.username} - {userData.data?.user.jobTitle}
            </span>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={undefined} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onModalOpen}>Update Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <UserModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        ref={finalRef}
        initialValues={{
          username: userData.data?.user.username ?? "",
          jobTitle: userData.data?.user.jobTitle ?? "",
        }}
      />
    </>
  );
}
