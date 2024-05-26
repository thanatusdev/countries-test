import { User } from "@/models/User";
import { InMemoryCache, ReactiveVar, makeVar } from "@apollo/client";
import makeVarPersisted from "./makeVarPersisted";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        user: {
          read() {
            return userVar();
          },
        },
      },
    },
  },
});

/**
 * Set initial values when we create cache variables.
 */

const userInitialValue: User = {
  username: "",
  jobTitle: "",
};

export const userVar: ReactiveVar<User> = makeVarPersisted<User>(
  userInitialValue,
  "user"
);
