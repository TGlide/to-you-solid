import { Icon } from '~/UI/Icon';

import { Component } from 'solid-js';
import styles from './Checkbox.module.scss';
import { classes } from '~/utils/style';

type Props = {
	checked?: boolean;
	formaction?: string;
};

export const Checkbox: Component<Props> = (props) => {
	return (
		<button
			class={classes('btn', 'btn-icon', styles.button)}
			formaction={props.formaction}
			type="submit"
		>
			<div class={classes(styles.iconWrapper, props.checked && styles.checked)}>
				<Icon icon="check" />
			</div>
		</button>
	);
};
