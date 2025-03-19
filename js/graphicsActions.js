function actualizarMetricas(data) {
  document.getElementById("total-personas").innerText = data.length;
  const edadPromedio = data.reduce((sum, p) => sum + p.edad, 0) / data.length;
  document.getElementById("edad-promedio").innerText = Math.round(edadPromedio);
  document.getElementById("usuarios-activos").innerText = data.filter(
    (p) => p.activo
  ).length;
}

function renderizarGraficoEdades(data) {
  const edades = data.map((p) => p.edad);
  new Chart(document.getElementById("ageChart"), {
    type: "bar",
    data: {
      labels: edades,
      datasets: [
        {
          label: "Edades de Personas",
          data: edades,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
  });
}

let ageChart = null;
let genderChart = null; // Nueva variable global para el gráfico de género

function renderizarGraficoEdades(data) {
  const edades = data.map((p) => p.edad);

  const ctx = document.getElementById("ageChart").getContext("2d");

  if (ageChart !== null) {
    ageChart.destroy();
  }

  ageChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: edades.map((_, i) => `Persona ${i + 1}`),
      datasets: [
        {
          label: "Edades de Personas",
          data: edades,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderizarGraficoGenero(data) {
  const cantidadHombres = data.filter((p) => p.genero === "Masculino").length;
  const cantidadMujeres = data.filter((p) => p.genero === "Femenino").length;

  const ctx = document.getElementById("genderChart").getContext("2d");

  if (genderChart !== null) {
    genderChart.destroy();
  }

  genderChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Hombres", "Mujeres"],
      datasets: [
        {
          label: "Distribución de Género",
          data: [cantidadHombres, cantidadMujeres],
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
