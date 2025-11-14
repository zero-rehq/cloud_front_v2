import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { useTableRowClasses } from '../../hooks/';
import { TableCheckbox } from '../TableCheckbox/';
import { MenuPopover } from '../MenuPopover';
import { OptionsIcon } from '@/components/custom-icons';





export const TableRow = memo<TableRowProps<any>>(
	({
		index,
		row,
		columns,
		selectable,
		isSelected,
		onRowSelect,
		checkboxWidth,
		hasActions,
		actions = [],
		actionsWidth,
		isScrolling = false,
		selectedCount = 0,
	}) => {
		const handleCheckboxChange = useCallback(() => {
			onRowSelect(row.id);
		}, [row.id, onRowSelect]);

		const handleRowClick = useCallback(
			(_: React.MouseEvent) => {
				if (!isScrolling) {
					if (selectable) {
						onRowSelect(row.id);
					}
				}
			},
			[row.id, onRowSelect, selectable, isScrolling],
		);

		const classes = useTableRowClasses(index, Boolean(isSelected && true), true);
		const dataColumns = columns.filter((col) => col.key !== 'actions');

		const renderCellContent = useCallback(
			(col: ColumnConfig<any>, _colIndex: number) => {
				// Si estamos scrolling y la columna tiene placeholder, usarlo
				const value = row[col.key];
				if (isScrolling && col.placeholder) {
					return col.placeholder(value, row, index);
				}

				// Renderizado normal cuando no estamos scrolling
				if (col.render) {
					return col.render(value, row, index, isScrolling);
				}
				if (value === undefined || value === null) return String('-');
				return <div className='px-4 py-2'> {String(value)}</div>;
			},
			[row, index, isScrolling],
		);

		const renderCheckbox = useCallback(() => {
			if (isScrolling) {
				// Placeholder simple para checkbox durante scroll
				return <div className='h-4 w-4 animate-pulse rounded bg-gray-200' />;
			}
			return <TableCheckbox checked={isSelected} onChange={handleCheckboxChange} />;
		}, [isScrolling, isSelected, handleCheckboxChange]);

		const renderActions = useCallback(() => {
			if (isScrolling) {
				// Placeholder para acciones durante scroll
				return <div className='h-6 w-6 animate-pulse rounded bg-gray-200' />;
			}

			// Si no hay acciones, mostrar placeholder vacío
			if (actions.length === 0) {
				return <div className='h-6 w-6' />;
			}

			// Ocultar acciones si hay 2 o más items seleccionados
			if (selectedCount >= 2) {
				return <div className='h-6 w-6' />;
			}

			return (
				<MenuPopover
					trigger={
						<div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/50 text-white shadow-xl transition-colors hover:bg-primary'>
							<OptionsIcon className='h-5 w-5 rotate-90' />
						</div>
					}
					actions={actions}
					row={row}
					index={index}
					placement='bottom-end'
					disabled={isScrolling}
				/>
			);
		}, [isScrolling, actions, row, index, selectedCount]);

		return (
			<div
				className={clsx(classes.row, `w-fit min-w-full ${isSelected ? '' : ''}`)}
				style={{
					// Reducir opacidad ligeramente durante scroll para indicar estado placeholder
					opacity: isScrolling ? 0.8 : 1,
					// Desactivar transiciones durante scroll para mejor rendimiento
					transition: isScrolling ? 'none' : 'all 0.2s ease',
					// Desactivar pointer events durante scroll para evitar clicks accidentales
					pointerEvents: isScrolling ? 'none' : 'auto',
				}}
			>
				{selectable && (
					<div
						className={classes.checkboxColumn}
						style={{
							width: `${checkboxWidth}px`,
							minWidth: `${checkboxWidth}px`,
						}}
						onClick={(e) => {
							handleRowClick(e);
							if (!isScrolling) {
								e.stopPropagation();
							}
						}}
					>
						{renderCheckbox()}
					</div>
				)}

				{dataColumns.map((col, colIndex) => {
					const cellContent = renderCellContent(col, colIndex);
					return (
						<div
							key={`${col.key as string}-${colIndex}`}
							className={classes.column}
							style={{
								width: col.grow ? '' : col.width,
								minWidth: col.width,
								textAlign: col.align ?? 'left',
								flexGrow: col.grow ? 1 : 0,
								display: col.hideRow ? 'none' : undefined,
							}}
						>
							{cellContent}
						</div>
					);
				})}

				{hasActions && (
					<div
						className={classes.actionsColumn}
						style={{
							width: `${actionsWidth}px`,
							minWidth: `${actionsWidth}px`,
						}}
						onClick={(e) => {
							if (!isScrolling) {
								e.stopPropagation();
							}
						}}
					>
						{renderActions()}
					</div>
				)}
			</div>
		);
	},
);

TableRow.displayName = 'TableRow';
