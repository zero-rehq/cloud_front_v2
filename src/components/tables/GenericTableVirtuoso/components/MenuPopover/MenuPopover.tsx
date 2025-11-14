// MenuPopover.tsx
import { useCallback } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '../../../../../components/UI/dropdown-menu';
import { useMenuPopoverClasses } from './hooks';

import clsx from 'clsx';

export const MenuPopover = <T,>({
	trigger,
	actions = [],
	row,
	index,
	isOpen: controlledIsOpen,
	onOpenChange,
	placement = 'bottom-end',
	className,
	disabled = false,
}: MenuPopoverProps<T>) => {
	const classes = useMenuPopoverClasses();

	// Filtrar acciones habilitadas
	const enabledActions = actions.filter((action) => !action.disabled || !action.disabled(row, index));

	// Manejar click en acción
	const handleActionClick = useCallback(
		(action: ActionItem<T>) => {
			if (!action.disabled || !action.disabled(row, index)) {
				// Solo ejecutar onClick si existe (no es un submenú)
				if (action.onClick) {
					action.onClick(row, index);
				}
			}
		},
		[row, index],
	);

	// Mapear placement a side de Shadcn
	const getSide = () => {
		switch (placement) {
			case 'bottom-start':
			case 'bottom-end':
				return 'bottom';
			case 'top-start':
			case 'top-end':
				return 'top';
			case 'left':
				return 'left';
			case 'right':
				return 'right';
			default:
				return 'bottom';
		}
	};

	// Mapear placement a align de Shadcn
	const getAlign = () => {
		switch (placement) {
			case 'bottom-start':
			case 'top-start':
				return 'start';
			case 'bottom-end':
			case 'top-end':
				return 'end';
			case 'left':
			case 'right':
				return 'center';
			default:
				return 'end';
		}
	};

	// Renderizar un elemento del menú
	const renderMenuItem = useCallback(
		(action: ActionItem<T>, actionIndex: number) => {
			const { icon: Icon } = action;
			const isDisabled = action.disabled?.(row, index) ?? false;
			const hasSubmenu = action.submenu && action.submenu.length > 0;

			// Renderizar separador
			if (action.divider) {
				return <DropdownMenuSeparator key={`divider-${actionIndex}`} />;
			}

			// Renderizar submenú
			if (hasSubmenu) {
				return (
					<DropdownMenuSub key={actionIndex}>
						<DropdownMenuSubTrigger
							disabled={isDisabled}
							className={clsx(classes.variants[action.variant ?? 'secondary'], action.className)}
						>
							{Icon && <Icon className='h-4 w-4' />}
							{action.label}
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{action.submenu!.map((subAction, subIndex) => {
								const subIsDisabled = subAction.disabled?.(row, index) ?? false;
								return (
									<DropdownMenuItem
										key={subIndex}
										disabled={subIsDisabled}
										onClick={() => handleActionClick(subAction)}
										className={clsx(classes.variants[subAction.variant ?? 'secondary'], subAction.className)}
									>
										{subAction.icon && <subAction.icon className='h-4 w-4' />}
										{subAction.label}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				);
			}

			// Renderizar elemento normal del menú
			return (
				<DropdownMenuItem
					key={actionIndex}
					disabled={isDisabled}
					onClick={() => handleActionClick(action)}
					className={clsx(classes.variants[action.variant ?? 'secondary'], action.className)}
				>
					{Icon && <Icon className='h-4 w-4' />}
					{action.label}
				</DropdownMenuItem>
			);
		},
		[classes, row, index, handleActionClick],
	);

	return (
		<DropdownMenu open={controlledIsOpen} onOpenChange={disabled ? undefined : onOpenChange}>
			<DropdownMenuTrigger asChild>
				<div
					className={clsx(
						classes.trigger,
						disabled && classes.triggerDisabled,
						controlledIsOpen && classes.triggerActive,
					)}
				>
					{trigger}
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				side={getSide()}
				align={getAlign()}
				sideOffset={8}
				alignOffset={0}
				className={clsx(className)}
			>
				{enabledActions.length > 0 ? (
					enabledActions.map((action: ActionItem<T>, actionIndex) => renderMenuItem(action, actionIndex))
				) : (
					<div className={classes.emptyState}>No hay acciones disponibles</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
