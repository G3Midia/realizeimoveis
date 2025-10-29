document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const imovelId = params.get("id");

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/16UrqFCh58gf3puUt27mkrikPQDWxPvTzrt7hsTw5Nag/gviz/tq?tqx=out:json";

  fetch(sheetUrl)
    .then((res) => res.text())
    .then((text) => {
      const data = JSON.parse(text.substring(47).slice(0, -2));
      const rows = data.table.rows.slice(1);

      const detailEl = document.getElementById("conteudo-imovel");
      const recList = document.querySelector("#recomendados-carousel .splide__list");
      let detailHTML = "";

      rows.forEach((row) => {
        const [
          id,
          idForm,
          titulo,
          subtitulo,
          endereco,
          dormitorios,
          banheiros,
          metragem,
          AreaDeLazer,
          Seguranca,
          Diferenciais,
          sobre,
          condicoes,
          complementoCondicoes,
          imagens,
        ] = row.c.map((cell) => cell?.v || "");

        const imgRec = imagens.split(",")[0].trim();
        recList.insertAdjacentHTML(
          "beforeend",
          `
          <li class="splide__slide">
            <div class="imovel-card rec-card">
              <img src="${imgRec}" alt="${titulo}">
              <div class="card-content">
                <h2>${titulo}</h2>
                <h4>${subtitulo}</h4>
                <p class="cidade"><i class="fa-solid fa-map-marker-alt"></i>${endereco}</p>
                <button onclick="location.href='index.html?id=${id}'">Ver Detalhes</button>
              </div>
            </div>
          </li>
        `
        );

        if (id === imovelId) {
          const imgsArr = imagens.split(",").map((u) => u.trim()).filter((u) => u);
          const slidesHTML = imgsArr
            .map((u) => `<li class="splide__slide"><img src="${u}" alt="${titulo}"></li>`)
            .join("");

          // função pra criar item de info apenas se tiver conteúdo
          const infoItem = (label, value) => {
            if (!value || value.toLowerCase() === "none") return "";
            return `<div class="info-item"><strong>${label}</strong><br>${value}</div>`;
          };

          // seção "Sobre este imóvel" — só aparece se tiver texto
          const sobreSection = sobre && sobre.trim() !== ""
            ? `
              <section class="bloco sobre">
                <h2>Sobre este imóvel</h2>
                <p class="texto-sobre">${sobre}</p>
                <button class="btn-dourado" onclick="location.href='#formulario'">
                  CADASTRE-SE AGORA MESMO
                </button>
              </section>
            `
            : "";

          detailHTML = `
            <!-- CARROSSEL DE IMAGENS PRINCIPAIS -->
            <div id="image-carousel" class="splide">
              <div class="splide__track">
                <ul class="splide__list">
                  ${slidesHTML}
                </ul>
              </div>
            </div>

            <!-- TÍTULO + SUBTÍTULO + BOTÃO -->
            <div class="title-block">
              <h1>${titulo}</h1>
              <h4>${subtitulo}</h4>
              <button class="btn-dourado" onclick="location.href='#formulario'">QUERO CONHECER</button>
            </div>

            <!-- INFORMAÇÕES PRINCIPAIS -->
            <section class="bloco informacoes">
              ${infoItem("Endereço:", endereco)}
              ${infoItem("Dormitórios:", dormitorios)}
              ${infoItem("Banheiros:", banheiros)}
              ${infoItem("Metragem:", metragem)}
              ${infoItem("Área de Lazer:", AreaDeLazer)}
              ${infoItem("Segurança:", Seguranca)}
              ${infoItem("Diferenciais:", Diferenciais)}
            </section>

            ${sobreSection}

            <!-- CONDIÇÕES DE PAGAMENTO -->
            <section class="bloco condicoes">
              <h2>Condições de pagamento</h2>
              <p class="texto-grande">${condicoes}</p>
              <p class="texto-pequeno">${complementoCondicoes}</p>
              <button class="btn-dourado" onclick="location.href='#formulario'">ENTRAR EM CONTATO</button>
            </section>

            <!-- FORMULÁRIO -->
            <section class="formulario" id="formulario">
              <div class="bloco cadastro">
                <h1>Cadastre-se agora mesmo para receber todas as informações:</h1>
                <form id="${idForm}" action="obrigado.html">
                  <label for="nome">Nome*</label>
                  <input type="text" id="nome" name="form_fields[name]" required placeholder="Digite seu nome">

                  <label for="telefone">Telefone*</label>
                  <input type="tel" id="telefone" name="form_fields[phone]" pattern="[0-9 ]+" placeholder="Digite seu WhatsApp com DDD" required>

                  <label for="email">Email*</label>
                  <input type="email" id="email" name="form_fields[email]" required placeholder="Digite seu melhor e-mail">

                  <center>
                    <button type="submit">CADASTRAR</button>
                  </center>
                </form>
              </div>
            </section>

            <!-- Start of HubSpot Embed Code -->
              <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/22061060.js"></script>
            <!-- End of HubSpot Embed Code -->
          `;
        }
      });

      detailEl.innerHTML = detailHTML || "<p>Imóvel não encontrado.</p>";

      // Inicializa os carrosséis
      if (detailHTML) {
        new Splide("#image-carousel", {
          type: "loop",
          autoplay: true,
          perPage: 3,
          perMove: 1,
          gap: "0.2rem",
          pagination: false,
          breakpoints: { 768: { perPage: 1 } },
        }).mount();
      }

      new Splide("#recomendados-carousel", {
        type: "loop",
        autoplay: true,
        perPage: 4,
        perMove: 1,
        gap: "0.2rem",
        pagination: false,
        breakpoints: { 768: { perPage: 1 } },
      }).mount();

      // --- FUNÇÃO DE "LER MAIS" NO MOBILE ---
      const sobreEl = document.querySelector(".bloco.sobre .texto-sobre");
      if (sobreEl && window.innerWidth <= 768) {
        const maxLines = 6; // número máximo de linhas visíveis
        sobreEl.style.display = "-webkit-box";
        sobreEl.style.webkitBoxOrient = "vertical";
        sobreEl.style.overflow = "hidden";
        sobreEl.style.webkitLineClamp = maxLines;
        sobreEl.style.transition = "all 0.3s ease";

        // Cria botão "Ler mais"
        const btnLerMais = document.createElement("button");
        btnLerMais.textContent = "Ler mais";
        btnLerMais.className = "btn-ler-mais";

        // Insere logo depois do texto
        sobreEl.insertAdjacentElement("afterend", btnLerMais);

        let expandido = false;
        btnLerMais.addEventListener("click", () => {
          expandido = !expandido;
          if (expandido) {
            sobreEl.style.webkitLineClamp = "unset";
            btnLerMais.textContent = "Mostrar menos";
          } else {
            sobreEl.style.webkitLineClamp = maxLines;
            btnLerMais.textContent = "Ler mais";
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("conteudo-imovel").innerHTML =
        "<p>Erro ao carregar dados.</p>";
    });
});
