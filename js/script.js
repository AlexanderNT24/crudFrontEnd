document.addEventListener("DOMContentLoaded", () => {
  cargarPersonas(); 
});

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

document.getElementById("btnCancelarEditar").addEventListener("click", () => {
  $(".ui.modal.edit").modal("hide");
});

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
      activo,
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
  if (localStorage.getItem("modoOscuro") === "true") {
    $("body").addClass("dark-mode");
    $("#modoOscuroBtn").text("☀️ Modo Claro");
  }

  $("#modoOscuroBtn").click(() => {
    $("body").toggleClass("dark-mode");
    const modoOscuroActivo = $("body").hasClass("dark-mode");
    localStorage.setItem("modoOscuro", modoOscuroActivo);

    $("#modoOscuroBtn").text(
      modoOscuroActivo ? "☀️ Modo Claro" : "🌙 Modo Oscuro"
    );
  });
});
