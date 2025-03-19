document.getElementById("guardarPersona").addEventListener("click", () => {
  const id = document.getElementById("guardarPersona").getAttribute("data-id");
  const nombre = document.getElementById("nombreInput").value.trim();
  const edad = parseInt(document.getElementById("edadInput").value.trim());
  const genero = document.getElementById("generoInput").value;
  const activo = document.getElementById("activoInput").checked;
  console.log("hoal");
  if (!nombre || isNaN(edad) || !genero) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const personaActualizada = { nombre, edad, genero, activo };

  console.log("Enviando actualización para ID:", id, personaActualizada); // 🔍 Verificar que los datos son correctos

  fetch(`http://127.0.0.1:5000/personas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personaActualizada),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al actualizar la persona");
      return response.json();
    })
    .then(() => {
      console.log("✅ Persona actualizada correctamente");
      $(".ui.modal.edit").modal("hide"); // Cerrar modal después de guardar
      cargarPersonas(); // Recargar la lista
    })
    .catch((error) => console.error("❌ Error al actualizar persona:", error));

  document.getElementById("guardarPersona").removeAttribute("data-id");
});
