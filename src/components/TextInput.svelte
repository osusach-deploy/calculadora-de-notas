<script>
    export let value = "";
    export let placeholder = "";
    export let id = "";
    export let change = () => {};
    export let ariaLabel;
</script>

<input
    type="text"
    {id}
    {placeholder}
    on:change={change}
    aria-label={ariaLabel}
    class="neob-border input focus:border-black focus:outline-black {$$props.class}"
    bind:value
/>
