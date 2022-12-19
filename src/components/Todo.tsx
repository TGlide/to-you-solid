import { Component } from 'solid-js';
import { createServerAction$ } from 'solid-start/server';
import { DATABASE_ID, TODO_COLLECTION_ID } from '~/constants';
import { databases } from '~/lib/appwrite';
import { sessionKey } from '~/lib/session';
import { isAddTodoInput, isUpdateTodoInput, TodoDocument } from '~/types/todo';
import { Checkbox } from '~/UI/Checkbox';
import { Icon } from '~/UI/Icon';
import { formDataToObject, objectFilter } from '~/utils/object';
import { classes } from '~/utils/style';

import styles from './Todo.module.scss';

type Props = {
	todo: TodoDocument;
	disabled?: boolean;
};

export const Todo: Component<Props> = (props) => {
	const [, deleteTodo] = createServerAction$(async (formData: FormData) => {
		const { id } = formDataToObject(formData);

		if (!id || typeof id !== 'string') {
			return console.error('Error on todo delete: Invalid data');
		}

		await databases.deleteDocument(DATABASE_ID, TODO_COLLECTION_ID, id);
	});

	const [, updateTodo] = createServerAction$(async (formData: FormData) => {
		const data = formDataToObject(await formData, {
			transformers: { checked: (v) => v === 'true' },
			defaultValues: { checked: false }
		});

		
		if (!isUpdateTodoInput(data)) {
			return console.error('Error on todo update: Invalid data');
		}
		
		const updateObj = objectFilter(data, (k) => k !== 'id');

		await databases.updateDocument<TodoDocument>(
			DATABASE_ID,
			TODO_COLLECTION_ID,
			data.id,
			updateObj
		);
	});

	return (
		<div
			class={classes(styles.todo)}
			classList={{ disabled: props.disabled }}
		>
		<updateTodo.Form>
			<input type="hidden" name="id" value={props.todo.$id} />
			<input type="hidden" name="checked" value={`${!props.todo.checked}`} />
			<Checkbox checked={props.todo.checked} />
		</updateTodo.Form>

			<div class={styles.title} classList={{ checked: props.todo.checked }}>
				<span>{props.todo.title}</span>
			</div>

			<div class={styles.points}>
				<span>{props.todo.points}</span>
				<Icon icon="star" />
			</div>

		<deleteTodo.Form>
			<input type="hidden" name="id" value={props.todo.$id} />
			<button class={classes('clickable', styles.clickable)}>
				<Icon icon="trash-2" />
			</button>
			</deleteTodo.Form>
		</div>
	);
};
