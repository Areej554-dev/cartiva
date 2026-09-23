import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        await connectDB();

        const email =
          String(credentials.email)
            .toLowerCase()
            .trim();

        const user =
          await User.findOne({ email })
            .lean();

        if (!user) {
          return null;
        }

        // -------------------------------------
        // ACCOUNT STATUS
        // -------------------------------------

        // Treat older users without isActive
        // as active.
        if (user.isActive === false) {
          throw new Error(
            "Your account has been deactivated. Please contact the administrator."
          );
        }

        // -------------------------------------
        // PASSWORD
        // -------------------------------------

        const passwordMatch =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          isAdmin: Boolean(user.isAdmin),
        };
      },
    }),
  ],

  // -----------------------------------------
  // SESSION
  // -----------------------------------------

  session: {
    strategy: "jwt",
  },

  secret:
    process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  // -----------------------------------------
  // CALLBACKS
  // -----------------------------------------

  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.isAdmin =
          Boolean(user.isAdmin);
      }

      // ---------------------------------------
      // Re-check current account
      // ---------------------------------------

      if (token.id) {
        try {
          await connectDB();

          const currentUser =
            await User.findById(
              token.id
            )
              .select(
                "_id name email isAdmin isActive"
              )
              .lean();

          if (!currentUser) {
            // User no longer exists.
            token.id = null;
            token.isAdmin = false;
            token.error = "UserNotFound";

            return token;
          }

          // -----------------------------------
          // Deactivated account
          // -----------------------------------

          if (
            currentUser.isActive === false
          ) {
            token.id = null;
            token.isAdmin = false;
            token.error =
              "AccountDeactivated";

            return token;
          }

          // -----------------------------------
          // Keep role information current
          // -----------------------------------

          token.id =
            String(currentUser._id);

          token.isAdmin =
            Boolean(
              currentUser.isAdmin
            );

          token.name =
            currentUser.name;

          token.email =
            currentUser.email;
        } catch (error) {
          console.error(
            "JWT USER REFRESH ERROR:",
            error
          );

          // Don't accidentally grant
          // elevated permissions if the
          // database cannot be checked.
          token.isAdmin = false;
          token.error =
            "UserVerificationFailed";
        }
      }

      return token;
    },

    // -----------------------------------------
    // SESSION CALLBACK
    // -----------------------------------------

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id;

        session.user.isAdmin =
          Boolean(
            token.isAdmin
          );

        if (token.error) {
          session.user.error =
            token.error;
        }
      }

      return session;
    },
  },
};