# GenericTableVirtuoso

## Introducción

Este componente pretende ser algo más allá de una simple tabla. Su uso no es para cualquier situación, si pretendes renderizar más de **100000** registros, quizás debas elegir otras opciones como un paginado por el lado del servidor. En cambio, es una excelente opción si tienes que guardar en un estado global tus registros y quieres olvidarte de la paginación convencional, pero sin perder rendimiento. `GenericTableVirtuoso` no solo esta enfocado en optimizar el scroll con una virtualización (gracias a la libreria `react-virtuoso`) sino que busca optimizar y evitar re-renders innecesarios a la hora de acciones básicas como seleccionar una fila, hacer hover, etc.

### ¿De que debería encargase una tabla?

En mi punto de vista una tabla debe tener únicamente la responsabilidad de mostrar sus datos y si me apuras, también debería manejar las posibles acciones que se puedan aplicar en una fila en concreto. Pero lo que son el resto de acciones generales, no son responsabilidad de la tabla, pero pueden estar vinculadas y por ello es que este componente deja parte de control a otros componentes a partir de su `ref`. Por ende, conseguimos ejecutar acciones que a priori solo se podrían si estuviesemos dentro del componente `GenericTableVirtuoso`.

## 🚀 Características Principales

- **Virtualización Avanzada**: Renderizado eficiente de miles de filas usando react-virtuoso
- **Selección Múltiple**: Sistema completo de checkboxes con estados indeterminados
- **Ordenamiento**: Soporte para ordenamiento ascendente, descendente y reset
- **Búsqueda**: Sistema de búsqueda desacoplado y personalizable
- **Acciones por Fila**: Menú de acciones personalizable para cada elemento
- **Scroll Sincronizado**: Header sticky con scroll horizontal sincronizado
- **Columnas Personalizables**: Renderizado personalizado para cada columna
- **Control Externo**: API completa para controlar la tabla desde componentes padre

## 📁 Estructura del Proyecto

```bash
 GenericTableVirtuoso
├──  components
│   ├──  ScrollComponent
│   │   ├──  index.ts
│   │   └──  ScrollComponent.tsx
│   ├──  TableCheckbox
│   │   ├──  index.ts
│   │   └──  TableCheckbox.tsx
│   ├──  TableHeader
│   │   ├──  index.ts
│   │   └──  TableHeader.tsx
│   └──  TableRow
│       ├──  index.ts
│       └──  TableRow.tsx
├──  GenericTableVirtuoso.tsx
├──  hooks
│   ├──  index.ts
│   ├──  useTableRowClasses.tsx
│   └──  useTableSelection.tsx
├──  index.ts
├──  README.md
├──  types
│   ├──  generic-table-virtuoso.d.ts
│   ├──  scroll-component.d.ts
│   ├──  table-checkbox.d.ts
│   ├──  table-header.d.ts
│   ├──  table-row.d.ts
│   └──  use-table-selection.d.ts
└──  utils
    ├──  index.ts
    └──  utils.ts
```

## 🔧 Props Principales

### GenericTableProps\<T>

| Prop                | Tipo                | Descripción                         | Default     |
| ------------------- | ------------------- | ----------------------------------- | ----------- |
| `columns`           | `ColumnConfig<T>[]` | Configuración de columnas           | -           |
| `data`              | `T[]`               | Array de datos a mostrar            | -           |
| `selectable`        | `boolean`           | Habilita selección múltiple         | `true`      |
| `actions`           | `ActionItem<T>[]`   | Acciones por fila                   | `undefined` |
| `onSelectionChange` | `function`          | Callback cuando cambia la selección | `undefined` |
| `onRowClick`        | `function`          | Callback para click en fila         | `undefined` |
| `searchHandler`     | `SearchHandler<T>`  | Configuración de búsqueda           | `undefined` |
| `sortHandler`       | `SortHandler<T>`    | Configuración de ordenamiento       | `undefined` |

### ColumnConfig\<T>

```typescript
type RenderFunction = (value: any, row: T, index: number) => React.ReactNode;
type AlignColumnType = 'left' | 'center' | 'right';

interface IconProps {
	width?: number;
	height?: number;
	className?: string;
}

type IconComponent = React.ComponentType<IconProps>;
```

| Prop        | Tipo                   | Descripción                                                         | Default |
| ----------- | ---------------------- | ------------------------------------------------------------------- | ------- |
| `key`       | `keyof T \| 'actions'` | Valor a renderizar, agregando `actions` para la columna de acciones | -       |
| `label`     | `string`               | Título de la columna                                                | -       |
| `widht`     | `string`               | Ancho de la columna, en formato `"100px"`, por ejemplo.             | -       |
| `align?`    | `AlignColumnType`      | Permite decidir el alineado del texto                               | `left`  |
| `sortable?` | `boolean`              | Activa la opción de poder ordenar por el campo `key`                | -       |
| `render?`   | `RenderFunction`       | Permite renderizar contenido especial en vez de un `string`         | -       |
| `icon?`     | `IconComponent`        | Icono opcional para decorar el título de la columna                 | -       |

## 🎯 Casos de Uso Avanzados

### Tabla con Búsqueda

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [filteredData, setFilteredData] = useState(data);

const searchHandler = {
	onSearch: (term: string, fields?: Array<keyof User>) => {
		const filtered = data.filter((item) =>
			Object.values(item).some((value) => String(value).toLowerCase().includes(term.toLowerCase())),
		);
		setFilteredData(filtered);
	},
	searchFields: ['name', 'email'] as Array<keyof User>,
};

<GenericTableVirtuoso columns={columns} data={filteredData} searchHandler={searchHandler} />;
```

### Tabla con Ordenamiento

```tsx
const [sortField, setSortField] = useState<keyof User>('name');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
const [sortedData, setSortedData] = useState(data);

const sortHandler = {
	onSort: (field: keyof User, direction: 'asc' | 'desc') => {
		const sorted = [...data].sort((a, b) => {
			const aVal = a[field];
			const bVal = b[field];
			return direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
		});
		setSortedData(sorted);
		setSortField(field);
		setSortDirection(direction);
	},
	onResetSort: () => {
		setSortedData(data);
		setSortField(undefined);
		setSortDirection(undefined);
	},
	currentSortField: sortField,
	currentSortDirection: sortDirection,
};

<GenericTableVirtuoso columns={columns} data={sortedData} sortHandler={sortHandler} />;
```

### Tabla con Acciones

```tsx
const actions = [
	{
		label: 'Editar',
		onClick: (item: User, index: number) => {
			console.log('Editando:', item);
		},
	},
	{
		label: 'Eliminar',
		onClick: (item: User, index: number) => {
			console.log('Eliminando:', item);
		},
		disabled: (item: User) => item.status === 'active',
	},
];

<GenericTableVirtuoso columns={columns} data={data} actions={actions} />;
```
