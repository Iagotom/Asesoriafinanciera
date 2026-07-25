/* =========================================================
   CONFIGURACIÓN — edita SOLO este archivo para personalizar
   los datos de contacto y el destino del formulario.
   ========================================================= */

window.SITE_CONFIG = {

  /* Nombre público del negocio (se usa en el asunto del email). */
  nombre: "IT Asesor Financiero",

  /* Email donde quieres RECIBIR las solicitudes.
     No se muestra en la web: solo se usa como destinatario. */
  email: "iagonicotomassi@gmail.com",

  /* WhatsApp: número en formato internacional SIN "+", espacios ni guiones.
     Ejemplo España: 34600000000
     Es el único dato de contacto visible en la web (botón flotante y CTA). */
  whatsapp: "34600000000",

  /* Destino del formulario.
     - Déjalo en "" (vacío) y el formulario abrirá el cliente de correo
       del visitante con el mensaje ya redactado (funciona sin servidor,
       pero deja tu email a la vista del visitante al abrirse el borrador).
     - O pega aquí un endpoint de Formspree / Getform / Basin y los envíos
       llegarán directamente a tu email por AJAX, sin exponer la dirección.
       Ejemplo: "https://formspree.io/f/xxxxxxxx"                        */
  formEndpoint: ""
};
