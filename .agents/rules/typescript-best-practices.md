# Matt Pocock (Total TypeScript) Best Practices & Engineering Guidelines

En este proyecto se aplican de forma estricta las reglas y patrones de **Total TypeScript (Matt Pocock)** y buenas prácticas de ingeniería de software:

## 1. Cero uso de `any` (No `any` Policy)
* Está estrictamente prohibido el uso de `any`.
* Si un tipo es desconocido o proviene de una API externa, utilizar `unknown` junto con validaciones de tipo (Type Guards, Narrowing o validadores de esquema).

## 2. Exhaustive Checking con `assertNever`
* En todos los `switch` o sentencias condicionales sobre uniones discriminadas (Discriminated Unions), el bloque `default` debe invocar `assertNever(value)` para garantizar que el compilador alerte si se agrega un nuevo miembro a la unión.

## 3. Uso del operador `satisfies`
* Utilizar `satisfies` para validar la estructura de objetos y configuraciones sin perder la inferencia de tipos literales específicos (evita el "type widening" que causa `const x: Config = { ... }`).

## 4. Inferencia Estricta y `as const`
* Declarar arrays de opciones, constantes de configuración y rutas con `as const` para preservar tuplas y uniones literales exactas.

## 5. Tipos Nominales / Branded Types
* Para identificadores críticos de dominio (ej. `Ticker`, `ISIN`, `UUID`), utilizar Branded Types (`Brand<string, 'Ticker'>`) para prevenir asignaciones erróneas de cadenas genéricas.

## 6. Utilidad `Prettify<T>`
* Utilizar `Prettify<T>` en tipos compuestos y DTOs para que el autocompletado y hover de TypeScript en el IDE muestre objetos planos y legibles.

## 7. Inmutabilidad por Defecto
* Todas las propiedades de modelos de dominio y DTOs deben declararse como `readonly`.

## 8. Tipos Explícitos en Fronteras de Módulos (Ports & APIs)
* Todas las funciones públicas, métodos de repositorios y casos de uso deben declarar explícitamente su tipo de retorno (`Promise<DashboardMetricsDto>`), permitiendo inferencia contextual únicamente en variables locales internas.
