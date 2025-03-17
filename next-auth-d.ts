import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  export interface Company {
    id: string;
    name: string;
    email: string;
    device: string;
    address: string;
    tinNumber: string;
    phoneNumber: string;
    street: string;
    city: string;
  }
}
