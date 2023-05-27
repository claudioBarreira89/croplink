import { useEffect, useReducer, useState } from "react";

import { getAuth } from "@/api/getAuth";
import AuthContext from "@/context/useUserContext";

const initialState = {
  user: undefined,
};

const AuthProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(Reducer, initialState);

  const handler = async () => {
    setIsLoading(true);

    try {
      const json = await getAuth();
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
    case "UPDATE_ROLE":
      return { ...state, role: action.payload };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export default AuthProvider;
