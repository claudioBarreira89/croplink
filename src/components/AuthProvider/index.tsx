import AuthContext from "@/context/useUserContext";
import { useEffect, useReducer } from "react";

const initialState = {
  user: undefined,
};

const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        dispatch({ type: "LOGIN", payload: json.address });
      } catch (_error) {}
    };
    handler();
    // window.addEventListener("focus", handler);
    // return () => window.removeEventListener("focus", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
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
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

export default AuthProvider;
