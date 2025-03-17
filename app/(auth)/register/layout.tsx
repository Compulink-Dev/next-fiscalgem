import { ReactNode } from "react";
import { RegistrationProvider } from "./RegisterProvider";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <RegistrationProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-lg bg-white rounded shadow my-6">
          {children}
        </div>
      </div>
    </RegistrationProvider>
  );
}
