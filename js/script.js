document.addEventListener('DOMContentLoaded', function() {
  const ruleta = document.querySelector('#ruleta');
  let giros = 0;

  // Verifica si el usuario ya ha jugado al cargar la página
  if (Cookies.get('hasPlayed')) {
    // Desactivar la ruleta si ya ha jugado
    ruleta.classList.add('disabled');
    document.querySelector('.contador').innerHTML = 'TURNOS: 1';
  } else {
    ruleta.addEventListener('click', girar);
  }

  function girar() {
    if (giros < 1 && !Cookies.get('hasPlayed')) {
     // let rand = Math.random() * 7200;
      // Calcula el ángulo necesario para la posición deseada
    const fixedAngle = 157.15; // Ángulo para "1 rollo térmico"
    const completeRotations = 20; // Número de rotaciones completas antes de caer en la posición deseada
    let rand = completeRotations * 360 + fixedAngle; // Cálculo del ángulo total
      calcular(rand);
      giros++;

      // Reproducir sonido.
      var sonido = document.querySelector('#audio');
      sonido.setAttribute('src', 'sonido/ruleta.mp3');

      // Actualizar contador
      document.querySelector('.contador').innerHTML = 'TURNOS: ' + giros;

      // Generar un código único
      const uniqueCode = generateUniqueCode();

      // Almacenar el código en la base de datos (simulado aquí)
      storeCodeInDatabase(uniqueCode);

      // Guardar en cookies que el usuario ya ha jugado
      Cookies.set('hasPlayed', 'true', { expires: 1 }); // Cookie expira en 1 día

      // Desactivar la ruleta
      ruleta.classList.add('disabled');

      // Mostrar el código único al usuario después del giro
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Gracias por participar!',
          text: `Tu código único es: ${uniqueCode}`,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });
      }, 5500); // Se muestra después de que se haya calculado el resultado
    } else {
      Swal.fire({
        icon: 'info',
        title: 'VUELVA PRONTO, EL JUEGO TERMINÓ!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
    }
  }

  function premio(premios) {
    document.querySelector('.elije').innerHTML = 'HAS GANADO:' + premios;
  }

  function calcular(rand) {
    let valor = rand / 360;
    valor = (valor - parseInt(valor.toString().split(".")[0])) * 360;
    ruleta.style.transform = "rotate(" + rand + "deg)";

    setTimeout(() => {
      switch (true) {
        case valor > 0 && valor <= 45:
          premio("firma electronica 1 año");
          break;
        case valor > 45 && valor <= 90:
          premio("video + instalacion presencial");
          break;
        case valor > 90 && valor <= 135:
          premio("balanza"); 
          break; 
        case valor > 135 && valor <= 180:
          premio("descuento especial");
          break;
        case valor > 180 && valor <= 225:
          premio("siga participando");
          break; 
        case valor > 225 && valor <= 270:
          premio("Selladora semi-automatica");
          break;
        case valor > 270 && valor <= 315:
          premio("Lector");
          break;
        case valor > 315 && valor <= 360:
          premio("gaveta"); 
          break;
      }
    }, 5000);
  }

  function generateUniqueCode() {
    return 'RU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  function storeCodeInDatabase(code) {
    // Aquí debes agregar la lógica para almacenar el código en tu base de datos
    console.log('Código almacenado:', code);
  }
});
