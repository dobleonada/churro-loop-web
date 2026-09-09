# Churro Loop · Plan de implementación web

Documento de trabajo para Claude Code. Contiene el estado consolidado del brief (hilo de correo del 3 y 4 de septiembre de 2026), las decisiones cerradas, los puntos abiertos, el sistema de diseño en Tailwind y la especificación sección por sección.

Cliente final: Churro Loop (franquicia de churros).
Agencia de diseño: Doblemente (Marta Vidal, diseño; Marta Amézarri, CEO; Laura Álvarez).
Desarrollo: Kokua Labs (Bruno Martínez, David Hernández).
Figma: https://www.figma.com/design/iaWmmWaoyEUo5vyAAJR4PA/CHURRO-LOOP?node-id=0-1

> Regla general para Claude Code: **el Figma manda**. Este documento fija comportamiento, arquitectura y tokens; las medidas exactas, pesos tipográficos y espaciados se verifican contra el Figma actualizado (versión con selector de idioma, 3 de septiembre 14:23, más los cambios del 4 de septiembre 12:43).

---

## 1. Estado consolidado del brief

### 1.1 Qué se pidió inicialmente (correo 1, Marta Vidal, 3 sep 13:41)

- Web nueva para la franquicia Churro Loop, versiones escritorio y móvil ya diseñadas en Figma.
- Correo genérico tipo `info@churroloop.com` con redirección a Marta Amézarri, Laura Álvarez y Marta Vidal.
- Sección de mapa "brandeado" en amarillo con las localizaciones de tiendas. **Como no hay ninguna tienda abierta, el mapa se implementa pero no se muestra**: en la primera versión queda solo el título y el carrusel de fotos.
- Mapa hecho con MapTiler. Estilo: `https://api.maptiler.com/maps/01a014c9-6660-7e5a-8ff0-4c479ab0b9ff/style.json?key=API_KEY`.
- Botón "VER CARTA": todavía no hay carta. Dos opciones válidas: mostrar mensaje tipo "Disponible muy pronto" o no renderizar el botón, en ambos casos dejándolo listo para activar.
- Botón "QUIERO MÁS INFORMACIÓN": abre el cliente de correo hacia la dirección de contacto.
- Color de fondo de la web: `#FBF7EE`.

### 1.2 Actualizaciones posteriores (qué cambia respecto al correo 1)

| # | Correo | Cambio | Impacto en desarrollo |
|---|--------|--------|----------------------|
| 1 | Marta Amézarri, 3 sep 13:59 | La web va en **español e inglés** | Se añade capa i18n completa, rutas por idioma y diccionarios de contenido |
| 2 | Marta Amézarri, 3 sep 13:59 | Los contenidos que cambien **los sube Kokua**; Instagram lo lleva Marta Vidal | No hace falta CMS. El contenido vive en ficheros tipados dentro del repo |
| 3 | Marta Vidal, 3 sep 14:23 | Añadido **selector de idioma ES / EN** al diseño | Píldora morada en la cabecera, ver sección 9.1 |
| 4 | Marta Amézarri, 3 sep 17:11 | Se compran **churroloop.com y churroloop.es**, pero cuentas de correo solo en `.com` | `.es` redirige 301 a `.com`. Ver sección 12 |
| 5 | Marta Amézarri, 3 sep 17:21 | Cambiar el logo del render de Bilbao por el de Loop | Tarea de diseño, afecta al asset final del carrusel |
| 6 | Marta Amézarri, 3 sep 17:21 | Añadir **Valencia, Sevilla y Málaga** a próximas aperturas | El carrusel pasa de 2 a 5 ciudades |
| 7 | Marta Amézarri, 3 sep 17:21 | Contacto: usar **su correo personal** en lugar del genérico | Afecta solo al bloque Contacto (`marta@churroloop.com`); el botón de franquicias sigue apuntando a `info@`. A2 resuelto |
| 8 | Marta Vidal, 4 sep 12:43 | Figma actualizado: imágenes nuevas en "próximas aperturas" y en "nuestros loops". **Se ven 3 por defecto y el resto con las flechas** | Define el comportamiento del carrusel: 3 visibles en escritorio, navegación por flechas, no autoplay |
| 9 | Marta Vidal, 4 sep 12:43 | Recursos actualizados en WeTransfer: `we.tl/t-qevxDB1YQMQZ6Z6p` | Descargar y optimizar antes de empezar. El enlace caduca |
| 10 | Marta Amézarri, 4 sep 17:56 | Aprobación del diseño | Diseño validado, se puede maquetar |

