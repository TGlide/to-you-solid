import { Component } from 'solid-js';
import { createServerAction$, redirect } from 'solid-start/server';
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

const delFn = async (formData: FormData) => {
	const { id } = formDataToObject(formData);

	if (!id || typeof id !== 'string') {
		return console.error('Error on todo delete: Invalid data');
	}

	await databases.deleteDocument(DATABASE_ID, TODO_COLLECTION_ID, id);
	return redirect('/');
};

const updateFn = async (formData: FormData) => {
	const data = formDataToObject(await formData, {
		transformers: { checked: (v) => v === 'true' },
		defaultValues: { checked: false }
	});

	if (!isUpdateTodoInput(data)) {
		return console.error('Error on todo update: Invalid data');
	}

	const updateObj = objectFilter(data, (k) => k !== 'id');
	await databases.updateDocument<TodoDocument>(DATABASE_ID, TODO_COLLECTION_ID, data.id, updateObj);

	return redirect('/');
};

export const Todo: Component<Props> = (props) => {
	const [deleting, del] = createServerAction$(delFn);
	const [updating, update] = createServerAction$(updateFn);

	return (
		<div
			class={classes(styles.todo)}
			classList={{ [styles.disabled]: props.disabled || deleting.pending }}
		>
			<update.Form>
				<input type="hidden" name="id" value={props.todo.$id} />
				<input type="hidden" name="checked" value={`${props.todo.checked === false}`} />
				<Checkbox
					checked={
						updating.pending ? updating.input?.get('checked') === 'true' : props.todo.checked
					}
				/>
			</update.Form>

			<div class={styles.title} classList={{ checked: props.todo.checked }}>
				<span>{props.todo.title}</span>
			</div>

			<div class={styles.points}>
				<span>{props.todo.points}</span>
				<Icon icon="star" />
			</div>

			<del.Form>
				<input type="hidden" name="id" value={props.todo.$id} />
				<button class={classes('clickable', styles.clickable)}>
					<Icon icon="trash-2" />
				</button>
			</del.Form>
		</div>
	);
};
