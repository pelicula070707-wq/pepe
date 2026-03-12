require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Configurar transporter de Nodemailer
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Función para generar el HTML del correo de confirmación
function generarCorreoCliente(datos) {
  const { nombre, email, telefono, servicio, fecha, hora, comentarios } = datos;

  const serviciosMap = {
    corte: 'Corte de Cabello',
    corte_barba: 'Corte + Barba',
    barba: 'Arreglo de Barba',
    afeitado: 'Afeitado Clásico',
    coloracion: 'Coloración',
    tratamiento: 'Tratamiento Capilar',
    combo_completo: 'Combo Completo'
  };

  const servicioNombre = serviciosMap[servicio] || servicio;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - Barber & Co.</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111111;border-top:3px solid #c9a84c;padding:40px 30px 30px;">
              <p style="margin:0;color:#c9a84c;letter-spacing:8px;font-size:11px;text-transform:uppercase;font-family:Arial,sans-serif;">Est. 2018</p>
              <h1 style="margin:10px 0 5px;color:#f5f0e8;font-size:36px;letter-spacing:4px;font-family:Georgia,serif;">BARBER & CO.</h1>
              <p style="margin:0;color:#888;letter-spacing:3px;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">The Art of Grooming</p>
              <div style="width:60px;height:1px;background:#c9a84c;margin:20px auto 0;"></div>
            </td>
          </tr>

          <!-- Mensaje principal -->
          <tr>
            <td style="background-color:#161616;padding:40px 40px 20px;">
              <h2 style="color:#c9a84c;font-size:14px;letter-spacing:5px;text-transform:uppercase;margin:0 0 20px;font-family:Arial,sans-serif;">Reserva Confirmada</h2>
              <p style="color:#d4c9b0;font-size:16px;line-height:1.8;margin:0 0 15px;">
                Estimado/a <strong style="color:#f5f0e8;">${nombre}</strong>,
              </p>
              <p style="color:#999;font-size:14px;line-height:1.8;margin:0 0 30px;">
                Tu reserva ha sido confirmada exitosamente. Te esperamos con todo nuestro equipo listo para brindarte la mejor experiencia de cuidado personal.
              </p>
            </td>
          </tr>

          <!-- Detalles de la reserva -->
          <tr>
            <td style="background-color:#161616;padding:0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-top:2px solid #c9a84c;">
                <tr>
                  <td style="padding:20px 25px;border-bottom:1px solid #2a2a2a;">
                    <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Servicio</p>
                    <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${servicioNombre}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 25px;border-bottom:1px solid #2a2a2a;">
                    <table width="100%">
                      <tr>
                        <td width="50%">
                          <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Fecha</p>
                          <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${fecha}</p>
                        </td>
                        <td width="50%">
                          <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Hora</p>
                          <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${hora}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 25px;border-bottom:1px solid #2a2a2a;">
                    <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Teléfono de Contacto</p>
                    <p style="margin:5px 0 0;color:#f5f0e8;font-size:16px;">${telefono}</p>
                  </td>
                </tr>
                ${comentarios ? `
                <tr>
                  <td style="padding:20px 25px;">
                    <p style="margin:0;color:#666;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Comentarios</p>
                    <p style="margin:5px 0 0;color:#d4c9b0;font-size:14px;line-height:1.6;">${comentarios}</p>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Aviso -->
          <tr>
            <td style="background-color:#0f0f0f;padding:25px 40px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;color:#666;font-size:12px;line-height:1.7;text-align:center;">
                ¿Necesitas cancelar o modificar tu reserva? Contáctanos al menos <strong style="color:#c9a84c;">24 horas antes</strong>.<br>
                📞 +56 9 1234 5678 &nbsp;|&nbsp; 📧 ${process.env.SMTP_USER || 'contacto@barberandco.cl'}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#0a0a0a;padding:25px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;color:#444;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">
                Barber & Co. · Santiago, Chile
              </p>
              <p style="margin:8px 0 0;color:#333;font-size:10px;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Función para generar el correo interno (notificación al barbero)
function generarCorreoInterno(datos) {
  const { nombre, email, telefono, servicio, fecha, hora, comentarios } = datos;
  return `
    <h2>🔔 Nueva Reserva Recibida</h2>
    <p><strong>Cliente:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${telefono}</p>
    <p><strong>Servicio:</strong> ${servicio}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Hora:</strong> ${hora}</p>
    <p><strong>Comentarios:</strong> ${comentarios || 'Ninguno'}</p>
  `;
}

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para procesar reservas
app.post('/api/reservar', async (req, res) => {
  const { nombre, email, telefono, servicio, fecha, hora, comentarios } = req.body;

  // Validación básica
  if (!nombre || !email || !telefono || !servicio || !fecha || !hora) {
    return res.status(400).json({
      success: false,
      message: 'Por favor completa todos los campos obligatorios.'
    });
  }

  // Validar formato email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'El formato del correo electrónico no es válido.'
    });
  }

  // Si no hay credenciales SMTP configuradas, simular éxito
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  SMTP no configurado. Simulando envío de correo...');
    console.log('📋 Datos de reserva:', { nombre, email, telefono, servicio, fecha, hora, comentarios });
    return res.json({
      success: true,
      message: `¡Reserva registrada, ${nombre}! (Modo demo: correo simulado)`
    });
  }

  try {
    const transporter = createTransporter();

    // Verificar conexión SMTP
    await transporter.verify();

    // Enviar correo al cliente
    await transporter.sendMail({
      from: `"Barber & Co." <${process.env.SMTP_USER}>`,
      to: email,
      subject: `✅ Reserva Confirmada — ${fecha} a las ${hora} | Barber & Co.`,
      html: generarCorreoCliente({ nombre, email, telefono, servicio, fecha, hora, comentarios })
    });

    // Enviar notificación interna
    await transporter.sendMail({
      from: `"Sistema de Reservas" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `🔔 Nueva Reserva: ${nombre} — ${fecha} ${hora}`,
      html: generarCorreoInterno({ nombre, email, telefono, servicio, fecha, hora, comentarios })
    });

    console.log(`✅ Reserva confirmada para ${nombre} (${email}) — ${fecha} ${hora}`);

    res.json({
      success: true,
      message: `¡Reserva confirmada, ${nombre}! Te hemos enviado un correo de confirmación a ${email}.`
    });

  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
    res.status(500).json({
      success: false,
      message: 'Tu reserva fue registrada, pero hubo un problema al enviar el correo de confirmación. Por favor contáctanos directamente.'
    });
  }
});

// Health check para Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════╗');
  console.log('  ║       BARBER & CO. — SERVER       ║');
  console.log('  ╚═══════════════════════════════════╝');
  console.log(`  🚀 Servidor activo en http://localhost:${PORT}`);
  console.log(`  📧 SMTP: ${process.env.SMTP_USER ? '✅ Configurado' : '⚠️  No configurado (modo demo)'}`);
  console.log('');
});
