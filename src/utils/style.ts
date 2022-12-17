export const classes = (...classNames: string[]) => {
	return classNames.filter(Boolean).join(' ');
};

export function pxToRem(px: number): number {
	return px / 16;
}
