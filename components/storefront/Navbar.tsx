import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Menu, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { redis } from "@/lib/redis";
import { Cart } from "@/lib/interfaces";
import { UserDropdown } from "./UserDropdown";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const cart: Cart | null = await redis.get(`cart-${user?.id}`);
  const total = cart?.items.reduce((sum: number, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-black font-bold text-xl lg:text-3xl">
              Amazing<span className="text-primary">Own</span>
            </h1>
          </Link>
          <NavbarLinks />
        </div>

        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              <Link href="/bag" className="group p-2 flex items-center">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {total}
                </span>
              </Link>

              <UserDropdown
                email={user.email as string}
                name={user.given_name as string}
                userImage={
                  user.picture ?? `https://avatar.vercel.sh/${user.given_name}`
                }
              />
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-x-2">
                <Button variant="ghost" asChild>
                  <LoginLink>Sign in</LoginLink>
                </Button>
                <span className="h-6 w-px bg-gray-200"></span>
                <Button variant="ghost" asChild>
                  <RegisterLink>Create Account</RegisterLink>
                </Button>
              </div>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col gap-4 mt-4">
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <LoginLink>Sign in</LoginLink>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <RegisterLink>Create Account</RegisterLink>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
