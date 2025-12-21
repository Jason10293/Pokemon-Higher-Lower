import { Zap } from "lucide-react";
import { Button } from "@/components/button";
export default function HomePage() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/*Background decoration elements*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-secondary/35 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-32 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Section Text + CTA */}
      <div className="flex flex-col items-center justify-content my-6 pt-12">
        <p className="text-7xl text-white font-black mt-6">Higher or</p>
        <p className="text-7xl text-primary font-black">Lower?</p>
        <div>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto text-center mt-4">
            Test your Pokemon Knowledge by guessing which card is more
            expensive!
          </p>
        </div>
        <Button variant="hero" size="xl" className="group">
          <Zap className="w-6 h-6 mr-2" />
          Start Playing!
        </Button>
      </div>
    </div>
  );
}