### 1.3 Erratas del hilo que no deben implementarse

En el correo del 3 de septiembre 17:21 aparece `CHURROPOP.COM` y `MARAT@CHURROPOP.COM`. Son erratas dobles: ni ese dominio se registró (en el correo 6 David confirma que lo disponible era `churroloop.es` y `churroloop.com`, y en el 7 Marta Amézarri responde "cogemos los dos"), ni `MARAT@` es un nombre. Marta Vidal preguntó explícitamente en el correo del 4 de septiembre 12:43 —*"supongo que querrías decir que la web sería churroloop.com y el e-mail marta@churroloop.com, ¿no?"*— y **Marta Amézarri no llegó a contestar a esa pregunta**: su correo de las 17:56 solo felicita por el diseño. **El dominio es churroloop.com**, no hay duda razonable, pero la confirmación por escrito sigue sin existir (punto A1) y hace falta antes de crear los buzones.

---

## 2. Puntos abiertos

### Bloqueantes antes de cerrar la maqueta

- **A1. Confirmación de dominio y correo.** Marta Amézarri escribió "churropop" dos veces. Pedir un "sí" explícito a churroloop.com y marta@churroloop.com.
- ~~**A2. Dirección del botón de franquicias.**~~ **Resuelto releyendo el hilo: son dos direcciones distintas, cada una en su sitio, y no se contradicen.**
  - **Botón "QUIERO MÁS INFORMACIÓN" → `info@churroloop.com`.** Correo 1 (Marta Vidal, 3 sep 13:41): *"este botón de 'quiero más información' debería abrir el correo para solicitar info a info@churroloop.com"*, y ese buzón es el alias que se reenvía a Marta Amézarri, Laura Álvarez y Marta Vidal.
  - **Sección Contacto → `marta@churroloop.com`.** Correo 8 (Marta Amézarri, 3 sep 17:21): *"PON DE CONTACTO EL MIO"*, escrito como `MARAT@CHURROPOP.COM` y corregido por Marta Vidal en el correo 9. Habla del bloque de contacto, no del botón de franquicias.
  - Ambas salen del CMS (`franchbutton.redirectTo` y `contact.email`), así que cambiarlas no toca código.
  - **Queda una tarea de infraestructura, no de maqueta:** el botón apunta a `info@`, así que ese alias tiene que existir en `churroloop.com` y reenviar a las tres personas antes de publicar. Si no, las solicitudes de franquicia se pierden. Ver sección 12.
- **A3. Assets finales.** El render de Bilbao con el logo corregido y las fotos nuevas del local que pidió Marta Amézarri. Sin ellos el carrusel queda con placeholders.
- **A4. Tipografías.** Confirmar con Marta Vidal las familias exactas del Figma y **quién aporta la licencia web**. Hasta entonces se usa la pila de respaldo de la sección 6.3.

### No bloqueantes, se pueden resolver en paralelo

- **A5. Carta.** Cuando exista, ¿es un PDF, una página propia o un enlace externo? Condiciona el comportamiento del botón (sección 8).
- **A6. URL de Instagram** para el icono del footer.
- **A7. Textos legales** (aviso legal, política de cookies, política de privacidad) y datos de la sociedad titular. Kokua tiene la parte de protección de datos, hay que pedir la razón social, CIF y domicilio del titular.
- **A8. Analítica.** ¿Se instala algo? Si entra Google Analytics o similar, hay que activar el banner de cookies desde el día uno.
- **A9. Traducción al inglés.** ¿La entrega Doblemente o la asume Kokua? Afecta al presupuesto.
- **A10. Hosting y despliegue.** Confirmar destino (Vercel u otro) y quién gestiona los DNS.

---

## 3. Stack y decisiones técnicas

