"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { useState } from "react";

const AVATAR_URLS = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", // Pikachu
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", // Bulbasaur
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", // Charmander
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", // Squirtle
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", // Jigglypuff
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png", // Eevee
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png", // Mewtwo
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png", // Snorlax
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", // Gengar
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png", // Charizard
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png", // Blastoise
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png", // Venusaur
];
const SettingsPage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  return (
    <main>
      <div className="gradient-hero relative min-h-screen overflow-hidden">
        <Header />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-5 text-white">
          <div className="flex flex-col items-start gap-3">
            <BackButton href="/" text="Back to Home" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <Tabs.Root defaultValue="profile" className="w-full">
            <Tabs.List className="flex w-full gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              <Tabs.Trigger
                value="profile"
                className="data-[state=active]:bg-primary-text flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white/70 transition data-[state=active]:text-white"
              >
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger
                value="settings"
                className="data-[state=active]:bg-primary-text flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white/70 transition data-[state=active]:text-white"
              >
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              value="profile"
              className="gradient-card mt-6 rounded-2xl p-6"
            >
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Your Profile
                </h1>
                <h4 className="mt-1 text-sm text-white/40">
                  Customize how others see you
                </h4>
              </div>
              <div className="mt-4 flex flex-row items-center justify-center">
                <div className="border-primary h-[100px] w-[100px] overflow-hidden rounded-full border-4">
                  <img
                    src={avatarUrl || AVATAR_URLS[0]}
                    alt="Avatar"
                    className="h-full w-full scale-115 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-md mt-4 mb-1 text-white">Display Name</h1>
                <input
                  type="text"
                  placeholder="Enter your display name"
                  className="focus:border-primary focus:ring-primary mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:ring-2 focus:outline-none"
                />
              </div>

              <div className="mb-2 flex flex-col gap-4">
                <h1 className="mt-8 mb-3 text-sm font-semibold text-white">
                  Choose a Pok&eacute;mon Avatar
                </h1>
                <div className="grid grid-cols-6 gap-4">
                  {AVATAR_URLS.map((url) => (
                    <button
                      key={url}
                      onClick={() => setAvatarUrl(url)}
                      className={`border-primary h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                        avatarUrl === url
                          ? "border-primary"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      <img
                        src={url}
                        alt="Avatar Option"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 shadow-button mt-3 h-11 w-full rounded-2xl px-4 py-2 font-semibold text-black transition-all duration-300 hover:scale-105"
                >
                  Save Profile
                </button>
              </div>
            </Tabs.Content>
            <Tabs.Content
              value="settings"
              className="mt-6 rounded-2xl bg-white/5 p-6"
            >
              <p className="text-sm text-white/80">Settings go here.</p>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
