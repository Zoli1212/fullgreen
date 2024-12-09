import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button asChild>

      <LoginLink>Login</LoginLink>
      </Button>
      <Button asChild>

      <RegisterLink>Sign Up</RegisterLink>
      </Button>
    
    </div>
  );
}
