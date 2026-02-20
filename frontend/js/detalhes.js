document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("detalhes-container");

    // Pega o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = `<p>ID do imóvel não encontrado</p>`;
        return;
    }

    try {
        const res = await fetch(`/api/imoveis/${id}`);
        const data = await res.json();
        const imovel = data.data || data;

        if (!imovel || !imovel._id) {
            container.innerHTML = `<p>Imóvel não encontrado.</p>`;
            return;
        }

        // ------------------------------
        // LAYOUT PROFISSIONAL
        // ------------------------------
        container.innerHTML = `
            <h1 class="detalhes-titulo">${imovel.titulo}</h1>

            <div class="codigo-destaque">
                CÓD.: <span>${imovel.codigo}</span>
            </div>

            <p class="detalhes-preco valor-direita">
                R$ ${Number(imovel.preco).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}
            </p>

            <!-- GALERIA -->
            <section class="galeria">
                <div class="galeria-principal">
                    <img src="${imovel.imagens?.[0] || "https://via.placeholder.com/800x400"}" alt="Imagem principal">
                </div>

                <div class="galeria-thumbs">
                ${imovel.imagens && imovel.imagens.length > 1
                ? imovel.imagens.slice(1).map(img =>
                    `<img src="${img}" alt="Imagem do imóvel">`
                ).join("")
                : ""
            }
                </div>
            </section>

            <!-- FICHA TÉCNICA -->
            <section class="ficha-tecnica">
                <h2>Ficha Técnica</h2>
                <ul>
                    <li><strong>Tipo:</strong> ${imovel.tipo || "—"}</li>
                    <li><strong>Cidade:</strong> ${imovel.cidade || "—"}</li>
                    <li><strong>Bairro:</strong> ${imovel.bairro || "—"}</li>
                    <li><strong>Quartos:</strong> ${imovel.quartos ?? 0}</li>
                    <li><strong>Banheiros:</strong> ${imovel.banheiros ?? 0}</li>
                    <li><strong>Salas:</strong> ${imovel.salas ?? 0}</li>
                    <li><strong>Cozinhas:</strong> ${imovel.cozinhas ?? 0}</li>
                    <li><strong>Suítes:</strong> ${imovel.suites ?? 0}</li>
                    <li><strong>Garagem:</strong> ${imovel.garagem ?? 0} vagas</li>
                    <li><strong>Área total:</strong> ${imovel.areaTotal
                ? Number(imovel.areaTotal).toFixed(2) + " m²"
                : "-"
            }</li>

<li><strong>Área construída:</strong> ${imovel.areaConstruida
                ? Number(imovel.areaConstruida).toFixed(2) + " m²"
                : "-"
            }</li>
                </ul>
            </section>

            <!-- DESCRIÇÃO -->
            <section class="descricao">
                <h2>Descrição</h2>
                <p>${imovel.descricao || "Sem descrição disponível"}</p>
            </section>

            <!-- CONTATO -->
            <section class="contato-imovel">
                <h2>Interessado?</h2>

                <a 
                    href="https://wa.me/5534996626666?text=Olá!%20Tenho%20interesse%20no%20imóvel%20${imovel.codigo}%20-%20${imovel.titulo}" 
                    target="_blank"
                    class="btn-contato-whatsapp"
                >
                    <i class="fa-brands fa-whatsapp"></i> Falar no WhatsApp
                </a>
            </section>
        `;

    } catch (err) {
        console.error("Erro ao carregar imóvel:", err);
        container.innerHTML = "<p>Erro ao carregar informações do imóvel.</p>";
    }

    // ----------- TROCAR IMAGEM PRINCIPAL AO CLICAR NA THUMB ----------- //
    setTimeout(() => {
        const mainImg = document.querySelector(".galeria-principal img");
        const thumbs = document.querySelectorAll(".galeria-thumbs img");

        thumbs.forEach(thumb => {
            thumb.addEventListener("click", () => {
                mainImg.src = thumb.src;
            });
        });
    }, 100);

});
