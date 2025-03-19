function actualizarTabla(personas) {
  const tabla = document.getElementById("tabla-personas");
  tabla.innerHTML = "";

  personas.forEach((persona) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
              <td>${persona.id}</td>
              <td>${persona.nombre}</td>
              <td>${persona.edad}</td>
              <td>${persona.genero}</td>
              <td>${persona.activo ? "Activo" : "Inactivo"}</td>
              <td>
                  <button class="editar-btn ui yellow button" id="editar-${
                    persona.id
                  }" data-id="${persona.id}">✏️</button>
                  <button class="eliminar-btn ui red button" id="eliminar-${
                    persona.id
                  }" data-id="${persona.id}">🗑️</button>
              </td>
          `;
    tabla.appendChild(fila);
  });

  // Agregar eventos después de renderizar la tabla
  document.querySelectorAll(".editar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Clic en Editar - ID:", btn.getAttribute("data-id")); // 🔍 Verificar que el evento se dispara
      editarPersona(btn.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      eliminarPersona(btn.getAttribute("data-id"))
    );
  });
}
