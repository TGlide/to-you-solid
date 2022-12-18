import { Icon } from '~/UI/Icon';

import { Component } from 'solid-js';
import styles from './Checkbox.module.scss';
import { classes } from '~/utils/style';

type Props = {
	checked?: boolean;
};

export const Checkbox: Component<Props> = (props) => {
	return (
		<button class={classes('btn', 'btn-icon', styles.button)}>
			<div class={classes(styles.iconWrapper, props.checked && styles.checked)}>
				<Icon icon="check" />
			</div>
		</button>
	);
};
