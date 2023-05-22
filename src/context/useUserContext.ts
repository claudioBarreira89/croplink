import { createContext, useContext } from "react";

export type AuthContextProps = {
  state: { user: string; role: string; isLoading: boolean };
  dispatch: Function;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { useAuthContext };
export default AuthContext;
