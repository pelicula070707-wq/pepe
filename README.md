# ✂️ Barber & Co. — Sistema de Reservas

Página web completa para peluquería/barbería con sistema de reservas online y envío automático de correos de confirmación.

## 🚀 Inicio Rápido

```bash
# 1. Clona o descarga el proyecto
cd peluqueria-reservas

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Edita .env con tus credenciales SMTP

# 4. Inicia el servidor
npm start

# 5. Abre en el navegador
# http://localhost:3000
```

> **Modo Demo:** Si no configuras el SMTP, el servidor funciona igualmente y simula el envío de correos (los datos se muestran en la consola).

---

## ⚙️ Configuración del Correo

### Opción A — Gmail (recomendado)

1. Ve a [Configuración de seguridad de Google](https://myaccount.google.com/security)
2. Activa la **verificación en dos pasos**
3. Ve a [Contraseñas de aplicación](https://myaccount.google.com/apppasswords)
4. Crea una nueva contraseña para "Correo" > "Otro dispositivo"
5. Copia la contraseña generada (16 caracteres)

Luego en tu `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=abcd efgh ijkl mnop   ← la contraseña de aplicación
```

### Opción B — Mailtrap (para pruebas)

1. Crea cuenta en [mailtrap.io](https://mailtrap.io) (gratis)
2. Ve a "Email Testing" > "Inboxes" > clic en tu inbox
3. Copia las credenciales SMTP

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario_mailtrap
SMTP_PASS=tu_contraseña_mailtrap
```

---

## ☁️ Despliegue en Render

### Pasos:

1. **Sube el proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/peluqueria-reservas.git
   git push -u origin main
   ```

2. **Crea el servicio en Render**
   - Ve a [render.com](https://render.com) y regístrate
   - Clic en **"New +"** > **"Web Service"**
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Name:** `peluqueria-reservas`
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

3. **Agrega las variables de entorno**
   - En Render, ve a "Environment" de tu servicio
   - Agrega cada variable de `.env.example` con sus valores reales
   - **No agregues `PORT`** — Render lo asigna automáticamente

4. **¡Despliega!**
   - Clic en "Create Web Service"
   - Render instalará dependencias y arrancará el servidor
   - Tu URL quedará como: `https://peluqueria-reservas.onrender.com`

> **Nota:** En el plan gratuito de Render, el servidor "duerme" tras 15 minutos de inactividad. La primera visita puede tardar ~30 segundos en despertar.

---

## 📁 Estructura del Proyecto

```
peluqueria-reservas/
│
├── package.json          ← Dependencias y scripts
├── server.js             ← Servidor Express + Nodemailer
├── .env.example          ← Plantilla de variables de entorno
├── .gitignore
├── README.md
│
├── public/
│   └── index.html        ← Página principal
│
├── css/
│   └── style.css         ← Estilos (tema oscuro/dorado)
│
└── js/
    └── main.js           ← Lógica del formulario
```

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Página principal |
| `POST` | `/api/reservar` | Procesar reserva |
| `GET` | `/health` | Health check |

### POST /api/reservar

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "+56 9 1234 5678",
  "servicio": "corte_barba",
  "fecha": "2024-12-25",
  "hora": "11:00",
  "comentarios": "Prefiero corte tijera"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "¡Reserva confirmada, Juan! Te hemos enviado un correo..."
}
```

---

## 🛠️ Tecnologías

- **Backend:** Node.js + Express
- **Email:** Nodemailer
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla
- **Deploy:** Render

---

*Barber & Co. — The Art of Grooming*
