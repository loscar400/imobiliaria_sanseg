// ===============================
// GERENCIAR CLIENTES - LISTAGEM
// ===============================

// Proteção simples
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "/login";
}

// ELEMENTOS

const tabela = document.getElementById("tabelaClientes");

async function carregarClientes() {
  try {
    const res = await fetch("/api/clientes");
    const json = await res.json();

    mostrar(json.data); // 👈 PASSA O ARRAY CERTO
  } catch (err) {
    console.error("Erro ao carregar clientes", err);
  }
}

function mostrar(lista) {
  tabela.innerHTML = "";

  lista.forEach(cliente => {
    tabela.innerHTML += `
      <tr>
        <td>${cliente.nome || "-"}</td>
        <td>${cliente.telefone || "-"}</td>
        <td>${cliente.cpf || "-"}</td>
        <td>${cliente.email || "-"}</td>
        <td>${cliente.cidade || "-"}</td>
        <td>${cliente.bairro || "-"}</td>
        <td>${cliente.captador || "-"}</td>
        <td>${cliente.propostas ?? 0}</td>
        <td>
          <button onclick="editar('${cliente._id}')">Editar</button>
          <button onclick="excluir('${cliente._id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}


async function excluir(id) {
  if (!confirm("Deseja excluir este cliente?")) return;

  await fetch(`/api/clientes/${id}`, { method: "DELETE" });
  carregarClientes();
}

function editar(id) {
  window.location.href = `/admin/admin-clientes-editar.html?id=${id}`;
}

// INICIA
carregarClientes();
