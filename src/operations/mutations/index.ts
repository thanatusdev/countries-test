import { userVar } from "@/utils/cache";
import mutateUser from "./mutateUser/mutateUser";

export const userMutations = {
  mutateUser: mutateUser(userVar),
};
