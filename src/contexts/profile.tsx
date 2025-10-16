import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
} from "react";

interface Local {
  cidade: string;
  estado: string;
  lat: string;
  long: string;
}

interface Profile {
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  genero: string;
  nascimento: string;
  cidade: string;
  localidade: Local;
  avatar?: string;
}

interface ProfileContextData {
  profile: Profile | null;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
}

const ProfileContext = createContext<ProfileContextData>(
  {} as ProfileContextData
);

const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useContext must be used within an AuthContext.");
  }

  return context;
}

export { ProfileProvider, useProfile };
