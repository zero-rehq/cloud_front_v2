import clsx from 'clsx';

export const useTableRowClasses = (index: number, isSelected: boolean, isClickable: boolean) => {
	const isEven = index % 2 === 0;

	return {
		row: clsx(
			'flex group items-center',
			isClickable && 'hover:bg-card/65 hover:text-cursor transition-colors duration-300',
			!isSelected && (isEven ? 'bg-card/95' : 'bg-card/75'),
			isSelected && 'bg-background/65 text-cursor',
		),
		column: 'text-sm truncate whitespace-nowrap flex-shrink-0',
		checkboxColumn: clsx(
			'py-4  px-4 text-sm  cursor-pointer truncate whitespace-nowrap flex-shrink-0',
			'flex items-center justify-center',
			'sticky left-0 z-10',
			'transition-opacity duration-200',
			isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
		),
		actionsColumn: clsx(
			'py-2 px-4 text-sm truncate whitespace-nowrap flex-shrink-0',
			'flex items-center justify-center',
			'sticky right-0 z-10',
			'transition-opacity duration-200',
			isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
		),
		checkbox: clsx('w-4 h-4 rounded-md border border-bgMono', 'transition-colors duration-200'),
	};
};
