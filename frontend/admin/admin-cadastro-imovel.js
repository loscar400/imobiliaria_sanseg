// ===============================
// CADASTRO DE IMÓVEL (ADMIN)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS de cadastro de imóvel carregado");

  // -------- ELEMENTOS --------
  const form = document.getElementById("formImovel");
  const cepInput = document.getElementById("cep");

  if (!form) {
    console.error("Formulário não encontrado");
    return;
  }

  // -------- CEP AUTOMÁTICO --------
  if (cepInput) {
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

    // máscara CEP
    cepInput.addEventListener("input", () => {
      cepInput.value = cepInput.value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
    });
  }

  // -------- SUBMIT DO FORM --------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("http://localhost:3000/api/imoveis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (res.ok) {
        alert("Imóvel cadastrado com sucesso!");
        window.location.href = "/admin/admin-imoveis.html";
      } else {
        alert("Erro ao cadastrar imóvel");
      }
    } catch (err) {
      console.error("Erro ao salvar imóvel", err);
      alert("Erro de comunicação com o servidor");
    }
  });
});