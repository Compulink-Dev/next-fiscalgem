"use client";

import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

// Define the shape of the context value
interface RegistrationContextType {
  formData: Record<string, any>;
  setFormData: Dispatch<SetStateAction<Record<string, any>>>;
}

type FormData = {
  companyName?: string;
  companyEmail?: string;
  firstName?: string;
  lastName?: string;
  device?: string;
  email?: string;
};

// Create the context with the correct type
export const RegistrationContext = createContext<
  RegistrationContextType | undefined
>(undefined);

// Provider component
export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({});

  return (
    <RegistrationContext.Provider value={{ formData, setFormData }}>
      {children}
    </RegistrationContext.Provider>
  );
}
