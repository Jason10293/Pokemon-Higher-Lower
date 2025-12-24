const Decoration = () => {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="bg-primary/40 absolute top-1/4 -left-32 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div className="bg-secondary/35 absolute top-1/2 -right-32 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div className="bg-accent/30 absolute -bottom-32 left-1/3 h-64 w-32 animate-pulse rounded-full blur-3xl" />
    </div>
  );
};

export default Decoration;
