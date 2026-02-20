const tabela = document.getElementById("tabelaProprietarios");
const buscar = document.getElementById("buscar");
const btnNovo = document.getElementById("btnNovo");

let dados = [];

// =======================
// CARREGAR PROPRIETÁRIOS
// =======================
async function carregar() {
  const res = await fetch("/api/clientes/proprietarios");
  const json = await res.json();

  dados = json.data || [];
  mostrar(dados);
}

// =======================
// MOSTRAR
// =======================
function mostrar(lista) {
  tabela.innerHTML = "";

  lista.forEach(p => {
    tabela.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.telefone || "-"}</td>
        <td>${p.qtdeImoveis ?? 0}</td>
        <td class="actions">
          <button onclick="editar('${p._id}')">Editar</button>
        </td>
      </tr>
    `;
  });
}

// =======================
// BUSCA
// =======================
buscar.addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();

  const filtrado = dados.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  mostrar(filtrado);

  if (filtrado.length === 0 && termo.length > 2) {
    btnNovo.style.display = "inline-block";
  } else {
    btnNovo.style.display = "none";
  }
});

// =======================
// EDITAR (CLIENTE)
// =======================
function editar(id) {
  window.location.href =
    `/admin/admin-clientes-editar.html?id=${id}`;
}

carregar();
