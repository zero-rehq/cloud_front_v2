interface UseInternalTableSelectionProps<T extends { id: string | number }> {
	dataLength: number;
	onSelectionChange?: (selectedItems: Array<T>, selectedIndices: Array<T['id']>) => void;
	data: Array<T>;
	initialSelectedItems?: Array<T>;
}