- **Next.js (App Router)** con TypeScript y renderizado estático. Es una web de marca sin datos dinámicos, así que todo sale como estático.
- **Tailwind CSS v4** con configuración CSS-first (`@theme`). En el apéndice está el equivalente para v3 por si el proyecto ya está en esa versión.
- **Internacionalización propia** con segmento `[locale]` y diccionarios tipados. No hace falta librería para dos idiomas y una sola página.
- **Embla Carousel** para los dos carruseles. Ligero, accesible y sin estilos impuestos.
- **MapLibre GL JS** para el mapa de MapTiler, cargado de forma diferida y solo si el flag está activo.
- **next/image** para todo el material fotográfico.
- Sin CMS. El contenido editable vive en `content/` y se actualiza con commit y despliegue, tal como pidió el cliente.

> Nota: el brief interno menciona que "ya tenemos el endpoint y la info cargada". Si existe una fuente de contenido externa, el punto de integración es `lib/content.ts`: se mantiene la misma interfaz `getContent(locale)` y solo cambia la implementación. Confirmar antes de la fase 2.

---

## 4. Estructura de carpetas

```
app/
  [locale]/
    layout.tsx
    page.tsx
    aviso-legal/page.tsx
    politica-de-privacidad/page.tsx
    politica-de-cookies/page.tsx
  layout.tsx            # html/body, fuentes, fondo global
  sitemap.ts
  robots.ts
  not-found.tsx
components/
  layout/
    Header.tsx
    MobileMenu.tsx
    LanguageSwitcher.tsx
    Footer.tsx
  sections/
    Hero.tsx
    PhotoStrip.tsx
    Manifesto.tsx
    UpcomingOpenings.tsx
    OurLoops.tsx
    Franchise.tsx
    Contact.tsx
  ui/
    Button.tsx
    SectionHeading.tsx
    Carousel.tsx
    LocationCard.tsx
    Wordmark.tsx
    StripesBackground.tsx
  map/
    StoreMap.tsx        # dynamic import, ssr: false
    StoreMap.loader.tsx
content/
  es.ts
  en.ts
  types.ts
  locations.ts          # ciudades y coordenadas, compartido entre idiomas
lib/
  config.ts             # correos, redes, flags derivados
  i18n.ts
  utils.ts
public/
  images/
  fonts/
  brand/                # logotipos SVG
middleware.ts           # redirección de / al idioma
```

---

## 5. Modelo de contenido e i18n

### 5.1 Rutas

- `/es` y `/en` como rutas canónicas.
- `middleware.ts` redirige `/` según `Accept-Language`, con `es` por defecto.
- `generateStaticParams` devuelve `['es', 'en']`.
- Las secciones son anclas dentro de la misma página: `#manifiesto`, `#proximas-aperturas`, `#donde-estamos`, `#franquicias`, `#contacto`. Los identificadores no se traducen para no romper enlaces compartidos.
- Los slugs legales sí se traducen (`/en/legal-notice`, etc.) mediante un mapa en `lib/i18n.ts`.

### 5.2 Forma del contenido

`content/types.ts` define un único tipo `SiteContent` y ambos diccionarios lo implementan. Así, si falta una traducción, falla el build en lugar de en producción.

```ts
export type SiteContent = {
  nav: { manifesto: string; openings: string; where: string; franchise: string; contact: string };
  hero: { welcome: string; tagline: string; subtitle: string; ctaMenu: string; menuSoon: string };
  manifesto: { eyebrow: string; title: string; body: string[]; signature: string[] };
  openings: { eyebrow: string; title: string; soonLabel: string };
  loops: { eyebrow: string; title: string; status: string };
  franchise: { eyebrow: string; title: string; claim: string; body: string[]; cta: string; mailSubject: string };
  contact: { eyebrow: string; title: string; email: string };
  footer: { legalNotice: string; cookies: string; privacy: string; copyright: string };
  meta: { title: string; description: string };
};
```

`content/locations.ts` mantiene las ciudades fuera de los diccionarios, porque los nombres propios no cambian entre idiomas:

```ts
export const openings = [
  { id: 'bilbao',   city: 'Bilbao',   date: { es: 'Noviembre 2026', en: 'November 2026' }, image: '/images/openings/bilbao.jpg', coords: [-2.9350, 43.2630] },
  { id: 'burgos',   city: 'Burgos',   date: null, image: '/images/openings/burgos.jpg',   coords: [-3.7000, 42.3439] },
  { id: 'valencia', city: 'Valencia', date: null, image: '/images/openings/valencia.jpg', coords: [-0.3763, 39.4699] },
  { id: 'malaga',   city: 'Málaga',   date: null, image: '/images/openings/malaga.jpg',   coords: [-4.4214, 36.7213] },
  { id: 'sevilla',  city: 'Sevilla',  date: null, image: '/images/openings/sevilla.jpg',  coords: [-5.9845, 37.3891] },
] as const;
```

