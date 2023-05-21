export interface SignInButtonProps {
  onSuccess?: (args: { address: string }) => void;
  onError?: (args: { error: Error }) => void;
}
