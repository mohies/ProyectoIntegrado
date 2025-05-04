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

---

## 📝 Notas

- Asegúrate de tener **Python 3.x**, **Node.js** y **Angular CLI** instalados en tu sistema.
- Podemos ejecutar el frontend y el backend en terminales distintas al mismo tiempo.
- Usamos `http://localhost:8000` para acceder al backend y `http://localhost:4200` para el frontend.
- El archivo `.env` es esencial para la configuración de autenticación y envío de correos. No lo tenemos que subir a GitHub.

---
