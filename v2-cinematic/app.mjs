/* ==========================================================================
   Academia Polímatas — V2 cinematográfica
   Um único relógio (o runtime da skill) governa tudo. Nada aqui esconde
   conteúdo por padrão: quem esconde é sempre uma classe aplicada por JS,
   então uma falha de script deixa a página legível em vez de vazia.
   ========================================================================== */
import { createCinematicRuntime } from './runtime/cinematic.mjs';
import { mountDeclarativeEffects } from './runtime/effects.mjs';
import { clamp, damp, seededRandom } from './runtime/core.mjs';

const runtime = createCinematicRuntime(document);
const soltarTextos = mountDeclarativeEffects(document, runtime);
const descartes = [soltarTextos];
const tempos = [];
const parado = () => runtime.signals.reducedMotion || runtime.signals.quality === 'static';

/* ---------- 0. Fatiar texto sem perder semântica ----------------------- */
/* Preserva <em>/<strong> e devolve os nós originais no desmonte. O nome
   acessível vira aria-label; os pedaços decorativos não são anunciados. */
function fatiar(el, porLetra = true) {
  const doc = document;
  const texto = (el.innerText || el.textContent).replace(/\s+/gu, ' ').trim();
  const originais = [...el.childNodes];
  const letras = [], palavras = [];
  const frag = doc.createDocumentFragment();

  const anda = (no, pai) => {
    if (no.nodeType !== 3) {
      const copia = no.cloneNode(false);
      for (const filho of no.childNodes) anda(filho, copia);
      pai.append(copia);
      return;
    }
    for (const pedaco of no.textContent.split(/(\s+)/u)) {
      if (!pedaco) continue;
      if (/^\s+$/u.test(pedaco)) { pai.append(doc.createTextNode(' ')); continue; }
      const palavra = doc.createElement('span');
      palavra.className = 'pal';
      palavra.setAttribute('aria-hidden', 'true');
      if (porLetra) {
        for (const ch of Array.from(pedaco)) {
          const letra = doc.createElement('span');
          letra.className = 'let';
          letra.textContent = ch;
          palavra.append(letra);
          letras.push(letra);
        }
      } else {
        // A palavra inteira é uma peça só, mas dentro do seu próprio
        // invólucro: assim cada palavra pode ter o seu ponto de fuga.
        const peca = doc.createElement('span');
        peca.className = 'let';
        peca.textContent = pedaco;
        palavra.append(peca);
        letras.push(peca);
      }
      palavras.push(palavra);
      pai.append(palavra);
    }
  };

  for (const no of originais) anda(no, frag);
  el.setAttribute('aria-label', texto);
  el.classList.add('txt3d');
  el.replaceChildren(frag);
  palavras.forEach((p, i) => p.style.setProperty('--i', i));

  return {
    letras, palavras, texto,
    restaurar() {
      el.replaceChildren(...originais);
      el.classList.remove('txt3d', 'esperando', 'digitando', 'digitou', 'flutua', 'respira', 'ondula');
      el.removeAttribute('aria-label');
    },
  };
}

