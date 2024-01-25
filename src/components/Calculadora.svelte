<script>
  import Ramo from "./Ramo.svelte";
  import { ramoData } from "../store";

  let str_data = null;
  let current_index = 0;
  let nombreInput = "";

  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    str_data = localStorage.getItem("calc_data");
  }

  /** @type {Array<import('./calculadora').Ramo>} */
  let data = [
    {
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
    },
  ];

  if (str_data !== null) data = JSON.parse(str_data);
  ramoData.set(data[current_index]);
  // Se actualiza el store cuando se cambia el current_index
  $: ramoData.set(data[current_index]);

  ramoData.subscribe((value) => {
    data[current_index] = value;
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("calc_data", JSON.stringify(data));
      console.log("ramo guardado en ls");
    }
  });

  function add_ramo(nombre) {
    data.push({
      nombre: nombre,
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
</script>

<div class="bg-base-100 p-1 rounded-lg flex flex-row flex-wrap gap-1 items-center">
  {#each data as ramo, i (i)}
    <div class="bg-base-200 p-1 w-fit rounded-lg flex flex-row">
      <button
        class="z-0 btn btn-outline btn-xs h-6 neob-border bg-base-300"
        on:click={() => {
          current_index = i;
          ramoData.set(data[current_index]);
        }}>{ramo.nombre}</button
      >
      <button
        class="btn btn-square btn-outline btn-xs h-6 neob-border z-10 bg-base-300"
        on:click={() => {
          remove_ramo(i);
        }}
      >
        <img src="/cross.svg" alt="Delete icon" />
      </button>
    </div>
  {/each}
  <button class="btn btn-square btn-outline btn-xs h-6" onclick="my_modal_5.showModal()">
    <img src="/plus.svg" alt="Add icon" />
  </button>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Agregar ramo</h3>
    <p class="py-4">Ingresa el nombre del ramo:</p>
    <input type="text" bind:value={nombreInput} placeholder="Nuevo ramo" class="input">
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn" on:click={() => { add_ramo(nombreInput)}}>Guardar</button>
      </form>
    </div>
  </div>
</dialog>
