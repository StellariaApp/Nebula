import type { IconComponent } from "./types.js";

const REGISTRY: Map<string, IconComponent> = new Map();

export function RegisterIcons(icons: Record<string, IconComponent>): void {
  for (const name of Object.keys(icons)) {
    const comp = icons[name];
    if (comp !== undefined) REGISTRY.set(name, comp);
  }
}

export function ResolveIcon(name: string): IconComponent | undefined {
  return REGISTRY.get(name);
}

export function HasIcon(name: string): boolean {
  return REGISTRY.has(name);
}

export function RegisteredIconNames(): string[] {
  return [...REGISTRY.keys()];
}

export function ClearIcons(): void {
  REGISTRY.clear();
}
