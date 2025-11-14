import { memo } from 'react';

import clsx from 'clsx';

export const TableCheckbox = memo<TableCheckboxProps>(
	({ checked, indeterminate = false, onChange, className, size = 'md' }) => {
		const sizeClasses = {
			sm: 'w-3 h-3',
			md: 'w-4 h-4',
		};

		const iconSizeClasses = {
			sm: 'w-2 h-2',
			md: 'w-3 h-3',
		};

		return (
			<div
				className={clsx(
					'flex cursor-pointer items-center justify-center rounded-sm border transition-colors duration-200',
					sizeClasses[size],
					checked || indeterminate
						? 'border-cursor bg-cursor text-white'
						: 'border-bgMono bg-transparent hover:border-gray-600',
					className,
				)}
				onClick={onChange}
			>
				{indeterminate ? (
					// Icono de indeterminate (línea horizontal)
					<div className={clsx('bg-white', size === 'sm' ? 'h-0.5 w-1.5' : 'h-0.5 w-2')} />
				) : checked ? (
					// Icono de check
					<svg className={iconSizeClasses[size]} fill='currentColor' viewBox='0 0 20 20'>
						<path
							fillRule='evenodd'
							d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
							clipRule='evenodd'
						/>
					</svg>
				) : null}
			</div>
		);
	},
);
TableCheckbox.displayName = 'GenericTableCheckbox';
