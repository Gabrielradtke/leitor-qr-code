const btn = document.getElementById("btnIniciar");
const reader = document.getElementById("reader");
const resultado = document.getElementById("resultado");
let html5QrCode;

btn.addEventListener("click", () => {
  btn.disabled = true;
  resultado.innerHTML = "Abrindo câmera e escaneando QR Code...";
  reader.style.display = "block";

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      // Tenta encontrar a câmera traseira pelo nome (label)
      const cameraBack = cameras.find(camera =>
        /back|rear|traseira|environment/i.test(camera.label)
      );

      const cameraId = cameraBack ? cameraBack.id : cameras[0].id;

      html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {
          html5QrCode.stop().then(() => {
            reader.style.display = "none";
            verificarCodigo(qrCodeMessage);
            btn.disabled = false;
          }).catch(err => {
            resultado.innerHTML = "Erro ao parar a câmera: " + err;
            btn.disabled = false;
          });
        },
        errorMessage => {
          // Você pode mostrar erros de scan aqui se quiser
        }
      ).catch(err => {
        resultado.innerHTML = "Erro ao iniciar a câmera: " + err;
        btn.disabled = false;
      });
    } else {
      resultado.innerHTML = "Nenhuma câmera encontrada.";
      btn.disabled = false;
    }
  }).catch(err => {
    resultado.innerHTML = "Erro ao buscar câmeras: " + err;
    btn.disabled = false;
  });
});

function verificarCodigo(codigo) {
  resultado.innerHTML = `Verificando código: <b>${codigo}</b> ...`;

  fetch(`/api/verificar?codigo=${encodeURIComponent(codigo)}`)
    .then(response => {
      if (!response.ok) throw new Error("Resposta do servidor não OK");
      return response.json();
    })
    .then(data => {
      if (data.autorizado) {
        resultado.style.backgroundColor = "#c8e6c9";
        resultado.innerHTML = `✅ Código <b>${codigo}</b> autorizado!`;
      } else {
        resultado.style.backgroundColor = "#ffcdd2";
        resultado.innerHTML = `❌ Código <b>${codigo}</b> não autorizado.`;
      }
    })
    .catch(err => {
      resultado.style.backgroundColor = "#ffeb3b";
      resultado.innerHTML = "Erro ao verificar código: " + err.message;
    });
}
