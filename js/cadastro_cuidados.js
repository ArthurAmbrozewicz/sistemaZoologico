document.getElementById("form-cuidados").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("../php/cadastrar_cuidados.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      const aviso = document.createElement("div");
      aviso.textContent = data.mensagem || "Cuidado cadastrado com sucesso!";
      aviso.style.position = "fixed";
      aviso.style.top = "1rem";
      aviso.style.right = "1rem";
      aviso.style.background = "#4CAF50";
      aviso.style.color = "white";
      aviso.style.padding = "10px 15px";
      aviso.style.borderRadius = "5px";
      aviso.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
      aviso.style.zIndex = "9999";
      document.body.appendChild(aviso);

      setTimeout(() => aviso.remove(), 3000);
      form.reset();
    })
    .catch(err => {
      const aviso = document.createElement("div");
      aviso.textContent = "Erro ao cadastrar cuidado.";
      aviso.style.position = "fixed";
      aviso.style.top = "1rem";
      aviso.style.right = "1rem";
      aviso.style.background = "#f44336";
      aviso.style.color = "white";
      aviso.style.padding = "10px 15px";
      aviso.style.borderRadius = "5px";
      aviso.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
      aviso.style.zIndex = "9999";
      document.body.appendChild(aviso);

      setTimeout(() => aviso.remove(), 3000);
    });
  });