export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "case_manager";
  avatar?: string;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}