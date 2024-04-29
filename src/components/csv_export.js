export { jsonToCsv };

function jsonToCsv(jsonData) {
    let csvString = jsonData.nombre + "," + jsonData.promedio + "\n";

    // Agregar los títulos de columnas para las evaluaciones
    csvString += `Nombre Evaluacion,Nota,Ponderacion\n`;
    jsonData.evaluaciones.forEach((evaluacion) => {
        csvString +=
            evaluacion.nombre +
            "," +
            evaluacion.nota +
            "," +
            evaluacion.ponderacion +
            "\n";
    });

    return csvString;
}
