/* ==========================================
   JAVASCRIPT - LOGICA, PRECIOS Y ANIMACIONES
   ========================================== */

let pasoActual = 1;
const totalPasos = 3;
const PRECIO_UNITARIO = 3.00; // Precio fijo solicitado

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú hamburguesa
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });

  // 2. Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Animaciones al hacer Scroll (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(section => {
    observer.observe(section);
  });

  // 4. Lógica de cálculo automático en tiempo real
  const inputCantidad = document.getElementById('form-cantidad');
  if (inputCantidad) {
    inputCantidad.addEventListener('input', function() {
      const cantidad = parseInt(this.value) || 1;
      const totalDinamico = document.getElementById('total-dinamico');
      if (totalDinamico) {
        totalDinamico.innerText = (cantidad * PRECIO_UNITARIO).toFixed(2);
      }
    });
  }
});

// -- FUNCIONES DEL MODAL --

function abrirModalPedido(nombreProducto) {
  const modal = document.getElementById('modal-pedido');
  const selectProducto = document.getElementById('form-producto');
  const inputCantidad = document.getElementById('form-cantidad');
  const totalDinamico = document.getElementById('total-dinamico');
  
  if (selectProducto && nombreProducto) {
    selectProducto.value = nombreProducto;
  }
  
  // Resetear valores por defecto al abrir
  if (inputCantidad) inputCantidad.value = 1;
  if (totalDinamico) totalDinamico.innerText = PRECIO_UNITARIO.toFixed(2);
  
  modal.classList.add('is-active');
  pasoActual = 1;
  actualizarVistaPasos();
}

function cerrarModal() {
  const modal = document.getElementById('modal-pedido');
  modal.classList.remove('is-active');
}

function cambiarPaso(direccion) {
  if (direccion === 1 && !validarPasoActual()) {
    return;
  }
  pasoActual += direccion;
  actualizarVistaPasos();
}

function actualizarVistaPasos() {
  for (let i = 1; i <= totalPasos; i++) {
    document.getElementById(`paso-${i}`).classList.add('is-hidden');
  }
  
  const pasoActivo = document.getElementById(`paso-${pasoActual}`);
  pasoActivo.classList.remove('is-hidden');
  
  pasoActivo.style.animation = 'none';
  pasoActivo.offsetHeight; 
  pasoActivo.style.animation = null; 

  const porcentaje = (pasoActual / totalPasos) * 100;
  document.getElementById('barra-progreso').value = porcentaje;

  document.getElementById('btn-atras').disabled = (pasoActual === 1);

  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnEnviar = document.getElementById('btn-enviar');

  if (pasoActual === totalPasos) {
    btnSiguiente.classList.add('is-hidden');
    btnEnviar.classList.remove('is-hidden');
  } else {
    btnSiguiente.classList.remove('is-hidden');
    btnEnviar.classList.add('is-hidden');
  }
}

function validarPasoActual() {
  const pasoContenedor = document.getElementById(`paso-${pasoActual}`);
  const inputs = pasoContenedor.querySelectorAll('input[required], select[required], textarea[required]');
  
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

// -- ENVIAR PEDIDO CON PRECIO AUTOMÁTICO Y CONDICIONES --
function enviarPedido() {
  if (!validarPasoActual()) return;

  const producto = document.getElementById('form-producto').value;
  const cantidad = parseInt(document.getElementById('form-cantidad').value) || 1;
  const fecha = document.getElementById('form-fecha').value;
  const comentarios = document.getElementById('form-comentarios').value;
  const nombre = document.getElementById('form-nombre').value;
  const direccion = document.getElementById('form-direccion').value;

  // Cálculo automático del total ($3.00 por unidad)
  const totalCalculado = (cantidad * PRECIO_UNITARIO).toFixed(2);

  // COLOCA AQUÍ TU NÚMERO CELULAR DE NEGOCIO (Ej: 593999999999)
  const numeroTelefono = "593983811395"; 

  // Mensaje optimizado, limpio y con los requisitos de pago solicitados
  let mensajeTexto = `Hola, vengo de la pagina web y quiero realizar un pedido:\n\n`;
  mensajeTexto += `*DETALLES DE LA ORDEN*\n`;
  mensajeTexto += `Nombre: ${nombre}\n`;
  mensajeTexto += `Producto: ${producto}\n`;
  mensajeTexto += `Cantidad: ${cantidad}\n`;
  mensajeTexto += `Precio por unidad: $${PRECIO_UNITARIO.toFixed(2)}\n`;
  mensajeTexto += `Total de productos: $${totalCalculado}\n`;
  mensajeTexto += `Fecha requerida: ${fecha}\n`;
  mensajeTexto += `Direccion/Retiro: ${direccion}\n`;
  
  if (comentarios.trim() !== "") {
    mensajeTexto += `Comentarios: ${comentarios}\n`;
  }

  mensajeTexto += `\n*INFORMACION DE PAGO Y ENVIO*\n`;
  mensajeTexto += `- Deseo realizar el pago mediante transferencia bancaria. ¿Me podria ayudar con los datos?\n`;
  mensajeTexto += `- Entiendo que si el servicio es mediante delivery tiene un costo adicional y que se trabaja unicamente con el pago completo por adelantado.`;

  // Codificar de manera segura para URL
  const textoCodificado = encodeURIComponent(mensajeTexto);

  const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${textoCodificado}`;
  window.open(urlWhatsApp, '_blank');
  
  cerrarModal();
}