Cuando `date` es `null` la tarjeta muestra la etiqueta traducida "MUY PRONTO" / "COMING SOON".

### 5.3 Texto del manifiesto

Se maqueta como líneas independientes, no como un párrafo con saltos automáticos, porque en el diseño los cortes de línea son intencionados. En móvil hay que revisar el PDF: si los cortes no caben, se pasa a párrafo fluido con `text-balance`.

---

## 6. Sistema de diseño y Tailwind

### 6.1 Paleta

Los hexadecimales que no vienen del correo están tomados de las capturas y **deben verificarse con el cuentagotas en Figma** antes de dar por buena la fase 2.

| Token | Valor | Uso |
|-------|-------|-----|
| `cream` | `#FBF7EE` | Fondo global, confirmado por el cliente |
| `purple` | `#A21CF0` (verificar) | Titulares, logotipo, botones, flechas |
| `yellow` | `#F8C64B` (verificar) | Bandas de próximas aperturas y franquicias, rayas del hero, mapa |
| `ink` | `#1B1A19` (verificar) | Texto corrido y subtítulo del hero |
| `white` | `#FFFFFF` | Rayas del hero, tarjetas |

La marca es morado sobre crema con amarillo como bloque de sección. El amarillo nunca se usa como color de texto y el morado nunca como fondo de área grande, solo en botones y píldoras.

### 6.2 Tokens en Tailwind v4

`app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Color */
  --color-cream: #FBF7EE;
  --color-purple: #A21CF0;
  --color-purple-deep: #7C0FBC;   /* hover y focus */
  --color-yellow: #F8C64B;
  --color-yellow-soft: #FCE3A4;   /* fondo del mapa */
  --color-ink: #1B1A19;

  /* Tipografía */
  --font-display: var(--font-churro-display), "Cormorant Garamond", Georgia, serif;
  --font-body: var(--font-churro-body), "Inter", system-ui, sans-serif;

  --text-eyebrow: 0.875rem;
  --text-eyebrow--line-height: 1.2;
  --text-eyebrow--letter-spacing: 0.06em;

  --text-display: clamp(3.5rem, 11vw, 8.5rem);
  --text-display--line-height: 0.92;

  --text-h2: clamp(2.25rem, 5vw, 3.5rem);
  --text-h2--line-height: 1.05;

  --text-h3: clamp(1.5rem, 3vw, 2rem);
  --text-body: 1rem;
  --text-body--line-height: 1.7;
  --text-small: 0.8125rem;

  /* Layout */
  --spacing-section: clamp(4rem, 9vw, 8rem);
  --radius-card: 1.25rem;
  --radius-pill: 9999px;
  --container-site: 1280px;
}

/* Rayas verticales del hero */
@utility bg-churro-stripes {
  background-image: repeating-linear-gradient(
    90deg,
    var(--color-yellow) 0 var(--stripe-width, 4.5rem),
    #ffffff var(--stripe-width, 4.5rem) calc(var(--stripe-width, 4.5rem) * 2)
  );
}

@layer base {
  html { scroll-behavior: smooth; }
  body { background-color: var(--color-cream); color: var(--color-ink); }
  ::selection { background: var(--color-purple); color: var(--color-cream); }
  :focus-visible { outline: 2px solid var(--color-purple); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
}
```

En móvil, `--stripe-width` baja a `2.25rem` con una media query, para que el número de rayas se parezca al PDF móvil.

### 6.3 Tipografía

Dos familias:

1. **Display serif de alto contraste** para logotipo, titulares y subtítulos del hero. Es la que carga la personalidad de la marca. Pendiente de confirmar (A4). Respaldo: Cormorant Garamond.
2. **Sans geométrica** para el texto corrido, el eyebrow, la navegación y los botones. Respaldo: Inter.

