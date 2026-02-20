// =============================
// LISTAR E BUSCAR IMÓVEIS
// =============================
document.addEventListener("DOMContentLoaded", async () => {
    const containerTodos = document.getElementById("todos-imoveis-container");
    const searchForm = document.getElementById("search-form");

    async function carregarImoveis(filtros = {}) {
        try {
            const params = new URLSearchParams();

            if (filtros.tipo) params.append("tipo", filtros.tipo);
            if (filtros.cidade) params.append("busca", filtros.cidade);
            if (filtros.bairro) params.append("busca", filtros.bairro);
            if (filtros.quartos) params.append("quartos", filtros.quartos);
            if (filtros.minPreco) params.append("minPreco", filtros.minPreco);
            if (filtros.maxPreco) params.append("maxPreco", filtros.maxPreco);

            const res = await fetch(`/api/imoveis?${params.toString()}`);
            const data = await res.json();

            const imoveis = data.data || [];

            if (imoveis.length === 0) {
                containerTodos.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
                return;
            }

            containerTodos.innerHTML = imoveis
                .map(imovel => {

                    const imagem = imovel.imagens?.[0] || "/placeholder.jpg";
                    const preco = parseFloat(imovel.preco).toLocaleString("pt-BR", {
                        minimumFractionDigits: 0
                    });


                    // Ícone automático
                    const tipoIcon =
                        imovel.titulo?.toLowerCase().includes("apart") ? "fa-building" : "fa-house";

                    return `
<div class="card-imovel">

    <div class="categoria">
        <i class="fa-solid ${tipoIcon}"></i>
        ${imovel.titulo || "IMÓVEL"}
    </div>

    <img src="${imagem}" class="foto">

    <div class="card-info">
        <p class="codigo">Cód.: ${imovel.codigo}</p>
        <p class="local">${imovel.cidade} - ${imovel.bairro}</p>

        <p class="preco">
            R$ ${parseFloat(imovel.preco).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
</p>

    </div>

    <div class="card-icons">
        <div class="item">
            <i class="fa-solid fa-ruler-combined"></i>
            <span>${imovel.areaConstruida !== undefined && imovel.areaConstruida !== null
                            ? Number(imovel.areaConstruida).toFixed(0)
                            : "-"} m²</span>
        </div>

        <div class="item">
            <i class="fa-solid fa-bed"></i>
            <span>${imovel.quartos || 0} quartos</span>
        </div>

        <div class="item">
            <i class="fa-solid fa-shower"></i>
            <span>${imovel.suites || 0} suítes</span>
        </div>

        <div class="item">
            <i class="fa-solid fa-car"></i>
            <span>${imovel.garagem || 0} vagas</span>
        </div>
    </div>

    <a href="detalhes.html?id=${imovel._id}" class="btn-detalhes-link" target="_blank">
        <button class="detalhes">+ DETALHES</button>
    </a>

</div>
`;

                })
                .join("");



        } catch (err) {
            console.error("Erro ao carregar imóveis:", err);
            containerTodos.innerHTML = "<p>Erro ao carregar imóveis.</p>";
        }
    }

    // Carregar tudo ao abrir
    carregarImoveis();

    // ----------------------------
    // BUSCA FUNCIONAL
    // ----------------------------
    if (searchForm) {
        searchForm.addEventListener("submit", e => {
            e.preventDefault();

            const tipo = document.getElementById("tipo").value;
            const cidade = document.getElementById("cidade").value;
            const bairro = document.getElementById("bairro").value;
            const quartos = document.getElementById("quartos").value;
            const minPreco = document.getElementById("minPreco").value;
            const maxPreco = document.getElementById("maxPreco").value;

            carregarImoveis({
                tipo,
                cidade,
                bairro,
                quartos,
                minPreco,
                maxPreco
            });
        });
    }
});
