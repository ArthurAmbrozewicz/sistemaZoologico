document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById('lista-animais');
  const barraPesquisa = document.getElementById('barra-pesquisa');
  let todosAnimais = [];
  fetch('../php/listar_animais.php')
    .then(response => response.json())
    .then(animais => {
      todosAnimais = animais;
      renderizarLista(animais);
    })
    .catch(error => {
      console.error('Erro ao carregar os animais:', error);
    });
  function renderizarLista(animais) {
    lista.innerHTML = '';
    animais.forEach(animal => {
      const div = document.createElement('div');
      div.className = 'animais';
      div.innerHTML = `
        <span><strong>ID:</strong> ${animal.id} - <strong>Nome:</strong> ${animal.nome}</span>
        <div class="botoes">
          <button class="btn-visualizar" data-id="${animal.id}">Mais detalhes</button>
          <button class="btn-editar" data-id="${animal.id}">Editar</button>
          <button class="btn-excluir" data-id="${animal.id}">Excluir</button>
        </div>
      `;
      div.querySelector('.btn-editar').addEventListener('click', () => {
        document.getElementById('editar-id').value = animal.id;
        document.getElementById('editar-nome').value = animal.nome;
        document.getElementById('editar-descricao').value = animal.descricao || '';
        document.getElementById('editar-data').value = animal.data_nascimento || '';
        document.getElementById('editar-especie').value = animal.especie || '';
        document.getElementById('editar-habitat').value = animal.habitat || '';
        document.getElementById('editar-pais').value = animal.pais_origem || '';

        document.getElementById('popup-editar').style.display = 'flex';
      });

      div.querySelector('.btn-excluir').addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja excluir o animal "${animal.nome}"?`)) {
          fetch('../php/excluir_animal.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${animal.id}`
          })
          .then(response => response.json())
          .then(result => {
            if (result.mensagem) {
              todosAnimais = todosAnimais.filter(a => a.id !== animal.id);
              renderizarLista(todosAnimais);
            } else {
              alert(result.erro || 'Erro ao excluir.');
            }
          });
        }
      });

      div.querySelector('.btn-visualizar').addEventListener('click', () => {
        const popup = document.getElementById('popup');
        const popupTexto = document.getElementById('popup-texto');

        popupTexto.innerHTML = `
          <strong>ID:</strong> ${animal.id}<br>
          <strong>Nome:</strong> ${animal.nome}<br>
          <strong>Espécie:</strong> ${animal.especie || 'N/A'}<br>
          <strong>Data de nascimento:</strong> ${animal.data_nascimento || 'N/A'}<br>
          <strong>Habitat:</strong> ${animal.habitat || 'N/A'}<br>
          <strong>País de origem:</strong> ${animal.pais_origem || 'N/A'}<br>
          <strong>Descrição:</strong> ${animal.descricao || 'N/A'}
        `;

        popup.style.display = 'flex';
      });

      lista.appendChild(div);
    });
  }

  document.getElementById('fechar-popup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });

  document.getElementById('fechar-popup-editar').addEventListener('click', () => {
    document.getElementById('popup-editar').style.display = 'none';
  });

  document.getElementById('form-editar').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-id').value;
    const nome = document.getElementById('editar-nome').value;
    const descricao = document.getElementById('editar-descricao').value;
    const data = document.getElementById('editar-data').value;
    const especie = document.getElementById('editar-especie').value;
    const habitat = document.getElementById('editar-habitat').value;
    const pais = document.getElementById('editar-pais').value;

    const dados = new URLSearchParams();
    dados.append('id', id);
    dados.append('nome', nome);
    dados.append('descricao', descricao);
    dados.append('data_nascimento', data);
    dados.append('especie', especie);
    dados.append('habitat', habitat);
    dados.append('pais_origem', pais);

    fetch('../php/editar_animal.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dados
    })
    .then(res => res.json())
    .then(result => {
      if (result.mensagem) {
        alert(result.mensagem);
        document.getElementById('popup-editar').style.display = 'none';
        location.reload(); // Ou renderizarLista(todosAnimais);
      } else {
        alert(result.erro || 'Erro ao editar o animal.');
      }
    })
    .catch(error => console.error('Erro ao editar o animal:', error));
  });

  barraPesquisa.addEventListener('input', () => {
    const termo = barraPesquisa.value.toLowerCase();
    const filtrados = todosAnimais.filter(animal =>
      animal.nome.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
  });
});
