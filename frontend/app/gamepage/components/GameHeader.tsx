export function GameHeader() {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-5xl md:text-6xl text-white font-black">
        Pokémon Higher / Lower
      </h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
        Is the card on the right worth more or less than the one on the left?
      </p>
    </header>
  );
}
