document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("formCliente");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID do cliente não informado");
    window.location.href = "/admin/admin-clientes-listar.html";
    return;
  }

  try {
    const res = await fetch(`/api/clientes/${id}`);

    // 🔴 SÓ VALIDA AQUI
    if (!res.ok) {
      alert("Cliente não encontrado");
      window.location.href = "/admin/admin-clientes-listar.html";
      return;
    }

    const json = await res.json();
    const cliente = json.data;

    // ✅ Preenche somente depois de validar
    form.nome.value = cliente.nome || "";
    form.telefone.value = cliente.telefone || "";
    form.cpf.value = cliente.cpf || "";
    form.email.value = cliente.email || "";
    form.captador.value = cliente.captador || "";
    form.cep.value = cliente.cep || "";
    form.endereco.value = cliente.endereco || "";
    form.bairro.value = cliente.bairro || "";
    form.cidade.value = cliente.cidade || "";
    form.uf.value = cliente.uf || "";


  } catch (err) {
    console.error(err);
    alert("Erro ao carregar cliente");
  }

  // SALVAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form));

    const res = await fetch(`/api/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (!res.ok) {
      alert("Erro ao salvar alterações");
      return;
    }

    alert("Cliente atualizado com sucesso!");
    window.location.href = "/admin/admin-clientes-listar.html";
  });
});
