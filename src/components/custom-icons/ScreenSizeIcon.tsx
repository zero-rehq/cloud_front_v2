export const ScreenSizeIcon = (props: IconProps) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' {...props} viewBox='0 0 24 24'>
			<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}>
				<rect width={18.5} height={15.5} x={2.75} y={4.25} rx={3}></rect>
				<path d='M6.75 12.25v-4h4m6.5 3.5v4h-4'></path>
			</g>
		</svg>
	);
};
