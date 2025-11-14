// hooks/useMenuPopoverClasses.tsx
import { useMemo } from 'react';

import clsx from 'clsx';

export const useMenuPopoverClasses = () => {
	return useMemo(
		() => ({
			// Trigger styles
			actionButton: clsx(
				'w-6 h-6 rounded text-xs text-white cursor-pointer',
				'bg-primary-fade-50 hover:bg-cursor',
				'flex items-center justify-center',
				'transition-colors',
			),
			trigger: clsx(
				'inline-flex items-center justify-center cursor-pointer',
				'transition-colors duration-200 hover:bg-gray-100 rounded-md',
				'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
			),
			triggerDisabled: 'cursor-not-allowed opacity-50 hover:bg-transparent',
			triggerActive: 'bg-gray-100',

			menu: clsx(
				'bg-bgPaper rounded-lg shadow-lg border border-paperPrimary-65',
				'py-2 px-2',
				// Animaciones mejoradas
				'data-[state=open]:animate-in data-[state=closed]:animate-out',
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
				'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
				'data-[side=bottom]:slide-in-from-top-2',
				'data-[side=left]:slide-in-from-right-2',
				'data-[side=right]:slide-in-from-left-2',
				'data-[side=top]:slide-in-from-bottom-2',
				'duration-200',
			),

			// Menu content
			menuContent: 'space-y-1',

			// Menu items
			menuItem: clsx(
				'w-full py-2 px-3 text-left text-sm font-medium',
				'flex items-center gap-3 rounded-md',
				'transition-colors duration-150',
				'focus:outline-none focus:ring-0',
				'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
				// Mejorar la interacción
				'select-none cursor-pointer',
			),

			// Menu item variants
			variants: {
				primary: clsx('text-bgMono hover:text-white hover:bg-paperPrimary-65', 'focus:bg-paperPrimary-65'),
				secondary: clsx('text-gray-700 hover:bg-red-700 ', 'focus:bg-gray-50 focus:text-gray-900'),
				danger: clsx('text-red-700 hover:bg-red-50 hover:text-red-800', 'focus:bg-red-50 focus:text-red-800'),
			},

			// Menu item parts
			menuItemIcon: 'flex-shrink-0 w-4 h-4',
			menuItemLabel: 'flex-1 truncate', // truncate para textos largos

			// States
			disabled: 'cursor-not-allowed opacity-50 hover:bg-transparent',

			// Empty state
			emptyState: clsx(
				'px-3 py-2 text-sm text-gray-500 italic text-center',
				'min-h-[40px] flex items-center justify-center',
			),

			// Submenu styles
			submenuContainer: clsx('relative group'),
			submenuTrigger: clsx(
				'w-full py-2 px-3 text-left text-sm font-medium',
				'flex items-center gap-3 rounded-md',
				'transition-colors duration-150',
				'hover:bg-gray-50 focus:bg-gray-50',
				'focus:outline-none focus:ring-0',
				'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
				'select-none cursor-pointer',
			),
			submenuArrow: clsx('ml-auto h-4 w-4 transition-transform duration-200', 'group-hover:-translate-x-1'),
			submenuContent: clsx(
				'absolute right-full top-0 mr-1 z-50',
				'bg-bgPaper rounded-lg shadow-lg border border-paperPrimary-65',
				'py-2 px-2 min-w-[200px]',
				'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
				'transition-all duration-200 ease-out',
				'transform -translate-x-2 group-hover:translate-x-0',
				// Clases para posicionamiento inteligente
				'submenu-content',
			),
			// Variantes de posición para el submenú
			submenuContentBottom: clsx(
				'absolute right-full bottom-0 mr-1 z-50',
				'bg-bgPaper rounded-lg shadow-lg border border-paperPrimary-65',
				'py-2 px-2 min-w-[200px]',
				'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
				'transition-all duration-200 ease-out',
				'transform -translate-x-2 group-hover:translate-x-0',
			),
			submenuList: 'space-y-1',

			// Divider styles
			divider: clsx('my-2 h-px bg-gray-200', 'border-0'),
		}),
		[],
	);
};
