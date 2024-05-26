"use client";

import WelcomeIcon from "@/components/icons/WelcomeIcon";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Suspense, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { GET_USER, GetUserQuery } from "@/operations/queries/getUser";
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";

const UserModal = dynamic(() => import("@/components/UserModal"), {
  ssr: false,
});

const Card = () => {
  const { push } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const userData = useQuery<GetUserQuery>(GET_USER, {
    fetchPolicy: "cache-and-network",
  });
  const isUserLoggedIn =
    userData.data?.user?.username && userData.data?.user?.jobTitle;

  useEffect(() => {
    if (isUserLoggedIn) {
      push("/dashboard");
    }
  }, [isUserLoggedIn, push]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      py={12}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        boxShadow={"2xl"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        maxW={"xl"}
        p={10}
        spacing={8}
        align={"center"}
      >
        <Icon as={WelcomeIcon} w={200} h={200} />
        <Stack align={"center"} spacing={2}>
          <Heading
            textTransform={"uppercase"}
            fontSize={"3xl"}
            color={useColorModeValue("gray.800", "gray.200")}
          >
            Welcome!
          </Heading>
          <Text fontSize={"lg"} color={"gray.500"}>
            Please click on the button below to add your information before
            proceeding to dashboard.
          </Text>
        </Stack>
        <Stack spacing={4} direction={{ base: "column", md: "row" }} w={"full"}>
          <Button
            bg={"blue.400"}
            rounded={"full"}
            color={"white"}
            flex={"1 0 auto"}
            _hover={{ bg: "blue.500" }}
            _focus={{ bg: "blue.500" }}
            onClick={onOpen}
            name="add-information"
          >
            Continue
          </Button>
        </Stack>
      </Stack>
      <Suspense>
        <UserModal isOpen={isOpen} onClose={onClose} ref={finalRef} />
      </Suspense>
    </Flex>
  );
};

export default Card;