Carga con `next/font/local` desde `public/fonts` en woff2, `display: 'swap'`, y expuestas como variables CSS para que el bloque `@theme` las consuma. Solo se cargan los pesos que aparecen en el diseño; no se sube toda la familia.

El logotipo "CHURRO LOOP" del hero y del footer **no es texto**, es un SVG con los trazos personalizados (las ligaduras de la C y la O no se reproducen con la fuente). Se implementa como componente `Wordmark` con `role="img"` y `aria-label="Churro Loop"`.

### 6.4 Patrones de composición

- `SectionHeading`: eyebrow en morado, titular en display morado, ambos centrados. Se repite en cinco secciones, así que va como componente con props `eyebrow`, `title` y `as` para el nivel semántico correcto.
- `Button`: píldora morada, texto en sans, mayúsculas, tracking amplio. Variantes `solid` (morado sobre amarillo o crema) y `ghost`. Estados hover con `--color-purple-deep` y foco visible.
- Tarjetas de ciudad: esquinas `--radius-card`, imagen a sangre, etiqueta de ciudad arriba a la izquierda y fecha arriba a la derecha, ambas en blanco sobre un degradado sutil para garantizar contraste.

---

## 7. Especificación por secciones

Orden de la página: Header, Hero, Tira de fotos, Manifiesto, Próximas aperturas, Nuestros loops, Franquicias, Contacto y pie.

### 7.1 Header

- Logotipo pequeño a la izquierda (SVG en dos líneas, "CHURRO / LOOP").
- Navegación a la derecha: Manifiesto, Próximas aperturas, ¿Dónde estamos?, Franquicia, Contacto.
- Selector `ES | EN` como píldora morada con el idioma activo destacado. Cambia de ruta manteniendo el ancla actual.
- Escritorio: cabecera sobre el fondo de rayas. Verificar en el prototipo de Figma si es fija al hacer scroll; si no está definido, se implementa estática y se propone fija con fondo crema tras 80 px de scroll.
- Móvil: logotipo, selector de idioma y botón de menú. El menú abre a pantalla completa sobre fondo crema, con foco atrapado, cierre con Escape y bloqueo del scroll de fondo.

### 7.2 Hero

- Fondo de rayas verticales amarillas y blancas a ancho completo.
- Bloque centrado: "WELCOME TO", logotipo grande, "THE NEW SPANISH ICON", subtítulo en negro y botón "VER CARTA".
- Churro con chocolate en PNG con transparencia, posicionado en el lateral derecho, rotado y desbordando el borde inferior. Es decorativo: `alt=""` y `aria-hidden`.
- En móvil se recoloca según el PDF móvil. La imagen es pesada, así que va con `priority` y `sizes` bien ajustados, y una versión reducida para viewports pequeños.
- El botón "VER CARTA" se rige por el flag de la sección 8.

### 7.3 Tira de fotos

Cuatro imágenes en fila a ancho casi completo bajo el hero. En escritorio son cuatro columnas de altura fija; en móvil se convierten en tira con scroll horizontal o en rejilla de dos por dos según el PDF móvil. No es un carrusel, no lleva controles.

### 7.4 Manifiesto

Eyebrow, titular, texto centrado en dos bloques y firma final ("CHURRO LOOP." y "The New Spanish Icon."). Ancho máximo de línea contenido, alrededor de 62 caracteres, para respetar los cortes del diseño.

### 7.5 Próximas aperturas

- Banda amarilla a ancho completo con eyebrow "CHURRO LOOP IS COMING TO TOWN" (se mantiene en inglés también en la versión española, es parte del tono de marca; confirmar con Marta Vidal si en la versión inglesa cambia).
- Carrusel de cinco tarjetas: Bilbao, Burgos, Valencia, Málaga y Sevilla, en ese orden.
- Escritorio: 3 tarjetas visibles, flechas morada a izquierda y derecha, sin autoplay.
- Móvil: una tarjeta y media visible con arrastre.
- Bilbao muestra "NOVIEMBRE 2026"; el resto, "MUY PRONTO".
- Cuando una tienda abra, la ciudad se mueve de `openings` a `stores` en `content/locations.ts` y aparece en el mapa. Dejarlo previsto.

### 7.6 Nuestros loops

