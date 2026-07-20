API de Gestión de Servicios y Reservas

Este proyecto es una API REST construida con **Node.js** y **Express** que permite gestionar un catálogo de servicios médicos/estéticos (crear, listar, filtrar, actualizar y eliminar) y administrar las reservas de los clientes, permitiendo asociar múltiples servicios a una misma cita.

La persistencia de los datos se maneja de forma local a través de archivos **JSON** utilizando el módulo nativo `fs/promises`.

Características
- Gestión completa de Servicios (CRUD) con filtros avanzados por Query Params.
- Gestión de Reservas integrando validaciones cruzadas.
- Sistema de IDs auto-incrementales dinámicos.
- Manejo seguro de errores y respuestas unificadas en formato JSON.

---

**Instalación y Uso Local**

1. Clonar el repositorio:
2.   Instalar dependencias:
Bash
npm install
3. Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto y define el puerto (por defecto usará el 3000 si no se declara)

 **Documentación de Endpoints:**


  **1. Servicios (/api/services)**
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | /api/services | Obtiene todos los servicios (Soporta filtros). |
| GET | /api/services/:id | Obtiene un servicio específico por su ID. |
| POST | /api/services | Crea un nuevo servicio en el catálogo. |
| PUT | /api/services/:id | Modifica un servicio existente sin alterar su ID. |
| DELETE | /api/services/:id | Elimina un servicio del sistema. |
  

  
  **Filtros disponibles (Query Params) en GET /api/services:**
  
  Puedes enviar parámetros en la URL para refinar tus búsquedas:
  Por Nombre: ?name=Limpieza (Busca coincidencias parciales sin importar mayúsculas).
  Por Categoría: ?category=odontologia (Busca por coincidencia de área).
  Por Disponibilidad: ?available=true (Filtra booleanos true o false).
  
**Ejemplo de Body para crear/editar un Servicio (POST / PUT):**

JSON

{
  "name": "Consulta General",
  "description": "Visita de diagnóstico inicial",
  "duration": 60,
  "price": 130000,
  "category": "Cuerpo y Mente",
  "available": true
}

**2. Reservas (/api/bookings)**

| Método | Endpoint   |  Descripción |      
| :---| :--- | :--- |
                 
| GET     |            /api/bookings  |                     Obtiene el listado de todas las reservas históricas. |
| GET    |             /api/bookings/:id |                  Obtiene el detalle de una reserva por su ID. |
| POST  |              /api/bookings      |                 Registra una nueva reserva base. |
| POST |                /api/bookings/:bid/services/:sid |   Añade de forma segura un servicio a una reserva. |

**Ejemplo de Body para registrar una Reserva (POST):**
JSON
{
  "clientName": "Carlos Mendoza",
  "clientEmail": "carlos@example.com",
  "date": "2026-07-25",
  "time": "14:30",
  "status": "pendiente",
  "services": []
}