// =========================
// MENU RESPONSIVO
// =========================
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// =========================
// BUSCA E LISTAGEM DE IMÓVEIS
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("imoveis-container");
  const searchForm = document.getElementById("search-form");
  const tipoSelect = document.getElementById("tipo");
  const cidadeInput = document.getElementById("cidade");
  const precoSelect = document.getElementById("preco");

  // Função principal: carrega imóveis do banco
  async function carregarImoveis(filtros = {}) {
    try {
      const params = new URLSearchParams();

      if (filtros.tipo) params.append("tipo", filtros.tipo);
      if (filtros.busca) params.append("busca", filtros.busca);
      if (filtros.minPreco) params.append("minPreco", filtros.minPreco);
      if (filtros.maxPreco) params.append("maxPreco", filtros.maxPreco);

      const res = await fetch(`/api/imoveis?${params.toString()}`);
      const data = await res.json();

      container.innerHTML = "";

      if (!data.data || data.data.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-secondary);">Nenhum imóvel encontrado.</p>`;
        return;
      }

      // Monta os cards dinamicamente
      data.data.forEach((imovel) => {
        const card = document.createElement("div");
        card.className = "property-card";
        card.innerHTML = `
          <img src="${imovel.imagens?.[0] || 'https://via.placeholder.com/400x250'}" alt="${imovel.titulo}" />
          <div class="property-info">
            <h3>${imovel.titulo}</h3>
            <p>${imovel.descricao || "Sem descrição disponível."}</p>
            <p><strong>Endereço:</strong> ${imovel.endereco || "-"}</p>
            <p><strong>Tipo:</strong> ${imovel.tipo}</p>
            <p class="price">R$ ${Number(imovel.preco).toLocaleString("pt-BR")}</p>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
      container.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar imóveis.</p>`;
    }
  }

  // Carrega todos ao abrir a página
  carregarImoveis();

  // Quando o usuário faz a busca
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let minPreco = "";
    let maxPreco = "";

    const precoSelecionado = precoSelect.value;
    if (precoSelecionado) {
      const [min, max] = precoSelecionado.split("-");
      minPreco = min;
      maxPreco = max;
    }

    carregarImoveis({
      tipo: tipoSelect.value,
      busca: cidadeInput.value.trim(),
      minPreco,
      maxPreco,
    });
  });
});
