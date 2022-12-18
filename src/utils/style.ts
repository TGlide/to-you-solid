export const classes = (...classNames: unknown[]) => {
	return classNames.filter((n) => typeof n === 'string').join(' ');
};

export function pxToRem(px: number): number {
	return px / 16;
}
