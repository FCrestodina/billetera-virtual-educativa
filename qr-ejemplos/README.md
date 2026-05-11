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

## Tips para imprimir

- Tamaño mínimo recomendado: **5x5 cm** por QR.
- Incluí debajo del QR el nombre del comercio y el precio para que los chicos puedan anticipar.
- Plastificalos si vas a reutilizarlos en varias clases.
