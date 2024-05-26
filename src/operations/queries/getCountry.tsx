import { gql } from "@apollo/client";

export interface GetCountryQuery {
  country: {
    name: string;
    native: string;
    capital: string;
    emoji: string;
    currency: string;
    languages: {
      code: string;
      name: string;
    }[];
  };
}

export const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      name
      native
      capital
      emoji
      currency
      languages {
        code
        name
      }
    }
  }
`;
