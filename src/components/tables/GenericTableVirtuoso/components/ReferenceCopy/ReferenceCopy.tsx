import { toast } from 'sonner';
import { CopyIcon } from '@/components/custom-icons';

export const ReferenceCopy = (props: { value: string; showCopyIcon?: boolean }) => {
	const { value, showCopyIcon = true } = props;

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(ref);
		toast.success('¡Copiado!');
	};

	if (!value) return <></>;

	const ref = String(value);

	if (!ref) return <></>;

	// Verificar si hay múltiples referencias
	const references = ref
		.split(',')
		.map((ref: string) => ref.trim())
		.filter((ref: string) => ref);

	// Si solo hay una referencia
	if (references.length === 1) {
		return (
			<div
				onClick={copyToClipboard}
				className='group z-40 flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-all duration-300 hover:text-primary'
			>
				{showCopyIcon && (
					<CopyIcon className='h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
				)}
				<span
					className={
						showCopyIcon ? 'translate-x-[-0.3rem] transition-transform duration-300 group-hover:translate-x-1' : ''
					}
				>
					{ref}
				</span>
			</div>
		);
	}

	// Si hay múltiples referencias, mostrar un dropdown/menú
	return (
		<div
			onClick={copyToClipboard}
			className='group flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all duration-300 hover:text-primary'
		>
			{showCopyIcon && (
				<CopyIcon className='h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
			)}
			<span
				className={
					showCopyIcon ? 'translate-x-[-0.3rem] transition-transform duration-300 group-hover:translate-x-1' : ''
				}
			>
				{references.length} refs
			</span>
		</div>
	);
};
