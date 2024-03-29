<script>
    import { calcular_notas_minimas, calcular_promedio } from "./calculadora";
    import NumberInput from "./NumberInput.svelte";
    import Checkbox from "./Checkbox.svelte";
    import { ramoData } from "../store";
    import TextInput from "./TextInput.svelte";
    import { jsonToCsv } from "./csv_export.js"

    /** @type {import('./calculadora').Ramo} */
    let ramo = {};

    /** @type {Array<import('./calculadora').Evaluacion>} */
    let evaluaciones = [];
    evaluaciones = ramo.evaluaciones === undefined ? [] : ramo.evaluaciones;

    let promedio_simple = false,
        da_ponderacion = true;

    let nombreInput = "";
    let min = 1;
    let max = 7;
    let acumulador_ponderaciones = 0;
    let reload = 1;

    ramoData.subscribe(
        /** @type {import('./calculadora').Ramo} value */
        (value) => {
            ramo = value;
            evaluaciones =
                ramo.evaluaciones === undefined
                    ? evaluaciones
                    : ramo.evaluaciones;
            reload += 1;
        },
    );

    // Calcular el porcentaje para el radial progress
    $: porcentaje_promedio =
        ramo.promedio >= 1 ? ((ramo.promedio - 1) * 100) / 6 : 0;

    // Cambiar la cantidad de evaluaciones cuando cambia evaluaciones
    $: ramo.promedio = calcular_promedio(evaluaciones);

    function add_evaluacion() {
        evaluaciones.push({
            nombre: "",
            nota: 1,
            ponderacion: 0.5,
            es_pendiente: false,
        });
        evaluaciones = evaluaciones;
        ramoData.set(ramo);
    }

    function pop_evaluacion(index = evaluaciones.length - 1) {
        if (index < 0) return;

        evaluaciones.pop();
        evaluaciones = evaluaciones;
        ramoData.set(ramo);
    }
    // Recalcular ponderaciones cuando se marca promedio simple
    $: {
        if (promedio_simple) {
            evaluaciones.forEach((item) => {
                item.ponderacion = 1 / evaluaciones.length;
            });
            evaluaciones = evaluaciones;
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

    function handleSliderChange() {
        ramoData.set(ramo);
        console.log("promedio");
    }

    // Revisa si hay al menos 1 nota pendiente
    $: hay_pendientes = !evaluaciones.some((item) =>
        Boolean(item.es_pendiente),
    );

    // Revisa si las ponderaciones suman 1
    $: {
        acumulador_ponderaciones = evaluaciones.reduce(
            (acumulado, objeto) => acumulado + objeto.ponderacion,
            0,
        );
        da_ponderacion = Math.round(acumulador_ponderaciones * 100) / 100 === 1;
    }
</script>

<div class="flex flex-col gap-2 py-5 {$$props.class}">
    <div
        class="flex flex-col flex-wrap items-center justify-around gap-4 md:flex-row"
    >
        <div class="neob-border flex flex-col gap-2 rounded-xl bg-base-200 p-5">
            <p>Cantidad de Evaluaciones:</p>
            <NumberInput
                id="cantidad"
                increment={add_evaluacion}
                decrement={pop_evaluacion}
                bind:value={evaluaciones}
            />
            <Checkbox
                class="m-1 bg-secondary px-2 py-3"
                bind:value={promedio_simple}>Promedio Simple</Checkbox
            >
            <div
                class="tooltip-warning flex w-60 flex-col gap-2 text-warning-content"
                class:tooltip={hay_pendientes}
                data-tip="No hay suficientes notas pendientes"
            >
                <button
                    class="neob-clickable disable-btn m-1 w-full rounded-md bg-primary px-2 py-4 text-primary-content"
                    disabled={hay_pendientes}
                    on:click={calc}
                    >Calcular notas mínimas
                </button>
            </div>
        </div>
        <div
            class="neob-border flex flex-col items-center gap-3 rounded-xl bg-base-200 px-10 py-3"
        >
            <TextInput
                class="input-lg w-[20ch] text-center text-xl md:text-3xl"
                bind:value={ramo.nombre}
                change={() => {
                    ramo.nombre = ramo.nombre ? ramo.nombre : "Nuevo Ramo";
                    ramoData.set(ramo);
                }}
            />

            <button
                class="neob-clickable btn-sm z-20 mx-1 flex items-center gap-1 rounded-lg bg-accent px-3"
                aria-label="Export ramo"
                onclick="my_modal_6.showModal()"
            >
                Exportar
                <img class="h-5" src="/export.svg" alt="Export icon" />
            </button>
        </div>
        <div class="neob-border rounded-xl bg-base-200 p-10">
            <div class="flex flex-col items-center px-14 pt-24 md:pt-0">
                <div
                    class="tooltip tooltip-warning before:w-40 md:before:w-60"
                    class:tooltip-open={!da_ponderacion}
                    data-tip="Las ponderaciones de las notas no suman 1: ({acumulador_ponderaciones.toFixed(
                        2,
                    )})"
                ></div>
                <div
                    class="radial-progress border-4 border-success-content bg-success-content text-3xl"
                    class:text-error={ramo.promedio < 4}
                    class:text-success={ramo.promedio >= 4}
                    style="--value:{porcentaje_promedio};--size:10rem;"
                >
                    {ramo.promedio.toFixed(2)}
                </div>
            </div>
        </div>
    </div>
    <p class="self-center text-pretty text-center text-sm sm:text-base">
        Marca evaluaciones como pendientes para calcular qué nota necesitas para
        tener promedio 4
    </p>

    <ul class="flex flex-wrap justify-center gap-4">
        {#each evaluaciones as evaluacion, i (i)}
            <li
                class="neob-border flex w-72 flex-col gap-4 rounded-xl bg-base-200 p-4 sm:w-80"
            >
                <div class="flex flex-row items-center gap-2">
                    <TextInput
                        placeholder="Nombre"
                        class="input-sm grow"
                        bind:value={evaluacion.nombre}
                    />
                    <button
                        class="neob-clickable h-fit w-fit rounded-lg bg-error p-1"
                        on:click={() => pop_evaluacion(i)}
                    >
                        <img class="h-5" src="/trash.svg" alt="trash icon" />
                    </button>
                </div>
                <div class="flex place-content-around items-center">
                    <label
                        class="neob-border w-[9ch] bg-base-100 p-1 text-center"
                        class:bg-secondary={evaluacion.es_pendiente}
                        class:bg-warning={evaluacion.nota < 4 &&
                            !evaluacion.es_pendiente}
                        class:bg-error={evaluacion.nota > 7 &&
                            !evaluacion.es_pendiente}
                        class:text-secondary-content={evaluacion.es_pendiente}
                        for="nota"
                    >
                        Nota: {evaluacion.nota.toFixed(1)}
                    </label>
                    <label for="es_pendiente-{i}">Es pendiente?</label>
                    <Checkbox
                        id="es_pendiente-{i}"
                        value={evaluacion.es_pendiente}
                        click={() => {
                            evaluacion.nota = 1;
                            evaluacion.es_pendiente = !evaluacion.es_pendiente;
                        }}
                        class="rounded-lg bg-secondary"
                        ><img
                            class="filter"
                            class:invert={evaluacion.es_pendiente}
                            src="/check.svg"
                            alt="check icon"
                        /></Checkbox
                    >
                </div>
                <input
                    id="nota"
                    class="neob-border range range-md bg-base-100 disabled:range-info disabled:pointer-events-none"
                    class:range-warning={evaluacion.nota < 4}
                    class:range-error={evaluacion.nota > 7}
                    disabled={evaluacion.es_pendiente}
                    type="range"
                    {min}
                    {max}
                    step="0.1"
                    bind:value={evaluacion.nota}
                    on:change={handleSliderChange}
                />
                {#if !promedio_simple}
                    <div class="divider divider-neutral m-0">Ponderación</div>
                    <div
                        class="flex flex-row place-content-evenly items-center gap-1"
                    >
                        <input
                            id="ponderacion-{i}"
                            class="neob-border range range-info range-md h-7 bg-base-100"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            bind:value={evaluacion.ponderacion}
                            on:change={handleSliderChange}
                        />
                        <input
                            type="number"
                            class="neob-border input input-sm h-7 w-[6ch] rounded-md p-0 text-center"
                            id="ponderacion-{i}"
                            min="0"
                            max="1"
                            step="0.01"
                            bind:value={evaluacion.ponderacion}
                        />
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</div>



<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_6" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box neob-border">
        <h3 class="text-lg font-bold">Exportar ramo</h3>

        <div class="modal-action">
            <form method="dialog" class="flex flex-col w-full gap-4">
                <button
                    class="absolute right-4 top-2 neob-border neob-clickable p-2"
                    aria-label="Close modal"
                    ><img
                        class="h-5"
                        src="/cross.svg"
                        alt="Delete icon"
                    /></button
                >
                <p class="py-2">Cómo quieres exportar tu ramo:</p>
                    <button
                        class="neob-clickable w-1/2 bg-info p-2 text-primary-content self-center"
                        on:click={() => {
                            const data = JSON.stringify(ramo);
                            navigator.clipboard.writeText(data);
                            alert("Ramo copiado al portapapeles");
                        }}>Copiar al portapapeles</button
                    >
                    <button
                        class="neob-clickable flex w-1/2 h-10 items-center justify-center bg-accent text-accent-content self-center"
                        aria-label="Import ramo"
                        on:click={() => {
                                    const data = jsonToCsv(ramo);
                                    const blob = new Blob([data], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = 'ramo.csv';
                                    link.click();
                                    URL.revokeObjectURL(url);
                                }}
                    >
                        Exportar como CSV
                        <img class="h-6" src="/import.svg" alt="Import icon" />
                    </button>
            </form>
        </div>
    </div>
</dialog>
