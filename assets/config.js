/* =========================================================
   CONFIGURACIÓN — edita SOLO este archivo para personalizar
   los datos de contacto y el destino del formulario.
   ========================================================= */

window.SITE_CONFIG = {

  /* Nombre público del negocio (se usa en el asunto del email). */
  nombre: "Asesoría Financiera",

  /* Email donde quieres recibir las solicitudes. */
  email: "iagonicotomassi@gmail.com",

  /* Teléfono en formato visible y en formato de llamada. */
  telefono: "+34 600 000 000",
  telefonoLink: "+34600000000",

  /* WhatsApp: número en formato internacional SIN "+", espacios ni guiones.
     Ejemplo España: 34600000000 */
  whatsapp: "34600000000",

  /* Destino del formulario.
     - Déjalo en "" (vacío) y el formulario abrirá el cliente de correo
       del visitante con el mensaje ya redactado (funciona sin servidor).
     - O pega aquí un endpoint de Formspree / Getform / Basin y los envíos
       llegarán directamente a tu email por AJAX.
       Ejemplo: "https://formspree.io/f/xxxxxxxx"                        */
  formEndpoint: ""
};
