import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

import { BRAND, OG_SIZE, SITE_NAME } from "../lib/site";

export interface OgCard {
  /** El rótulo pequeño de arriba: la sección o la familia. */
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  /** Las etiquetas de abajo: subpath, frontera RSC, presupuesto. */
  tags?: readonly string[] | undefined;
}

/**
 * La tarjeta social se pinta con Satori, que no es un navegador: solo flexbox, sin variables CSS y
 * sin las hojas del catálogo. Por eso los colores vienen del eje de marca a mano y no del tema.
 */
export function OgImage({ eyebrow, title, description, tags }: OgCard): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: BRAND.paper,
          backgroundImage: `radial-gradient(1000px 500px at 15% -10%, ${BRAND.from}66, transparent 60%), radial-gradient(900px 450px at 95% 10%, ${BRAND.to}55, transparent 55%)`,
          color: BRAND.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${BRAND.from}, ${BRAND.to})`,
              }}
            />
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600 }}>{SITE_NAME}</div>
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
