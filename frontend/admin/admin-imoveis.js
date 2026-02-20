// ===============================
// GERENCIAR IMÓVEIS - LISTAGEM
// ===============================

// Proteção simples
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "/login";
}

// ELEMENTOS
const tabela = document.getElementById("tabela-imoveis");
const buscar = document.getElementById("buscar");

let dados = [];

// CARREGAR IMÓVEIS
async function carregarImoveis() {
  try {
    const res = await fetch("/api/imoveis");
    const json = await res.json();

    dados = json.data || [];
    mostrar(dados);

  } catch (err) {
    console.error("Erro ao carregar imóveis", err);
  }
}

// MOSTRAR NA TABELA
function mostrar(lista) {
  tabela.innerHTML = "";

  if (!lista.length) {
    tabela.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">
          Nenhum imóvel cadastrado
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach(imovel => {
    tabela.innerHTML += `
      <tr>
        <td>${imovel.codigo}</td>
        <td>${imovel.tipo}</td>
        <td>${imovel.cidade}</td>
        <td>${imovel.bairro}</td>
        <td>R$ ${Number(imovel.preco).toLocaleString("pt-BR")}</td>
        <td class="actions">
          <button onclick="editar('${imovel._id}')">Editar</button>
          <button onclick="excluir('${imovel._id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// BUSCAR
buscar?.addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();
  const filtrado = dados.filter(i =>
    i.codigo.toLowerCase().includes(termo) ||
    i.cidade.toLowerCase().includes(termo) ||
    i.bairro.toLowerCase().includes(termo)
  );
  mostrar(filtrado);
});

// EDITAR
function editar(id) {
  window.location.href = `/admin/admin-imoveis-editar.html?id=${id}`;
}

// EXCLUIR
async function excluir(id) {
  if (!confirm("Deseja excluir este imóvel?")) return;

  const res = await fetch(`/api/imoveis/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    carregarImoveis();
  } else {
    alert("Erro ao excluir imóvel");
  }
}

// INICIAR
carregarImoveis();
