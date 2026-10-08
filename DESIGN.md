# DESIGN.md — billetera-virtual-educativa

Todavía no hay un sistema de diseño escrito para este repo: por ahora solo las reglas de uso y la deuda medida. **Tokens:** solo `--background` y `--foreground` (`src/app/globals.css:6-16`); no hay paleta de marca.

## Reglas de UI (nota `buenas-practicas-ui` del vault)

> Agregado el 2026-10-08. Es criterio de uso, vale para cualquier look: el look sale de los tokens de arriba (y del DESIGN.md que se escriba). Lo que el repo rompe hoy está abajo, en "Deuda medida": no se suma deuda nueva de ese tipo y, al tocar una de esas pantallas, se corrige ahí mismo.

- **Un solo botón Primary por vista**; el resto Secondary (contorno), Ghost o Link. Repetir el *mismo* CTA en el hero y en el cierre de una landing larga no cuenta: es una sola acción.
- **Nunca `outline: none` sin foco visible de reemplazo** (anillo u outline en `:focus-visible`). Cambiar solo el color del borde no alcanza.
- **El estado nunca solo por color**: texto o ícono al lado.
- **Tablas sin sombra.**
- **Colores por token del tema**, nunca hex ni clases primitivas (`bg-red-500`) en un componente.
- Contraste AA (4.5:1 texto normal, 3:1 grande) y touch target de 44×44px en mobile.

### Deuda medida (2026-10-08)

- **Clases primitivas como único sistema de color:** ~288 usos en 15 archivos (ej. `src/app/page.tsx:23` `bg-blue-600`, `:36` `bg-green-500`, `src/app/docente/[code]/page.tsx:556` `bg-red-600`). Antes de migrar hace falta definir tokens.
- **Varios Primary por vista:** home `src/app/page.tsx:23,36` (dos tarjetas-botón rellenas); `src/app/docente/[code]/page.tsx:376` ("Generar QR de productos") junto con `:410` ("Acreditar", uno por grupo pendiente).
- Sin deuda en: foco (los `outline-none` traen `focus:ring-2`), sombra en tablas. Estado solo por color: no revisado componente por componente.
- Este código vive también en `didakt/app/billetera-virtual/`: lo que se arregle acá se replica allá.
