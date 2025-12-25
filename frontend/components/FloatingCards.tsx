"use client";

import { motion } from "framer-motion";
const FloatingCards = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="gradient-card shadow-card absolute top-20 left-[10%] h-44 w-32 rounded-xl opacity-20"
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="gradient-card shadow-card absolute top-40 right-[15%] h-40 w-28 rounded-xl opacity-15"
        animate={{ y: [0, -15, 0], rotate: [5, -5, 5] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="gradient-card shadow-card absolute bottom-32 left-[20%] h-36 w-24 rounded-xl opacity-10"
        animate={{ y: [0, -25, 0], rotate: [-3, 3, -3] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default FloatingCards;
