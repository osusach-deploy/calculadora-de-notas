<script>
  import Ramo from "./Ramo.svelte";
  import { ramoData } from "../store";
  
  let str_data = null;
  let current_index = 0;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    str_data = localStorage.getItem("calc_data");
  }

  /** @type {Array<import('./calculadora').Ramo>} */
  let data = [{
    nombre: "Nuevo Ramo",
    evaluaciones: [
      {
        nombre: "",
        nota: 1,
        ponderacion: 0.5,
        es_pendiente: false,
      },
      {
        nombre: "",
        nota: 1,
        ponderacion: 0.5,
        es_pendiente: false,
      },
    ],
  }];

  if (str_data !== null) data = JSON.parse(str_data);

  // Se actualiza el store cuando se cambia el current_index
  $: ramoData.set(data[current_index]);

  function add_ramo() {
    data.push({
      nombre: "Nuevo Ramo",
      evaluaciones: [
        {
          nombre: "",
          nota: 1,
          ponderacion: 0.5,
          es_pendiente: false,
        },
        {
          nombre: "",
          nota: 1,
          ponderacion: 0.5,
          es_pendiente: false,
        },
      ],
    });
    current_index = data.length - 1;
    data = data;
  }
  /** @param {Number} index*/
  function remove_ramo(index) {
    data.splice(index, 1);
    current_index = 0;
    data = data;
  }

  ramoData.subscribe((value) => {
    data[current_index] = value;  
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {

      localStorage.setItem("calc_data", JSON.stringify(data));
      console.log("ramo guardado en ls");}
  });
</script>

<div class="bg-base-100 p-1 w-fit rounded-lg flex flex-col gap-1 items-center">
  {#each data as ramo, i (i)}
    <div class="bg-base-200 p-1 w-fit rounded-lg flex flex-row">
      <button
        class="btn btn-outline btn-xs h-6 neob-border"
        on:click={() => {
          current_index = i;
          ramoData.set(data[current_index]);
        }}>{ramo.nombre}</button
      >
      <button
        class="btn btn-square btn-outline btn-xs h-6"
        on:click={() => {
          remove_ramo(i);
        }}
      >
        <img src="/cross.svg" alt="Delete icon" />
      </button>
    </div>
  {/each}
  <button class="btn btn-square btn-outline btn-xs h-6" on:click={add_ramo}>
    <img src="/plus.svg" alt="Add icon" />
  </button>
</div>
