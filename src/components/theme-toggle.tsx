"use client";
import {useSyncExternalStore} from "react";

/** Appearance: follow the system, or force light or dark (the app has the same three choices). Saved in this browser only. */
const modes = ["system", "light", "dark"] as const;
type Mode = (typeof modes)[number];
const label: Record<Mode, string> = {system: "Auto", light: "Light", dark: "Dark"};

function read(): Mode {
  try {
    const saved = localStorage.getItem("wada-theme");
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}
function subscribe(onChange: () => void) {
  window.addEventListener("wada-theme", onChange);
  return () => window.removeEventListener("wada-theme", onChange);
}

export default function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as Mode);
  function next() {
    const m = modes[(modes.indexOf(mode) + 1) % modes.length];
    if (m === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", m);
    try {
      if (m === "system") localStorage.removeItem("wada-theme");
      else localStorage.setItem("wada-theme", m);
    } catch {}
    window.dispatchEvent(new Event("wada-theme"));
  }
  return <button type="button" className="theme-toggle" onClick={next} aria-label={`Appearance: ${label[mode]}. Change`} title="Appearance">{label[mode]}</button>;
}
