import featherSprite from 'feather-icons/dist/feather-sprite.svg';

import { Component, mergeProps } from 'solid-js';
import styles from './Icon.module.scss';

const sizeMap = {
	sm: '0.75rem',
	base: '1rem',
	md: '1.25rem',
	lg: '1.5rem',
	xl: '2.25rem'
} as const;
type Size = keyof typeof sizeMap;

type Props = {
	size?: Size;
	icon: string;
};

export const Icon: Component<Props> = (props) => {
	const width = () => sizeMap[props.size || 'base'];
	const height = () => sizeMap[props.size || 'base'];
	const href = () => `${featherSprite}#${props.icon}`;

	return (
		<svg class={styles.icon} style={{ width: width(), height: height() }}>
			<use href={href()} />
		</svg>
	);
};
