/* PortfolioLite — tema, menu, animações ao rolar, filtros de projetos e formulário de contato */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Troque pelos seus dados de contato */
const WHATSAPP = '5551999999999';
const EMAIL = 'contato@lucasandrade.dev';

const HABILIDADES = [
  ['HTML e CSS', 95], ['JavaScript', 88], ['React', 80], ['Design responsivo', 92],
  ['Figma', 75], ['Acessibilidade', 78], ['Git e GitHub', 85], ['SEO técnico', 70]
];
const PROJETOS = [
  { nome: 'Barbearia Navalha', tipo: 'Site + agendamento', cat: 'sites', desc: 'Site com agendamento online e lembretes pelo WhatsApp. As reservas dobraram no primeiro mês.', tags: ['HTML', 'CSS', 'JavaScript'], cores: ['#ff5a1f', '#ffb38a'] },
  { nome: 'Doce Encanto', tipo: 'Loja virtual', cat: 'lojas', desc: 'Loja de doces artesanais com carrinho, cupons e pedidos que chegam direto no WhatsApp.', tags: ['React', 'Pix', 'Mobile'], cores: ['#d6336c', '#ffc9de'] },
  { nome: 'Clínica Vitta', tipo: 'Site institucional', cat: 'sites', desc: 'Site rápido e acessível com páginas de especialidades e formulário de contato.', tags: ['HTML', 'SEO', 'Acessibilidade'], cores: ['#0ca678', '#b2f2bb'] },
  { nome: 'FinPlan', tipo: 'Painel web', cat: 'apps', desc: 'Painel para controle de gastos com gráficos, metas mensais e exportação de relatórios.', tags: ['JavaScript', 'Gráficos', 'API'], cores: ['#3b5bdb', '#a5d8ff'] },
  { nome: 'Lançamento Aurora', tipo: 'Landing page', cat: 'landing', desc: 'Página de lançamento com contagem regressiva e lista de espera. 2 mil cadastros em uma semana.', tags: ['HTML', 'CSS', 'Animações'], cores: ['#7048e8', '#e5dbff'] },
  { nome: 'Agenda Fit', tipo: 'Aplicativo web', cat: 'apps', desc: 'App para academia marcar aulas, ver horários livres e acompanhar o histórico de treinos.', tags: ['React', 'PWA', 'Firebase'], cores: ['#f08c00', '#ffec99'] }
];
const CATS = { todos: 'Todos', sites: 'Sites', lojas: 'Lojas', landing: 'Landing pages', apps: 'Apps' };

/* ---------- Tema claro/escuro ---------- */
$('#tema').addEventListener('click', () => {
  const escuro = document.documentElement.dataset.tema !== 'escuro';
  if (escuro) document.documentElement.dataset.tema = 'escuro'; else delete document.documentElement.dataset.tema;
  try { localStorage.setItem('pl_tema', escuro ? 'escuro' : 'claro'); } catch { /* ignora */ }
});

/* ---------- Menu no celular ---------- */
const menu = $('#menu'), nav = $('#nav');
function fecharMenu() { nav.classList.remove('aberta'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
menu.addEventListener('click', () => {
  const abrir = !nav.classList.contains('aberta');
  nav.classList.toggle('aberta', abrir);
  menu.setAttribute('aria-expanded', String(abrir)); menu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
});
nav.addEventListener('click', (e) => { if (e.target.closest('a')) fecharMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });
document.addEventListener('click', (e) => { if (!e.target.closest('#nav, #menu')) fecharMenu(); });
addEventListener('scroll', () => $('#topo').classList.toggle('rolou', scrollY > 10), { passive: true });

/* ---------- Texto digitando no título ---------- */
const PALAVRAS = ['front-end', 'web', 'de interfaces', 'freelancer'];
(function digitar() {
  const el = $('#digitando');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let p = 0, i = PALAVRAS[0].length, apagando = true;
  const passo = () => {
    const w = PALAVRAS[p];
    el.textContent = w.slice(0, i);
    if (apagando) { i--; if (i < 0) { apagando = false; p = (p + 1) % PALAVRAS.length; i = 0; } }
    else { i++; if (i > PALAVRAS[p].length) { apagando = true; i = PALAVRAS[p].length; return setTimeout(passo, 1800); } }
    setTimeout(passo, apagando ? 45 : 90);
  };
  setTimeout(passo, 2200);
})();

/* ---------- Habilidades e projetos ---------- */
$('#lista-hab').innerHTML = HABILIDADES.map(([n, v]) => `<div class="hab" role="group" aria-label="${n}: ${v}%">
  <div class="hab__topo"><span class="hab__nome" style="color:inherit">${n}</span><span>${v}%</span></div>
  <div class="barra" aria-hidden="true"><i style="--n:${v}%"></i></div></div>`).join('');

let filtro = 'todos';
function desenharFiltros() {
  $('#filtros').innerHTML = Object.entries(CATS).filter(([k]) => k === 'todos' || PROJETOS.some((p) => p.cat === k))
    .map(([k, v]) => `<button data-cat="${k}" aria-pressed="${filtro === k}">${v}</button>`).join('');
}
function desenharProjetos() {
  const l = PROJETOS.filter((p) => filtro === 'todos' || p.cat === filtro);
  $('#lista-proj').innerHTML = l.map((p, i) => `<li class="proj" style="--a:${p.cores[0]};--b:${p.cores[1]};animation-delay:${i * 60}ms">
    <div class="proj__capa" aria-hidden="true"><div class="tela"><i></i><i></i><i></i><i></i></div></div>
    <div class="proj__corpo"><span class="proj__tipo">${escapar(p.tipo)}</span><h3>${escapar(p.nome)}</h3><p>${escapar(p.desc)}</p>
    <div class="tags">${p.tags.map((t) => `<span>${escapar(t)}</span>`).join('')}</div></div></li>`).join('');
}
$('#filtros').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) { filtro = b.dataset.cat; desenharFiltros(); desenharProjetos(); } });
desenharFiltros(); desenharProjetos();

