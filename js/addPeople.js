document.getElementById("guardarPersona").addEventListener("click", () => {
  const id = document.getElementById("guardarPersona").getAttribute("data-id");
  const nombre = document.getElementById("nombreInput").value.trim();
  const edad = parseInt(document.getElementById("edadInput").value.trim());
  const genero = document.getElementById("generoInput").value;
  const activo = document.getElementById("activoInput").checked;

  if (!nombre || isNaN(edad) || !genero) {
    mostrarAlerta(
      "Por favor, completa todos los campos correctamente.",
      "error"
    );
    return;
  }

  // Guardar datos en una variable para usarlos después de la confirmación
  const personaActualizada = { nombre, edad, genero, activo };

  $("#modalConfirmacion")
    .modal({
      closable: false,
      onApprove: function () {
        // Si el usuario confirma, se envía la solicitud
        console.log("✅ Guardando persona:", personaActualizada);

        fetch(`http://127.0.0.1:5000/personas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(personaActualizada),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Error al guardar la persona");
            return response.json();
          })
          .then(() => {
            mostrarAlerta("✅ Persona guardada correctamente.", "success");
            $(".ui.modal.add").modal("hide"); // Cerrar modal después de guardar
            cargarPersonas(); // Recargar la lista
          })
          .catch((error) => {
            mostrarAlerta("❌ Error al guardar la persona.", "error");
            console.error("❌ Error:", error);
          });

        document.getElementById("guardarPersona").removeAttribute("data-id");
      },
    })
    .modal("show");
});

function mostrarAlerta(mensaje, tipo = "success") {
  const alerta = $("#alerta");
  const clases = {
    error: "ui red message",
    success: "ui green message",
    warning: "ui yellow message",
  };
  alerta.attr("class", clases[tipo]);
  $("#alerta-mensaje").text(mensaje);
  alerta.removeClass("hidden").transition("fade in");
  setTimeout(() => {
    alerta.transition("fade out");
  }, 3000);
}


$(document).ready(() => {
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
      mostrarAlerta(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );
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