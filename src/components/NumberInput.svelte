<script>
    export let value = 0;
    export let id = "";
    export let increment = () => {};
    export let decrement = () => {};
</script>

<div class="flex p-1">
    <button
        class="neob-clickable z-[1] h-10 w-20 rounded-l-md bg-error text-error-content ease-linear"
        on:click={decrement}>-</button
    >
    <label
        for={id}
        class="neob-border-full pointer-events-none z-[2] h-10 w-20 bg-secondary text-center text-xl leading-[2.25rem] text-secondary-content"
        >{value.length}</label
    >
    <button
        {id}
        class="neob-clickable z-[3] h-10 w-20 rounded-r-md bg-success text-success-content"
        on:click={increment}>+</button
    >
</div>
