# 2-turnos-BE - Sistema de Gestión de Turnos (Migración a Express.js)

Segunda iteración del backend para la gestión de turnos y servicios. En este proyecto se migra la arquitectura desde el servidor HTTP nativo de Node hacia el framework **Express.js (v5)**, modularizando el código mediante routers y separando la configuración de la aplicación de la inicialización del servidor.

---

## 📋 Descripción y Nuevas Actualizaciones

En comparación con `1-turnos-BE`, esta versión introduce mejoras significativas en mantenibilidad y arquitectura:

1. **Incorporación de Express.js**: Se reemplaza el módulo nativo `http` por Express, simplificando la gestión de peticiones, respuestas y códigos de estado.
2. **Separación de responsabilidades (`app.js` vs `server.js`)**:
   - `src/app.js`: Instancia la aplicación Express, declara middlewares globales (parseo de JSON con `express.json()`, controlador global de errores para JSONs malformados, y manejador 404 para rutas inexistentes) y monta los routers.
   - `src/server.js`: Punto de entrada (`entry point`) del sistema. Importa `app`, lee la configuración de entorno y levanta la escucha con `app.listen()`.
3. **Enrutamiento Modular (`express.Router`)**:
   - La lógica de las rutas del recurso `services` se desacopla a `src/routes/services.router.js`, montándose bajo el prefijo `/services`.
4. **Almacenamiento**:
   - Continúa utilizando la clase `ServiceManager` con almacenamiento en memoria temporal.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior recomendada)
- **npm** (gestor de paquetes de Node.js)

---

## ⚙️ Variables de Entorno

El proyecto requiere un archivo `.env` en la raíz del directorio `2-turnos-BE` basado en `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

### Detalle de variables:

| Variable | Tipo | Obligatoria | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde escucha el servidor Express | `8080` |
| `NODE_ENV` | String | Sí | Entorno de ejecución (`development` / `production`) | `development` |

---

## 📦 Cómo Instalar

1. Navega hasta el directorio del proyecto:
   ```bash
   cd 2-turnos-BE
   ```

2. Instala las dependencias (incluye `express`, `dotenv`, `nodemon`):
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo** (con reinicio automático al detectar cambios):
  ```bash
  npm run dev
  ```

- **Modo Inicio Estándar**:
  ```bash
  npm start
  ```

El servidor Express iniciará en: `http://localhost:8080` (o el puerto configurado).

---

## 📁 Estructura del Proyecto

```text
2-turnos-BE/
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias y scripts (express, nodemon, dotenv)
├── src/
│   ├── app.js                    # Configuración de Express, middlewares y rutas
│   ├── server.js                 # Inicialización y escucha del servidor HTTP
│   ├── config/
│   │   └── env.config.js         # Validación y exportación de variables de entorno
│   ├── data/
│   │   └── services.json         # Archivo JSON base
│   ├── managers/
│   │   └── ServiceManager.js     # Gestor en memoria de los servicios
│   ├── routes/
│   │   └── services.router.js    # Enrutador Express para /services
│   └── utils/
│       └── http.js               # Utilidades auxiliares
```

---

## 🏷️ Descripción del Recurso `services`

El recurso `services` representa cada prestación o servicio disponible en el sistema de turnos.

### Estructura de un Servicio:

| Propiedad | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | Autogenerado | Identificador único generado por el sistema |
| `name` | `String` | Sí | Nombre comercial del servicio |
| `description` | `String` | Sí | Descripción de lo que ofrece el servicio |
| `duration` | `Number` | Sí | Duración en minutos |
| `price` | `Number` | Sí | Costo monetario del servicio |
| `category` | `String` | Sí | Categoría clasificatoria |
| `available` | `Boolean` | Sí | Si se encuentra habilitado para reserva |

---

## 🔌 Endpoints y Ejemplos de Uso

Todos los endpoints responden en formato JSON y manejan códigos de estado HTTP semánticos.

### 1. Obtener todos los servicios
- **Método**: `GET`
- **Ruta**: `/services`
- **Código de éxito**: `200 OK`

```bash
curl -X GET http://localhost:8080/services
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c",
    "name": "Masaje Descontracturante",
    "description": "Sesión integral de masajes de espalda y cuello",
    "duration": 50,
    "price": 15000,
    "category": "Spa",
    "available": true
  }
]
```

---

### 2. Obtener un servicio por ID
- **Método**: `GET`
- **Ruta**: `/services/:id`
- **Códigos de respuesta**: `200 OK` / `404 Not Found`

```bash
curl -X GET http://localhost:8080/services/c1f7a28e-5cb2-4a0b-9df0-ef6d8e031a7c
```

**Respuesta cuando no existe (404 Not Found):**
```json
{
  "error": "Servicio no encontrado"
}
```

---

### 3. Crear un nuevo servicio
- **Método**: `POST`
- **Ruta**: `/services`
- **Headers**: `Content-Type: application/json`
- **Códigos de respuesta**:
  - `201 Created`: Creado exitosamente.
  - `400 Bad Request`: Si falta alguno de los campos requeridos (`name`, `description`, `duration`, `price`, `category`, `available`).

```bash
curl -X POST http://localhost:8080/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limpieza Facial Profunda",
    "description": "Tratamiento hidratante con punta de diamante",
    "duration": 60,
    "price": 18000,
    "category": "Estética",
    "available": true
  }'
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": "e2d09418-47c3-4d76-bc38-232152a420b9",
  "name": "Limpieza Facial Profunda",
  "description": "Tratamiento hidratante con punta de diamante",
  "duration": 60,
  "price": 18000,
  "category": "Estética",
  "available": true
}
```

---

### 4. Actualizar un servicio
- **Método**: `PUT`
- **Ruta**: `/services/:id`
- **Headers**: `Content-Type: application/json`
- **Códigos de respuesta**:
  - `200 OK`: Actualizado exitosamente.
  - `400 Bad Request`: Intento de cambiar el `id` o si no se envía ningún campo válido.
  - `404 Not Found`: Si el servicio no existe.

```bash
curl -X PUT http://localhost:8080/services/e2d09418-47c3-4d76-bc38-232152a420b9 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 20000,
    "available": false
  }'
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "e2d09418-47c3-4d76-bc38-232152a420b9",
  "name": "Limpieza Facial Profunda",
  "description": "Tratamiento hidratante con punta de diamante",
  "duration": 60,
  "price": 20000,
  "category": "Estética",
  "available": false
}
```

---

### 5. Eliminar un servicio
- **Método**: `DELETE`
- **Ruta**: `/services/:id`
- **Códigos de respuesta**:
  - `200 OK`: Retorna el servicio eliminado.
  - `404 Not Found`: Si el ID no existe.

```bash
curl -X DELETE http://localhost:8080/services/e2d09418-47c3-4d76-bc38-232152a420b9
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "e2d09418-47c3-4d76-bc38-232152a420b9",
  "name": "Limpieza Facial Profunda",
  "description": "Tratamiento hidratante con punta de diamante",
  "duration": 60,
  "price": 20000,
  "category": "Estética",
  "available": false
}
```

