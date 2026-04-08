# @test/config

Configuración compartida mínima y segura para el monorepo.

## Qué incluye

- constantes públicas para identificar apps del monorepo
- valores locales de referencia no secretos
- convención de archivos de entorno documentada en un solo lugar

## Qué NO incluye todavía

- secretos
- clientes API
- lógica de dominio
- configuración de Auth0, Stripe o integraciones reales

## Nota

Este paquete queda en formato fuente (`.ts`) porque en A6 solo se define la base compartida.
La resolución real de workspaces, builds o publicación se deja para pasos posteriores.