/* ---------- 1. Abertura: digitação com as letras chegando em 3D -------- */
{
  const alvos = [...document.querySelectorAll('[data-digitar]')]
    .sort((a, b) => Number(a.dataset.digitar) - Number(b.dataset.digitar));

  if (alvos.length && !parado()) {
    let base = 0;
    for (const el of alvos) {
      const { letras, restaurar } = fatiar(el);
      // Passo adaptativo: frase curta digita devagar, frase longa acelera,
      // de modo que nenhuma delas passe de ~1,5s.
      const passo = Math.max(10, Math.min(30, Math.round(1400 / Math.max(1, letras.length))));
      letras.forEach((s, i) => s.style.setProperty('--atraso', (base + i * passo) + 'ms'));
      el.__ini = base;
      el.__fim = base + letras.length * passo + 380;
      base = el.__fim - 260;                        // a próxima frase entra no rastro
      el.classList.add('esperando');
      descartes.push(restaurar);
    }

    let comecou = false;
    const comecar = () => {
      if (comecou) return;
      comecou = true;
      for (const el of alvos) {
        el.classList.remove('esperando');
        el.classList.add('digitou');
        tempos.push(setTimeout(() => el.classList.add('digitando'), el.__ini));
        tempos.push(setTimeout(() => {
          el.classList.remove('digitando');
          el.classList.add('flutua');
        }, el.__fim));
      }
    };

    const obs = new IntersectionObserver((entradas) => {
      if (!entradas.some(e => e.isIntersecting)) return;
      obs.disconnect();
      comecar();
    }, { threshold: .15 });
    obs.observe(alvos[0]);
    // O IntersectionObserver não dispara em documento que não está sendo
    // renderizado. O prazo abaixo garante que a frase saia do estado oculto.
    tempos.push(setTimeout(() => { obs.disconnect(); comecar(); }, 1400));
    descartes.push(() => obs.disconnect());
    window.__digitacao = () => comecou;
  }
}

/* ---------- 2. Letras que respiram (o rótulo do topo) ------------------ */
{
  for (const el of document.querySelectorAll('[data-letras="respira"]')) {
    if (parado()) continue;
    const { letras, restaurar } = fatiar(el);
    const meio = Math.max(1, (letras.length - 1) / 2);
    letras.forEach((s, i) => {
      s.style.setProperty('--i', i);
      s.style.setProperty('--dir', ((i - meio) / meio).toFixed(3));
    });
    el.classList.add('respira');
    descartes.push(restaurar);
  }
}

/* ---------- 3. Letras que flutuam ------------------------------------- */
/* Mesma flutuação da abertura: cada palavra no seu próprio tempo, sem nada
   dependendo do ponteiro. */
{
  for (const el of document.querySelectorAll('[data-letras="flutua"]')) {
    if (parado()) continue;
    const { restaurar } = fatiar(el, false);
    el.classList.add('flutua-livre');
    descartes.push(restaurar);
  }
}

/* ---------- 3b. A carta: palavras e letras vindo em direção a quem lê -- */
{
  const alvos = [...document.querySelectorAll('[data-vindo]')];
  if (alvos.length && !parado()) {
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        obs.unobserve(e.target);
        e.target.classList.remove('esperando');
        e.target.classList.add('vindo-ativo');
      }
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

    for (const el of alvos) {
      const porLetra = el.dataset.vindo === 'letra';
      const { letras, restaurar } = fatiar(el, porLetra);
      // Letra a letra nas duas frases curtas; palavra a palavra no corpo, que
      // letra a letra ficaria lento de ler. O passo é calculado para que
      // nenhum parágrafo leve mais de ~1,2s para se montar por inteiro, senão
      // quem rola rápido fica lendo texto que ainda está chegando.
      const n = Math.max(1, letras.length);
      const passo = porLetra
        ? Math.max(6, Math.min(12, Math.round(900 / n)))
        : Math.max(12, Math.min(42, Math.round(1200 / n)));
      letras.forEach((s, i) => s.style.setProperty('--atraso', (i * passo) + 'ms'));
      el.classList.add('vindo', 'esperando');
      obs.observe(el);
      descartes.push(restaurar);
    }
    descartes.push(() => obs.disconnect());
  }
}

