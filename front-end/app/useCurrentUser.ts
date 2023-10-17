import { useQuery } from "@tanstack/react-query";
import jwtDecode from 'jwt-decode';
import { useCookies } from 'react-cookie';
import { User } from "./types";

export function useCurrentUser() {
  const [cookies] = useCookies(['user']);

  return useQuery<User | null>(
    ['currentUser'],
    async () => {
      if (cookies.user) {
        const user = jwtDecode(cookies.user) as User | null;
        return user;
      }
      return null;
    }
  );
}