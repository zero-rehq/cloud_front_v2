// utils.ts

// ✅ Nueva función para calcular anchos proporcionales
export function calculateProportionalWidths<T>(
	columns: Array<ColumnConfig<T>>,
	containerWidth: number,
	checkboxWidth: number = 0,
	actionsWidth: number = 0,
): Array<{ width: string; minWidth: string; flexGrow: number }> {
	// Filtrar solo las columnas de datos (sin 'actions')
	const dataColumns = columns.filter((col) => col.key !== 'actions');

	// Calcular el ancho total de las columnas de datos
	const totalDataColumnsWidth = dataColumns.reduce((total, col) => {
		const match = col.width.match(/^(\d+)px$/);
		if (!match) {
			throw new Error(`Invalid width format: ${col.width}. Expected format like '100px'.`);
		}
		const width = parseInt(match[1], 10);
		return total + width;
	}, 0);

	// Ancho ocupado por elementos fijos (checkbox + acciones)
	const fixedWidth = checkboxWidth + actionsWidth;

	// Ancho disponible para las columnas de datos
	const availableWidth = containerWidth - fixedWidth;

	// ✅ CAMBIO: Forzar expansión incluso si hay poco espacio extra
	// Si el contenido es más ancho que el container, usar anchos originales
	if (totalDataColumnsWidth >= availableWidth) {
		return dataColumns.map((col) => ({
			width: col.width,
			minWidth: col.width,
			flexGrow: 0,
		}));
	}

	// Espacio extra a distribuir
	const extraSpace = availableWidth - totalDataColumnsWidth;

	// ✅ CAMBIO: Solo expandir si hay suficiente espacio extra (más de 50px)
	if (extraSpace < 50) {
		return dataColumns.map((col) => ({
			width: col.width,
			minWidth: col.width,
			flexGrow: 0,
		}));
	}

	// Calcular anchos proporcionales
	const result = dataColumns.map((col, _) => {
		const originalWidth = parseInt(col.width.match(/^(\d+)px$/)![1], 10);
		const proportion = originalWidth / totalDataColumnsWidth;
		const extraWidth = extraSpace * proportion;
		const finalWidth = originalWidth + extraWidth;

		return {
			width: `${Math.round(finalWidth)}px`,
			minWidth: col.width, // Mantener el mínimo original
			flexGrow: proportion, // Para CSS flex si es necesario
		};
	});

	return result;
}
