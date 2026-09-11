# Billetera Virtual Educativa

Simulador educativo de billetera virtual / dinero digital para 6° y 7° grado — **Buenos Aires Aprende**.

> Esta es una simulación. No es dinero real. No se almacenan datos personales.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Railway PostgreSQL** + Drizzle ORM
- **@zxing/browser** — lectura de QR desde cámara
- **Framer Motion** + Lucide React

## Correr localmente

### 1. Prerrequisitos

- Node.js 18+
- PostgreSQL local o una base de datos Railway

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/billetera_educativa
TEACHER_PIN=ba2026
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear tablas en la base de datos

```bash
npm run db:push
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

Los tests de rutas mockean la base, así que no ven errores de SQL. Para eso está la
prueba de punta a punta, que corre contra el server local y una base Postgres real:

```bash
npm run dev    # en otra terminal
npm run e2e
```

Solo corre contra `localhost` (se niega con cualquier otra dirección, así que no puede
escribir en producción). No toca aulas ni estudiantes existentes: crea su propia aula
de prueba y la cierra al terminar. Opcionales: `BASE`, `PIN`, `PREFIJO`.

## Desplegar en Railway

1. Crear un proyecto en [Railway](https://railway.app).
2. Agregar un servicio **PostgreSQL** y conectarlo a tu proyecto.
3. Agregar un servicio **GitHub** apuntando a este repo.
4. Configurar las variables de entorno en Railway:
   - `DATABASE_URL` → Railway lo autocompleta si usás el plugin Postgres interno.
   - `TEACHER_PIN` → el PIN que vas a dar a las docentes.
5. Railway detecta automáticamente el proyecto Next.js y lo despliega.
6. Antes del primer deploy, con la base **vacía**, creá las tablas:
   ```bash
   DATABASE_URL=tu_url npm run db:push
   ```

> ⚠️ **Con datos cargados, no uses `db:push` contra producción.** Contra el Postgres 18
> de Railway, `drizzle-kit` propuso por error **vaciar la tabla de estudiantes**
> (`truncate`) para agregar una restricción que ya existía. Para sumar columnas: hacé un
> backup (`\copy tabla to 'tabla.csv' csv header` por tabla), probá el cambio con
> `db:push` en una base local, y en producción aplicá solo los `ALTER TABLE … ADD COLUMN`
> a mano, en una transacción.

## QR de ejemplo

Ver [`qr-ejemplos/README.md`](./qr-ejemplos/README.md) para los textos de cada tipo de operación listos para generar QR.

## Flujo de uso

### Docente
1. Ir a `/docente` → ingresar PIN → crear aula con código y crédito inicial.
2. El código del aula se muestra grande para proyectar o dictar.
3. El panel docente muestra en tiempo real los estudiantes conectados y sus saldos.

### Estudiante
1. Ir a `/estudiante` → ingresar código de aula + apodo + avatar.
2. Accede a la billetera con el saldo inicial.
3. Toca "Pagar con QR" → escanea → confirma la operación.
4. El historial registra todos los movimientos.

## Tipos de operación QR

| Tipo | Descripción |
|------|-------------|
| Normal | Descuenta el precio del saldo |
| Descuento % | Aplica porcentaje de descuento al precio |
| Descuento monto | Descuenta un monto fijo del precio |
| Reintegro % | Cobra el precio y devuelve un porcentaje |
| Reintegro monto | Cobra el precio y devuelve un monto fijo |

Todos los tipos admiten `tope=N` para limitar usos por estudiante.
