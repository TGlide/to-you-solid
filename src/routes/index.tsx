import { Query } from 'appwrite';
import { For } from 'solid-js';
import { useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';
import { Todo } from '~/components/Todo';
import { DATABASE_ID, TODO_COLLECTION_ID } from '~/constants';
import { databases } from '~/lib/appwrite';
import { sessionKey } from '~/lib/session';
import { isModelsDocumentList } from '~/types/appwrite';
import { isAddTodoInput, isTodo, TodoDocument } from '~/types/todo';
import { Icon } from '~/UI/Icon';
import { formDataToObject } from '~/utils/object';
import { classes } from '~/utils/style';
import styles from './index.module.scss';

export function routeData() {
	return createServerData$(async (_, ev) => {
		// TODO: Implement cookie session
		const todos = await databases.listDocuments(DATABASE_ID, TODO_COLLECTION_ID, [
			Query.equal('session_key', sessionKey)
		]);

		if (isModelsDocumentList(todos, isTodo)) {
			return todos;
		}

		throw new Error('Failed to load todos');
	});
}

export default function Home() {
	const todos = useRouteData<typeof routeData>();
	const [_, { Form }] = createServerAction$(async (formData: FormData) => {
		const data = formDataToObject(formData, { transformers: { points: Number } });

		if (!isAddTodoInput(data)) {
			return console.error('Error on todo add: Invalid data');
		}

		return await databases.createDocument<TodoDocument>(
			DATABASE_ID,
			TODO_COLLECTION_ID,
			'unique()',
			{
				...data,
				session_key: sessionKey
			}
		);
	});

	return (
		<div class={classes(styles.container, 'container')}>
			<div class={styles.header}>
				<div class={styles.points}>
					{/* <Counter value={points} /> */}
					<Icon icon="star" />
				</div>
				<div class={styles.actions}>
					<form method="post" action="?/deleteChecked">
						<button
							class="clickable color-red-60"
							// disabled={$todoStore.filter((t) => t.checked).length === 0}
						>
							Clear all completed
						</button>
					</form>
				</div>
			</div>
			<Form class={styles.addWrapper}>
				<input class={classes('input', styles.title)} placeholder="Todo title" name="title" />
				<input
					class={classes('input', styles.points)}
					value="1"
					type="number"
					name="points"
					min="1"
					max="10"
				/>
				<button
					class="btn"
					// disabled={browser && !todoTitle}
				>
					Add
				</button>
			</Form>

			<div class={styles.todos}>
				<For each={todos()?.documents}>
					{(todo) => (
						// <div animate:flip={{ duration: 500 }} in:fade out:fade={{ duration: 100 }}>
						<Todo todo={todo} disabled={todo.disabled} />
						// </div>
					)}
				</For>
			</div>
		</div>
	);
}
