<script>
  import { calcular_notas_minimas, calcular_promedio } from "./calculadora";
  import NumberInput from "./NumberInput.svelte";
  import Checkbox from "./Checkbox.svelte";

  /** @type {import('./calculadora').Ramo} */
  export let ramo;
  /** @type {Array<import('./calculadora').Evaluacion>} */
  let evaluaciones = ramo.evaluaciones;

  let promedio_simple = false,
    da_ponderacion = true;
  let cantidad = evaluaciones.length,
    cantidad_temp = cantidad,
    min = 1,
    max = 7,
    promedio = 1,
    acumulador_ponderaciones = 0;

  // Calcular el porcentaje para el radial progress
  $: porcentaje_promedio = promedio >= 1 ? ((promedio - 1) * 100) / 6 : 0;

  // Cambiar la cantidad de evaluaciones cuando cambia cantidad
  $: {
    while (evaluaciones.length !== cantidad && cantidad >= 0) {
      if (evaluaciones.length < cantidad) {
        evaluaciones.push({
          nombre: "",
          nota: 1,
          ponderacion: 1 / cantidad,
          es_pendiente: false,
        });
      } else {
        evaluaciones.pop();
      }
    }
    promedio = calcular_promedio(evaluaciones);
  }

  // Recalcular ponderaciones cuando se marca promedio simple
  $: {
    if (promedio_simple) {
      evaluaciones.forEach((item) => {
        item.ponderacion = 1 / cantidad;
      });
      evaluaciones = evaluaciones;
      promedio = calcular_promedio(evaluaciones);
    }
  }

  /**
   * Se ejecuta cuando se hace click al boton de calcular
   */
  function calc() {
    evaluaciones = calcular_notas_minimas(evaluaciones);
    evaluaciones.forEach((item) => {
      item.es_pendiente = false;
    });
  }

  // Revisa si hay al menos 1 nota pendiente
  $: hay_pendientes = !evaluaciones.some((item) => Boolean(item.es_pendiente));

  // Revisa si las ponderaciones suman 1
  $: {
    acumulador_ponderaciones = evaluaciones.reduce(
      (acumulado, objeto) => acumulado + objeto.ponderacion,
      0,
    );
    da_ponderacion = Math.round(acumulador_ponderaciones * 100) / 100 === 1;
  }

  // revisar si cantidad no es negativa o sino crashea
  $: cantidad = cantidad_temp > 0 ? cantidad_temp : cantidad;
</script>

<div class="neob-border bg-base-100 py-5 rounded-lg flex flex-col gap-2">
  <div class="flex flex-row flex-wrap justify-around items-center">
    <div class="flex flex-col p-5 gap-2">
      <label for="cantidad"
        >Cantidad de Evaluaciones:
        <NumberInput id="cantidad" bind:value={cantidad_temp} />
      </label>
      <Checkbox bind:value={promedio_simple} label="Promedio Simple" />
      <div
        class="flex flex-col gap-2 w-60 tooltip-warning text-warning-content"
        class:tooltip={hay_pendientes}
        data-tip="No hay suficientes notas pendientes"
      >
        <button
          class="neob-clickable bg-primary text-primary-content rounded-md disable-btn w-full px-2 py-4 m-1"
          disabled={hay_pendientes}
          on:click={calc}
          >Calcular notas mínimas
        </button>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div
        class="w-60 tooltip-warning"
        class:tooltip={!da_ponderacion}
        class:tooltip-open={!da_ponderacion}
        data-tip="Las ponderaciones de las notas no suman 1: ({acumulador_ponderaciones.toFixed(
          2,
        )})"
      ></div>
      <div
        class="text-3xl radial-progress bg-success-content border-4 border-success-content"
        class:text-error={promedio < 4}
        class:text-success={promedio >= 4}
        style="--value:{porcentaje_promedio};--size:10rem;"
      >
        {promedio.toFixed(2)}
      </div>
    </div>
  </div>
  <p class="text-sm sm:text-base text-pretty text-center self-center">
    Marca evaluaciones como pendientes para calcular qué nota necesitas para
    tener promedio 4
  </p>

  <div class="flex flex-wrap justify-center gap-4">
    {#if cantidad != 0}
      {#each [...Array(cantidad).keys()] as i}
        <div
          class="flex flex-col bg-base-300 p-4 gap-4 w-72 neob-border rounded-xl"
        >
          <input
            type="text"
            placeholder="Nombre"
            class="input input-sm w-full max-w-xs neob-border"
            bind:value={evaluaciones[i].nombre}
          />
          <div class="flex items-center place-content-around">
            <label
              class="neob-border p-1 bg-base-100 w-[9ch] text-center"
              class:bg-warning={evaluaciones[i].nota < 4}
              class:bg-error={evaluaciones[i].nota > 7}
              for="nota"
            >
              Nota: {evaluaciones[i].nota.toFixed(1)}
            </label>
            <label for="es_pendiente-{i}">Es pendiente?</label>
            <input
              id="es_pendiente-{i}"
              class="checkbox rounded-none"
              type="checkbox"
              bind:checked={evaluaciones[i].es_pendiente}
              on:click={() => {
                evaluaciones[i].nota = 1;
                evaluaciones[i].es_pendiente = !evaluaciones[i].es_pendiente;
              }}
            />
          </div>
          <input
            id="nota"
            class="range range-md neob-border bg-base-100 disabled:range-info disabled:pointer-events-none"
            class:range-warning={evaluaciones[i].nota < 4}
            class:range-error={evaluaciones[i].nota > 7}
            disabled={evaluaciones[i].es_pendiente}
            type="range"
            {min}
            {max}
            step="0.1"
            bind:value={evaluaciones[i].nota}
          />
          {#if !promedio_simple}
            <div class="divider divider-neutral m-0">Ponderación</div>
            <div class="flex flex-row items-center place-content-evenly gap-1">
              <input
                id="ponderacion-{i}"
                class="range range-info h-7 range-md neob-border bg-base-100"
                type="range"
                min="0"
                max="1"
                step="0.01"
                bind:value={evaluaciones[i].ponderacion}
              />
              <input
                type="number"
                class="input input-sm p-0 h-7 w-[6ch] text-center rounded-md neob-border"
                id="ponderacion-{i}"
                min="0"
                max="1"
                step="0.01"
                bind:value={evaluaciones[i].ponderacion}
              />
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
