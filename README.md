# PlateVault by Wark Corp

PlateVault es una plataforma moderna para la consulta de información técnica de vehículos españoles basada en su matrícula.

## Requisitos Previos

- **Node.js**: v18 o superior.
- **PostgreSQL**: Una instancia de base de datos activa.

## Despliegue Local

Sigue estos pasos para ejecutar el proyecto en tu máquina:

1. **Configurar el entorno**:
   Copia el archivo de ejemplo y configura tu `DATABASE_URL` y `AUTH_SECRET`.
   ```bash
   cp .env.example .env
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Sincronizar la base de datos**:
   ```bash
   npx prisma db push
   ```

4. **Poblar datos de prueba (Seed)**:
   ```bash
   npm run seed
   ```
   *Nota: Esto cargará la matrícula de prueba `1234XYZ`.*

5. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Credenciales de Prueba (Seed)

- **Matrícula**: `1234XYZ` (SEAT León ECO).
- **Admin**: Debes registrarte y cambiar tu rol manualmente en la base de datos o mediante el panel si ya tienes privilegios.

## Estructura del Proyecto

- `src/actions`: Lógica de API (Matrículas, Autenticación, Admin).
- `src/components`: UI Premium y componentes de React.
- `src/lib`: Utilidades de DB, Auditoría y Rate Limiting.
- `prisma/schema.prisma`: Definición del modelo de datos.
