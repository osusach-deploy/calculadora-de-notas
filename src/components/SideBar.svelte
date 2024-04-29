<script>
    import { ramoData } from "../store";
    import TextInput from "./TextInput.svelte";

    let promedio = 1;
    let str_data = null;
    let current_index = 0;
    let nombreInput = "";
    let importedData = "";

    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        str_data = localStorage.getItem("calc_data");
    }

    /** @type {Array<import('./calculadora').Ramo>} */
    let data = [
        {
            nombre: "Nuevo Ramo",
            promedio: 1,
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

    ramoData.subscribe((value) => {
        data[current_index] = value;
        if (
            typeof window !== "undefined" &&
            typeof localStorage !== "undefined"
        ) {
            localStorage.setItem("calc_data", JSON.stringify(data));
        }
        promedio =
            data.reduce((acc, ramo) => acc + ramo.promedio, 0) / data.length;
    });

    function add_ramo(nombre) {
        data.push({
            nombre: nombre,
            promedio: 1,
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
        ramoData.set(data[current_index]);
    }

    /** @param {string} ramo*/
    function import_ramo(ramo) {
        let jsonRamo;
        try {
            jsonRamo = JSON.parse(ramo);
            // Revisar unos casos borde de parse
            if (!jsonRamo || typeof jsonRamo !== "object") return false;
        } catch (error) {
            return false;
        }
        data.push(jsonRamo);
        current_index = data.length - 1;
        data = data;
        ramoData.set(data[current_index]);
        return true;
    }

    /** @param {Number} index*/
    function remove_ramo(index) {
        data.splice(index, 1);
        current_index = 0;

        if (data.length === 0) add_ramo("Nuevo Ramo");

        data = data;
        ramoData.set(data[current_index]);
    }
</script>

<div
    class="neob-border flex flex-row flex-wrap items-center gap-1 rounded-xl bg-base-200 p-1 {$$props.class}"
>
    {#each data as ramo, i (i)}
        <div class="join flex w-fit flex-row rounded-lg p-1">
            <button
                class="neob-clickable join-item btn-sm z-0 h-6 min-w-[10ch] text-left"
                class:bg-accent={i === current_index}
                class:bg-base-100={i !== current_index}
                on:click={() => {
                    current_index = i;
                    ramoData.set(data[current_index]);
                }}>{ramo.nombre}</button
            >
            <button
                class="neob-clickable join-item btn-sm z-10 w-fit bg-base-100 px-1"
                on:click={() => {
                    remove_ramo(i);
                }}
            >
                <img class="h-5" src="/cross.svg" alt="Delete icon" />
            </button>
        </div>
    {/each}
    <button
        class="neob-clickable btn-sm z-20 rounded-lg bg-base-100 px-1"
        onclick="my_modal_5.showModal()"
        aria-label="Add ramo"
    >
        <img class="h-5" src="/plus.svg" alt="Add icon" />
    </button>
    <span class="p-1">
        <h3 class="neob-border btn-sm h-6 rounded-lg bg-base-100 leading-7">
            Promedio general: {promedio.toFixed(2)}
        </h3>
    </span>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
    <div class="neob-border modal-box">
        <h3 class="text-lg font-bold">Agregar ramo</h3>

        <div class="modal-action">
            <form method="dialog" class="flex w-full flex-col gap-4">
                <button
                    class="neob-border neob-clickable absolute right-4 top-2 p-2"
                    aria-label="Close modal"
                    on:click={() => {
                        nombreInput = "";
                    }}
                    ><img
                        class="h-5"
                        src="/cross.svg"
                        alt="Delete icon"
                    /></button
                >
                <p class="py-2">Ingresa el nombre del ramo</p>
                <div class="flex">
                    <TextInput
                        class="mr-2 rounded-none"
                        bind:value={nombreInput}
                        placeholder="Nuevo ramo"
                    />
                    <button
                        class="neob-clickable h-12 w-28 bg-primary p-2 text-primary-content"
                        on:click={() => {
                            add_ramo(nombreInput ? nombreInput : "Nuevo Ramo");
                            nombreInput = "";
                        }}>Guardar</button
                    >
                </div>
                O importa un ramo
                <div class="flex">
                    <TextInput
                        class="mr-2 rounded-none"
                        bind:value={importedData}
                        placeholder="Pega tu ramo aquí"
                    />
                    <!-- if there is a button in form, it will close the modal -->
                    <button
                        on:click={() => {
                            if (!import_ramo(importedData))
                                alert("Error al importar");
                            importedData = "";
                        }}
                        class="neob-clickable flex h-12 w-28 items-center justify-center bg-accent text-accent-content"
                        aria-label="Import ramo"
                    >
                        Importar
                        <img class="h-6" src="/import.svg" alt="Import icon" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</dialog>
