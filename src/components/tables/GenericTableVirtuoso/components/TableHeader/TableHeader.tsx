// TableHeader.tsx - Actualizado para nueva tabla desacoplada
import { forwardRef, memo } from 'react';

import { ChevronUp } from 'lucide-react';

import { TableCheckbox } from '../TableCheckbox/';

export const TableHeader = memo(
	forwardRef<HTMLDivElement, TableHeaderProps<any>>(
		<T extends object>(
			{
				columns,
				selectable,
				checkboxWidth,
				allSelected,
				indeterminate,
				onSelectAll,
				hasActions,
				actionsWidth,
				sortHandler,
			}: TableHeaderProps<T>,
			ref: React.Ref<HTMLDivElement>,
		) => {
			// Filtrar columnas de datos (excluir 'actions')
			const dataColumns = columns.filter((col) => col.key !== 'actions');

			// ✅ Función actualizada para usar sortHandler
			const getSortIcon = (columnKey: keyof T) => {
				if (!sortHandler) return null;

				const { currentSortField, currentSortDirection } = sortHandler;
				const isCurrentSort = currentSortField === columnKey;

				if (isCurrentSort && currentSortDirection) {
					// Esta columna está siendo ordenada
					if (currentSortDirection === 'asc') {
						return (
							<ChevronUp className='h-4 w-4 rotate-0 transform text-cursor transition-transform duration-500 ease-in-out' />
						);
					} else {
						return (
							<ChevronUp className='h-4 w-4 rotate-180 transform text-cursor transition-transform duration-500 ease-in-out' />
						);
					}
				}

				return (
					<ChevronUp className='h-4 w-4 rotate-0 transform text-primary-fade-70 transition-all duration-300 ease-in-out hover:text-cursor' />
				);
			};

			const handleColumnClick = (columnKey: keyof T, sortable?: boolean) => {
				if (!sortable || !sortHandler) return;

				const { currentSortField, currentSortDirection, onSort, onResetSort } = sortHandler;

				if (currentSortField === columnKey) {
					// Mismo campo: ciclar ASC → DESC → RESET
					if (currentSortDirection === 'asc') {
						onSort(columnKey, 'desc');
					} else {
						onResetSort();
					}
				} else {
					// Campo diferente: empezar con ASC
					onSort(columnKey, 'asc');
				}
			};

			// ✅ Función actualizada para determinar si una columna está activamente ordenada
			const isActivelySorted = (columnKey: keyof T) => {
				if (!sortHandler) return false;
				return sortHandler.currentSortField === columnKey && sortHandler.currentSortDirection;
			};

			// Se le pone un padding right de 0.5 rem para suplir el espacio que deja el scroll
			return (
				<div
					ref={ref}
					className='scrollbar-hidden flex w-full overflow-x-auto border-b border-b-primary-fade-20 bg-card/95'
					style={{
						scrollbarWidth: 'none',
						msOverflowStyle: 'none',
					}}
				>
					<div className='flex w-full'>
						{/* Checkbox column header - Sticky izquierda */}
						{selectable && (
							<div
								className='sticky left-0 z-20 flex flex-shrink-0 items-center justify-center whitespace-nowrap bg-none px-4 py-2'
								style={{
									width: `${checkboxWidth}px`,
									minWidth: `${checkboxWidth}px`,
								}}
							>
								<TableCheckbox checked={allSelected} indeterminate={indeterminate} onChange={onSelectAll} />
							</div>
						)}

						{/* Data columns con anchos proporcionales */}
						{dataColumns.map((col, idx) => {
							const isSortable = col.sortable !== false && col.key !== 'actions';
							const isActiveSort = isActivelySorted(col.key as keyof T);
							const { icon: Icon } = col;

							return (
								<div
									key={`header-${col.key as string}-${idx}`}
									className={`flex flex-shrink-0 items-center gap-1 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-200 ${
										isSortable ? 'hover:bg-primary-fade-10 cursor-pointer select-none' : ''
									} ${isActiveSort ? 'bg-primary-fade-5 text-cursor' : ''}`}
									style={{
										width: col.grow ? '' : col.width,
										minWidth: col.width,
										textAlign: col.align ?? 'left',
										justifyContent:
											col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
										flexGrow: col.grow ? 1 : 0,
									}}
									onClick={() => handleColumnClick(col.key as keyof T, isSortable)}
								>
									{Icon && (
										<span className='flex-shrink-0'>
											<Icon className='h-4 w-4' />
										</span>
									)}
									<span title={col.label} className='truncate'>
										{col.label}
									</span>
									{isSortable && (
										<span
											title={
												isSortable ? `Click para ordenar por ${col.label} (ASC → DESC → Estado inicial)` : undefined
											}
											className='flex-shrink-0'
										>
											{getSortIcon(col.key as keyof T)}
										</span>
									)}
								</div>
							);
						})}

						{/* Actions column header - Sticky derecha */}
						{hasActions && (
							<div
								className='sticky right-0 z-20 flex flex-shrink-0 items-center justify-center whitespace-nowrap bg-none px-4 py-2'
								style={{
									width: `${actionsWidth}px`,
									minWidth: `${actionsWidth}px`,
								}}
							></div>
						)}
					</div>
				</div>
			);
		},
	),
) as <T extends object>(props: TableHeaderProps<T> & { ref?: React.Ref<HTMLDivElement> }) => JSX.Element;
