import { Sparkles, User } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between p-6 px-16">
      <div className="flex flex-row items-center gap-1">
        <Sparkles className="text-primary" />
        <p className="text-primary font-bold text-2xl">PokePrice</p>
      </div>
      <button className="flex flex-row gap-2 items-center border-2 border-primary bg-transparent text-primary hover:bg-primary font-semibold hover:text-black py-2 px-4 rounded-lg transition">
        <User />
        Login/Signup
      </button>
    </header>
  );
};

export default Header;
