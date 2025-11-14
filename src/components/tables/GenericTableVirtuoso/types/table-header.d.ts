type TableHeaderProps<T> = {
	columns: Array<ColumnConfig<T>>;
	selectable: boolean;
	checkboxWidth: number;
	allSelected: boolean;
	indeterminate: boolean;
	onSelectAll: () => void;
	hasActions: boolean;
	actionsWidth: number;

	sortHandler?: SortHandler<T>;
};
