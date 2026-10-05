(function () {
  var CHAVE = "mural-estagios-vagas";
  var form = document.getElementById("form-vaga");
  var corpo = document.getElementById("corpo");
  var vazio = document.getElementById("vazio");
  var busca = document.getElementById("busca");
  var contador = document.getElementById("contador");
  var erro = document.getElementById("erro");
  var vagas = carregar();
  var novaId = null;

  function carregar() {
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (Array.isArray(salvo)) return salvo;
    } catch (e) {}
    return [
      { id: 1, titulo: "Estágio em Desenvolvimento Web", empresa: "Tecnova", area: "Tecnologia", modalidade: "Híbrido", cidade: "Fortaleza - CE", bolsa: "1.300", contato: "rh@tecnova.com.br", descricao: "HTML, CSS e JavaScript. 6h por dia.", data: Date.now() - 86400000 * 2 },
      { id: 2, titulo: "Estágio em Marketing Digital", empresa: "Casa Aurora", area: "Marketing", modalidade: "Remoto", cidade: "Juazeiro do Norte - CE", bolsa: "a combinar", contato: "vagas@casaaurora.com", descricao: "Redes sociais e criação de conteúdo.", data: Date.now() - 86400000 }
    ];
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(vagas)); } catch (e) {}
  }
  function esc(t) {
    var d = document.createElement("div");
    d.textContent = t == null ? "" : String(t);
    return d.innerHTML;
  }
  function formatarBolsa(b) {
    if (!b) return "A combinar";
    return /^[\d.,\s]+$/.test(b) ? "R$ " + esc(b.trim()) : esc(b);
  }
  function contatoHtml(c) {
    var v = esc(c);
    if (/^https?:\/\//i.test(c)) return '<a href="' + v + '" target="_blank" rel="noopener noreferrer">Candidatar-se</a>';
    if (/^\S+@\S+\.\S+$/.test(c)) return '<a href="mailto:' + v + '">' + v + "</a>";
    return v;
  }
  function render() {
    var q = busca.value.trim().toLowerCase();
    var lista = vagas.filter(function (v) {
      return !q || [v.titulo, v.empresa, v.area, v.cidade, v.modalidade].join(" ").toLowerCase().indexOf(q) > -1;
    });
    corpo.innerHTML = lista.map(function (v) {
      return '<tr' + (v.id === novaId ? ' class="nova"' : "") + ">" +
        '<td><span class="vaga-titulo">' + esc(v.titulo) + "</span>" + (v.descricao ? '<span class="vaga-desc">' + esc(v.descricao) + "</span>" : "") + "</td>" +
        "<td>" + esc(v.empresa) + "</td>" +
        '<td><span class="etiqueta">' + esc(v.area) + "</span></td>" +
        "<td>" + esc(v.cidade) + "<br><small>" + esc(v.modalidade) + "</small></td>" +
        "<td>" + formatarBolsa(v.bolsa) + "</td>" +
        "<td>" + contatoHtml(v.contato) + "</td>" +
        "<td>" + new Date(v.data).toLocaleDateString("pt-BR") + "</td>" +
        '<td><button class="remover" data-id="' + v.id + '" aria-label="Remover vaga ' + esc(v.titulo) + '">Remover</button></td></tr>';
    }).join("");
    vazio.hidden = lista.length > 0;
    contador.textContent = vagas.length;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var campos = form.elements, faltando = false;
    ["titulo", "empresa", "area", "modalidade", "cidade", "contato"].forEach(function (n) {
      var vazioCampo = !campos[n].value.trim();
      campos[n].classList.toggle("invalido", vazioCampo);
      if (vazioCampo) faltando = true;
    });
    if (faltando) {
      erro.textContent = "Preencha os campos obrigatórios destacados para publicar a vaga.";
      erro.hidden = false;
      return;
    }
    erro.hidden = true;
    var vaga = {
      id: Date.now(),
      titulo: campos.titulo.value.trim(),
      empresa: campos.empresa.value.trim(),
      area: campos.area.value,
      modalidade: campos.modalidade.value,
      cidade: campos.cidade.value.trim(),
      bolsa: campos.bolsa.value.trim(),
      contato: campos.contato.value.trim(),
      descricao: campos.descricao.value.trim(),
      data: Date.now()
    };
    vagas.unshift(vaga);
    novaId = vaga.id;
    salvar();
    busca.value = "";
    render();
    form.reset();
    document.getElementById("vagas").scrollIntoView();
  });

  form.addEventListener("input", function (e) { e.target.classList.remove("invalido"); });
  busca.addEventListener("input", render);
  corpo.addEventListener("click", function (e) {
    var b = e.target.closest(".remover");
    if (!b || !confirm("Remover esta vaga da tabela?")) return;
    vagas = vagas.filter(function (v) { return String(v.id) !== b.dataset.id; });
    salvar();
    render();
  });

  render();
})();
