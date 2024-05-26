"use client";

import Navbar from "@/components/Navbar";
import { GET_USER, GetUserQuery } from "@/operations/queries/getUser";
import { useQuery } from "@apollo/client";

import { Box, Container, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navRef = useRef(null);
  const wrapper = useRef(null);
  const userData = useQuery<GetUserQuery>(GET_USER, {
    fetchPolicy: "cache-and-network",
  });
  const isUserLoggedIn =
    userData.data?.user?.username && userData.data?.user?.jobTitle;

  const { push } = useRouter();

  useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  }, []);

  // Redirect to / if user is not logged in
  useEffect(() => {
    if (!isUserLoggedIn) {
      push("/");
    }
  }, [push, isUserLoggedIn]);

  return (
    <Box ref={navRef}>
      <Portal containerRef={navRef}>
        <Navbar />
        <Container maxW={"7xl"} p="12" hidden={!isUserLoggedIn}>
          {children}
        </Container>
      </Portal>
      <Box w="100%">
        <Box ref={wrapper} w="100%"></Box>
      </Box>
    </Box>
  );
}
