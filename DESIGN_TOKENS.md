# 🎨 Guía de Tokens de Diseño - FarmaConnect

Esta guía documenta el sistema unificado de tokens de diseño del proyecto, basado en el tema **FarmaConnect**.

## 🎯 Filosofía

Una sola fuente de verdad para estilos sin duplicación de variables ni capas de compatibilidad. Todo se basa en:

- **Tokens semánticos globales** (color, fondo, borde)
- **Control tokens** (componentes de formulario)
- **Utilidades Tailwind** (opacidades, focus states, spacing)
- **System Components** (Button, Input, Select, etc. con CVA)

---

## 🎨 Paleta de Colores FarmaConnect

### Colores de Marca

| Color | Hex | Uso |
|-------|-----|-----|
| **Celestial Blue** | `#0099D8` | Primary (light mode) |
| **Sandy Brown** | `#FDA042` | Secondary / Primary (dark mode) |
| **Alice Blue** | `#E5EDEF` | Background (light mode) |
| **Oxford Blue** | `#031A34` | Text / Background (dark mode) |

### Colores Semánticos

| Color | Hex | Uso |
|-------|-----|-----|
| **Error** | `#D32F2F` | Errores, estados destructivos |
| **Warning** | `#EC9005` | Advertencias, Carrot Orange |
| **Success** | `#43A047` | Éxito, confirmaciones |

---

## 🧩 Tokens Semánticos Disponibles

### Base (Light/Dark)

```css
--background       /* Fondo principal */
--foreground       /* Texto principal */
--card             /* Fondo de tarjetas */
--card-foreground  /* Texto en tarjetas */
--popover          /* Fondo de popovers */
--popover-foreground
--primary          /* Color primario */
--primary-foreground
--secondary        /* Color secundario */
--secondary-foreground
--destructive      /* Color de error */
--destructive-foreground
--muted            /* Colores apagados */
--muted-foreground
--accent           /* Color de acento */
--accent-foreground
--border           /* Borde estándar */
--ring             /* Ring en focus */
--radius           /* Radio de bordes (12px) */
```

### Surface Tokens (Superficies Mezcladas)

Reemplazan las variables `paperPrimary-*` legacy:

```css
--surface-primary-95  /* Paper + 5% primary */
--surface-primary-90  /* Paper + 10% primary */
--surface-primary-65  /* Paper + 35% primary */
```

**Uso en Tailwind:**
```tsx
<div className="bg-[--surface-primary-95]">Superficie suave</div>
```

### Chart Colors

Para gráficos y visualizaciones:

```css
--chart-1  /* Primary */
--chart-2  /* Secondary */
--chart-3  /* Success */
--chart-4  /* Warning */
--chart-5  /* Error */
```

---

## 🎛️ Control Tokens (Formularios)

Tokens específicos para inputs, selects, textareas y botones.

### Heights (Alturas)

```css
--control-h-sm: 40px   /* Pequeño */
--control-h-md: 44px   /* Mediano (default) */
--control-h-lg: 48px   /* Grande */
```

### Spacing (Espaciado Interno)

```css
--control-px: 0.875rem  /* 14px - Padding horizontal */
--control-py: 0.625rem  /* 10px - Padding vertical */
--control-radius: 8px   /* Radio de bordes */
```

### Backgrounds (Fondos)

```css
--control-bg              /* Fondo base */
--control-bg-hover        /* Hover */
--control-bg-focus        /* Focus */
--control-bg-disabled     /* Deshabilitado */
```

### Borders (Bordes)

```css
--control-border          /* Borde base */
--control-border-hover    /* Hover */
--control-border-focus    /* Focus (Primary) */
--control-border-error    /* Error state */
--control-border-disabled /* Deshabilitado */
```

### Text (Texto)

```css
--control-text            /* Texto principal */
--control-text-secondary  /* Texto secundario */
--control-text-disabled   /* Texto deshabilitado */
--control-placeholder     /* Placeholder */
--control-icon            /* Iconos */
--control-icon-disabled   /* Iconos deshabilitados */
```

### Shadows (Sombras)

```css
--control-shadow        /* Sombra base */
--control-shadow-hover  /* Sombra hover */
--control-shadow-focus  /* Sombra focus */
```

---

## 🪄 Reglas de Uso

### 1. Tokens Únicos
Toda variable debe derivar de los grupos anteriores. **No crear variables custom.**

### 2. Fades del Primary
En lugar de variables personalizadas (`primary-fade-20`), usa utilidades Tailwind:

```tsx
// ❌ Mal (legacy)
<div className="bg-primary-fade-20">

// ✅ Bien (Tailwind)
<div className="bg-primary/20">
<p className="text-primary/70">
<div className="ring-primary/30">
```

