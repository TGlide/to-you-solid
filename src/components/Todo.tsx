import { Component } from 'solid-js';
import { TodoDocument } from '~/types/todo';
import { Checkbox } from '~/UI/Checkbox';
import { Icon } from '~/UI/Icon';
import { classes } from '~/utils/style';

import styles from './Todo.module.scss';

type Props = {
	todo: TodoDocument;
	disabled?: boolean;
};

export const Todo: Component<Props> = (props) => {
	return (
		<form
			class={classes(styles.todo, styles.form)}
			method="post"
			action="/?/delete"
			classList={{ disabled: props.disabled }}
		>
			<input type="hidden" name="id" value={props.todo.$id} />
			<input type="hidden" name="checked" value={!props.todo.checked} />

			<Checkbox
				checked={props.todo.checked}
				// formaction="/?/update"
			/>

			<div class={styles.title} classList={{ checked: props.todo.checked }}>
				<span>{props.todo.title}</span>
			</div>

			<div class={styles.points}>
				<span>{props.todo.points}</span>
				<Icon icon="star" />
			</div>

			<button class={styles.clickable}>
				<Icon icon="trash-2" />
			</button>
		</form>
	);
};
