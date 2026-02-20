document.addEventListener("DOMContentLoaded", async () => {

  const form = document.getElementById("formImovel");
  const inputImagens = document.querySelector('input[name="imagens"]');
  const previewExistentes = document.getElementById("preview-imagens-existentes");

  let imagensAtuais = [];
  let id;

  // ==========================
  // PEGAR ID DA URL
  // ==========================
  const params = new URLSearchParams(window.location.search);
  id = params.get("id");

  if (!id) {
    alert("ID do imóvel não informado");
    window.location.href = "/admin/admin-imoveis-listar.html";
    return;
  }

  // ==========================
  // BUSCAR IMÓVEL
  // ==========================
  try {
    const res = await fetch(`/api/imoveis/${id}`);
    const json = await res.json();
    const imovel = json.data || json;

    if (!imovel) {
      alert("Imóvel não encontrado");
      return;
    }

    // 🔥 Carregar imagens atuais
    imagensAtuais = [...(imovel.imagens || [])];

    function renderImagens() {
      previewExistentes.innerHTML = imagensAtuais.map((img, index) => `
        <div class="img-box" style="display:inline-block; margin:5px; position:relative;">
          <img src="${img}" width="120" style="border-radius:6px;">
          <button type="button" 
                  style="position:absolute; top:0; right:0; background:red; color:#fff; border:none; cursor:pointer;"
                  onclick="removerImagem(${index})">
            ❌
          </button>
        </div>
      `).join("");
    }

    window.removerImagem = function(index) {
      imagensAtuais.splice(index, 1);
      renderImagens();
    };

    renderImagens();

    // ==========================
    // PREENCHER CAMPOS
    // ==========================
    form.titulo.value = imovel.titulo || "";
    form.captador.value = imovel.captador || "";
    form.proprietario.value = imovel.proprietario || "";
    form.tipo.value = imovel.tipo || "";
    form.finalidade.value = imovel.finalidade || "";

    form.areaTotal.value = imovel.areaTotal || "";
    form.areaConstruida.value = imovel.areaConstruida || "";

    form.quartos.value = imovel.quartos || "";
    form.suites.value = imovel.suites || "";
    form.banheiros.value = imovel.banheiros || "";
    form.salas.value = imovel.salas || "";
    form.cozinhas.value = imovel.cozinhas || "";
    form.garagem.value = imovel.garagem || "";

    form.descricao.value = imovel.descricao || "";
    form.endereco.value = imovel.endereco || "";
    form.bairro.value = imovel.bairro || "";
    form.cidade.value = imovel.cidade || "";
    form.uf.value = imovel.uf || "";
    form.preco.value = imovel.preco || "";

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar imóvel");
  }

  // ==========================
  // PREVIEW NOVAS IMAGENS
  // ==========================
  const previewNovas = document.createElement("div");
  inputImagens.after(previewNovas);

  inputImagens.addEventListener("change", () => {
    previewNovas.innerHTML = "";

    Array.from(inputImagens.files).forEach(file => {
      const reader = new FileReader();

      reader.onload = e => {
        previewNovas.innerHTML += `
          <div style="display:inline-block; margin:5px;">
            <img src="${e.target.result}" width="120" style="border-radius:6px;">
          </div>
        `;
      };

      reader.readAsDataURL(file);
    });
  });

  // ==========================
  // SALVAR ALTERAÇÕES
  // ==========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // 🔥 Enviar imagens restantes
    formData.append("imagensExistentes", JSON.stringify(imagensAtuais));

    try {
      const res = await fetch(`/api/imoveis/${id}`, {
        method: "PUT",
        body: formData
      });

      if (!res.ok) {
        const erro = await res.json();
        alert("Erro ao atualizar: " + erro.error);
        return;
      }

      alert("Imóvel atualizado com sucesso!");
      window.location.href = "/admin/admin-imoveis-listar.html";

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações");
    }
  });

});