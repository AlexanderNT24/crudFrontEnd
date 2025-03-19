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