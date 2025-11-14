import { useCallback, useEffect, useRef, useState } from 'react';

export const useSubmenuPosition = () => {
	const [position, setPosition] = useState<'top' | 'bottom'>('top');
	const submenuRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const calculatePosition = useCallback(() => {
		if (!submenuRef.current || !containerRef.current) return;

		const submenu = submenuRef.current;
		const container = containerRef.current;
		const viewport = window.innerHeight;

		// Obtener posición del contenedor relative al viewport
		const containerRect = container.getBoundingClientRect();

		// Simular altura del submenú (estimación conservadora)
		const submenuHeight = submenu.children.length * 40 + 16; // ~40px por item + padding

		// Calcular si hay espacio abajo
		const spaceBelow = viewport - (containerRect.top + containerRect.height);
		const spaceAbove = containerRect.top;

		// Decidir posición basada en el espacio disponible
		if (spaceBelow >= submenuHeight) {
			setPosition('top'); // Alineado al top del container
		} else if (spaceAbove >= submenuHeight) {
			setPosition('bottom'); // Alineado al bottom del container
		} else {
			// Si no hay espacio suficiente en ningún lado, preferir arriba
			setPosition(spaceAbove > spaceBelow ? 'bottom' : 'top');
		}
	}, []);

	const handleMouseEnter = useCallback(() => {
		// Calcular posición cuando el mouse entra
		setTimeout(calculatePosition, 10); // Small delay para asegurar que el DOM esté listo
	}, [calculatePosition]);

	useEffect(() => {
		// Recalcular en resize de ventana
		window.addEventListener('resize', calculatePosition);
		return () => window.removeEventListener('resize', calculatePosition);
	}, [calculatePosition]);

	return {
		position,
		submenuRef,
		containerRef,
		handleMouseEnter,
	};
};
