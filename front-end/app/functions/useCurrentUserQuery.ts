import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { User } from "../util/types";

const useCurrentUserQuery = () => {
  const [cookies] = useCookies(["user"]);

  const { data: currentUser, isLoading } = useQuery<User | null>(
    ["currentUser"],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );

  return { currentUser, isLoading };
};

export default useCurrentUserQuery;
