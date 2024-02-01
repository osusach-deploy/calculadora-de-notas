<script>
    import { calcular_notas_minimas, calcular_promedio } from "./calculadora";
    import NumberInput from "./NumberInput.svelte";
    import Checkbox from "./Checkbox.svelte";
    import { ramoData } from "../store";
    import TextInput from "./TextInput.svelte";

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
    let promedio = 1;
    let acumulador_ponderaciones = 0;
    let reload;

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
    $: porcentaje_promedio = promedio >= 1 ? ((promedio - 1) * 100) / 6 : 0;

    // Cambiar la cantidad de evaluaciones cuando cambia evaluaciones
    $: promedio = calcular_promedio(evaluaciones);

    function add_evaluacion() {
        evaluaciones.push({
            nombre: "",
            nota: 1,
            ponderacion: 1 / (evaluaciones.length + 1),
            es_pendiente: false,
        });
        evaluaciones = evaluaciones;
        ramoData.set(ramo);
    }

    function pop_evaluacion(index = evaluaciones.length - 1) {
        if (index < 0) return;

        evaluaciones.splice(index, 1);
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

{#key reload}
    <div class="flex flex-col gap-2 py-5 {$$props.class}">
        <div
            class="flex flex-col flex-wrap items-center justify-around gap-4 md:flex-row"
        >
            <div class="neob-border flex flex-col gap-2 bg-base-300 p-5">
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
            <div class="neob-border bg-base-300 px-10 py-3 flex flex-col items-center gap-3">
                <TextInput
                    class="input-lg w-[20ch] text-center text-xl md:text-3xl"
                    bind:value={ramo.nombre}
                    change={() => {
                        ramo.nombre = ramo.nombre ? ramo.nombre : "Nuevo Ramo";
                        ramoData.set(ramo);
                    }}
                />
                
                    <button
                    class="neob-clickable btn-sm bg-accent z-20 mx-1 flex items-center gap-1 rounded-lg px-3"
                    aria-label="Export ramo"
                    on:click={() => {
                        const data = JSON.stringify(ramo);
                        navigator.clipboard.writeText(data);
                        alert("Ramo copiado al portapapeles");
                    }}
                >
                    Exportar
                    <img class="h-5" src="/export.svg" alt="Export icon" />
                </button>
            </div>
            <div class="neob-border bg-base-300 p-10">
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
                        class:text-error={promedio < 4}
                        class:text-success={promedio >= 4}
                        style="--value:{porcentaje_promedio};--size:10rem;"
                    >
                        {promedio.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
        <p class="self-center text-pretty text-center text-sm sm:text-base">
            Marca evaluaciones como pendientes para calcular qué nota necesitas
            para tener promedio 4
        </p>

        <div class="flex flex-wrap justify-center gap-4">
            {#each evaluaciones as evaluacion, i (i)}
                <div
                    class="neob-border flex w-72 flex-col gap-4 rounded-xl bg-base-300 p-4 sm:w-80"
                >
                    <TextInput
                        placeholder="Nombre"
                        class="input-sm max-w-xs"
                        bind:value={evaluacion.nombre}
                    />
                    <div class="flex place-content-around items-center">
                        <label
                            class="neob-border w-[9ch] bg-base-100 p-1 text-center"
                            class:bg-warning={evaluacion.nota < 4}
                            class:bg-error={evaluacion.nota > 7}
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
                                evaluacion.es_pendiente =
                                    !evaluacion.es_pendiente;
                                console.log(evaluacion.es_pendiente);
                            }}
                            class="rounded-none bg-secondary"
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
                    />
                    {#if !promedio_simple}
                        <div class="divider divider-neutral m-0">
                            Ponderación
                        </div>
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
                </div>
            {/each}
        </div>
    </div>
{/key}

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_1" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Agregar ramo</h3>
        <p class="py-4">Ingresa el nombre del ramo:</p>
        <input
            type="text"
            bind:value={nombreInput}
            placeholder="Nuevo ramo"
            class="input"
        />
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button
                    class="btn"
                    on:click={() => {
                        ramo.nombre = nombreInput;
                        ramoData.set();
                        nombreInput = "";
                    }}>Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
