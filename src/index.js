//clase Web3
const Web3 = require('web3');

//Escuchamos el evento onload en la pagina (windows)
//cuando cargue la pagina vamos a ejecutar una funcion
window.onload = () => {
  let web3;
  let from;

  //boton de conectar -document es la pagina
  const connectButton = document.getElementById('connect');

  //contenedor, bloque
  const content = document.getElementById('content');

  //el bloque de la cuenta
  const account = document.getElementById('account');

  // Formulario
  const form = document.getElementById('send'); //formulario 
  const amountInput = document.getElementById('amount'); //caja de textos 
  const recipientInput = document.getElementById('recipient'); //caja de texto 

  // Funcion llamada connect. ASincrona para espera a q termine la peticion
  const connect = async () => {
    if (window.ethereum) {
      //instanciamos web3s
      web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); //abre el MetaMask

        content.style.display = 'initial'; 
        connectButton.style.display = 'none';

        const accounts = await web3.eth.getAccounts(); //trae la cuenta conectada al proveedor de web3, en este caso metamask

        //en la variable from guardamos la cuenta que nos devuelve el array con las cuentas conectadas en metamask, en su 
        //primera posicion, o sea la primerass
        from = accounts[0];

        account.innerText = from;
      } catch (err) { // se intercepta el evento de rechazar la conexion por parte del usuario
        alert('Por favor acepte la solicitud de MetaMask');
      }
    } else {
      alert('Web3 es requerido, por favor instala MetaMask');
    }
  };

  //Funcion que se ejecuta 
  const transact = async (event) => {
    
    //previene el comportamiento por defecto del formulario html
    event.preventDefault();
    
    //leemos los valores de las cajas de texto
    const amount = amountInput.value;
    const recipient = recipientInput.value;

    //valida que la cuenta destino sea valida
    //usando una funcion de web3, utils
    //recibe como parametro el valor del input
    if (!web3.utils.isAddress(recipient)) {
      alert('Dirección inválida');
      return;
    }

    //valida que el weis no sea negativo
    if (Number(amount) <= 0) {
      alert('Cantidad de weis no puede ser negativa');
      return;
    }

    //funcion para enviar weis
    //recibe un objeto de configuracion con valores de una transaccion en eth
    web3.eth.sendTransaction({
      from,
      to: recipient,
      value: amount,
    });
  };

  // Listeners de Eventos
  connectButton.onclick = connect;//cuando est evento de darle click al boton ocurre, llama a la funcion transact
  form.onsubmit = transact;
};
