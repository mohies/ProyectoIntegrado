# 🎉 Eventia – Plataforma de Gestión de Eventos

## 📌 Descripción  
**Eventia** es una aplicación fullstack que nos permite gestionar eventos de forma sencilla y eficiente. Podemos crear, visualizar y administrar eventos mediante una interfaz intuitiva.  
El proyecto está construido con **Django** en el backend y **Angular** en el frontend.

---

## 🛠️ Tecnologías Utilizadas  
- **Backend:** Django  
- **Frontend:** Angular  
- **Base de Datos:** SQLite  
- **Estilos:** Bootstrap + CSS

---

## ⚙️ Instalación y Configuración

### 🔧 Backend – Django

Seguimos estos pasos para configurar y ejecutar el backend del proyecto:

1. Entramos al directorio del backend:  
   `cd Back`

2. Creamos un entorno virtual:  
   `python -m venv myvenv`

3. Activamos el entorno virtual:

   - En **Windows**:  
     `Set-ExecutionPolicy RemoteSigned`  
     `.\myvenv\Scripts\activate`

   - En **Linux/macOS**:  
     `source myvenv/bin/activate`

4. Creamos un archivo `.env` basado en la plantilla proporcionada:  
   Copiamos el archivo `.env.plantilla` y lo renombramos a `.env`:  
   `cp .env.plantilla .env`

   Luego, rellenamos las siguientes variables con nuestros datos, los cuales son necesarios para iniciar sesión con Google y recibir mensajes de contacto:
    - Tutorial para crear credenciales de Google:  
    [Tutorial de Google](https://www.youtube.com/watch?v=TjMhPr59qn4&pp=ygUadHV0b3JpYWwgZ29vZ2xlIGNsaWVudGUgaWQ%3D)
    
    - Tutorial para generar contraseñas de aplicación:  
    [Generación de contraseñas de aplicación](https://support.google.com/accounts/answer/185833?hl=es)
    
   - `GOOGLE_CLIENT_ID`: ID de cliente para autenticación con Google.  
   - `GOOGLE_CLIENT_SECRET`: Secreto del cliente de Google.  
   - `EMAIL_HOST_USER`: Dirección de correo desde la cual se enviarán emails (por ejemplo, notificaciones).  
   - `EMAIL_HOST_PASSWORD`: Contraseña o token de la cuenta de correo configurada.

5. Actualizamos pip e instalamos las dependencias:  
   `python -m pip install --upgrade pip`  
   `pip install -r requirements.txt`

6. Aplicamos las migraciones de base de datos:  
   `python manage.py makemigrations`  
   `python manage.py migrate`

7. Cargamos los datos iniciales:  
   `python manage.py loaddata data.json`

8. Ejecutamos el servidor de desarrollo en localhost:  
   `python manage.py runserver localhost:8000`

---

### 💻 Frontend – Angular

Para poner en marcha el frontend:

1. Abrimos una nueva terminal y entramos en la carpeta del frontend:  
   `cd Front`

2. Instalamos las dependencias del proyecto:  
   `npm install`

3. Instalamos Bootstrap y Popper.js:  
   `npm install bootstrap @popperjs/core`

4. Iniciamos el servidor de Angular:  
   `ng serve`  
   Veremos una notificación en la terminal donde podemos aceptar (y) o rechazar (n).

### Ejecución de tests en Angular

Para poder ejecutar los tests del frontend, primero instalamos las dependencias necesarias:

```bash
npm install --save-dev karma karma-chrome-launcher karma-jasmine jasmine-core karma-jasmine-html-reporter @angular-devkit/build-angular --legacy-peer-deps
```

Luego, podemos lanzar los tests con:

```bash
ng test
```

---

## 📝 Notas

- Asegúrate de tener **Python 3.x**, **Node.js** y **Angular CLI** instalados en tu sistema.
- Podemos ejecutar el frontend y el backend en terminales distintas al mismo tiempo.
- Usamos `http://localhost:8000` para acceder al backend y `http://localhost:4200` para el frontend.
- El archivo `.env` es esencial para la configuración de autenticación y envío de correos. No lo tenemos que subir a GitHub.

---



## 🚢 Despliegue en Docker y Producción

Podemos desplegar Eventia fácilmente usando Docker, lo que nos permite ejecutar tanto el backend como el frontend de forma sencilla y segura en cualquier entorno.

### 1. Requisitos Previos

- Tener instalado [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).
- Configurar correctamente el archivo `.env` en la carpeta `Back` antes de construir los contenedores.

### 2. Estructura de Archivos

Debemos asegurarnos de tener la siguiente estructura mínima:

```
ProyectoIntegrado/
│
├── Back/           # Backend Django
│   ├── .env        # Variables de entorno (no subir a GitHub)
│   └── ...
├── Front/          # Frontend Angular
│   └── ...
├── docker-compose.yml
├── nginx.conf      # Configuración de Nginx para servir Angular
└── ...
```

### 3. Construcción y Ejecución

Desde la raíz del proyecto, ejecutamos:

```bash
docker compose up --build
```

Esto hará lo siguiente:
- Construirá la imagen del backend (Django) y aplicará migraciones automáticamente.
- Construirá la imagen del frontend (Angular) y lo servirá con Nginx.
- Levantará ambos servicios en una red interna.

### 4. Acceso a la Aplicación

- **Frontend Angular:** [http://localhost:4200](http://localhost:4200)
- **Backend Django:** [http://localhost:8000](http://localhost:8000)

### 5. Notas de Producción

- El frontend se sirve con Nginx para mayor rendimiento.
- El backend ejecuta migraciones y recolecta archivos estáticos automáticamente.
- Los archivos sensibles como `.env` **no debemos subirlos a GitHub**.
- Podemos cargar datos iniciales manualmente si lo necesitamos:
  ```bash
  docker compose exec backend python manage.py loaddata data.json
  ```
- Para detener los servicios:
  ```bash
  docker compose down
  ```

### 6. Variables de Entorno

Debemos rellenar correctamente el archivo `.env` en `Back/` antes de construir los contenedores, ya que contiene las credenciales necesarias para autenticación y envío de correos.

---


### 🐳 ¿Cómo funcionan los Dockerfile y el docker-compose?

#### Frontend (Angular + Nginx)

- **Construcción:**  
  Usamos una imagen oficial de Node.js (`node:20-alpine`) para compilar la aplicación Angular.  
  1. Copiamos todo el código fuente al contenedor.
  2. Instalamos Angular CLI y las dependencias del proyecto.
  3. Construimos la aplicación Angular en modo desarrollo (puedes cambiar a producción si lo prefieres).
  4. Mostramos el resultado del build para depuración.

- **Despliegue:**  
  Después de compilar, usamos una imagen ligera de Nginx para servir los archivos estáticos generados por Angular.  
  1. Copiamos la carpeta generada (`/app/dist/front-app/browser`) al directorio de Nginx.
  2. Copiamos nuestro archivo de configuración `nginx.conf` para personalizar el servidor.
  3. Exponemos el puerto 80 para acceder a la aplicación desde el navegador.

#### Backend (Django)

- **Construcción:**  
  Usamos una imagen oficial de Python (`python:3.12`).  
  1. Copiamos todo el código fuente del backend al contenedor.
  2. Instalamos las dependencias de Python usando `requirements.txt`.
  3. Ejecutamos las migraciones de la base de datos para preparar el entorno.
  4. Recolectamos los archivos estáticos de Django.
  5. Copiamos un script de entrada (`entrypoint.sh`) y le damos permisos de ejecución.
  6. Exponemos el puerto 8000 para acceder a la API.

- **Ejecución:**  
  El contenedor arranca ejecutando el script `entrypoint.sh`, que normalmente lanza el servidor de Django.

#### Orquestación con docker-compose

- El archivo `docker-compose.yml` define ambos servicios:
  - **backend:** Construye la imagen de Django, expone el puerto 8000 y monta los volúmenes necesarios para la base de datos y los archivos estáticos.
  - **frontend:** Construye la imagen de Angular/Nginx y expone el puerto 4200.
- Ambos servicios están en la misma red interna (`redapp`) para que puedan comunicarse.
- Podemos levantar todo el entorno con un solo comando:  
  ```bash
  docker compose up --build
  ```

Con estos pasos, tendremos Eventia funcionando en producción de forma sencilla y segura usando Docker.