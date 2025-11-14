import React, { memo, useCallback } from 'react';

import { MenuPopover } from '@/presentation/shared/components/ui/MenuPopover';

import { OptionsIcon } from '../../../CustomIcons';
import { TableCheckbox } from '../TableCheckbox/';

import clsx from 'clsx';

interface GalleryItemProps<T> {
	item: T;
	index: number;
	isSelected: boolean;
	onSelect: (id: string | number) => void; // Soportar string y number
	actions?: ActionItem<T>[];
	isScrolling?: boolean;
	selectable?: boolean;
	children: React.ReactNode; // El contenido específico del template
	className?: string;
}

export const GalleryItem = memo(<T extends { id: string | number }>(props: GalleryItemProps<T>) => {
	const {
		item,
		index,
		isSelected,
		onSelect,
		actions = [],
		isScrolling = false,
		selectable = true,
		children,
		className,
	} = props;

	const handleSelect = useCallback(() => {
		if (!isScrolling) {
			onSelect(item.id);
		}
	}, [item.id, onSelect, isScrolling]);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (!isScrolling && selectable) {
				e.preventDefault();
				handleSelect();
			}
		},
		[handleSelect, isScrolling, selectable],
	);

	const renderCheckbox = useCallback(() => {
		if (isScrolling) {
			return <div className='h-4 w-4 animate-pulse rounded bg-gray-200' />;
		}
		return <TableCheckbox checked={isSelected} onChange={handleSelect} />;
	}, [isScrolling, isSelected, handleSelect]);

	const renderActions = useCallback(() => {
		if (isScrolling) {
			return <div className='h-6 w-6 animate-pulse rounded bg-gray-200' />;
		}

		if (!actions || actions.length === 0) {
			return null;
		}

		return (
			<MenuPopover
				trigger={
					<div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary-fade-50 text-white shadow-xl transition-colors hover:bg-primary'>
						<OptionsIcon className='h-5 w-5 rotate-90' />
					</div>
				}
				actions={actions}
				row={item}
				index={index}
				placement='bottom-end'
				disabled={isScrolling}
			/>
		);
	}, [isScrolling, actions, item, index]);

	return (
		<div
			className={clsx(
				'gallery-item relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200',
				{
					'bg-primary-fade-5 border-primary-fade-50': !isSelected,
					'bg-primary-fade-10 border-primary': isSelected,
					'opacity-80': isScrolling,
					'hover:border-primary-fade-70': !isScrolling && !isSelected,
					'hover:bg-primary-fade-15': !isScrolling && isSelected,
				},
				className,
			)}
			onClick={handleClick}
			style={{
				pointerEvents: isScrolling ? 'none' : 'auto',
				transition: isScrolling ? 'none' : 'all 0.2s ease',
			}}
		>
			{/* Checkbox en esquina superior izquierda */}
			{selectable && <div className='absolute left-2 top-2 z-10'>{renderCheckbox()}</div>}

			{/* Actions en esquina superior derecha */}
			{actions && actions.length > 0 && <div className='absolute right-2 top-2 z-10'>{renderActions()}</div>}

			{/* Contenido del template */}
			<div className='pt-2'>{children}</div>
		</div>
	);
}) as <T extends { id: string | number }>(props: GalleryItemProps<T>) => JSX.Element;
