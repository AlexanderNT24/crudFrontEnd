function cargarPersonas() {
    fetch("http://127.0.0.1:5000/personas")
        .then((response) => response.json())
        .then((data) => {
            actualizarTabla(data);
            actualizarMetricas(data);
            renderizarGraficoEdades(data);
            renderizarGraficoGenero(data);
        })
        .catch((error) => console.error("Error al cargar personas:", error));
}
