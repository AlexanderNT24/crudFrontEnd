function eliminarPersona(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta persona?")) {
        return;
    }

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

            // Recargar la tabla sin refrescar la página
            cargarPersonas();
        })
        .catch((error) => console.error("❌ Error al eliminar persona:", error));
}