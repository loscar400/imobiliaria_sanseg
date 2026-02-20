document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCliente");
  const telefone = document.getElementById("telefone");
  const cpf = document.getElementById("cpf");

  if (!form) {
    console.error("Formulário formCliente não encontrado");
    return;
  }

  const cepInput = document.getElementById("cep");

  if (cepInput) {

    // Máscara CEP: 00000-000
    cepInput.addEventListener("input", () => {
      cepInput.value = cepInput.value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
    });

    // Busca automática no ViaCEP
    cepInput.addEventListener("blur", async () => {
      const cep = cepInput.value.replace(/\D/g, "");

      if (cep.length !== 8) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data.erro) {
          alert("CEP não encontrado");
          return;
        }

        document.getElementById("endereco").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("uf").value = data.uf || "";

      } catch (err) {
        console.error("Erro ao buscar CEP", err);
        alert("Erro ao consultar o CEP");
      }
    });
  }


  /* =====================
     MÁSCARA TELEFONE
     (00) 00000-0000
  ===================== */
  telefone?.addEventListener("input", () => {
    let v = telefone.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");

    telefone.value = v;
  });

  /* =====================
     MÁSCARA CPF
     000.000.000-00
  ===================== */
  cpf?.addEventListener("input", () => {
    let v = cpf.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = v;
  });

  /* =====================
     SUBMIT DO FORMULÁRIO
  ===================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (!res.ok) {
        const erro = await res.text();
        alert("Erro ao cadastrar cliente: " + erro);
        return;
      }

      alert("Cliente cadastrado com sucesso!");
      window.location.href = "/admin/admin-clientes-listar.html";

    } catch (err) {
      console.error(err);
      alert("Erro de comunicação com o servidor");
    }
  });

});
