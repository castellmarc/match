// Funció per processar el contingut del fitxer de text i construir la llista de llistes
function processarFitxerDeText(contingut) {
  var linies = contingut.split('\n');
  var llistaDeLlistes = [];

  linies.forEach(function (linia) {
    var elements = linia.split('$');
    llistaDeLlistes.push(elements);
  });

  return llistaDeLlistes;
}

// Funció per buscar la paraula i obtenir les coincidències
function buscarParaula(paraulaCercada, numeroSeleccionat, llistaDeLlistes, comença, tipusRima) {
  var matches = [];
  // Cerca prèvia per trobar la llista que conté la paraula cercada
  var llistaParaulaCerca = llistaDeLlistes.find(item => item[0].toLowerCase() === paraulaCercada);

  for (var i = 0; i < llistaDeLlistes.length; i++) {
    let paraula = llistaDeLlistes[i]
    let bona = 1;
    while (bona === 1) {
      if (paraula.length > 7 && paraula[7] !== numeroSeleccionat && numeroSeleccionat !== "0" && numeroSeleccionat !== "5") {
        break;
      }

      if (paraula.length > 7 && numeroSeleccionat === "5" && parseInt(paraula[7]) < 5) {
        break;
      }

      if (comença === "vocal+h" && !'haeiou'.includes(paraula[0][0])) {
        break;
      }

      if (comença === "consonant" && 'haeiou'.includes(paraula[0][0])) {
        break;
      }

      if (tipusRima === 'Consonant') {
        if (paraula[5] !== llistaParaulaCerca[5]) {
          break;
        }
      }

      if (tipusRima === 'assonant') {
        if (paraula[6] !== llistaParaulaCerca[6]) {
          break;
        }
      }

      matches.push(paraula);
      bona = 0;
    }
  }

  return matches;
}

// Funció per mostrar els resultats a la pàgina web
function mostrarResultats(resultats) {
  var resultatsContainer = document.getElementById('resultats');
  resultatsContainer.innerHTML = ''; // Netegem el contingut anterior

  if (resultats.length > 0) {
    // Iterar sobre tots els elements de la llista matches
    for (var i = 0; i < resultats.length; i++) {
      var llistaResultat = resultats[i];
      var llistaElement = document.createElement('div');
      llistaElement.textContent = 'Resultats: ' + llistaResultat.join(', ');
      resultatsContainer.appendChild(llistaElement);
    }
  } else {
    resultatsContainer.textContent = 'No s\'ha trobat la paraula cercada.';
  }
}

// Funció per realitzar la cerca
function realitzarCerca() {
  var paraulaCercada = document.getElementById('paraulaCercada').value.toLowerCase();
  var numeroSeleccionat = document.getElementById('numeroSelector').value;
  var tipusRima = document.getElementById('rimaSelector').value;
  var comença = document.getElementById('categoriaSelector').value;


  // Obtenir la llista de llistes des del fitxer de text
  fetch('data.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error de xarxa: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(data => {
      // Processar el contingut del fitxer de text per construir la llista de llistes
      var llistaDeLlistes = processarFitxerDeText(data);

      // Buscar la paraula i obtenir les coincidències
      var matches = buscarParaula(paraulaCercada, numeroSeleccionat, llistaDeLlistes, comença, tipusRima);

      // Mostrar els resultats
      mostrarResultats(matches);
    })
    .catch(error => {
      console.error('Error carregant les llistes:', error);
      // Maneixar l'error, com mostrar un missatge a l'usuari
    });
}

// Configurar l'esdeveniment del botó per realitzar la cerca
document.getElementById('cercaButton').addEventListener('click', realitzarCerca);