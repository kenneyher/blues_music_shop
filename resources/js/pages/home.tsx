'use client';
import { ArrowUpRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <div className="pointer-events-none absolute transition-all duration-300 ease-in -top-1/6 -right-1/6 z-0 w-[40em] md:w-[55em]">
        <img
          src="vinyl.png"
          alt="Vinyl Record"
          className="h-auto w-full object-cover opacity-50 md:opacity-100"
        />
      </div>
      <div className="relative z-10 container mx-auto flex h-screen items-center px-6 md:px-12">
        {/* Left Column for Text and Button */}
        <div className="w-full md:w-3/5 lg:w-1/2">
          {/* Main Title */}
          {/* Using white text for contrast against the dark background */}
          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-primary md:text-8xl">
            Blue's
            <br />
            Music
            <br />
            Shop
          </h1>

          {/* Subtitle/Description */}
          <p className="mb-12 max-w-lg text-xl font-medium text-foreground md:text-2xl">
            Expand your vinyl record collection or your CD wall with our
            extensive catalog of music from all genres and eras.
          </p>

          {/* Call to Action Button */}
          <button className="group flex items-center rounded-full bg-white py-3 pr-3 pl-8 text-black shadow-lg transition-all duration-300 hover:scale-105">
            <span className="mr-6 text-lg font-bold tracking-wide">
              select in the catalog
            </span>
            {/* Arrow Icon Circle */}
            <div className="rounded-full bg-black p-3 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
