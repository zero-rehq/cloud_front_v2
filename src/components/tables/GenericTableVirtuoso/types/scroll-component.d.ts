type ScrollerComponentProps = React.HTMLProps<HTMLDivElement> & {
	onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
};

interface CreateScrollerProps {
	headerRef: React.RefObject<HTMLDivElement>;
}
