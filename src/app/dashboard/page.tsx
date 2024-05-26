"use client";

import { Country } from "@/models/Country";
import {
  GET_COUNTRIES,
  GetCountriesQuery,
} from "@/operations/queries/getCountries";
import { useQuery } from "@apollo/client";
import {
  Heading,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";

const DynamicModal = dynamic(() => import("@/components/CountryModal"), {
  ssr: false,
});

const Dashboard = () => {
  const { data, loading } = useQuery<GetCountriesQuery>(GET_COUNTRIES, {
    fetchPolicy: "cache-and-network",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const onOpenModal = (country: Country) => {
    router.replace(`/dashboard?country=${country.code}`);
    onOpen();
  };

  const onCloseModal = () => {
    onClose();
    router.replace("/dashboard");
  };

  return (
    <>
      <Stack spacing={8}>
        <Heading as="h1">Information Page</Heading>
        <Stack
          boxShadow={"2xl"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          p={10}
          spacing={8}
          align={"center"}
        >
          <TableContainer minW={"100%"}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Country</Th>
                  <Th>Capital</Th>
                  <Th>Languages</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading &&
                  [...Array(5).keys()].map((i) => (
                    <Tr key={i}>
                      <Td minW={"100%"}>
                        <Skeleton height="20px" />
                      </Td>
                      <Td minW={"100%"}>
                        <Skeleton height="20px" />
                      </Td>
                      <Td minW={"100%"}>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                  ))}
                {!loading &&
                  data?.countries.map((country) => (
                    <Tr
                      onClick={() => onOpenModal(country)}
                      key={country.code}
                      _hover={{ cursor: "pointer" }}
                    >
                      <Td>{country.name}</Td>
                      <Td>{country.capital}</Td>
                      <Td>
                        {country.languages.map((lang) => lang.name).join(", ")}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
      <Suspense>
        <DynamicModal isOpen={isOpen} onClose={onCloseModal} isCentered />
      </Suspense>
    </>
  );
};

export default Dashboard;
