document.getElementById("guardarEdicion").addEventListener("click", () => {
  const id = document.getElementById("guardarEdicion").getAttribute("data-id");

  if (!id || id === "null") {
    console.error("❌ Error: ID de persona no válido en la edición.");
    alert("Error: No se puede guardar la edición porque falta el ID.");
    return;
  }

  const nombre = document.getElementById("editarNombreInput").value.trim();
  const edad = parseInt(
    document.getElementById("editarEdadInput").value.trim()
  );
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
    body: JSON.stringify(personaActualizada),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al actualizar la persona");
      return response.json();
    })
    .then(() => {
      console.log("✅ Persona actualizada correctamente");

      $(".ui.modal.edit").modal("hide");

      cargarPersonas();
    })
    .catch((error) => console.error("❌ Error al actualizar persona:", error));

  // Eliminar ID almacenado en el botón
  document.getElementById("guardarEdicion").removeAttribute("data-id");
});

function editarPersona(id) {
  console.log("Clic en Editar - ID:", id);

  fetch(`http://127.0.0.1:5000/personas/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Error al obtener la persona");
      return response.json();
    })
    .then((persona) => {
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
      document
        .getElementById("guardarEdicion")
        .setAttribute("data-id", persona.id);

      // Abrir el modal de edición
      $(".ui.modal.edit").modal("show");
    })
    .catch((error) => {
      console.error("❌ Error al cargar la persona:", error);
      alert("Error al cargar la información. Inténtalo de nuevo.");
    });
}
