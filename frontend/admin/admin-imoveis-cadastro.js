document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formImovel");
  const cepInput = document.getElementById("cep");

  if (!form) {
    console.error("Formulário não encontrado");
    return;
  }

  // ==========================
  // CEP AUTOMÁTICO
  // ==========================
  cepInput?.addEventListener("input", () => {
    cepInput.value = cepInput.value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  });

  cepInput?.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (!data.erro) {
      document.getElementById("endereco").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("uf").value = data.uf || "";
    }
  });

  // ==========================
  // SUBMIT
  // ==========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/imoveis", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const erro = await res.json();
        alert("Erro: " + erro.error);
        return;
      }

      alert("Imóvel cadastrado com sucesso!");
      window.location.href = "/admin/admin-imoveis-listar.html";

    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar imóvel");
    }
  });
});
