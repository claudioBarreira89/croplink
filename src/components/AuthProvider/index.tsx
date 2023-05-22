import AuthContext from "@/context/useUserContext";
import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";

const initialState = {
  user: undefined,
};

const AuthProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { push } = useRouter();

  const handler = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      dispatch({ type: "LOGIN", payload: json.address, role: json.role });

      setIsLoading(false);
    } catch (_error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handler();
  }, []);

  return (
    <AuthContext.Provider value={{ state: { ...state, isLoading }, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const Reducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        role: action.role,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export default AuthProvider;
