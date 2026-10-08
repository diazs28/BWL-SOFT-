# Política de seguridad

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad en este sitio, **no abras un issue público**.
Repórtalo de forma privada desde la pestaña **Security → Report a vulnerability** de este
repositorio en GitHub. Te responderemos en un plazo máximo de 5 días hábiles.

## Alcance

Este repositorio es un sitio estático (HTML, CSS y JS) sin backend, sin base de datos y sin
secretos. El formulario de contacto no envía datos a ningún servidor: arma un mensaje y abre
WhatsApp en el dispositivo del visitante.

## Buenas prácticas del repositorio

- Nunca se versionan `.env`, llaves (`*.pem`, `*.key`) ni la carpeta `.secrets/` (ver `.gitignore`).
- Las cabeceras de seguridad (CSP, HSTS, X-Frame-Options, etc.) se definen en `vercel.json`.
- Dependabot revisa semanalmente las dependencias de desarrollo.
