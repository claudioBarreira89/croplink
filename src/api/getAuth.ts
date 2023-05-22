import { useQuery } from "@tanstack/react-query";

export const getAuth = async (): Promise<any> => {
  const res = await fetch("/api/me");
  const json = await res.json();
  return json;
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => getAuth(),
  });
};