- Eyebrow "ENCUENTRA TU CHURRO LOOP MÁS CERCANO", titular "NUESTROS LOOPS" y estado "MUY PRONTO".
- Carrusel de fotos del local con el mismo componente que la sección anterior, pero con proporción horizontal.
- Debajo, el mapa. **Oculto en la primera versión.** El bloque no se renderiza y su código no entra en el bundle inicial.
- La sección responde al ancla `#donde-estamos`.

### 7.7 Franquicias

Banda amarilla, eyebrow, titular, claim "ABRE EL PRÓXIMO CHURRO LOOP.", tres líneas de texto y botón "QUIERO MÁS INFORMACIÓN".

El botón es un `mailto` con asunto prellenado por idioma:

```ts
const href = `mailto:${config.contactEmail}?subject=${encodeURIComponent(content.franchise.mailSubject)}`;
```

Asunto sugerido: "Solicito información sobre franquicias Churro Loop" y "Franchise information request".

Riesgo a comentar con el cliente: `mailto` falla en equipos sin cliente de correo configurado y no deja registro de las solicitudes. Si más adelante quieren trazabilidad, la alternativa es un formulario con envío a su correo, pero eso añade tratamiento de datos personales y por tanto casilla de consentimiento y mención en la política de privacidad. Fuera de alcance salvo que lo pidan.

### 7.8 Contacto y pie

- Eyebrow "¿HABLAMOS?", titular "CONTACTO", correo como enlace `mailto` y icono de Instagram.
- Logotipo gigante a ancho completo. Se recorta ligeramente por los laterales en escritorio; se implementa con un SVG que escala por ancho y `overflow-hidden` en el contenedor.
- Enlaces legales y línea de copyright "ChurroLoop2026©". Ojo: en la captura pone "Avisa Legal", es una errata. Lo correcto es "Aviso legal". Avisar a Marta Vidal para que lo corrija también en Figma.

---

## 8. Feature flags y variables de entorno

Todo lo que el cliente quiere "preparado pero apagado" se controla por entorno, para que activarlo sea cambiar una variable y volver a desplegar, sin tocar código.

`.env.example`:

```
NEXT_PUBLIC_SITE_URL=https://churroloop.com
NEXT_PUBLIC_CONTACT_EMAIL=marta@churroloop.com
NEXT_PUBLIC_INSTAGRAM_URL=

# Mapa de tiendas. off mientras no haya locales abiertos
NEXT_PUBLIC_SHOW_MAP=false
NEXT_PUBLIC_MAPTILER_KEY=
NEXT_PUBLIC_MAPTILER_STYLE=https://api.maptiler.com/maps/01a014c9-6660-7e5a-8ff0-4c479ab0b9ff/style.json

# Carta. hidden | soon | link
NEXT_PUBLIC_MENU_MODE=soon
NEXT_PUBLIC_MENU_URL=
```

`lib/config.ts` centraliza la lectura y el tipado. Comportamiento de `NEXT_PUBLIC_MENU_MODE`:

- `hidden`: no se renderiza el botón.
- `soon`: el botón se ve y al pulsarlo muestra un aviso accesible ("Disponible muy pronto" / "Coming very soon") como texto que aparece bajo el botón con `aria-live="polite"`. Nada de `alert()`.
- `link`: el botón enlaza a `NEXT_PUBLIC_MENU_URL`.

Recomendación al cliente: arrancar en `soon`, porque mantiene la composición del hero tal cual está diseñada. La opción `hidden` deja el hero con un hueco visible.

La clave de MapTiler es pública por necesidad, así que hay que **restringirla por dominio** en el panel de MapTiler antes de activar el mapa.

---

## 9. Componentes transversales

### 9.1 LanguageSwitcher

```tsx
type LanguageSwitcherProps = {
  locale: 'es' | 'en';
  variant?: 'header' | 'mobile';
};
```

Renderiza dos enlaces reales, no botones, para que funcionen con clic central y sean rastreables. El activo lleva `aria-current="true"`. El separador vertical es decorativo (`aria-hidden`).

### 9.2 Carousel

```tsx
type CarouselProps = {
  items: React.ReactNode[];
  slidesPerView?: { base: number; md: number; lg: number }; // por defecto 1.2 / 2 / 3
  ariaLabel: string;
  arrowPosition?: 'outside' | 'inside';
};
```

