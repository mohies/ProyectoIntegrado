// Declaración de la variable global `google` para evitar errores de TypeScript.
// Esto es necesario porque el SDK de Google se carga dinámicamente desde un script externo,
// y TypeScript no lo reconoce a menos que se declare explícitamente.
// Permite acceder a `google.accounts.id` sin errores de tipo en tiempo de compilación.
declare var google: any;