/* ---------- Animações ao rolar ---------- */
$$('.secao > *, .habilidades, .numeros').forEach((el) => el.classList.add('revelar'));
const obs = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visivel');
    if (en.target.classList.contains('numeros')) contar();
    obs.unobserve(en.target);
  });
}, { threshold: 0.2 });
$$('.revelar').forEach((el) => obs.observe(el));

function contar() {
  $$('[data-contar]').forEach((el) => {
    const alvo = +el.dataset.contar, ini = performance.now(), dur = 1400;
    const q = (t) => { const p = Math.min(1, (t - ini) / dur); el.textContent = Math.round(alvo * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(q); };
    requestAnimationFrame(q);
  });
}

/* Link ativo no menu conforme a seção visível */
const secoes = ['inicio', 'sobre', 'habilidades', 'projetos', 'contato'].map((id) => document.getElementById(id));
const obsNav = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => {
    if (en.isIntersecting) $$('.nav a').forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === `#${en.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secoes.forEach((s) => obsNav.observe(s));

/* ---------- Formulário de contato ---------- */
const form = $('#form');
const regras = {
  nome: (v) => (v.trim().length < 3 ? 'Digite seu nome (pelo menos 3 letras).' : ''),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Digite um e-mail válido.' : ''),
  mensagem: (v) => (v.trim().length < 10 ? 'Conte um pouco mais (pelo menos 10 caracteres).' : '')
};
function validar(campo) {
  const el = $(`#${campo}`), msg = regras[campo](el.value);
  $(`#erro-${campo}`).textContent = msg;
  el.setAttribute('aria-invalid', String(!!msg));
  if (msg) el.setAttribute('aria-describedby', `erro-${campo}`); else el.removeAttribute('aria-describedby');
  return !msg;
}
Object.keys(regras).forEach((c) => {
  $(`#${c}`).addEventListener('blur', () => { if ($(`#${c}`).value) validar(c); });
  $(`#${c}`).addEventListener('input', () => { if ($(`#${c}`).getAttribute('aria-invalid') === 'true') validar(c); });
});
$('#mensagem').addEventListener('input', (e) => { $('#contador').textContent = `${e.target.value.length}/800`; });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = Object.keys(regras).map(validar).every(Boolean);
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
  if ($('#site').value) return; // campo-isca preenchido: provavelmente robô
  const d = { nome: $('#nome').value.trim(), email: $('#email').value.trim(), assunto: $('#assunto').value, mensagem: $('#mensagem').value.trim() };
  const via = form.querySelector('[name=via]:checked').value;
  const texto = `Olá! Meu nome é ${d.nome}.\nAssunto: ${d.assunto}\n\n${d.mensagem}\n\nMeu e-mail: ${d.email}`;
  const url = via === 'whatsapp'
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`
    : `mailto:${EMAIL}?subject=${encodeURIComponent(`[Site] ${d.assunto}`)}&body=${encodeURIComponent(texto)}`;
  $('#enviar').disabled = true; $('#enviar').textContent = 'Abrindo…';
  setTimeout(() => {
    if (via === 'whatsapp') window.open(url, '_blank', 'noopener'); else location.href = url;
    $('#sucesso').textContent = `Prontinho, ${d.nome.split(' ')[0]}! ${via === 'whatsapp' ? 'Sua mensagem foi aberta no WhatsApp' : 'Seu e-mail foi aberto no aplicativo de e-mail'}. É só confirmar o envio por lá.`;
    $('#sucesso').hidden = false;
    form.reset(); $('#contador').textContent = '0/800';
    $('#enviar').disabled = false; $('#enviar').textContent = 'Enviar mensagem';
  }, 500);
});

$('#ano').textContent = new Date().getFullYear();
