import { Sparkles, User } from "lucide-react";
import Link from "next/link";
const Header = () => {
  return (
    <header className="flex justify-between p-6 px-16">
      <div className="flex flex-row items-center gap-1">
        <Sparkles className="text-primary" />
        <p className="text-primary text-2xl font-bold">PokePrice</p>
      </div>
      <Link href="/login">
        <button className="border-primary text-primary hover:bg-primary flex flex-row items-center gap-2 rounded-lg border-2 bg-transparent px-4 py-2 font-semibold transition hover:text-black">
          <User />
          Login/Signup
        </button>
      </Link>
    </header>
  );
};

export default Header;
