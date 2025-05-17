// Configuración del entorno de producción.
// Define la URL base de la API y el Client ID de PayPal que se usará en el entorno en vivo.
// Esta configuración se utiliza cuando Angular se ejecuta con el flag --configuration=production.
export const environment = {
    production: true,
    apiUrl: 'http://18.204.87.245:8000/api/v1/',
    paypalClientId: 'AeDu-aOCquvRuiy02F1383FlCssLHhch5IfsdClXVpL6bRYifGOA7Hw7ZglfjVTr82riE3umxbSg3Ujw'
  };
  