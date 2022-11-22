
document.querySelector(".showResults").addEventListener("click", showResults1);

function showResults1() {
    console.log('se ejecuto el script')
    var parametros = [];
    var valores = [];
    
    for (var i = 0; i < document.querySelectorAll('.parametro').length; i++) {
      parametros.push(document.querySelectorAll('.parametro')[i].value);
      valores.push(parseInt(document.querySelectorAll(".valor")[i].value));
    }
    var data = [{
      x: parametros,
      y: valores,
      type: "linear"
    }];
    Plotly.newPlot("grafico", data);
  }