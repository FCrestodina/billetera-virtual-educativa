# QR de ejemplo

Generá estos QR con cualquier generador online de texto plano (goqr.me, qr.io, etc.).
Copiá el texto de cada bloque exactamente como está y generá un QR de tipo "texto".

---

## 1. Pago simple — Transporte

```
comercio=Transporte
producto=Viaje en colectivo
precio=1200
```

→ Descuenta $1.200 del saldo.

---

## 2. Descuento porcentual (20%) — Librería

```
comercio=Librería Escolar
producto=Cartulina
precio=3000
promo=20
modo=porcentaje
tipo=descuento
```

→ Precio $3.000 con 20% de descuento → paga $2.400.

---

## 3. Descuento por monto fijo — Kiosco

```
comercio=Kiosco Escolar
producto=Combo merienda
precio=5000
promo=1000
modo=monto
tipo=descuento
```

→ Precio $5.000 con $1.000 de descuento → paga $4.000.

---

## 4. Reintegro porcentual (25%) — Feria

```
comercio=Feria Escolar
producto=Merienda saludable
precio=4000
promo=25
modo=porcentaje
tipo=reintegro
```

→ Paga $4.000 y recibe $1.000 de reintegro.

---

## 5. Reintegro por monto fijo — Evento

```
comercio=Evento Escolar
producto=Entrada actividad
precio=8000
promo=1500
modo=monto
tipo=reintegro
```

→ Paga $8.000 y recibe $1.500 de reintegro.

---

## 6. Con tope (2 usos) — Promo especial

```
comercio=Kiosco Escolar
producto=Promo merienda
precio=3000
promo=20
modo=porcentaje
tipo=reintegro
tope=2
```

→ Reintegro 20% usable solo 2 veces por estudiante.
→ En el tercer intento: opción de pagar sin promo o cancelar.

---

## 7. Monto libre con compra mínima — Supermercado

```
comercio=Supermercado Verde
producto=Compra
precio=libre
promo=20
modo=porcentaje
tipo=reintegro
minimo=100000
tope_pesos=25000
```

→ El estudiante escribe el monto al pagar. Con $200.000 el 20% serían $40.000, pero el tope lo corta en $25.000; con $50.000 no llega al mínimo y no hay reintegro.

---

## 8. Llevá 2, pagá 1 — Almacén

```
comercio=Almacén
producto=Gaseosa
precio=3000
tipo=nxm
lleva=2
paga=1
```

→ El estudiante elige la cantidad: con 2 paga $3.000; con 1 la promo no se aplica. Para "50% en la 2.ª unidad": `tipo=segunda` y `promo=50`.

---

## 9. Reintegro que acredita la docente, solo los viernes

```
comercio=Mercado Azul
producto=Compra
precio=libre
promo=15
modo=porcentaje
tipo=reintegro
acreditacion=pendiente
plazo=3
dias=V
```

→ El estudiante elige qué día compra; un martes la promo no se aplica. El reintegro queda en «A acreditar» hasta que la docente lo acredita desde el panel. `plazo` solo define la fecha que se muestra.

Otros campos: `promocion` (nombre compartido para el tope en pesos), `modalidad`, `vigencia`, `condiciones` (se muestran, no se controlan). Los QR del Caso 1, 2 y 3 están listos en `/casos`.

---

## Tips para imprimir

- Tamaño mínimo recomendado: **5x5 cm** por QR.
- Incluí debajo del QR el nombre del comercio y el precio para que los chicos puedan anticipar.
- Plastificalos si vas a reutilizarlos en varias clases.
