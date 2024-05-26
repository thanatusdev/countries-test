import { gql } from "@apollo/client";

export interface GetUserQuery {
  user: {
    username: string;
    jobTitle: string;
  };
}

export const GET_USER = gql`
  query GetUser {
    user @client {
      username
      jobTitle
    }
  }
`;
