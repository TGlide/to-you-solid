import { createSignal } from "solid-js";
import "./Counter.css";

export default function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button class="increment" onClick={() => setCount((prev) => prev + 1)}>
      Clicks: {count()}
    </button>
  );
}
