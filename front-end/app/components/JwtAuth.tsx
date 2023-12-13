// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import jwtDecode from "jwt-decode";
// import { useCookies } from "react-cookie";

// type DecodedToken = {
//   exp: number;
// };

// const JwtAuth = () => {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const [cookies, setCookie] = useCookies(["user"]);
//   const router = useRouter();

//   const isTokenExpired = !cookies.user || checkIfTokenExpired(cookies.user);

//   if (token && (isTokenExpired || !cookies.user)) {
//     const tokenString = Array.isArray(token) ? token[0] : token;
//     setCookie("user", tokenString, {
//       path: "/",
//     });
//   }

//   function checkIfTokenExpired(token: string) {
//     const decodedToken: DecodedToken = jwtDecode(token);
//     if (!decodedToken) {
//       return true;
//     }
//     const currentTimestamp = Math.floor(Date.now() / 1000);
//     return decodedToken.exp < currentTimestamp;
//   }

//   return null;
// };

// export default JwtAuth;
