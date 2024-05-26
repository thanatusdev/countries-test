import { gql } from "@apollo/client";

export interface GetCountriesQuery {
  countries: {
    name: string;
    code: string;
    capital: string;
    emoji: string;
    languages: {
      code: string;
      name: string;
    }[];
  }[];
}

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      code
      capital
      emoji
      languages {
        code
        name
      }
    }
  }
`;
