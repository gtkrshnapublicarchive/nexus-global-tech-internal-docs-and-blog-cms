import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: "READER" | "EDITOR" }).role;
        token.department = (user as { department: string }).department;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "READER" | "EDITOR";
        session.user.department = token.department as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = nextUrl.pathname.startsWith("/login");
      const isPrivilegedRoute =
        nextUrl.pathname.startsWith("/editor") ||
        nextUrl.pathname.startsWith("/admin");

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/feed", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      // Privileged Route Defense: Readers cannot access /editor
      const userRole = auth?.user?.role;
      if (isPrivilegedRoute && userRole !== "EDITOR") {
        return Response.redirect(new URL("/feed", nextUrl));
      }

      if (nextUrl.pathname === "/") {
        return Response.redirect(new URL("/feed", nextUrl));
      }

      return true;
    },
  },
  providers: [],
};
