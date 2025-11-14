// types/menu-popover.d.ts

type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left' | 'right';

interface MenuPopoverProps<T> {
	// Elemento que activa el menú
	trigger: React.ReactNode;

	// Acciones del menú
	actions: ActionItem<T>[];

	// Datos de la fila
	row: T;
	index: number;

	// Control del estado (opcional - puede ser controlado o no controlado)
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;

	// Configuración de posicionamiento
	placement?: MenuPlacement;
	offset?: number;

	// Estilos y estado
	className?: string;
	disabled?: boolean;
}

// Re-exportar ActionItem para consistencia
interface ActionItem<T> {
	label: string;
	icon?: React.ReactNode;
	onClick?: (item: T, index: number) => void; // Opcional para submenús
	disabled?: (item: T, index: number) => boolean;
	className?: string;
	variant?: 'primary' | 'secondary' | 'danger';
	// Nuevas propiedades para soporte de submenús
	submenu?: ActionItem<T>[]; // Array de sub-acciones
	divider?: boolean; // Para separadores visuales
}
