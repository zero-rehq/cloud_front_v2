type TableRowProps<T> = {
	index: number;
	row: T;
	columns: Array<ColumnConfig<T>>;
	selectable: boolean;
	isSelected: boolean;

	onRowSelect: (id: string) => void;
	checkboxWidth: number;
	// Props para acciones
	hasActions: boolean;
	actions?: Array<ActionItem<T>>;
	actionsWidth: number;
	isScrolling?: boolean;
	selectedCount?: number;
};
