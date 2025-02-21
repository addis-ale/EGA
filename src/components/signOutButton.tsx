"use client";

import { signOut } from "next-auth/react";
const SignOutButton = () => {
  return (
    <button
      className="bg-red-700 text-white p-3"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Signout
    </button>
  );
};

export default SignOutButton;
