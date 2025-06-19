import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";

const NavBar = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };
  return (
    <div className="fixed top-0 z-50 flex w-full h-fit items-center justify-between gap-2 bg-background px-4 py-2 shadow-md">
      <Button variant="ghost" onClick={() => handleNavigate("/")}>
        Home
      </Button>

      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={() => handleNavigate("/signin")}>
          Sign In
        </Button>
        <Button variant="ghost" onClick={() => handleNavigate("/signup")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
