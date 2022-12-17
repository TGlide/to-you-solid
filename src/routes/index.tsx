import { Query } from 'appwrite';
import { useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { DATABASE_ID, TODO_COLLECTION_ID } from '~/constants';
import { databases } from '~/lib/appwrite';
import { classes } from '~/utils/style';
import styles from './index.module.scss';

export function routeData() {
	return createServerData$(async () => {
		const todos = await databases.listDocuments(DATABASE_ID, TODO_COLLECTION_ID);
		return todos;
	});
}

export default function Home() {
	const todos = useRouteData<typeof routeData>();

	console.log(todos());

	return (
		<div class={`container ${styles.container}`}>
			<div class={styles.header}>
				<div class={styles.points}>
					{/* <Counter value={points} /> */}
					{/* <Icon icon="star" /> */}
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
			<form class={styles.addWrapper} method="post" action="?/add">
				<input
					// bind:this={titleEl}
					class={classes('input', styles.title)}
					// bind:value={todoTitle}
					placeholder="Todo title"
					name="title"
				/>
				<input
					class={classes('input', styles.points)}
					// bind:value={todoPoints}
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
			</form>

			<div class={styles.todos}>
				{/* {#each todos as todo (todo.tempId || todo.$id)}
			<div animate:flip={{ duration: 500 }} in:fade out:fade={{ duration: 100 }}>
				<Todo {todo} disabled={todo.disabled} />
			</div>
		{/each} */}
			</div>
		</div>
	);
}
