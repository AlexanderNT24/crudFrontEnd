document.addEventListener("DOMContentLoaded", () => {
    cargarPersonas(); // Llamar al backend para obtener las personas
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
            renderizarGraficoGenero(data);
        })
        .catch(error => console.error("Error al cargar personas:", error));
}

function editarPersona(id) {
    console.log("Clic en Editar - ID:", id);

    fetch(`http://127.0.0.1:5000/personas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener la persona");
            return response.json();
        })
        .then(persona => {
            console.log("Datos recibidos para edición:", persona);

            // Asegurar que el ID es válido
            if (!persona.id) {
                console.error("❌ ID de persona no válido");
                alert("Error al obtener los datos de la persona.");
                return;
            }

            // Llenar los inputs del modal de edición
            document.getElementById("editarNombreInput").value = persona.nombre;
            document.getElementById("editarEdadInput").value = persona.edad;
            document.getElementById("editarGeneroInput").value = persona.genero;
            document.getElementById("editarActivoInput").checked = persona.activo;

            // Almacenar el ID de la persona correctamente en el botón de "Guardar"
            document.getElementById("guardarEdicion").setAttribute("data-id", persona.id);

            // Abrir el modal de edición
            $(".ui.modal.edit").modal("show");
        })
        .catch(error => {
            console.error("❌ Error al cargar la persona:", error);
            alert("Error al cargar la información. Inténtalo de nuevo.");
        });
}

function eliminarPersona(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta persona?")) {
        return;
    }

    console.log("🗑️ Eliminando persona con ID:", id);

    fetch(`http://127.0.0.1:5000/personas/${id}`, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar la persona");
            return response.json();
        })
        .then(() => {
            console.log("✅ Persona eliminada correctamente");

            // Recargar la tabla sin refrescar la página
            cargarPersonas();
        })
        .catch(error => console.error("❌ Error al eliminar persona:", error));
}




document.getElementById("guardarEdicion").addEventListener("click", () => {
    const id = document.getElementById("guardarEdicion").getAttribute("data-id");

    if (!id || id === "null") {
        console.error("❌ Error: ID de persona no válido en la edición.");
        alert("Error: No se puede guardar la edición porque falta el ID.");
        return;
    }

    const nombre = document.getElementById("editarNombreInput").value.trim();
    const edad = parseInt(document.getElementById("editarEdadInput").value.trim());
    const genero = document.getElementById("editarGeneroInput").value;
    const activo = document.getElementById("editarActivoInput").checked;

    if (!nombre || isNaN(edad) || !genero) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const personaActualizada = { nombre, edad, genero, activo };

    console.log("Enviando actualización para ID:", id, personaActualizada);

    fetch(`http://127.0.0.1:5000/personas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personaActualizada)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar la persona");
            return response.json();
        })
        .then(() => {
            console.log("✅ Persona actualizada correctamente");

            // Cerrar el modal de edición
            $(".ui.modal.edit").modal("hide");

            // Recargar la tabla sin refrescar la página
            cargarPersonas();
        })
        .catch(error => console.error("❌ Error al actualizar persona:", error));

    // Eliminar ID almacenado en el botón
    document.getElementById("guardarEdicion").removeAttribute("data-id");
});



document.getElementById("btnCancelarEditar").addEventListener("click", () => {
    $(".ui.modal.edit").modal("hide");
});

document.getElementById("guardarPersona").addEventListener("click", () => {
    const id = document.getElementById("guardarPersona").getAttribute("data-id");
    const nombre = document.getElementById("nombreInput").value.trim();
    const edad = parseInt(document.getElementById("edadInput").value.trim());
    const genero = document.getElementById("generoInput").value;
    const activo = document.getElementById("activoInput").checked;
    console.log("hoal")
    if (!nombre || isNaN(edad) || !genero) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const personaActualizada = { nombre, edad, genero, activo };

    console.log("Enviando actualización para ID:", id, personaActualizada); // 🔍 Verificar que los datos son correctos

    fetch(`http://127.0.0.1:5000/personas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personaActualizada)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar la persona");
            return response.json();
        })
        .then(() => {
            console.log("✅ Persona actualizada correctamente");
            $(".ui.modal.edit").modal("hide"); // Cerrar modal después de guardar
            cargarPersonas(); // Recargar la lista
        })
        .catch(error => console.error("❌ Error al actualizar persona:", error));

    document.getElementById("guardarPersona").removeAttribute("data-id");
});



function actualizarTabla(personas) {
    const tabla = document.getElementById("tabla-personas");
    tabla.innerHTML = "";

    personas.forEach(persona => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.edad}</td>
            <td>${persona.genero}</td>
            <td>${persona.activo ? "Activo" : "Inactivo"}</td>
            <td>
                <button class="editar-btn ui yellow button" id="editar-${persona.id}" data-id="${persona.id}">✏️</button>
                <button class="eliminar-btn ui red button" id="eliminar-${persona.id}" data-id="${persona.id}">🗑️</button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Agregar eventos después de renderizar la tabla
    document.querySelectorAll(".editar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            console.log("Clic en Editar - ID:", btn.getAttribute("data-id")); // 🔍 Verificar que el evento se dispara
            editarPersona(btn.getAttribute("data-id"));
        });
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", () => eliminarPersona(btn.getAttribute("data-id")));
    });
}


function cerrarModal() {
    $(".ui.modal").modal("hide");
}

$(document).ready(() => {
    // Abre el modal
    $("#btnAbrirModalAgregar").click(() => {
        $(".ui.modal.add").modal("show");
    });

    // Cierra el modal
    $("#btnCancelar").click(() => {
        $(".ui.modal.add").modal("hide");
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
        $(".ui.modal.add").modal("hide");

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
