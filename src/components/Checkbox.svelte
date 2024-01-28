<script>
    export let value = false;
    export let id = "";
    export let click = () => {
        value = !value;
    };
</script>

<button
    on:click={click}
    {id}
    class="neob-clickable rounded-md text-secondary-content {$$props.class}"
    class:neob-clicked={value}
    class:bg-disabled={!value}
>
    <slot />
</button>
