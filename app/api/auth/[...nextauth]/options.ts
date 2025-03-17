import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import Company from "@/models/Company"; // Ensure you have a Company model
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          await connectDB();
          console.log("Connecting to DB...");

          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            console.log("No user found");
            throw new Error("No user found with the provided email");
          }

          const isValid = await bcrypt.compare(
            credentials?.password || "",
            user.password
          );

          if (!isValid) {
            console.log("Invalid password");
            throw new Error("Invalid password");
          }

          // Fetch company details
          const company = await Company.findById(user.company);

          if (!company) {
            console.log("Company not found");
            throw new Error("User's company not found");
          }

          console.log("User authenticated:", user);

          return {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            company: {
              id: company._id.toString(),
              name: company.name,
              email: company.email,
              device: company.device,
              address: company.address,
              tinNumber: company.tinNumber,
              phoneNumber: company.phoneNumber,
              street: company.street,
              city: company.city,
            },
          };
        } catch (error: any) {
          console.error("Authorization Error:", error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        //@ts-ignore
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        //@ts-ignore
        session.user.company = token.company;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