/* ---------- 4. Centro estático -----------------------------------------
   A página não "desce": o conteúdo sobe até o meio da tela, segura, e sai
   mais devagar do que a rolagem. O valor é linear no scroll, sem suavização,
   para que o movimento acompanhe o dedo/roda sem atraso. */
{
  const centros = [...document.querySelectorAll('[data-centro]')];
  const montaveis = [...document.querySelectorAll('[data-montar]')];
  if ((centros.length || montaveis.length) && !parado()) {
    const solto = runtime.subscribe(() => {
      const vh = window.innerHeight || 1;
      const caixas = centros.map(el => el.getBoundingClientRect());
      const caixasM = montaveis.map(el => el.getBoundingClientRect());

      centros.forEach((el, i) => {
        const r = caixas[i];
        const d = clamp(((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        const sobe = d >= 0 ? d * vh * .082 : d * vh * .032;
        const op = 1 - clamp((Math.abs(d) - .26) / .74) * .7;
        el.style.setProperty('--sobe', sobe.toFixed(1) + 'px');
        el.style.setProperty('--op', op.toFixed(3));
      });

      // Os cartões sobem um atrás do outro conforme a rolagem avança: a seção
      // parece ser montada em tempo real em vez de deslizar inteira.
      montaveis.forEach((el, i) => {
        const r = caixasM[i];
        const p = clamp((vh * .92 - r.top - i * 58) / (vh * .4));
        el.style.setProperty('--sobe', ((1 - p) * 52).toFixed(1) + 'px');
        el.style.setProperty('--op', (.08 + p * .92).toFixed(3));
      });
      return false;
    });
    descartes.push(solto);
  }
}

/* ---------- 5. Revelação ao rolar --------------------------------------- */
{
  const alvos = [...document.querySelectorAll('[data-revelar]')];
  if (alvos.length && !parado()) {
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('revelando');
        obs.unobserve(e.target);
      }
    }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
    alvos.forEach(el => obs.observe(el));
    descartes.push(() => obs.disconnect());
  }
}

/* ---------- 6. Contadores ---------------------------------------------- */
{
  const numeros = [...document.querySelectorAll('[data-contar]')];
  if (numeros.length) {
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target, alvo = parseInt(el.dataset.contar, 10);
        obs.unobserve(el);
        if (parado() || !Number.isFinite(alvo)) { el.textContent = alvo; continue; }
        const t0 = performance.now(), dur = 1100;
        const passo = (agora) => {
          const t = Math.min(1, (agora - t0) / dur);
          el.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }
    }, { threshold: .55 });
    numeros.forEach(el => obs.observe(el));
    descartes.push(() => obs.disconnect());
  }
}

/* ---------- 7. Emblema: inclinação em profundidade --------------------- */
{
  const palco = document.querySelector('[data-emblema] .emblema3d__palco');
  if (palco && !parado()) {
    const solto = runtime.subscribe(({ pointer, coarsePointer }) => {
      if (coarsePointer || !pointer.active) {
        palco.style.setProperty('--rx', '0deg');
        palco.style.setProperty('--ry', '0deg');
        return;
      }
      palco.style.setProperty('--rx', (pointer.normalizedY * -9).toFixed(2) + 'deg');
      palco.style.setProperty('--ry', (pointer.normalizedX * 12).toFixed(2) + 'deg');
    });
    descartes.push(solto);
  }
}

