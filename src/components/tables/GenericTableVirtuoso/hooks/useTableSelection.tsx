import { useCallback, useMemo, useRef, useState } from 'react';

export function useTableSelection<T extends { id: string | number }>({
	dataLength,
	onSelectionChange,
	data,
	initialSelectedItems = [] as Array<T>,
}: UseInternalTableSelectionProps<T>) {
	const [selectedItems, setSelectedItems] = useState<Array<T['id']>>(
		initialSelectedItems.map((item) => item.id)
	);

	// ✅ Guardar copia original de los datos para búsquedas de selección
	const originalDataRef = useRef<Array<T>>(data);

	// Actualizar la referencia original solo cuando sea necesario
	useMemo(() => {
		// Inicializar si está vacío o actualizar si los datos han crecido (no por filtros)
		if (originalDataRef.current.length === 0 || data.length > originalDataRef.current.length) {
			originalDataRef.current = data;
		}
	}, [data]);

	// Usar useRef para mantener referencia estable del Set
	const selectedItemsSetRef = useRef(new Set(selectedItems));

	// Solo actualizar el Set cuando realmente cambien los items
	const selectedItemsSet = useMemo(() => {
		const newSet = new Set(selectedItems);
		selectedItemsSetRef.current = newSet;
		return newSet;
	}, [selectedItems]);

	// Efecto para sincronizar con cambios externos
	const allSelected = useMemo(() => {
		return dataLength > 0 && selectedItems.length === dataLength;
	}, [selectedItems.length, dataLength]);

	const indeterminate = useMemo(() => {
		return selectedItems.length > 0 && selectedItems.length < dataLength;
	}, [selectedItems.length, dataLength]);

	// Función para notificar cambios
	const notifySelectionChange = useCallback(
		(newSelection: Array<T['id']>) => {
			// Siempre actualizar el estado interno
			setSelectedItems(newSelection);
			// Notificar al componente padre si hay callback
			if (onSelectionChange) {
				// ✅ Usar datos originales para encontrar TODOS los objetos seleccionados
				// incluso si no están en el resultado de búsqueda actual
				const selectedObjects = newSelection
					.map((id) => originalDataRef.current.find((d) => d.id === id))
					.filter((item): item is T => item !== undefined);
				onSelectionChange(selectedObjects, newSelection);
			}
		},
		[onSelectionChange],
	);

	const handleSelectAll = useCallback(() => {
		if (allSelected) {
			// Deseleccionar todos
			notifySelectionChange([]);
		} else {
			// Seleccionar todos
			const allIndices = data.map((item) => item.id);
			notifySelectionChange(allIndices);
		}
	}, [allSelected, dataLength, notifySelectionChange]);

	const handleRowSelect = useCallback(
		(id: string) => {
			// Obtener los items actualmente seleccionados
			const currentSelectedItems = selectedItemsSetRef.current;
			const isSelected = currentSelectedItems.has(id);
			let newSelection: Array<T['id']>;
			if (isSelected) {
				// Remover el item del array actual
				newSelection = Array.from(currentSelectedItems).filter((i) => i !== id);
			} else {
				// Agregar el item al array actual
				newSelection = [...Array.from(currentSelectedItems), id];
			}
			notifySelectionChange(newSelection);
		},
		[notifySelectionChange],
	);

	const handleBulkSelect = useCallback(
		(ids: Array<T['id']>) => {
			// Obtener los items actualmente seleccionados
			const currentSelectedItems = selectedItemsSetRef.current;
			const newSelectionSet = new Set(currentSelectedItems);

			ids.forEach((id) => {
				newSelectionSet.add(id);
			});

			if (newSelectionSet.size !== currentSelectedItems.size) {
				notifySelectionChange(Array.from(newSelectionSet));
			}
		},
		[notifySelectionChange],
	);

	// Funciones de utilidad para el componente padre
	const getSelectedItems = useCallback(() => {
		// ✅ Usar datos originales para obtener TODOS los elementos seleccionados
		return selectedItems
			.map((item) => originalDataRef.current.find((d) => d.id === item))
			.filter((item): item is T => item !== undefined);
	}, [selectedItems]);

	const clearSelection = useCallback(() => {
		notifySelectionChange([]);
	}, [notifySelectionChange]);

	const selectAll = useCallback(() => {
		const allIndices = data.map((item) => item.id);
		notifySelectionChange(allIndices);
	}, [dataLength, notifySelectionChange]);

	const setSelection = useCallback(
		(ids: Array<T['id']>) => {
			notifySelectionChange(ids);
		},
		[notifySelectionChange],
	);

	const isItemSelected = useCallback(
		(id: string) => {
			return selectedItemsSet.has(id);
		},
		[selectedItemsSet],
	);

	return {
		selectedItems,
		selectedItemsSet,
		allSelected,
		indeterminate,
		handleSelectAll,
		handleRowSelect,
		handleBulkSelect,
		getSelectedItems,
		clearSelection,
		selectAll,
		setSelection,
		isItemSelected,
		selectedCount: selectedItems.length,
	};
}
