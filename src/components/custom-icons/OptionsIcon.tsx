export const OptionsIcon = (props: IconProps) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' {...props} viewBox='0 0 24 24'>
			<g fill='none' stroke='currentColor' strokeWidth={1}>
				<path strokeLinecap='round' strokeLinejoin='round' d='M4 8h9m4 0h3m-9 8h9M4 16h3'></path>
				<circle cx={9} cy={16} r={2}></circle>
				<circle cx={15} cy={8} r={2}></circle>
			</g>
		</svg>
	);
};
