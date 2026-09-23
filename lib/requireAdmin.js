import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      status: 401,
      message: "Authentication required.",
    };
  }

  if (!session.user.isAdmin) {
    return {
      authorized: false,
      status: 403,
      message: "Admin access required.",
    };
  }

  return {
    authorized: true,
    session,
  };
}