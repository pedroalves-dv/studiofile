"use client";

import Link from "next/link";
import Logo from "public/images/logo/newlogov2.svg";
import { useEffect, useState } from "react";

// ✏️ Change this to your actual launch date
const LAUNCH_DATE = new Date("2026-09-01T00:00:00");

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span>
      {days}d {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}

export function LandingMinimalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-canvas">
      <div className="h-full px-5 border-b sm:border-r border-light">
        <div className="h-full grid grid-cols-2 items-end pb-3">
          <Link href="/" aria-label="Studiofile — Home" className="group w-fit">
            <Logo className="h-6 w-30 fill-current text-ink group-hover:text-light transition-colors mb-0.5" />
          </Link>
          <div className="h-full flex justify-self-end items-end gap-28">
            <p className="justify-self-start w-60 flex items-end font-medium tracking-[-0.05em] text-lg leading-none">
              Countdown: [<Countdown />]
            </p>
            <p className="flex items-end font-medium tracking-[-0.05em] text-lg leading-none">
              © 2026 Studio filé — Paris
            </p>
            <p className="flex items-end font-medium tracking-[-0.05em] text-lg leading-none">
              TOTEM
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