- Basado en Embla, sin autoplay ni bucle (el diseño muestra flechas de navegación clásicas).
- Flechas deshabilitadas visualmente cuando no hay más contenido en esa dirección.
- Contenedor con `role="region"` y `aria-roledescription="carrusel"`, cada slide con `aria-label` del tipo "1 de 5".
- Navegable con teclado y con arrastre táctil.

### 9.3 StoreMap

```tsx
type StoreMapProps = {
  stores: Store[];
  styleUrl: string;
  apiKey: string;
};
```

- Importado con `next/dynamic` y `ssr: false`, envuelto en la comprobación del flag para que MapLibre no entre en el bundle mientras esté apagado.
- Marcadores personalizados con el icono de churro sobre el pin, en morado.
- Controles: zoom sí, rotación no. `scrollZoom` desactivado para no secuestrar el scroll de la página; se activa al hacer clic dentro del mapa.
- Encuadre inicial: península ibérica, como en el diseño.
- Alternativa accesible: bajo el mapa, una lista de tiendas con dirección, para quien no pueda usar el mapa.

---

## 10. SEO, legal y rendimiento

**Metadatos.** `generateMetadata` por idioma con título, descripción, Open Graph y Twitter Card. Imagen OG específica (1200 x 630) con el logotipo sobre rayas. `alternates.languages` con `es-ES` y `en`, más `x-default` apuntando a `/es`.

**Datos estructurados.** JSON-LD de tipo `Organization` con nombre, logotipo y perfil de Instagram. Cuando abra la primera tienda, añadir `FoodEstablishment` por local.

**Sitemap y robots.** Generados con `app/sitemap.ts` y `app/robots.ts`, incluyendo ambos idiomas.

**Legales.** Tres páginas estáticas con el mismo layout, tipografía de lectura y ancho contenido. Se traducen las dos versiones. Pendiente de los textos (A7).

**Cookies.** Sin analítica y con el mapa apagado, la web no instala cookies no esenciales y no necesita banner en el lanzamiento. Al activar el mapa o la analítica sí hará falta: dejar el componente `CookieBanner` previsto pero no montado, y documentarlo para el cliente.

**Rendimiento.** Objetivo: LCP por debajo de 2,5 s en 4G. Medidas: imagen del hero con `priority`, resto en `lazy`, conversión de todas las fotos a AVIF y WebP con `next/image`, fuentes en woff2 con subconjunto latino, sin librerías de animación. El mapa apagado ahorra unos 200 kB de JavaScript.

**Accesibilidad.** Contraste comprobado en el morado sobre crema y sobre amarillo (el morado sobre amarillo va justo, verificar con herramienta y ajustar el tono si no llega a 4.5:1 en texto pequeño). Foco visible, navegación completa por teclado, `prefers-reduced-motion` respetado, jerarquía de encabezados correcta con un solo `h1`.

---

## 11. Fases de trabajo

### Fase 0. Preparación
- [ ] Descargar los recursos del WeTransfer antes de que caduque y guardarlos en el Drive del proyecto.
- [ ] Exportar del Figma los SVG de logotipo, iconos y flechas.
- [ ] Optimizar el material fotográfico y nombrarlo de forma consistente.
- [ ] Confirmar tipografías y licencias (A4).
- [ ] Crear el proyecto Next.js con TypeScript y Tailwind v4.

### Fase 1. Base
- [ ] Tokens de Tailwind y estilos base según la sección 6.
- [ ] Carga de fuentes y componente `Wordmark`.
- [ ] Enrutado `[locale]`, middleware y diccionarios vacíos tipados.
- [ ] Componentes `Button`, `SectionHeading` y `StripesBackground`.

### Fase 2. Secciones
- [ ] Header con navegación, menú móvil y selector de idioma.
- [ ] Hero con rayas, logotipo, churro y botón de carta con sus tres modos.
- [ ] Tira de fotos.
- [ ] Manifiesto.
- [ ] Carrusel genérico con Embla.
- [ ] Próximas aperturas con las cinco ciudades.
- [ ] Nuestros loops con carrusel y bloque de mapa condicionado.
- [ ] Franquicias con el `mailto`.
- [ ] Contacto y pie con logotipo a ancho completo y enlaces legales.