/* ---------- 8. A foto: zoom simples no ponto do ponteiro ---------------
   O crescimento é do CSS (:hover), então funciona mesmo sem este script; aqui
   só andamos com a origem do zoom para onde o mouse está. */
{
  if (!parado()) for (const fig of document.querySelectorAll('[data-zoom]')) {
    const aoMover = (e) => {
      const r = fig.getBoundingClientRect();
      if (!r.width || !r.height) return;
      fig.style.setProperty('--zx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      fig.style.setProperty('--zy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    };
    fig.addEventListener('pointermove', aoMover, { passive: true });
    descartes.push(() => fig.removeEventListener('pointermove', aoMover));
  }
}

/* ---------- 9. A rede: travessia em perspectiva real -------------------
   Os 32 assuntos e as ligações vêm do HTML, que é a fonte da verdade.
   Projeção em perspectiva sobre canvas 2D: sem WebGL, sem CDN, sem custo.
   Ao fim do voo a câmera para e o painel dos assuntos emerge do fundo, com
   o canvas ainda preso: a página não rola para revelar a grade. */
{
  const palco = document.querySelector('[data-constelacao]');
  const tela = palco?.querySelector('[data-ceu]');
  const painel = palco?.querySelector('[data-painel]');
  const bloco = palco?.querySelector('[data-texto-rede]');
  const itens = [...document.querySelectorAll('[data-topico]')];

  if (tela && itens.length) {
    const ctx = tela.getContext('2d', { alpha: false });
    const aleatorio = seededRandom(7);

    // Túnel simétrico: ângulo em passos de 3/8 de volta (simetria de oito
    // pontas) e dois raios alternados. Nada aleatório, nada torto.
    const nos = itens.map((el, i) => {
      const ang = i * (Math.PI * 2 * 3 / 8);
      const raio = i % 2 ? 234 : 152;
      return {
        nome: el.textContent.trim(),
        destaque: el.hasAttribute('data-destaque'),
        liga: (el.dataset.liga || '').split('|').filter(Boolean),
        peso: parseFloat(el.dataset.peso) || 1,
        x: Math.cos(ang) * raio,
        y: Math.sin(ang) * raio * .66,
        z: 260 + i * 128,
        tela: { x: 0, y: 0, escala: 0, visivel: false },
      };
    });
    itens.forEach((el, i) => el.style.setProperty('--n', i % 9));
    const porNome = new Map(nos.map(n => [n.nome, n]));
    const arestas = [];
    for (const n of nos) for (const outro of n.liga) {
      const b = porNome.get(outro);
      if (b) arestas.push([n, b]);
    }
    const zMax = Math.max(...nos.map(n => n.z));

    // Poeira de fundo: dá continuidade ao zoom, que sem ela parece pular.
    const poeira = Array.from({ length: 170 }, () => ({
      x: (aleatorio() * 2 - 1) * 1000,
      y: (aleatorio() * 2 - 1) * 660,
      z: 120 + aleatorio() * (zMax + 700),
      b: .18 + aleatorio() * .42,
    }));

    const VOO = .7;                                   // o voo termina aqui; depois, a grade
    let larg = 0, alt = 0, camZ = 0, rotulos = 1;

    function medir() {
      const r = tela.getBoundingClientRect();
      if (!r.width || !r.height) { larg = alt = 0; return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      larg = Math.max(1, Math.round(r.width));
      alt = Math.max(1, Math.round(r.height));
      tela.width = Math.round(larg * dpr);
      tela.height = Math.round(alt * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function progresso() {
      const r = palco.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      return clamp(-r.top / total);
    }

    function pintar() {
      if (!larg || !alt) return;
      const foco = Math.min(larg, alt) * .9;
      const cx = larg / 2, cy = alt / 2;

      ctx.fillStyle = '#0a0f14';
      ctx.fillRect(0, 0, larg, alt);

      for (const p of poeira) {
        const dz = p.z - camZ;
        if (dz < 50) continue;
        const k = foco / dz;
        const a = p.b * clamp((dz - 50) / 300) * clamp((3200 - dz) / 1400);
        if (a < .02) continue;
        ctx.fillStyle = `rgba(150,170,195,${(a * .55).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cx + p.x * k, cy + p.y * k, Math.max(.4, 1.5 * k), 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of nos) {
        const dz = n.z - camZ;
        n.tela.visivel = dz > 40;
        if (!n.tela.visivel) continue;
        const k = foco / dz;
        n.tela.x = cx + n.x * k;
        n.tela.y = cy + n.y * k;
        n.tela.escala = clamp(k * 1.5, 0, 1.6) * clamp((dz - 40) / 260) * clamp((2600 - dz) / 900);
      }

      ctx.lineWidth = 1;
      for (const [a, b] of arestas) {
        if (!a.tela.visivel || !b.tela.visivel) continue;
        const forca = Math.min(a.tela.escala, b.tela.escala);
        if (forca < .04) continue;
        ctx.strokeStyle = `rgba(138,153,173,${(forca * .42).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.tela.x, a.tela.y);
        ctx.lineTo(b.tela.x, b.tela.y);
        ctx.stroke();
      }

      for (const n of nos) {
        if (!n.tela.visivel || n.tela.escala < .03) continue;
        const r = Math.max(1, (n.destaque ? 4.6 : 3.2) * n.peso * n.tela.escala);
        const a = clamp(n.tela.escala);
        const brilho = ctx.createRadialGradient(n.tela.x, n.tela.y, 0, n.tela.x, n.tela.y, r * 4.6);
        brilho.addColorStop(0, `rgba(212,166,58,${(a * (n.destaque ? .42 : .26)).toFixed(3)})`);
        brilho.addColorStop(1, 'rgba(212,166,58,0)');
        ctx.fillStyle = brilho;
        ctx.beginPath(); ctx.arc(n.tela.x, n.tela.y, r * 4.6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = n.destaque
          ? `rgba(247,215,116,${a.toFixed(3)})`
          : `rgba(200,170,110,${(a * .82).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(n.tela.x, n.tela.y, r, 0, Math.PI * 2); ctx.fill();

        if (n.destaque && n.tela.escala > .3) {
          ctx.strokeStyle = `rgba(240,200,90,${(a * .5).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.tela.x, n.tela.y, r * 2.3, 0, Math.PI * 2); ctx.stroke();
        }

        // Nome só quando há espaço para ler de verdade — e nunca por cima da grade.
        if (n.tela.escala > .55 && rotulos > .04) {
          const op = (n.tela.escala - .55) / .45 * .92 * rotulos;
          ctx.font = `${n.destaque ? 600 : 500} 13px "Instrument Sans", system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(245,247,250,${op.toFixed(3)})`;
          ctx.fillText(n.nome, n.tela.x, n.tela.y + r + 16);
        }
      }
    }

    /* Três tempos: o voo até 0,70; a grade emergindo do fundo até 0,84; e a
       partir de 0,90 ela sobe e apaga, entregando a cena ao vídeo. */
    function escrever(p) {
      const surgir = clamp((p - VOO) / .14);
      const sair = clamp((p - .9) / .1);
      rotulos = 1 - surgir;
      if (painel) {
        painel.style.setProperty('--surgir', surgir.toFixed(3));
        painel.style.setProperty('--sair', sair.toFixed(3));
        painel.classList.toggle('painel-vivo', surgir > .55 && sair < .5);
      }
      if (bloco) bloco.style.setProperty('--texto', (1 - clamp((p - .05) / .15)).toFixed(3));
      tela.style.setProperty('--ceu', ((1 - surgir * .7) * (1 - sair * .92)).toFixed(3));
    }

    medir();
    if (parado()) {
      camZ = zMax * .35;
      pintar();
    } else {
      // Primeiro quadro imediato: se o loop nunca rodar (aba de fundo, painel
      // sem composição), a cena aparece parada em vez de ficar preta.
      camZ = zMax * .1;
      pintar();
      escrever(0);
      const solto = runtime.subscribe(({ delta, visible }) => {
        if (!visible || !larg) return false;
        const p = progresso();
        const alvoZ = clamp(p / VOO) * (zMax - 180);
        camZ = damp(camZ, alvoZ, 9, delta || 1 / 60);
        escrever(p);
        pintar();
        return Math.abs(alvoZ - camZ) > .8;
      });
      const aoRedimensionar = () => { medir(); pintar(); };
      window.addEventListener('resize', aoRedimensionar);
      descartes.push(solto, () => window.removeEventListener('resize', aoRedimensionar));
    }
  }
}

/* ---------- 9b. A amostra: prévia no mudo, clique recomeça do início ----
   Mesmo comportamento da página em produção. A banda só é gasta quando a
   seção chega à tela, e a prévia para quando ela sai. */
{
  const filme = document.querySelector('[data-filme]');
  const video = filme?.querySelector('video');
  const play = filme?.querySelector('[data-filme-play]');

  if (filme && video && play) {
    let carregou = false;

    // A duração vem do próprio arquivo: nunca desencontra do vídeo publicado.
    const rotulo = filme.querySelector('[data-filme-duracao]');
    video.addEventListener('loadedmetadata', () => {
      if (!rotulo || !Number.isFinite(video.duration)) return;
      const m = Math.floor(video.duration / 60);
      const s = Math.round(video.duration % 60);
      rotulo.textContent = `${m}min${String(s).padStart(2, '0')}s · com legendas`;
    });

    const previa = () => {
      if (play.classList.contains('oculto')) return;
      if (!carregou) { video.load(); carregou = true; }
      video.muted = true;                  // autoplay com som é bloqueado
      video.play().catch(() => {});
    };

    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) { if (!parado()) previa(); }
        else if (!video.paused && video.muted) video.pause();
      }
    }, { threshold: .35 });
    obs.observe(filme);

    const doInicio = () => {
      play.classList.add('oculto');
      video.controls = true;
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    play.addEventListener('click', doInicio);

    // Terminou: o convite volta, para quem chegar depois rever do início.
    const aoFim = () => {
      video.controls = false;
      video.muted = true;
      play.classList.remove('oculto');
    };
    video.addEventListener('ended', aoFim);

    // Sem animação nenhuma: o convite fica e os controles nativos aparecem.
    if (parado()) video.controls = true;

    descartes.push(() => {
      obs.disconnect();
      play.removeEventListener('click', doInicio);
      video.removeEventListener('ended', aoFim);
    });
  }
}

/* ---------- 9c. O catálogo: abas, busca, situação e "ver mais" ----------
   As 138 aulas já estão no HTML. Aqui só escondemos o que não bate com o
   filtro — quem chega sem JS vê a lista inteira, que é o pior caso aceitável
   (muito texto), nunca uma lista vazia. */
{
  const raiz = document.querySelector('[data-catalogo]');
  if (raiz) {
    const aulas = [...raiz.querySelectorAll('.aula')];
    const abas = [...raiz.querySelectorAll('[data-temporada]')].filter(e => e.tagName === 'BUTTON');
    const pilulas = [...raiz.querySelectorAll('[data-status]')].filter(e => e.tagName === 'BUTTON');
    const busca = raiz.querySelector('[data-busca]');
    const conta = raiz.querySelector('[data-conta]');
    const vazio = raiz.querySelector('[data-vazio]');
    const mais = raiz.querySelector('[data-mais]');

    const LOTE = 12;
    let temporada = 'all', situacao = 'all', termo = '', limite = LOTE;

    // Mesma normalização usada ao gerar o data-texto: sem acento, minúsculo.
    const planificar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    function aplicar() {
      let achadas = 0, mostradas = 0, gravadas = 0;
      for (const el of aulas) {
        const bate =
          (temporada === 'all' || el.dataset.temporada === temporada) &&
          (situacao === 'all' || el.dataset.status === situacao) &&
          (!termo || el.dataset.texto.includes(termo));
        if (bate) {
          achadas++;
          if (el.dataset.status === 'recorded') gravadas++;
        }
        const visivel = bate && achadas <= limite;
        el.classList.toggle('esta-oculta', !visivel);
        if (visivel) mostradas++;
      }

      const plural = achadas === 1 ? 'aula' : 'aulas';
      conta.textContent = achadas === 0
        ? 'Nenhuma aula com esses filtros.'
        : `Mostrando ${mostradas} de ${achadas} ${plural} · ${gravadas} gravadas, ${achadas - gravadas} planejadas`;
      vazio.hidden = achadas !== 0;
      mais.hidden = achadas <= limite;
      mais.textContent = `Ver mais ${Math.min(LOTE, achadas - limite)} aulas`;
    }

    for (const b of abas) {
      b.addEventListener('click', () => {
        temporada = b.dataset.temporada;
        limite = LOTE;
        abas.forEach(o => {
          const eu = o === b;
          o.classList.toggle('is-ativa', eu);
          o.setAttribute('aria-pressed', String(eu));
        });
        aplicar();
      });
    }

    for (const b of pilulas) {
      b.addEventListener('click', () => {
        situacao = b.dataset.status;
        limite = LOTE;
        pilulas.forEach(o => {
          const eu = o === b;
          o.classList.toggle('is-ativa', eu);
          o.setAttribute('aria-pressed', String(eu));
        });
        aplicar();
      });
    }

    let espera = 0;
    busca.addEventListener('input', () => {
      clearTimeout(espera);
      espera = setTimeout(() => { termo = planificar(busca.value); limite = LOTE; aplicar(); }, 140);
    });
    tempos.push(() => clearTimeout(espera));

    mais.addEventListener('click', () => {
      const antes = aulas.filter(el => !el.classList.contains('esta-oculta')).length;
      limite += LOTE;
      aplicar();
      // Leva o foco para a primeira aula recém-revelada, senão quem usa
      // teclado volta para o começo da lista a cada clique.
      const nova = aulas.filter(el => !el.classList.contains('esta-oculta'))[antes];
      if (nova) { nova.setAttribute('tabindex', '-1'); nova.focus({ preventScroll: true }); }
    });

    aplicar();
  }
}

/* ---------- 10. O vídeo das comissões só toca quando visível ------------ */
{
  const videos = [...document.querySelectorAll('.carta video')];
  if (videos.length) {
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        const v = e.target;
        if (e.isIntersecting && !parado()) { v.play().catch(() => {}); }
        else if (!v.paused) v.pause();
      }
    }, { threshold: .4 });
    videos.forEach(v => obs.observe(v));
    descartes.push(() => obs.disconnect());
  }
}

