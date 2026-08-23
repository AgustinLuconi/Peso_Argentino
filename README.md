# 🇦🇷 Peso Argentino — Monitor Económico, Financiero e Institucional

Plataforma integral de analítica macroeconómica, seguimiento del mercado cambiario (Dólar Oficial, Blue, MEP, CCL, Tarjeta, Cripto), mercados de capitales (BYMA & Wall Street ADRs), detalle exhaustivo de bonos soberanos (AL30 / GD30 con calculadora de TIR interactiva), estadísticas del BCRA/INDEC y análisis de riesgo regulatorio/político.

---

## 🏛️ Características Principales

1. **Monitor Cambiario en Tiempo Real**:
   - Cotizaciones en vivo de 7 tipos de cambio (Oficial BNA, Blue, MEP, CCL, Cripto USDT, Tarjeta, Mayorista).
   - Cálculo automático de spreads de compra/venta, brecha cambiaria y fichas operativas con normativa impositiva y parking.
   - **Conversor Instantáneo de Divisas** con cálculo multidireccional simultáneo contra todas las cotizaciones.

2. **Mercado de Capitales (BYMA & NYSE/NASDAQ)**:
   - Panel Líder Merval (Índice en Pesos, Dólar CCL e Índice General BYMA).
   - Acciones locales (YPF, GGAL, PAMP, BMA, ALUA, TXAR, etc.).
   - ADRs de empresas argentinas que cotizan en Wall Street en USD con mini-sparklines.
   - Curva de Letras del Tesoro en Pesos (Lecaps S31M5, S28A5, S30M5) con TNA y TEM calculadas.

3. **Detalle Bono Soberano AL30 & Calculadora TIR**:
   - Ficha técnica completa (ISIN, Ley Argentina, Moneda de emisión y pago USD).
   - **Gráfico de Cascada de Flujo de Fondos (Waterfall Chart)** con descomposición en tiempo real de amortización de capital, renta de cupones y capital residual.
   - **Calculadora Interactiva de Rendimiento**: Simulación personalizada de nominales invertidos, TIR proyectada, paridad cambiaria y flujo de cobro total hasta el vencimiento en 2030.
   - Cronograma semestral de amortizaciones y renta.

4. **Estadísticas BCRA & Macroeconomía**:
   - Balance general del Banco Central (Reservas brutas y netas, Pasivos remunerados eliminados, Base Monetaria Ampliada y LEFIs del Tesoro).
   - **Comparador de Series Macroeconómicas**: Inflación mensual IPC INDEC, Reservas Internacionales, Base Monetaria y Balanza Comercial.
   - **Simulador de Tasa Real (Carry Trade vs Inflación)** con evaluación de tasa real positiva/negativa.
   - Cuadro comparativo de tasas de referencia (LEFI, BADLAR, Plazo Fijo, Caución Bursátil, TM20).

5. **Análisis Político & Regulatorio**:
   - **Monitor Legislativo**: Seguimiento parlamentario de leyes clave (Ley Bases 27.742, Paquete Fiscal 27.743, DNU 70/2023) con votación nominal y decretos reglamentarios.
   - **Radar RIGI**: Diagnóstico sectorial del Régimen de Incentivo para Grandes Inversiones (Minería, Oil & Gas, Energías Renovables, Siderurgia).
   - **Índice de Gobernabilidad Cuantitativo** (Gobernadores aliados, bloques legislativos, aprobación pública).

6. **Intelligence & Copiloto IA (100% Gratuito)**:
   - **Copiloto Financiero IA**: Asistente interactivo accesible mediante `⌘J` / `Ctrl+J` o botón en barra superior.
   - **Motor Dual Gratuito**: Integración con Google Gemini Flash (Free Tier) y fallback local instantáneo de 0ms (`FinancialNlpAdapter`).
   - Clasificación automatizada de noticias financieras en tiempo real (Sentimiento, Nivel de Impacto, Activos Afectados y Mecanismo de Transmisión).

---

## 🛠️ Stack Tecnológico & Arquitectura

* **Frontend**: React 18, TypeScript (Estándares estrictos Total TypeScript / Matt Pocock), Tailwind CSS v4, Lucide Icons, Vite.
* **Backend**: Express en TypeScript (`server/`), arquitectura hexagonal limpia con adaptadores para APIs públicas gratuitas.
* **Fuentes de Datos 100% Gratuitas**:
  * [DolarApi.com](https://dolarapi.com) — Cotizaciones cambiarias en tiempo real.
  * [ArgentinaDatos](https://argentinadatos.com) — Riesgo País EMBI+, tasas bancarias de plazo fijo y series históricas.
  * [Argly API](https://www.argly.com.ar) — Indicadores macroeconómicos, IPC y coeficientes oficiales.
  * APIs del BCRA e INDEC.
* **Caché Inteligente**: Almacenamiento en memoria con política de TTL estratificado (30s spot, 15m tasas, 1h macro, 12h leyes) y resiliencia offline.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* Node.js v18+ y npm

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AgustinLuconi/Peso_Argentino.git
   cd Peso_Argentino
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor backend (Express):
   ```bash
   npm run server
   ```
   *Servidor API disponible en `http://localhost:3001`*

4. En otra terminal, iniciar el servidor frontend (Vite):
   ```bash
   npm run dev
   ```
   *Aplicación disponible en `http://localhost:5173`*

5. (Opcional) Compilar para producción:
   ```bash
   npm run build
   ```

---

## 🔒 Variables de Entorno (Opcional)

Para habilitar el modelo Gemini en la nube (100% gratuito de Google AI Studio):
```env
GEMINI_API_KEY=tu_clave_api_gemini_aqui
```
*Si no se proporciona clave, el sistema utiliza de forma transparente el motor local de procesamiento de lenguaje financiero (0ms latencia, sin costos).*

---

## 📄 Licencia

Desarrollado bajo licencia MIT para la comunidad financiera y analistas económicos.
