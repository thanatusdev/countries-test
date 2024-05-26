import { User } from "@/models/User";
import { ReactiveVar } from "@apollo/client";

export default function mutateUser(userVar: ReactiveVar<User>) {
  return (user: User) => {
    userVar(user);
  };
}
