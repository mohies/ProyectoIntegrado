// Configuración del entorno de desarrollo.
// Utiliza la API local para pruebas y desarrollo con el mismo Client ID de PayPal.
// Esta configuración se carga automáticamente cuando Angular se ejecuta sin el flag de producción (--configuration=production).
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1/',
  paypalClientId: 'AeDu-aOCquvRuiy02F1383FlCssLHhch5IfsdClXVpL6bRYifGOA7Hw7ZglfjVTr82riE3umxbSg3Ujw'
};
