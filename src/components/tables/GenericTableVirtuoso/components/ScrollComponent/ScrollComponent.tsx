// ScrollerComponent.tsx
import React, { forwardRef } from 'react';

export function createScrollerComponent({ headerRef }: CreateScrollerProps) {
	return forwardRef<HTMLDivElement, ScrollerComponentProps>((props, ref) => {
		// Combinar clases existentes con la nueva clase de scrollbar
		const combinedClassName = `${props.className || ''} `.trim();

		const handleInternalScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const target = e.currentTarget;

			// Sincronizar scroll horizontal con el header
			if (headerRef.current && target) {
				headerRef.current.scrollLeft = target.scrollLeft;
			}

			// Llamar al onScroll original si existe
			if (props.onScroll) {
				props.onScroll(e);
			}
		};

		return <div {...props} ref={ref} className={combinedClassName} onScroll={handleInternalScroll} />;
	});
}