### 3. Superficies Mezcladas
Para fondos con mezcla de primary:

```tsx
// ✅ Bien
<div className="bg-[--surface-primary-95]">5% primary</div>
<div className="bg-[--surface-primary-90]">10% primary</div>
<div className="bg-[--surface-primary-65]">35% primary</div>
```

### 4. Inputs y Botones
Usar **System Components** que ya aplican `--control-*`:

```tsx
// ✅ Correcto
<Input size="md" placeholder="Buscar..." />
<Button variant="primary">Guardar</Button>
<Select size="lg"><option>...</option></Select>
<Textarea size="md" />
```

### 5. Animaciones
Usar clases de animación disponibles:

```tsx
<div className="animate-fade-in">
<div className="animate-wiggle">
<div className="animate-accordion-down">
```

---

## 🧠 Mapeo: Legacy → Unificado

| Legacy (MUI/CSS) | Unificado (Tokens/Tailwind) |
|------------------|------------------------------|
| `--color-primary` | `text-primary` / `bg-primary` / `border-primary` |
| `--primary-fade-20` | `bg-primary/20` |
| `--color-paperPrimary-95` | `bg-[--surface-primary-95]` |
| `--color-paperPrimary-90` | `bg-[--surface-primary-90]` |
| `--color-paperPrimary-65` | `bg-[--surface-primary-65]` |
| `--input-background` | `Input` component (usa `--control-bg`) |
| `--input-borderFocus` | `focus:ring-primary` / `focus:border-[var(--control-border-focus)]` |
| `--input-error-bg` | `invalid` variant en `Input` |
| `MuiButton containedPrimary` | `<Button variant="primary" />` |
| `MuiButton outlinedSecondary` | `<Button variant="outline" />` |

---

## 🧪 Ejemplos Prácticos

### Superficie con mezcla de primary 5%
```tsx
<div className="p-4 rounded-lg bg-[--surface-primary-95]">
  Contenido con fondo suave
</div>
```

### Texto azul con 70% de opacidad
```tsx
<p className="text-primary/70">Descripción sutil</p>
```

### Input con borde de focus (sin legacy)
```tsx
<Input
  className="focus:border-[var(--control-border-focus)]"
  placeholder="Email..."
/>
```

### Botones con semántica
```tsx
<Button variant="primary" size="md">Guardar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button variant="destructive">Eliminar</Button>
```

### Select con error
```tsx
<Select size="md" invalid>
  <option value="">Selecciona una opción</option>
</Select>
```

### Textarea con altura custom
```tsx
<Textarea
  size="lg"
  resize="none"
  placeholder="Escribe tu mensaje..."
/>
```

---

## 📦 Componentes del Sistema

Todos en `src/components/system/`:

| Componente | Variants | Sizes | Props Especiales |
|------------|----------|-------|------------------|
| **Button** | primary, secondary, ghost, outline, destructive | sm, md, lg | - |
| **Input** | - | sm, md, lg | `invalid` |
| **Select** | - | sm, md, lg | `invalid` |
| **Textarea** | - | sm, md, lg | `invalid`, `resize` |
| **Card** | - | - | Header, Title, Description, Content, Footer |

### API Consistente (CVA)

Todos los componentes siguen el mismo patrón:

```tsx
<Component variant="..." size="..." invalid={boolean} />
```

---

## 🌗 Dark Mode

El proyecto soporta light/dark mode automáticamente:

- Los tokens semánticos cambian según `.dark` class
- En **dark mode**, el primary es Sandy Brown (`#FDA042`)
- En **dark mode**, los errores usan Warning naranja (`#EC9005`)

Para alternar dark mode, agregar/remover clase `dark` al `<html>`:

```tsx
document.documentElement.classList.toggle('dark')
```

---

## ✅ Checklist de Migración

Al migrar código legacy a este sistema:

- [ ] Reemplazar `--color-*` con tokens semánticos
- [ ] Reemplazar `--primary-fade-*` con opacidades Tailwind (`/20`, `/70`)
- [ ] Reemplazar `--paperPrimary-*` con `--surface-primary-*`
- [ ] Usar `Input`, `Button`, `Select`, `Textarea` en lugar de HTML raw
- [ ] Eliminar variables CSS custom que duplican tokens
- [ ] Verificar que dark mode funcione correctamente

---

## 📚 Referencias

- **Tailwind CSS v4**: https://tailwindcss.com
- **CVA (Class Variance Authority)**: https://cva.style
- **OKLCH Colors**: https://oklch.com

---

## 💡 Conclusión

Con este sistema unificado:

✅ Diseño consistente y predecible
✅ Fácil de mantener y extender
✅ Compatible con light/dark mode
✅ Sin duplicación de variables
✅ Componentes con API uniforme
