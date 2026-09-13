import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "READER" | "EDITOR";
    department: string;
  }

  interface Session {
    user: {
      id: string;
      role: "READER" | "EDITOR";
      department: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "READER" | "EDITOR";
    department?: string;
  }
}
