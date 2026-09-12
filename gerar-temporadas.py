#!/usr/bin/env python3
"""Gera a seção do catálogo dentro do index.html a partir do temporadas.json.

O catálogo é HTML de verdade, não injeção por JavaScript: sem script as 138
aulas continuam lá, legíveis e indexáveis. O JS só põe as abas, a busca e o
filtro por cima.

O temporadas.json é a fonte da verdade. Mudou a lista? Edite o JSON e rode
este script de novo.

    python3 gerar-temporadas.py
"""
import html
import json
import pathlib
import re
import unicodedata

RAIZ = pathlib.Path(__file__).parent
INICIO = '<!-- TEMPORADAS:INICIO (gerado por gerar-temporadas.py) -->'
FIM = '<!-- TEMPORADAS:FIM -->'

NOMES = {
    '0': ('Temp. 0', 'Geral'),
    '1': ('Temp. 1', 'Produtividade'),
    '2': ('Temp. 2', 'Aprendizagem'),
    '3': ('Temp. 3', 'Comunicação'),
    'L': ('Lineares', 'Aulas soltas'),
    'D': ('Desafio', 'Estudo de caso'),
}
ORDEM = ['0', '1', 'L', 'D', '2', '3']


def sem_acento(texto):
    plano = unicodedata.normalize('NFD', texto)
    return ''.join(c for c in plano if unicodedata.category(c) != 'Mn').lower()


def data_legivel(bruta, status):
    if status != 'recorded':
        return 'Planejada'
    m = re.match(r'^(\d{4})\.(\d{2})\.(\d{2})$', bruta)          # 2026.01.16
    if m:
        return f'{m.group(3)}.{m.group(2)}.{m.group(1)}'
    return bruta                                                  # 09/08/2026


def main():
    aulas = json.loads((RAIZ / 'temporadas.json').read_text())
    gravadas = sum(1 for a in aulas if a['status'] == 'recorded')
    planejadas = len(aulas) - gravadas

    linhas = []
    for a in aulas:
        titulo = html.escape(a['title'])
        tema = html.escape(a['category'])
        gravada = a['status'] == 'recorded'
        busca = html.escape(sem_acento(f"{a['title']} {a['category']}"))
        linhas.append(
            f'        <li class="aula" data-temporada="{a["season"]}" data-status="{a["status"]}"\n'
            f'            data-texto="{busca}">\n'
            f'          <span class="aula__data">{html.escape(data_legivel(a["date"], a["status"]))}</span>\n'
            f'          <h3 class="aula__titulo">{titulo}</h3>\n'
            f'          <span class="aula__tema">{tema}</span>\n'
            f'          <span class="aula__selo aula__selo--{"gravada" if gravada else "planejada"}">'
            f'{"Gravada" if gravada else "Planejada"}</span>\n'
            f'        </li>'
        )

    abas = [
        '          <button type="button" class="aba is-ativa" data-temporada="all" aria-pressed="true">'
        f'Todas <i>{len(aulas)}</i></button>'
    ]
    for s in ORDEM:
        n = sum(1 for a in aulas if a['season'] == s)
        curto, longo = NOMES[s]
        abas.append(
            f'          <button type="button" class="aba" data-temporada="{s}" aria-pressed="false" '
            f'title="{longo}">{curto} <i>{n}</i></button>'
        )

    secao = f"""{INICIO}
  <section id="temporadas" class="cena faixa">
    <p class="olho" data-revelar>Centro de treino em tempo real</p>
    <h2 class="titulo-grande" data-revelar>As <em>Temporadas</em></h2>
    <blockquote class="citacao" data-revelar>Cada temporada é uma sala de treino diferente, gravada
      em tempo real, com data e hora. Você não assina um tema, assina o centro inteiro.</blockquote>

    <div class="catalogo" data-catalogo>
      <div class="catalogo__abas" aria-label="Filtrar por temporada" role="group">
{chr(10).join(abas)}
      </div>

      <div class="catalogo__linha">
        <div class="catalogo__busca">
          <label class="so-leitor" for="busca-aula">Buscar aula por título ou tema</label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input id="busca-aula" type="search" data-busca autocomplete="off"
                 placeholder="Buscar por título ou tema…">
        </div>
        <div class="catalogo__status" aria-label="Filtrar por situação" role="group">
          <button type="button" class="pilula is-ativa" data-status="all" aria-pressed="true">Todas</button>
          <button type="button" class="pilula" data-status="recorded" aria-pressed="false">Gravadas <i>{gravadas}</i></button>
          <button type="button" class="pilula" data-status="planned" aria-pressed="false">Planejadas <i>{planejadas}</i></button>
        </div>
      </div>

      <p class="catalogo__conta" data-conta aria-live="polite">
        {len(aulas)} aulas no catálogo · {gravadas} gravadas, disponíveis agora · {planejadas} planejadas
      </p>

      <ul class="catalogo__lista" data-lista>
{chr(10).join(linhas)}
      </ul>

      <p class="catalogo__vazio" data-vazio hidden>Nenhuma aula encontrada com esses filtros.</p>
      <div class="catalogo__mais">
        <button type="button" class="btn btn--linha" data-mais hidden>Ver mais aulas</button>
      </div>
    </div>

    <div class="catalogo__cta">
      <a class="btn btn--ouro btn--grande" href="https://pay.kiwify.com.br/OizrzJd">Entrar na Academia</a>
      <p class="catalogo__nota">R$ 30 por mês · acesso às {gravadas} aulas já gravadas e às novas
        publicadas enquanto a assinatura estiver ativa. As {planejadas} planejadas ainda não estão
        disponíveis.</p>
    </div>
  </section>
  {FIM}"""

    pagina = RAIZ / 'index.html'
    t = pagina.read_text()
    if INICIO in t:
        t = re.sub(re.escape(INICIO) + r'.*?' + re.escape(FIM), secao, t, flags=re.S)
    else:
        marca = '  <!-- ════ 6. QUEM CONDUZ ════ -->'
        if marca not in t:
            raise SystemExit('não achei onde inserir a seção')
        t = t.replace(marca, secao + '\n\n' + marca)
    pagina.write_text(t)

    print(f'catálogo gerado: {len(aulas)} aulas ({gravadas} gravadas, {planejadas} planejadas)')


if __name__ == '__main__':
    main()
