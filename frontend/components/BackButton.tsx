import Link from "next/link";
import { ArrowLeft } from "lucide-react";
const BackButton = ({ href = "/", text = "Back" }) => {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:bg-muted-foreground/30 text-med flex items-center gap-2 rounded-xl px-6 py-2 font-semibold transition-colors duration-300 hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      {text}
    </Link>
  );
};

export default BackButton;
