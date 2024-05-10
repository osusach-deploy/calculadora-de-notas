<script>
    export let value = 0;
    export let id = "";
    export let increment = () => {};
    export let decrement = () => {};
</script>

<div class="join flex *:grow">
    <button
        class="neob-clickable join-item z-[1] h-10 rounded-md bg-error text-error-content"
        on:click={decrement}>-</button
    >
    <label
        for={id}
        class="neob-border join-item pointer-events-none z-[2] h-10 bg-secondary text-center text-xl leading-[2.25rem] text-secondary-content"
        >{value.length}</label
    >
    <button
        {id}
        class="neob-clickable join-item z-[3] h-10 rounded-md bg-success text-success-content"
        on:click={increment}>+</button
    >
</div>