### Fase 3. Contenido y idiomas
- [ ] Volcar todos los textos en español desde el Figma.
- [ ] Integrar la traducción al inglés (según A9).
- [ ] Páginas legales.
- [ ] Metadatos, OG, sitemap, robots y JSON-LD.

### Fase 4. Mapa (queda listo pero apagado)
- [ ] `StoreMap` con MapLibre y el estilo de MapTiler.
- [ ] Marcadores de marca y lista accesible.
- [ ] Verificar que con `NEXT_PUBLIC_SHOW_MAP=false` no se carga nada.

### Fase 5. Cierre
- [ ] Repaso responsive contra los dos PDF, en 375, 768, 1280 y 1600 px.
- [ ] Auditoría Lighthouse y de accesibilidad.
- [ ] Revisión de textos con Marta Vidal, incluida la errata "Avisa Legal".
- [ ] Despliegue en preproducción y validación del cliente.
- [ ] DNS, correo, redirección de `.es` y paso a producción.

---

## 12. Infraestructura, dominios y correo

- Se registran `churroloop.com` y `churroloop.es`.
- La web y el correo van sobre `churroloop.com`.
- `churroloop.es` se configura con redirección 301 a `churroloop.com` conservando la ruta, en el proveedor de dominios o en el hosting. Sin contenido propio, para no generar duplicados en buscadores.
- Buzones a crear en `.com`: `marta@` (buzón real, es el que se muestra en Contacto) e `info@` (alias con reenvío a Marta Amézarri, Laura Álvarez y Marta Vidal, es el destino del botón de franquicias). Los dos son obligatorios: cada uno está cableado a una parte distinta de la web.
- Registros DNS a preparar: A o CNAME de la web, MX del proveedor de correo, SPF, DKIM y DMARC. Sin SPF y DKIM correctos, los correos del dominio nuevo van a spam desde el primer día.
- Registros antiguos: Marta Amézarri pidió no renovar los dominios previos al vencimiento y dar de baja los buzones anteriores. Conviene poner fecha en calendario y hacer una copia de los buzones antes de eliminarlos.

---

## 13. Criterios de aceptación

1. La web se ve igual que el Figma en escritorio y móvil, con desviación de espaciados menor a 4 px en los puntos de ruptura de referencia.
2. El cambio de idioma conserva la posición en la página y traduce todos los textos, incluidos los metadatos y las etiquetas de los carruseles.
3. El botón "VER CARTA" se puede activar y desactivar cambiando una variable de entorno, sin tocar código.
4. Con el mapa apagado, la sección "Nuestros loops" muestra solo el titular y el carrusel, y MapLibre no aparece en el bundle.
5. El botón de franquicias abre el cliente de correo con destinatario y asunto correctos en ambos idiomas.
6. Toda la web es navegable con teclado y los focos son visibles.
7. Lighthouse por encima de 90 en rendimiento, accesibilidad y buenas prácticas en móvil.
8. `churroloop.es` redirige a `churroloop.com`.

---

## Apéndice A. Equivalente para Tailwind v3

Si el proyecto ya está en v3, los mismos tokens en `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7EE',
        purple: { DEFAULT: '#A21CF0', deep: '#7C0FBC' },
        yellow: { DEFAULT: '#F8C64B', soft: '#FCE3A4' },
        ink: '#1B1A19',
      },
      fontFamily: {
        display: ['var(--font-churro-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-churro-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.875rem', { lineHeight: '1.2', letterSpacing: '0.06em' }],
        display: ['clamp(3.5rem, 11vw, 8.5rem)', { lineHeight: '0.92' }],
        h2: ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.05' }],
      },
      borderRadius: { card: '1.25rem' },
      maxWidth: { site: '1280px' },
      backgroundImage: {
        'churro-stripes':
          'repeating-linear-gradient(90deg, #F8C64B 0 4.5rem, #ffffff 4.5rem 9rem)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## Apéndice B. Fuentes del brief

- Hilo "WEB CHURRO LOOP", 3 y 4 de septiembre de 2026.
- Figma CHURRO LOOP, versión con selector de idioma.
- Recursos: WeTransfer `we.tl/t-qevxDB1YQMQZ6Z6p` y `RECURSOS WEB CHURRO LOOP.rar`.
- PDF de referencia: versión escritorio y versión móvil, ambas con selector de idioma.
