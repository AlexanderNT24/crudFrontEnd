document.addEventListener("DOMContentLoaded", () => {
    const fakeData = generarDataFake(20); // Genera 20 registros de prueba
    actualizarMetricas(fakeData);
    renderizarGraficoEdades(fakeData);
    renderizarGraficoGenero(fakeData);
    renderizarTabla(fakeData);
});

function generarDataFake(cantidad) {
    const nombres = ["Juan", "María", "Pedro", "Ana", "Luis", "Laura", "Carlos", "Marta", "Javier", "Sofía"];
    const generos = ["Masculino", "Femenino"];
    return Array.from({ length: cantidad }, (_, i) => ({
        id: i + 1,
        nombre: nombres[Math.floor(Math.random() * nombres.length)],
        edad: Math.floor(Math.random() * 60) + 18, // Edades entre 18 y 77 años
        genero: generos[Math.floor(Math.random() * generos.length)],
        activo: Math.random() > 0.5 // Activo o no
    }));
}

function actualizarMetricas(data) {
    document.getElementById("total-personas").innerText = data.length;
    const edadPromedio = data.reduce((sum, p) => sum + p.edad, 0) / data.length;
    document.getElementById("edad-promedio").innerText = Math.round(edadPromedio);
    document.getElementById("usuarios-activos").innerText = data.filter(p => p.activo).length;
}

function renderizarGraficoEdades(data) {
    const edades = data.map(p => p.edad);
    new Chart(document.getElementById("ageChart"), {
        type: "bar",
        data: {
            labels: edades,
            datasets: [{
                label: "Edades de Personas",
                data: edades,
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        }
    });
}

function renderizarGraficoGenero(data) {
    const genero = { Masculino: 0, Femenino: 0 };
    data.forEach(p => genero[p.genero]++);
    new Chart(document.getElementById("genderChart"), {
        type: "pie",
        data: {
            labels: ["Masculino", "Femenino"],
            datasets: [{
                data: [genero.Masculino, genero.Femenino],
                backgroundColor: ["#36A2EB", "#FF6384"]
            }]
        }
    });
}

function renderizarTabla(data) {
    const tabla = document.getElementById("tabla-personas");
    tabla.innerHTML = ""; // Limpiar contenido
    data.forEach(persona => {
        const fila = `<tr>
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.edad}</td>
            <td>${persona.genero}</td>
            <td>${persona.activo ? "Activo" : "Inactivo"}</td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}