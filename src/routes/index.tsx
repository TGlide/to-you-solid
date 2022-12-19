import { Query } from 'appwrite';
import { createEffect, createSignal, For } from 'solid-js';
import { useRouteData } from 'solid-start';
import {
	createServerAction$,
	createServerData$,
	createServerMultiAction$,
	redirect
} from 'solid-start/server';
import { Todo } from '~/components/Todo';
import { DATABASE_ID, TODO_COLLECTION_ID } from '~/constants';
import { databases } from '~/lib/appwrite';
import { sessionKey } from '~/lib/session';
import { isModelsDocumentList, ModelsDocument } from '~/types/appwrite';
import { AddTodoInput, isAddTodoInput, isTodo, TodoDocument } from '~/types/todo';
import { Icon } from '~/UI/Icon';
import { formDataToObject } from '~/utils/object';
import { classes } from '~/utils/style';
import styles from './index.module.scss';
import { v4 as uuidv4 } from 'uuid';

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

const addTodoFn = async (formData: FormData) => {
	const data = formDataToObject(formData, { transformers: { points: Number } });

	if (!isAddTodoInput(data)) {
		return console.error('Error on todo add: Invalid data');
	}

	await databases.createDocument<TodoDocument>(DATABASE_ID, TODO_COLLECTION_ID, 'unique()', {
		...data,
		session_key: sessionKey
	});

	return redirect('/');
};

export default function Home() {
	const todos = useRouteData<typeof routeData>();
	const [addingTodos, addTodo] = createServerMultiAction$(addTodoFn);
	const [name, setName] = createSignal('');
	let nameRef: HTMLInputElement | undefined;
	let pointsRef: HTMLInputElement | undefined;

	const optimisticTodos = (): TodoDocument[] => {
		const inputToObject = (input: FormData) => {
			return formDataToObject(input, { transformers: { points: Number } });
		};

		const parsedAddingTodos: TodoDocument[] = addingTodos.pending
			.filter((t) => {
				return isAddTodoInput(inputToObject(t.input));
			})
			.map((t) => {
				const dataObj = inputToObject(t.input) as AddTodoInput;

				return {
					...dataObj,
					checked: false,
					disabled: true,
					$id: uuidv4(),
					$collectionId: '',
					$databaseId: '',
					$createdAt: '',
					$updatedAt: '',
					$permissions: []
				};
			});

		return [...(todos()?.documents ?? []), ...parsedAddingTodos];
	};

	const points = () => {
		return optimisticTodos().reduce((acc, todo) => {
			if (todo.checked) {
				return acc + todo.points;
			}

			return acc;
		}, 0);
	};

	createEffect(function resetForm() {
		optimisticTodos().length;
		if (!nameRef || !pointsRef) return;
		nameRef.value = '';
		pointsRef.value = '1';
		nameRef.focus();
	});

	return (
		<div class={classes(styles.container, 'container')}>
			<div class={styles.header}>
				<div class={styles.points}>
					{points()}
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
			<addTodo.Form class={styles.addWrapper}>
				<input
					ref={nameRef}
					class={classes('input', styles.title)}
					placeholder="Todo title"
					name="title"
					value={name()}
					onChange={(e) => setName(e.currentTarget.value)}
				/>
				<input
					ref={pointsRef}
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
			</addTodo.Form>

			<div class={styles.todos}>
				<For each={optimisticTodos()}>
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
