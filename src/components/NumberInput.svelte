<script>
  export let value = 0;
  export let id = "";
  export let increment = () => {};
  export let decrement = () => {};
</script>

<div class="flex p-1">
  <button
    class="w-20 h-10 z-[1] ease-linear neob-clickable rounded-l-md bg-error text-error-content"
    on:click={decrement}>-</button
  >
  <label
    for={id}
    class="w-20 h-10 z-[2] text-center text-xl leading-[2.25rem] text-secondary-content neob-border-full bg-secondary pointer-events-none"
    >{value.length}</label>
  <button
    {id}
    class="w-20 h-10 z-[3] neob-clickable rounded-r-md bg-success text-success-content"
    on:click={increment}>+</button
  >
</div>
