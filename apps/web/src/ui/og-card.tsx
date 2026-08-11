import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

import { BRAND, OG_SIZE } from "../lib/site";

export interface OgCard {
  /** El rótulo pequeño de arriba: la sección o la familia. */
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  /** Las etiquetas de abajo: subpath, frontera RSC, presupuesto. */
  tags?: readonly string[] | undefined;
}

const GOLDEN = 0.618033988749895;
const SILVER = 0.7548776662466927;

const GRID = 56;

/** El wordmark real, a la altura que cabe en el pie de la tarjeta. Su SVG mide 400×85. */
const LOGO = { height: 38, width: Math.round((400 / 85) * 38) } as const;
const STARS = 26;
const ACCENT_EVERY = 5;

function Fract(value: number): number {
  return value - Math.floor(value);
}

let logo: Promise<string> | null = null;

/**
 * Satori no carga archivos ni resuelve rutas del sitio: la única forma de meter el logotipo es
 * incrustado. Se lee una vez por proceso.
 */
function Logo(): Promise<string> {
  logo ??= readFile(join(process.cwd(), "public", "logo.svg"))
    .then((file) => `data:image/svg+xml;base64,${file.toString("base64")}`)
    .catch(() => "");
  return logo;
}

/**
 * El mismo reparto que `StarField` —oro y plata sobre un `seed`—, reescrito aquí porque la tarjeta la
 * pinta Satori: no hay JS, ni canvas, ni las hojas del catálogo. Es una reproducción del campo, no el
 * componente.
 */
function Field(seed: number): { left: number; top: number; size: number; accent: boolean }[] {
  const offset = Fract(seed * GOLDEN);
  const stars = [];

  for (let index = 0; index < STARS; index += 1) {
    stars.push({
      left: Fract(offset + (index + 1) * GOLDEN) * 98,
      top: Fract(offset + (index + 1) * SILVER) * 96,
      size: index % 4 === 0 ? 4 : 2,
      accent: index % ACCENT_EVERY === 0,
    });
  }

  return stars;
}

export async function OgImage({
  eyebrow,
  title,
  description,
  tags,
}: OgCard): Promise<ImageResponse> {
  const mark = await Logo();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: BRAND.paper,
          color: BRAND.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            display: "flex",
            backgroundImage: `linear-gradient(to right, ${BRAND.ink}14 1px, transparent 1px), linear-gradient(to bottom, ${BRAND.ink}14 1px, transparent 1px)`,
            backgroundSize: `${String(GRID)}px ${String(GRID)}px`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            display: "flex",
            backgroundImage: `radial-gradient(760px 380px at 12% -8%, ${BRAND.from}59, transparent 62%), radial-gradient(680px 340px at 92% 8%, ${BRAND.to}4D, transparent 58%)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            display: "flex",
          }}
        >
          {Field(1).map((star) => (
            <div
              key={`${String(star.left)}-${String(star.top)}`}
              style={{
                position: "absolute",
                left: (star.left / 100) * OG_SIZE.width,
                top: (star.top / 100) * OG_SIZE.height,
                width: star.size,
                height: star.size,
                borderRadius: star.size,
                background: star.accent ? BRAND.to : BRAND.ink,
                opacity: star.accent ? 1 : 0.72,
                boxShadow: `0 0 14px ${star.accent ? BRAND.to : BRAND.ink}80`,
              }}
            />
          ))}
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 18 }}>
          {eyebrow === undefined ? null : (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 18px",
                borderRadius: 999,
                border: `1px solid ${BRAND.ink}33`,
                background: `${BRAND.ink}14`,
                fontSize: 26,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 86, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          {description === undefined ? null : (
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.35,
                color: `${BRAND.ink}B3`,
                maxWidth: 900,
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {mark === "" ? null : (
              <img src={mark} alt="Nebula" width={LOGO.width} height={LOGO.height} />
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {(tags ?? []).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: `1px solid ${BRAND.ink}26`,
                  background: `${BRAND.paper}99`,
                  fontSize: 24,
                  color: `${BRAND.ink}CC`,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ) as ReactElement,
    { ...OG_SIZE },
  );
}
