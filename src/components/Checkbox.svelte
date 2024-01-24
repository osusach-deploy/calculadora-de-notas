<script>
  export let value = false;
  export let label = "";
</script>

<button
  on:click={() => {
    value = !value;
  }}
  class="neob-clickable rounded-md px-2 py-3 m-1 text-secondary-content {$$props.class}"
  class:bg-secondary={value}
  class:neob-clicked={value}
  class:bg-disabled={!value}>{label}</button
>
