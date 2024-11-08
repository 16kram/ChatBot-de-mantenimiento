var contexto = "";//Los datos del contexto se cargan en un archivo de texto en GitHub (max 4096 tokens)
var indicaciones = "Tu eres el chatbot de mantenimiento, un técnico virtual de mantenimiento eléctrico. ";

//Se llama a la API de completions del ChatGPT
async function chat(pregunta) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = 'Aquí va la APIkey de OpenAI';

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + apiKey
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "system",
                    "content": indicaciones + contexto
                }, {
                    "role": "user",
                    "content": pregunta
                }]
            })
        })

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        let data = await response.json();
        return data.choices[0].message.content;


    } catch (error) {
        console.error('Fetch error:', error);
    }
}

//Se envía el mensaje
async function enviarMensaje() {
    // Obtiene el valor del mensaje
    const input = document.getElementById("messageInput");
    const mensaje = input.value;

    if (mensaje.trim() !== "") { // Asegura que no esté vacío
        // Crea un nuevo elemento de mensaje
        const nuevoMensaje = document.createElement("div");
        nuevoMensaje.classList.add("chat-message");
        nuevoMensaje.textContent = mensaje;

        // Agrega el mensaje a la caja de chat
        const chatBox = document.getElementById("chatBox");
        chatBox.appendChild(nuevoMensaje);

        // Desplaza la caja de chat al final para mostrar el mensaje más reciente
        chatBox.scrollTop = chatBox.scrollHeight;

        // Limpia la caja de entrada
        input.value = "";

        // Respuesta del chatGPT
        const respuesta = await chat(mensaje);
        console.log('Respuesta de ChatGPT:', respuesta);

        // Crea un nuevo elemento de mensaje
        const nuevaRespuesta = document.createElement("div");
        nuevaRespuesta.classList.add("chat-response");
        nuevaRespuesta.textContent = respuesta;

        // Agrega el mensaje a la caja de chat
        chatBox.appendChild(nuevaRespuesta);

        // Desplaza la caja de chat al final para mostrar el mensaje más reciente
        chatBox.scrollTop = chatBox.scrollHeight;

    }
}

//Se cargan los datos del contexto
function cargaContexto() {
    // URL del archivo de contexto en GitHub
    const url = 'https://raw.githubusercontent.com/16kram/Archivos-de-datos-del-chatbot-de-mantenimiento/refs/heads/main/contexto.txt';

    fetch(url)
        .then(response => response.text())  // Convierte la respuesta a texto
        .then(data => {
            contexto = data;
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
}

//Evento para enviar el mensaje con la tecla Enter
function teclaEnter() {
    var messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evitar el salto de línea
            enviarMensaje(); // Llamar a la función de envío
        }
    });
}

//Al finalizar la carga de la página carga el contexto y activa la tecla Enter para enviar mensajes
function iniciar() {
    cargaContexto();
    teclaEnter();
}

window.addEventListener("load", iniciar);