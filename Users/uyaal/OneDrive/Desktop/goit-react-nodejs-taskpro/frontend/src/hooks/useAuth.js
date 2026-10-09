import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectToken, selectUser } from "../store/auth/authSelectors.js";

export function useAuth() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return {
    user,
    isLoggedIn: isLoggedIn || Boolean(token),
    token,
  };
}
