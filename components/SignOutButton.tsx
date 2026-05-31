"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-white"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign out
    </Button>
  );
}
