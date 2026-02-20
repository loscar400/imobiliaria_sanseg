// ===============================
// GERENCIAR IMÓVEIS - LISTAGEM
// ===============================

// proteção simples
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
  const res = await fetch("/api/imoveis");
  const json = await res.json();

  dados = json.data;
  mostrar(dados);
}


// MOSTRAR NA TABELA
function mostrar(lista) {
  tabela.innerHTML = "";

  lista.forEach(imovel => {
    tabela.innerHTML += `
      <tr>
        <td>${imovel.codigo || "-"}</td>
        <td>${imovel.tipo || "-"}</td>
        <td>${imovel.captador || "-"}</td>
        <td>${imovel.proprietario || "-"}</td>
        <td>${imovel.cidade || "-"}</td>
        <td>${imovel.bairro || "-"}</td>
        <td>${imovel.endereco || "-"}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editar('${imovel._id}')">
            Editar
          </button>
          <button class="btn-delete" onclick="excluir('${imovel._id}')">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

// BUSCA
buscar?.addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();
  const filtrado = dados.filter(i =>
    (i.codigo || "").toLowerCase().includes(termo) ||
    (i.bairro || "").toLowerCase().includes(termo) ||
    (i.cidade || "").toLowerCase().includes(termo)
  );
  mostrar(filtrado);
});

// EDITAR
function editar(id) {
  window.location.href = `/admin/admin-imoveis-editar.html?id=${id}`;
}

// EXCLUIR
async function excluir(id) {
  if (!confirm("Deseja realmente excluir este imóvel?")) return;

  try {
    const res = await fetch(`/api/imoveis/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      carregarImoveis();
    } else {
      alert("Erro ao excluir imóvel");
    }
  } catch (err) {
    console.error("Erro ao excluir", err);
  }
}

// INICIAR
carregarImoveis();
