type RenderFunction<T> = (value: T[U], row: T, index: number, isScrolling?: boolean) => React.ReactNode;
type AlignColumnType = 'left' | 'center' | 'right';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SearchHandler<T> {
	onSearch: (searchTerm: string, fields?: Array<string>) => void;
	searchFields?: Array<string>;
}

// ✅ Nueva interfaz desacoplada para ordenamiento
interface SortHandler<T> {
	onSort: (field: keyof T, direction: SortDirection) => void;
	onResetSort: () => void;
	currentSortField?: keyof T;
	currentSortDirection?: SortDirection;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
	sortAction: (field: keyof T, direction: SortDirection) => any;
	resetAction: () => any;
	currentSortField: keyof T;
	currentSortDirection: SortDirection;
	initialSortField: keyof T;
	initialSortDirection: SortDirection;
}

interface ColumnConfig<T> {
	key: keyof T | 'actions';
	label: string;
	width: string;
	hideRow?: boolean;
	grow?: boolean;
	align?: AlignColumnType;
	placeholder?: RenderFunction<T, keyof T>; // Nueva propiedad para placeholder
	sortable?: boolean;
	render?: RenderFunction;
	icon?: IconComponent;
}

interface ActionItem<T> {
	label: string;
	icon?: IconComponent;
	onClick?: (item: T, index: number) => void; // Opcional para submenús
	disabled?: (item: T, index: number) => boolean;
	className?: string;
	variant?: 'primary' | 'secondary' | 'danger';
	// Nuevas propiedades para soporte de submenús
	submenu?: Array<ActionItem<T>>; // Array de sub-acciones
	divider?: boolean; // Para separadores visuales
}

// ✅ Nuevo tipo para anchos calculados

// Ref interface para controlar la tabla desde el exterior
interface GenericTableRef<T> {
	getSelectedItems: () => Array<T>;
	clearSelection: () => void;
	handleRowSelect: (id: T['id']) => void;
	handleBulkSelect: (ids: Array<T['id']>) => void;
	selectAll: () => void;
	setSelection: (ids: Array<T['id']>) => void;
	isItemSelected: (id: T['id']) => boolean;
	selectedCount: number;
	search: (searchTerm: string) => void;
}

interface SearchConfig<T> {
	searchAction: (search: string | undefined, fields?: Array<string>) => any;
	searchFields?: Array<string>;
	sortConfig?: SortConfig<T>;
}

// interface para controlar la tabla desde el interior
interface GenericTableProps<T> {
	columns: Array<ColumnConfig<T>>;
	placeholderColumns?: Array<ColumnConfig<T>>;
	data: Array<T>;
	itemHeight?: number;
	usePlaceholderColumns?: boolean;
	// Props para checkboxes optimizadas
	selectable?: boolean;
	// Nuevas props para funcionalidad de selección
	selectOnRowClick?: boolean;
	// Props para acciones
	actions?: Array<ActionItem<T>>; // Nueva prop para acciones dinámicas
	// Nuevas props para callbacks externos
	onSelectionChange?: (selectedItems: Array<T>, selectedIndices: Array<T['id']>) => void;
	// Props para control externo opcional
	initialSelectedItems?: Array<T['id']>;
	searchHandler?: SearchHandler<T>;
	sortHandler?: SortHandler<T>;
	onSearchChange?: (value: string) => void;

	getIdFn?: (item: T) => string | number;
}
