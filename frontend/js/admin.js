document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Proteção apenas admin
    if (!user || user.role !== "admin") {
        alert("Acesso restrito! Faça login como admin.");
        window.location.href = "/login.html";
        return;
    }

    console.log(`Admin logado: ${user.nome}`);

    // Logout
    const logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/login.html";
    });

    // Cadastro de imóveis
    const form = document.getElementById("upload-form");
    const statusMsg = document.getElementById("status-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:3000/api/imoveis", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                statusMsg.textContent = "Imóvel cadastrado com sucesso!";
                statusMsg.style.color = "limegreen";
                form.reset();
            } else {
                statusMsg.textContent = data.error || "Falha ao cadastrar imóvel";
                statusMsg.style.color = "red";
            }
        } catch (err) {
            console.error("Erro ao enviar:", err);
            statusMsg.textContent = "Erro ao conectar com o servidor.";
            statusMsg.style.color = "orange";
        }
    });
});
