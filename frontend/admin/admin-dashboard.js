// ===============================
// DASHBOARD - RESUMO DO SISTEMA
// ===============================

// 🔐 Proteção do dashboard (usuário único)
const token = localStorage.getItem("token");
if (!token) {
    alert("Acesso restrito!");
    window.location.href = "/login.html";
}

// Logout
document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/login.html";
});

async function carregarDashboard() {
    try {
        // =====================
        // IMÓVEIS
        // =====================
        const resImoveis = await fetch("/api/imoveis");
        const jsonImoveis = await resImoveis.json();
        const imoveis = jsonImoveis.data || [];

        document.getElementById("total-imoveis").textContent = imoveis.length;

        const venda = imoveis.filter(i => i.finalidade === "VENDA").length;
        const aluguel = imoveis.filter(i => i.finalidade === "ALUGUEL").length;

        document.getElementById("tipos-imoveis").textContent =
            `Venda: ${venda} / Aluguel: ${aluguel}`;

        if (imoveis.length > 0) {
            document.getElementById("ultimo-imovel").textContent =
                `${imoveis[0].codigo} - ${imoveis[0].titulo}`;
        } else {
            document.getElementById("ultimo-imovel").textContent = "—";
        }

        // =====================
        // CLIENTES
        // =====================
        const resClientes = await fetch("/api/clientes");
        const jsonClientes = await resClientes.json();

        const clientes = jsonClientes.data || [];

        document.getElementById("total-clientes").textContent = clientes.length;


    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }



}

carregarDashboard();
