"use client";

import { GET_COUNTRY, GetCountryQuery } from "@/operations/queries/getCountry";
import { useQuery } from "@apollo/client";
import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Skeleton,
  UnorderedList,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import React from "react";

type CountryModalProps = Omit<ModalProps, "children">;

const CountryModal = ({ onClose, ...props }: CountryModalProps) => {
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("country");
  const { data, loading } = useQuery<GetCountryQuery>(GET_COUNTRY, {
    variables: {
      code: countryCode,
    },
    skip: !countryCode,
  });

  return (
    <Modal onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Skeleton isLoaded={!loading} width="100%" h={"20px"}>
            {data?.country?.name} {data?.country?.emoji}
          </Skeleton>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDirection={"column"} gap={2}>
          <Skeleton isLoaded={!loading}>
            <p>Native: {data?.country?.native}</p>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <p>Capital: {data?.country?.capital}</p>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <p>Currency: {data?.country?.currency}</p>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <p>Languages:</p>
            <UnorderedList>
              {data?.country?.languages.map((language) => (
                <ListItem key={language.code}>{language.name}</ListItem>
              ))}
            </UnorderedList>
          </Skeleton>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CountryModal;
