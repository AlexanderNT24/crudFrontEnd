function mostrarAlerta(mensaje, tipo = "error") {
  const alerta = $("#alerta");

  // Clases de Semantic UI para los diferentes tipos de alerta
  const clases = {
    error: "ui red message",
    success: "ui green message",
    warning: "ui yellow message",
  };

  // Aplicar estilos según el tipo de alerta
  alerta.attr("class", clases[tipo]);
  $("#alerta-mensaje").text(mensaje);
  alerta.removeClass("hidden").transition("fade in");

  // Cerrar automáticamente después de 3 segundos
  setTimeout(() => {
    alerta.transition("fade out");
  }, 3000);
}

function eliminarPersona(id) {
  $(".ui.basic.modal")
    .modal({
      closable: false,
      onApprove: function () {
        console.log("🗑️ Eliminando persona con ID:", id);

        fetch(`http://127.0.0.1:5000/personas/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) throw new Error("Error al eliminar la persona");
            return response.json();
          })
          .then(() => {
            console.log("✅ Persona eliminada correctamente");
            mostrarAlerta("Persona eliminada correctamente.", "success");

            // Recargar la tabla sin refrescar la página
            cargarPersonas();
          })
          .catch((error) => {
            console.error("❌ Error al eliminar persona:", error);
            mostrarAlerta("Error al eliminar la persona.", "error");
          });
      },
    })
    .modal("show");
}
