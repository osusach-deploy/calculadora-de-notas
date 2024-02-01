<script>
    export let value = "";
    export let placeholder = "";
    export let id = "";
    export let change = () => {};
</script>

<input
    type="text"
    {id}
    {placeholder}
    on:change={change}
    class="neob-border input focus:border-black focus:outline-black {$$props.class}"
    bind:value
/>
