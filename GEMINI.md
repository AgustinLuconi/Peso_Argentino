# Guías del Proyecto "Peso Argentino" & Reglas de Desarrollo

Este proyecto sigue estándares rigurosos de ingeniería de software, arquitectura hexagonal y TypeScript avanzado:

## 1. Patrones de TypeScript (Total TypeScript / Matt Pocock)
* **Cero `any`**: Usar `unknown` con type narrowing y predicates (`isObject`, `isNonNullable`).
* **Exhaustive Matching**: Chequeo exhaustivo con `assertNever(val)` en uniones discriminadas.
* **Operador `satisfies`**: Para validar tipado sin widening de literales.
* **Inferencia `as const`**: Tuplas y arrays constantes fuertemente tipados.
* **Branded Types**: Para tokens de dominio (`Ticker`, `ISIN`).
* **Prettify Utility**: En tipos complejos y DTOs para legibilidad en el IDE.
* **Inmutabilidad**: Modelos y DTOs con propiedades `readonly`.

## 2. Arquitectura Hexagonal Modular
* `domain/`: Entidades puras y objetos de valor (inmutables, sin dependencias externas).
* `application/`: Puertos (interfaces) y Casos de Uso (interactores).
* `infrastructure/`: Adaptadores a APIs públicas gratuitas (`DolarApi`, `ArgentinaDatos`, `Argly`) y Caché inteligente.
* `presentation/`: Vistas y componentes React con diseño de alto nivel visual y accesibilidad.

## 3. Backend & Caché de Alta Velocidad
* Servidor Express en `server/` con APIs REST v1 y worker de sincronización en segundo plano.
* Respuestas en memoria con Stale-While-Revalidate y resiliencia ante cortes de red.
