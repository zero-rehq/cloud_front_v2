// GenericTableVirtuoso.tsx - Con soporte para placeholderColumns durante scroll
import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { ChevronUp } from 'lucide-react';

import { createScrollerComponent } from './components/ScrollComponent/';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { useTableSelection } from './hooks/';
import type { JSX } from 'react';

const GenericTableVirtuosoInner = <T extends { id: string }>(
	{
		columns,
		data,
		selectable = true,
		usePlaceholderColumns = false,
		actions,
		placeholderColumns,
		onSelectionChange,
		initialSelectedItems,
		searchHandler,
		sortHandler,
		onSearchChange,
	}: GenericTableProps<T>,
	ref: React.Ref<GenericTableRef<T>>,
) => {
	const headerRef = useRef<HTMLDivElement>(null!);
	const virtuosoRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Estado para manejar el scrolling - Solo si usePlaceholderColumns es true
	const [isScrolling, setIsScrolling] = useState(false);

	// Detectar si hay columna de acciones
	const hasActionsColumn = useMemo(() => {
		return columns.some((col) => col.key === 'actions');
	}, [columns]);

	// Verificar si tenemos acciones para mostrar
	const hasActions = useMemo(() => {
		return hasActionsColumn && Boolean(actions && actions.length > 0);
	}, [hasActionsColumn, actions]);

	const {
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
		selectedCount,
	} = useTableSelection<T>({
		dataLength: data.length,
		onSelectionChange,
		data,
		initialSelectedItems: initialSelectedItems ? data.filter(item => initialSelectedItems.includes(item.id)) : undefined,
	});

	// ✅ Función de búsqueda desacoplada
	const handleSearch = useCallback(
		(searchTerm: string) => {
			// Usar el handler personalizado si está disponible
			if (searchHandler) {
				searchHandler.onSearch(searchTerm.trim() === '' ? '' : searchTerm, searchHandler.searchFields);
			}

			// También notificar al componente padre si tiene callback
			if (onSearchChange) {
				onSearchChange(searchTerm);
			}
		},
		[searchHandler, onSearchChange],
	);

	// Exponer funciones a través del ref
	useImperativeHandle(
		ref,
		() => ({
			getSelectedItems,
			clearSelection,
			handleRowSelect,
			handleBulkSelect,
			selectAll,
			setSelection,
			isItemSelected,
			selectedCount,
			search: handleSearch,
		}),
		[
			getSelectedItems,
			clearSelection,
			handleRowSelect,
			handleBulkSelect,
			selectAll,
			setSelection,
			isItemSelected,
			selectedCount,
			handleSearch,
		],
	);

	// Valores estables
	const checkboxWidth = useMemo(() => (selectable ? 48 : 0), [selectable]);
	const actionsWidth = useMemo(() => (hasActions ? 60 : 0), [hasActions]);

	// Scroller component memoizado
	const ScrollerComponent = useMemo(
		() =>
			createScrollerComponent({
				headerRef: headerRef,
			}),
		[],
	);

	// ItemContent altamente optimizado con soporte condicional para placeholders
	const itemContent = useCallback(
		(index: number, item: T, context: { isScrolling: boolean }) => {
			const row = data[index];
			const isSelected = selectedItemsSet.has(row.id);

			// ✅ Solo usar placeholders si usePlaceholderColumns es true
			const shouldUseScrolling = usePlaceholderColumns && context.isScrolling;
			const columnsToUse = shouldUseScrolling && placeholderColumns ? placeholderColumns : columns;

			return (
				<TableRow
					index={index}
					row={row}
					columns={columnsToUse}
					selectable={selectable}
					isSelected={isSelected}
					onRowSelect={handleRowSelect}
					checkboxWidth={checkboxWidth}
					hasActions={hasActions}
					actions={actions}
					actionsWidth={actionsWidth}
					isScrolling={shouldUseScrolling} // ✅ Solo pasar isScrolling si usePlaceholderColumns es true
					selectedCount={selectedCount}
				/>
			);
		},
		[
			data,
			selectedItemsSet,
			columns,
			placeholderColumns,
			usePlaceholderColumns, // ✅ Agregado a las dependencias
			selectable,
			handleRowSelect,
			checkboxWidth,
			hasActions,
			actions,
			actionsWidth,
			selectedCount,
		],
	);

	const headerProps = useMemo(
		() => ({
			columns,
			selectable,
			checkboxWidth,
			allSelected,
			indeterminate,
			onSelectAll: handleSelectAll,
			hasActions,
			actionsWidth,
			sortHandler,
		}),
		[
			columns,
			selectable,
			checkboxWidth,
			allSelected,
			indeterminate,
			handleSelectAll,
			hasActions,
			actionsWidth,
			sortHandler,
		],
	);

	// Context para pasar al Virtuoso
	const virtuosoContext = useMemo(() => ({ isScrolling }), [isScrolling]);

	// ✅ Props condicionales para Virtuoso
	const virtuosoProps = useMemo(() => {
		const baseProps = {
			style: { height: '100%' },
			totalCount: data.length,
			context: virtuosoContext,
			components: { Scroller: ScrollerComponent },
			itemContent,
			followOutput: false,
			alignToBottom: false,
		};

		// Solo agregar isScrolling si usePlaceholderColumns es true
		if (usePlaceholderColumns) {
			return {
				...baseProps,
				isScrolling: setIsScrolling,
			};
		}

		return baseProps;
	}, [data.length, virtuosoContext, ScrollerComponent, itemContent, usePlaceholderColumns]);

	return (
		<div
			ref={containerRef}
			className='h-full rounded-md shadow-md'
			style={{
				display: 'grid',
				gridTemplateRows: 'auto 1fr',
				overflow: 'hidden',
			}}
		>
			{/* Header */}
			<TableHeader ref={headerRef} {...headerProps} />

			{/* Virtuoso Container */}
			<div className='relative overflow-hidden'>
				{data.length > 0 && (
					<button
						onClick={() => {
							virtuosoRef.current.scrollToIndex({
								index: 1,
								align: 'center',
								behavior: 'smooth',
							});
						}}
						className='absolute bottom-4 right-4 z-30 flex items-center justify-center rounded-full bg-cursor p-1 opacity-40 hover:opacity-100'
					>
						<ChevronUp className='h-5 w-5 text-white' />
					</button>
				)}
				<Virtuoso ref={virtuosoRef} {...virtuosoProps} />
			</div>
		</div>
	);
};

export const GenericTableVirtuoso = memo(forwardRef(GenericTableVirtuosoInner)) as <T extends object>(
	props: GenericTableProps<T> & { ref?: React.Ref<GenericTableRef<T>> },
) => JSX.Element;