/* ---------- salvaguarda: conteúdo antes de espetáculo -------------------
   Animação CSS, IntersectionObserver e requestAnimationFrame só avançam em
   documento que está sendo renderizado. Em aba de fundo, painel embutido ou
   motor congelado, um estado de espera com opacity 0 esconderia texto de
   verdade. Timers continuam correndo: este é o resgate. */
tempos.push(setTimeout(() => {
  const invisivel = (el) => !el || parseFloat(getComputedStyle(el).opacity) < .5;

  // A digitação da abertura sempre começa (observador + prazo) e termina em
  // ~2s. Se as letras dela ainda estão invisíveis, nada está animando neste
  // ambiente: aí todo o conteúdo em espera volta a aparecer de uma vez.
  const congelado = invisivel(document.querySelector('[data-digitar] .let'));

  if (congelado) {
    for (const el of document.querySelectorAll('[data-digitar], [data-vindo]')) {
      el.classList.remove('esperando', 'digitando');
      el.classList.add('pronto');
    }
    for (const el of document.querySelectorAll('[data-revelar]')) el.classList.add('pronto');
    try { soltarTextos(); } catch {}
    return;
  }

  // Motor normal: conserta só o que já foi ativado e mesmo assim não apareceu.
  if (invisivel(document.querySelector('[data-cinematic-text] span'))) {
    try { soltarTextos(); } catch {}
  }
  for (const el of document.querySelectorAll('.vindo-ativo, [data-revelar].revelando')) {
    if (invisivel(el.querySelector('.let') || el)) el.classList.add('pronto');
  }
}, 2600));

/* ---------- desmontagem ------------------------------------------------ */
window.addEventListener('pagehide', () => {
  tempos.forEach(clearTimeout);
  descartes.reverse().forEach(fn => { try { fn(); } catch {} });
  runtime.dispose();
}, { once: true });
