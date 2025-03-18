document.addEventListener("DOMContentLoaded", () => {
    cargarPersonas(); // Llamar al backend para obtener las personas
});

document.getElementById("guardarPersona").addEventListener("click", () => {
    const nombre = document.getElementById("nombreInput").value;
    const edad = document.getElementById("edadInput").value;
    const genero = document.getElementById("generoInput").value;
    const activo = document.getElementById("activoInput").checked;

    if (!nombre || !edad || !genero) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const nuevaPersona = { nombre, edad: parseInt(edad), genero, activo };

    fetch("http://127.0.0.1:5000/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaPersona)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Persona agregada:", data);
            cerrarModal();
            cargarPersonas(); // Volver a cargar la lista con la nueva persona
        })
        .catch(error => console.error("Error al agregar persona:", error));
});

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

function cargarPersonas() {
    fetch("http://127.0.0.1:5000/personas")
        .then(response => response.json())
        .then(data => {
            actualizarTabla(data);
            actualizarMetricas(data);
        })
        .catch(error => console.error("Error al cargar personas:", error));

}

let ageChart = null;
let genderChart = null; // Nueva variable global para el gráfico de género

function renderizarGraficoEdades(data) {
    const edades = data.map(p => p.edad);
    
    const ctx = document.getElementById("ageChart").getContext("2d");

    if (ageChart !== null) {
        ageChart.destroy();
    }

    ageChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: edades.map((_, i) => `Persona ${i + 1}`),
            datasets: [{
                label: "Edades de Personas",
                data: edades,
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderizarGraficoGenero(data) {
    const cantidadHombres = data.filter(p => p.genero === "Masculino").length;
    const cantidadMujeres = data.filter(p => p.genero === "Femenino").length;

    const ctx = document.getElementById("genderChart").getContext("2d");

    if (genderChart !== null) {
        genderChart.destroy();
    }

    genderChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Hombres", "Mujeres"],
            datasets: [{
                label: "Distribución de Género",
                data: [cantidadHombres, cantidadMujeres],
                backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function cargarPersonas() {
    fetch("http://127.0.0.1:5000/personas")
        .then(response => response.json())
        .then(data => {
            actualizarTabla(data);
            actualizarMetricas(data);
            renderizarGraficoEdades(data);
            renderizarGraficoGenero(data); // Llamar a la función de gráfico de género
        })
        .catch(error => console.error("Error al cargar personas:", error));
}


function actualizarTabla(personas) {
    const tabla = document.getElementById("tabla-personas");
    tabla.innerHTML = "";

    personas.forEach(persona => {
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

function cerrarModal() {
    $(".ui.modal").modal("hide");
}

$(document).ready(() => {
    // Abre el modal
    $("#btnAbrirModal").click(() => {
        $(".ui.modal").modal("show");
    });

    // Cierra el modal
    $("#btnCancelar").click(() => {
        $(".ui.modal").modal("hide");
    });

    // Guardar persona y actualizar la tabla
    $("#guardarPersona").click(() => {
        const nombre = $("#nombreInput").val().trim();
        const edad = parseInt($("#edadInput").val());
        const genero = $("#generoInput").val();
        const activo = $("#activoInput").prop("checked") ? "Activo" : "Inactivo";

        if (!nombre || isNaN(edad) || !genero) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nuevaPersona = {
            id: document.querySelectorAll("#tabla-personas tr").length + 1,
            nombre,
            edad,
            genero,
            activo
        };

        // Agregar nueva persona a la tabla
        $("#tabla-personas").append(`
            <tr>
                <td>${nuevaPersona.id}</td>
                <td>${nuevaPersona.nombre}</td>
                <td>${nuevaPersona.edad}</td>
                <td>${nuevaPersona.genero}</td>
                <td>${nuevaPersona.activo}</td>
            </tr>
        `);

        // Cerrar modal
        $(".ui.modal").modal("hide");

        // Limpiar el formulario
        $("#nombreInput").val("");
        $("#edadInput").val("");
        $("#generoInput").val("");
        $("#activoInput").prop("checked", false);
    });
});


$(document).ready(() => {
    // Cargar preferencia de modo oscuro
    if (localStorage.getItem("modoOscuro") === "true") {
        $("body").addClass("dark-mode");
        $("#modoOscuroBtn").text("☀️ Modo Claro");
    }

    // Evento para cambiar de modo
    $("#modoOscuroBtn").click(() => {
        $("body").toggleClass("dark-mode");

        // Guardar preferencia en localStorage
        const modoOscuroActivo = $("body").hasClass("dark-mode");
        localStorage.setItem("modoOscuro", modoOscuroActivo);

        // Cambiar el texto del botón
        $("#modoOscuroBtn").text(modoOscuroActivo ? "☀️ Modo Claro" : "🌙 Modo Oscuro");
    });
});
