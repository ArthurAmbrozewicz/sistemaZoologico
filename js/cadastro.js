document.querySelector(".criar-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const form = document.querySelector("form");
  const formData = new FormData(form);

  console.log("Enviando para: ../php/cadastrar_animal.php");

  fetch("../php/cadastrar_animal.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((tarefa) => {
      if (tarefa.erro) {
        alert("Erro: " + tarefa.erro);
        return;
      }

      form.reset();

      const aviso = document.createElement("div");
      aviso.textContent = "Animal cadastrado com sucesso";
      aviso.style.position = "fixed";
      aviso.style.top = "1rem";
      aviso.style.right = "1rem";
      aviso.style.background = "#4CAF50";
      aviso.style.color = "white";
      aviso.style.padding = "10px 15px";
      aviso.style.borderRadius = "5px";
      aviso.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
      document.body.appendChild(aviso);

      setTimeout(() => aviso.remove(), 3000);
    })
    .catch((err) => {
      console.error("Erro ao enviar tarefa:", err);
      alert("Erro ao enviar tarefa.");
    });
});
