"use client";

import { ReactNode } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { cache } from "@/utils/cache";

export const apolloClient = new ApolloClient({
  uri: "https://countries.trevorblades.com",
  cache: cache,
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </ApolloProvider>
  );
};

export default Providers;
