function fecharPopupEditar() {
    document.getElementById('popup-editar').style.display = 'none';
  }
function abrirPopupDescricao(texto) {
    document.getElementById('descricao-texto').textContent = texto || 'Sem descrição.';
    document.getElementById('popup-descricao').style.display = 'flex';
}
  
function fecharPopupDescricao() {
    document.getElementById('popup-descricao').style.display = 'none';
}
  
document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById('lista-cuidados');
    const filtrotipo = document.getElementById('filtro-tipo');
    const filtrofrequencia = document.getElementById('filtro-frequencia');
    document.getElementById('btn-fechar-editar').addEventListener('click', fecharPopupEditar);

    let todosCuidados = [];
  
    fetch('../php/listar_cuidados.php')
      .then(response => response.json())
      .then(cuidados => {
        todosCuidados = cuidados;
        renderizarLista(cuidados);
        preencherSelectTipo(cuidados);
        preencherSelectFrequencia(cuidados);
      })
      .catch(error => {
        console.error('Erro ao carregar os cuidados:', error);
      });
  
    function renderizarLista(cuidados) {
      lista.innerHTML = '';
      cuidados.forEach(cuidado => {
        const div = document.createElement('div');
        div.className = 'cuidado';
  
        div.innerHTML = `
          <span>
            <strong>Tipo:</strong> ${cuidado.tipo_cuidado} -
            <strong>Animal:</strong> ${cuidado.nome} -
            <strong>Frequência:</strong> ${cuidado.frequencia}
          </span>
          <div class="botoes">
            <button class="btn-descricao" data-descricao="${cuidado.descricao}">Ver descrição</button>
            <button class="btn-editar" data-id="${cuidado.id}">Editar</button>
            <button class="btn-excluir" data-id="${cuidado.id}">Excluir</button>
          </div>
        `;
        
        div.querySelector('.btn-descricao').addEventListener('click', () => {
            abrirPopupDescricao(cuidado.descricao);
          });
          
        div.querySelector('.btn-excluir').addEventListener('click', () => {
          if (confirm(`Deseja excluir o cuidado "${cuidado.tipo_cuidado}" do animal "${cuidado.nome}"?`)) {
            fetch('../php/excluir_cuidado.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${cuidado.id}`
            })
            .then(res => res.json())
            .then(result => {
              if (result.mensagem) {
                todosCuidados = todosCuidados.filter(c => c.id !== cuidado.id);
                renderizarLista(todosCuidados);
              } else {
                alert(result.erro || 'Erro ao excluir.');
              }
            })
            .catch(error => console.error('Erro ao excluir o cuidado:', error));
          }
        });
  
        div.querySelector('.btn-editar').addEventListener('click', () => {
          document.getElementById('editar-id').value = cuidado.id;
          document.getElementById('editar-tipo').value = cuidado.tipo_cuidado;
          document.getElementById('editar-frequencia').value = cuidado.frequencia;
          document.getElementById('editar-descricao').value = cuidado.descricao;
  
          document.getElementById('popup-editar').style.display = 'flex';
        });
  
        lista.appendChild(div);
      });
    }
  
    function preencherSelectTipo(cuidados) {
      const tiposUnicos = [...new Set(cuidados.map(c => c.tipo_cuidado))];
      tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        filtrotipo.appendChild(option);
      });
    }
  
    function preencherSelectFrequencia(cuidados) {
      const frequenciasUnicas = [...new Set(cuidados.map(c => c.frequencia))];
      frequenciasUnicas.forEach(frequencia => {
        const option = document.createElement('option');
        option.value = frequencia;
        option.textContent = frequencia;
        filtrofrequencia.appendChild(option);
      });
    }
  
    filtrotipo.addEventListener('change', aplicarFiltros);
    filtrofrequencia.addEventListener('change', aplicarFiltros);
  
    function aplicarFiltros() {
      const tipoSelecionado = filtrotipo.value;
      const frequenciaSelecionada = filtrofrequencia.value;
  
      const filtrados = todosCuidados.filter(cuidado => {
        const tipoOK = !tipoSelecionado || cuidado.tipo_cuidado === tipoSelecionado;
        const freqOK = !frequenciaSelecionada || cuidado.frequencia === frequenciaSelecionada;
        return tipoOK && freqOK;
      });
  
      renderizarLista(filtrados);
    }
  
    document.getElementById('form-editar').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editar-id').value;
      const tipo = document.getElementById('editar-tipo').value;
      const frequencia = document.getElementById('editar-frequencia').value;
      const descricao = document.getElementById('editar-descricao').value;
  
      fetch('../php/editar_cuidado.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}&tipo_cuidado=${tipo}&frequencia=${frequencia}&descricao=${descricao}`
      })
      .then(res => res.json())
      .then(result => {
        if (result.mensagem) {
          alert(result.mensagem);
          document.getElementById('popup-editar').style.display = 'none';
          location.reload(); // ou atualize a lista com renderizarLista(todosCuidados)
        } else {
          alert(result.erro || 'Erro ao editar o cuidado.');
        }
      })
      .catch(error => console.error('Erro ao editar:', error));
    });
  
    
      

  });
  