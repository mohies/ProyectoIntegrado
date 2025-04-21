# 🎉 Eventia – Plataforma de Gestión de Eventos

## 📌 Descripción  
**Eventia** es una aplicación fullstack que permite gestionar eventos de forma sencilla y eficiente. Los usuarios pueden crear, visualizar y administrar eventos mediante una interfaz intuitiva.  
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

Sigue estos pasos para configurar y ejecutar el backend del proyecto:

1. Entra al directorio del backend:  
   `cd Back`

2. Crea un entorno virtual:  
   `python -m venv myvenv`

3. Activa el entorno virtual:

   - En **Windows**:  
     `Set-ExecutionPolicy RemoteSigned`  
     `.\myvenv\Scripts\activate`

   - En **Linux/macOS**:  
     `source myvenv/bin/activate`

4. Crea un archivo `.env` basado en la plantilla proporcionada:  
   Copia el archivo `.env.plantilla` y renómbralo a `.env`:  
   `cp .env.plantilla .env`

   Luego, rellena las siguientes variables con tus datos que son los datos para poder iniciar sesion con google y poder recibiar mensajes de contacto:
    Tutorial para crear credenciales de google:
    https://www.youtube.com/watch?v=TjMhPr59qn4&pp=ygUadHV0b3JpYWwgZ29vZ2xlIGNsaWVudGUgaWQ%3D
    Tutorial para generar contraseñas de aplicacion:
    https://support.google.com/accounts/answer/185833?hl=es
   - `GOOGLE_CLIENT_ID`: ID de cliente para autenticación con Google.
   - `GOOGLE_CLIENT_SECRET`: Secreto del cliente de Google.
   - `EMAIL_HOST_USER`: Dirección de correo desde la cual se enviarán emails (por ejemplo, notificaciones).
   - `EMAIL_HOST_PASSWORD`: Contraseña o token de la cuenta de correo configurada.

5. Actualiza pip e instala las dependencias:  
   `python -m pip install --upgrade pip`  
   `pip install -r requirements.txt`

6. Aplica las migraciones de base de datos:  
   `python manage.py makemigrations`  
   `python manage.py migrate`

7. Carga los datos iniciales:  
   `python manage.py loaddata data.json`

8. Ejecuta el servidor de desarrollo en localhost:  
   `python manage.py runserver localhost:8000`

---

### 💻 Frontend – Angular

Para poner en marcha el frontend:

1. Abre una nueva terminal y entra en la carpeta del frontend:  
   `cd Front`

2. Instala las dependencias del proyecto:  
   `npm install`

3. Instala Bootstrap y Popper.js:  
   `npm install bootstrap @popperjs/core`

4. Inicia el servidor de Angular:  
   `ng serve`
   ![alt text](<Captura de pantalla 2025-04-21 222104.png>)

   Nos saldra esta notificacion le podemos dar que si (y) como no (n)

---

## 📝 Notas

- Asegúrate de tener **Python 3.x**, **Node.js** y **Angular CLI** instalados en tu sistema.
- Puedes ejecutar el frontend y el backend en terminales distintas al mismo tiempo.
- Usa `http://localhost:8000` para acceder al backend y `http://localhost:4200` para el frontend.
- El archivo `.env` es esencial para la configuración de autenticación y envío de correos. Nunca lo subas a GitHub.
