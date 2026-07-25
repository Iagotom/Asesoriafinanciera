/* =========================================================
   CONFIGURACIÓN — edita SOLO este archivo para personalizar
   el destino del formulario.
   ========================================================= */

window.SITE_CONFIG = {

  /* Nombre público del negocio (se usa en el asunto del email). */
  nombre: "IT Asesor Financiero",

  /* Email donde quieres RECIBIR las solicitudes del formulario. */
  email: "contactoiagotomassi@gmail.com",

  /* Destino del formulario.

     Configurado con FormSubmit, que no necesita registro ni servidor: las
     solicitudes llegan al email de arriba.

     IMPORTANTE — hay que activarlo una sola vez: en el primer envío,
     FormSubmit manda un correo de confirmación a la dirección de destino.
     Hasta que se pulse el enlace de ese correo, los envíos no se entregan
     (la web avisa al visitante de que no ha podido enviarse).

     Para ocultar la dirección del código fuente, FormSubmit da un alias con
     forma de token al activarla. Sustituye el email por ese alias:
       "https://formsubmit.co/ajax/a1b2c3d4e5f6..."

     Otras alternativas válidas, si algún día quieres cambiar: Formspree,
     Getform o Basin. Basta con pegar aquí su endpoint.

     Déjalo en "" (vacío) para volver al modo sin servidor, que abre el
     programa de correo del visitante con la solicitud ya redactada.        */
  formEndpoint: "https://formsubmit.co/ajax/contactoiagotomassi@gmail.com"
};
