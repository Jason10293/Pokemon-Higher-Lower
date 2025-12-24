const Decoration = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-secondary/35 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 left-1/3 w-32 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse" />
    </div>
  );
};

export default Decoration;
