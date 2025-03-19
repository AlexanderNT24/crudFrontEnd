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
$(document).ready(function() {
  $('#searchInput').on('keyup', function() {
      var value = $(this).val().toLowerCase();
      console.log(value)
      $('#personTable tbody tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
  });
});
$(document).ready(function() {
  $('#searchInput').on('keyup', function() {
      var value = $(this).val().toLowerCase();
      $('#personTable tbody tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
  });
});