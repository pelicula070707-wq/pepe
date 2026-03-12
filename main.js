/* ============================================
   BARBER & CO. — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ──────────────────────
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll reveal ──────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Set min date for date input (today) ────
  const dateInput = document.getElementById('fecha');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // ── Booking form submission ────────────────
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageEl = document.getElementById('form-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Gather data
      const formData = {
        nombre:       form.nombre.value.trim(),
        email:        form.email.value.trim(),
        telefono:     form.telefono.value.trim(),
        servicio:     form.servicio.value,
        fecha:        formatDate(form.fecha.value),
        hora:         form.hora.value,
        comentarios:  form.comentarios.value.trim(),
      };

      // Basic client-side validation
      if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.fecha || !formData.hora) {
        showMessage('Por favor completa todos los campos obligatorios.', 'error');
        return;
      }

      // Disable button, show loading state
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Procesando...';
      hideMessage();

      try {
        const response = await fetch('/api/reservar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          showMessage('✓ ' + data.message, 'success');
          form.reset();
          // Scroll to message
          messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          showMessage(data.message || 'Ocurrió un error. Intenta nuevamente.', 'error');
        }

      } catch (err) {
        console.error(err);
        showMessage('Error de conexión. Verifica tu internet e intenta nuevamente.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Confirmar Reserva';
      }
    });
  }

  // ── Helpers ────────────────────────────────
  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = type; // 'success' or 'error'
  }

  function hideMessage() {
    messageEl.className = '';
    messageEl.textContent = '';
    messageEl.style.display = 'none';
    void messageEl.offsetHeight;
    messageEl.style.display = '';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  }

  // ── Animated number counters ───────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString('es-CL');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString('es-CL');
        }
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

});
