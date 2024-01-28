<script>
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

    ramoData.subscribe((value) => {
        data[current_index] = value;
        if (
            typeof window !== "undefined" &&
            typeof localStorage !== "undefined"
        ) {
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
        ramoData.set(data[current_index]);
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
    class="neob-border flex flex-row flex-wrap items-center gap-1 rounded-lg bg-base-100 p-1 {$$props.class}"
>
    {#each data as ramo, i (i)}
        <div class="join flex w-fit flex-row rounded-lg p-1">
                <button
                class="neob-clickable join-item btn-sm z-0 h-6 bg-base-300"
                on:click={() => {
                    current_index = i;
                    ramoData.set(data[current_index]);
                }}>{ramo.nombre}</button
                >
            <button
                class="neob-clickable px-1 join-item btn-sm z-10 w-fit bg-base-300"
                on:click={() => {
                    remove_ramo(i);
                }}
            >
                <img class="h-5" src="/cross.svg" alt="Delete icon" />
            </button>
        </div>
    {/each}
    <button
        class="neob-clickable px-1 rounded-lg btn-sm  z-20 bg-base-300"
        onclick="my_modal_5.showModal()"
    >
        <img class="h-5" src="/plus.svg" alt="Add icon" />
    </button>
</div>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Agregar ramo</h3>
        <p class="py-4">Ingresa el nombre del ramo:</p>
        <input
            type="text"
            bind:value={nombreInput}
            placeholder="Nuevo ramo"
            class="input input-bordered"
        />
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button
                    class="neob-clickable p-2 bg-primary text-primary-content"
                    on:click={() => {
                        add_ramo(nombreInput? nombreInput : "Nuevo Ramo");
                        nombreInput = "";
                    }}>Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
