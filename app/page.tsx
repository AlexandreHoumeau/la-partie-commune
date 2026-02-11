"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={() => window.open("/app")} variant="outline" className="mb-4">
        Découvrez Partie Commune CMS
      </Button>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Bienvenue sur la partie commune de notre CMS, conçue spécialement pour les agences web. Ici, vous pouvez gérer facilement vos projets, collaborer avec votre équipe et suivre l'avancement de vos tâches. Notre interface intuitive vous permet de rester organisé et productif, tout en offrant une expérience utilisateur fluide et agréable.
        </p>
      </div>
    </main>
  );
}
