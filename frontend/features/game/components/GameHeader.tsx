export function GameHeader() {
  return (
    <div>
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black text-white md:text-6xl">
          Pokémon <span className="text-primary">Higher</span>{" "}
          <span className="text-secondary">/ Lower</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-lg">
          Is the card on the right worth more or less than the one on the left?
        </p>
      </header>
    </div>
  );
}
