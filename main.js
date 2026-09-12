/* ==========================================================================
   ACADEMIA POLÍMATAS — MAIN JAVASCRIPT APP LOGIC
   Lesson datasets, season filters, pagination, logo zoom portal & metrics
   ========================================================================== */

// --- COMPLETE LESSONS DATASET ---
const LESSONS_DATA = [
  // TEMPORADA 0 (GERAL — 25 Aulas Gravadas)
  { id: 1, season: 0, date: '2026.01.16', title: 'O novo jeito de consumir cursos online', status: 'recorded', category: 'Generalismo & Método' },
  { id: 2, season: 0, date: '2026.01.17', title: 'Ansiedade e identidade', status: 'recorded', category: 'Psicologia & Mente' },
  { id: 3, season: 0, date: '2026.01.19', title: 'Taxonomia de conhecimento', status: 'recorded', category: 'Aprendizagem' },
  { id: 4, season: 0, date: '2026.01.20', title: 'Homem', status: 'recorded', category: 'Masculinidade & Identidade' },
  { id: 5, season: 0, date: '2026.01.22', title: 'Um meio para controlar pensamentos', status: 'recorded', category: 'Controle da Mente' },
  { id: 6, season: 0, date: '2026.01.23', title: 'Desistência e disciplina', status: 'recorded', category: 'Disciplina & Resiliência' },
  { id: 7, season: 0, date: '2026.01.30', title: 'A chave do sucesso', status: 'recorded', category: 'Filosofia Prática' },
  { id: 8, season: 0, date: '2026.01.31', title: 'Esporte coletivo', status: 'recorded', category: 'Rotina & Corpo' },
  { id: 9, season: 0, date: '2026.02.03', title: 'Para os que sempre desistem', status: 'recorded', category: 'Persistência' },
  { id: 10, season: 0, date: '2026.02.11', title: 'Sobre as metas de ano-novo e o mês de março', status: 'recorded', category: 'Metas & Planejamento' },
  { id: 11, season: 0, date: '2026.02.20', title: 'Quer ser bom? Aprenda a ser ruim', status: 'recorded', category: 'Medo de Errar' },
  { id: 12, season: 0, date: '2026.02.25', title: 'e-mail: múltiplos interesses e estudos', status: 'recorded', category: 'Generalismo' },
  { id: 13, season: 0, date: '2026.03.04', title: 'Como falar.', status: 'recorded', category: 'Comunicação' },
  { id: 14, season: 0, date: '2026.03.06', title: 'Como ser bem-sucedido?', status: 'recorded', category: 'Sucesso & Carreira' },
  { id: 15, season: 0, date: '2026.03.10', title: 'Seja útil e cale a boca', status: 'recorded', category: 'Postura & Ação' },
  { id: 16, season: 0, date: '2026.03.13', title: 'Como se sentir motivado', status: 'recorded', category: 'Motivação' },
  { id: 17, season: 0, date: '2026.03.20', title: 'Vença o medo de errar', status: 'recorded', category: 'Autoestima' },
  { id: 18, season: 0, date: '2026.03.22', title: 'Veja quando estiver paralisado com a rotina', status: 'recorded', category: 'Rotina & Foco' },
  { id: 19, season: 0, date: '2026.03.24', title: 'Aprenda a resolver problemas', status: 'recorded', category: 'Resolução de Problemas' },
  { id: 20, season: 0, date: '2026.04.03', title: 'A arte de memorizar tudo', status: 'recorded', category: 'Memória' },
  { id: 21, season: 0, date: '2026.04.20', title: 'Dias difíceis/momentos difíceis', status: 'recorded', category: 'Inteligência Emocional' },
  { id: 22, season: 0, date: '2026.04.29', title: 'Apenas continue.', status: 'recorded', category: 'Disciplina' },
  { id: 23, season: 0, date: '2026.05.10', title: 'Aprenda o mínimo de IA (eu tô implorando)', status: 'recorded', category: 'Inteligência Artificial' },
  { id: 24, season: 0, date: '2026.06.09', title: 'Decida onde você vai falhar', status: 'recorded', category: 'Tomada de Decisão' },
  { id: 25, season: 0, date: '2026.06.20', title: 'A importância da leveza', status: 'recorded', category: 'Equilíbrio' },

  // TEMPORADA 1 (PRODUTIVIDADE — 11 Gravadas + 18 Planejadas)
  { id: 101, season: 1, date: '2026.08.18', title: 'Tudo que você precisa saber', status: 'recorded', category: 'Produtividade Base' },
  { id: 102, season: 1, date: '2026.08.20', title: 'NÃO DECLARE DERROTA', status: 'recorded', category: 'Mindset & Foco' },
  { id: 103, season: 1, date: '2026.08.20', title: 'O que os disciplinados temem e falta em você', status: 'recorded', category: 'Disciplina' },
  { id: 104, season: 1, date: '2026.08.25', title: 'Um papo cabeça para quem pensar em mudar o percurso.', status: 'recorded', category: 'Tomada de Decisão' },
  { id: 105, season: 1, date: '2026.09.02', title: 'Moedor de sonhos e crise existencial', status: 'recorded', category: 'Crise Existencial' },
  { id: 106, season: 1, date: '2026.09.02', title: 'Aos ex-prodígios', status: 'recorded', category: 'Autoestima' },
  { id: 107, season: 1, date: '2026.09.02', title: 'Como fazer o desafio? [A PLANILHA]', status: 'recorded', category: 'Execução & Ferramentas' },
  { id: 108, season: 1, date: '2026.09.03', title: 'Por que fazer o desafio?', status: 'recorded', category: 'Propósito' },
  { id: 109, season: 1, date: '2026.09.03', title: 'Autoestima [Conquistas x Autopercepção de valor]', status: 'recorded', category: 'Psicologia' },
  { id: 110, season: 1, date: '2026.09.03', title: 'MOTIVAÇÃO: O neurotransmissor do sucesso ou do fracasso.', status: 'recorded', category: 'Neurociência & Motivação' },
  { id: 111, season: 1, date: '2026.09.03', title: 'Vôos de galinha', status: 'recorded', category: 'Consistência' },

  { id: 112, season: 1, date: '2026.09.07', title: 'Gestão de energia, não gestão de tempo', status: 'recorded', category: 'Energia & Foco' },
  { id: 113, season: 1, date: '2026.09.07', title: 'O mito da força de vontade', status: 'recorded', category: 'Psicologia & Hábito' },
  { id: 114, season: 1, date: 'Planejada', title: 'Por que você procrastina o que mais importa', status: 'planned', category: 'Procrastinação' },
  { id: 115, season: 1, date: 'Planejada', title: 'A raiz emocional da procrastinação', status: 'planned', category: 'Emoção & Ação' },
  { id: 116, season: 1, date: 'Planejada', title: 'Sono, o produtor de resultado invisível', status: 'planned', category: 'Recuperação & Sono' },
  { id: 117, season: 1, date: 'Planejada', title: 'Foco é um músculo, não um dom', status: 'planned', category: 'Atenção' },
  { id: 118, season: 1, date: 'Planejada', title: 'A tirania do multitarefa', status: 'planned', category: 'Brain fog' },
  { id: 119, season: 1, date: 'Planejada', title: 'Como priorizar quando tudo parece urgente', status: 'planned', category: 'Prioridades' },
  { id: 120, season: 1, date: 'Planejada', title: 'Metas vagas geram esforço vago', status: 'planned', category: 'Metas' },
  { id: 121, season: 1, date: 'Planejada', title: 'O poder da fricção: facilite o certo, dificulte o errado', status: 'planned', category: 'Arquitetura de Escolha' },
  { id: 122, season: 1, date: 'Planejada', title: 'Autorregulação: o adulto que observa você mesmo', status: 'planned', category: 'Autorregulação' },
  { id: 123, season: 1, date: 'Planejada', title: 'Energia mental tem picos e vales, descubra os seus', status: 'planned', category: 'Ritmo Biológico' },
  { id: 124, season: 1, date: 'Planejada', title: 'Descanso não é o oposto de produtividade', status: 'planned', category: 'Recuperação' },
  { id: 125, season: 1, date: 'Planejada', title: 'Como recomeçar depois de uma semana perdida', status: 'planned', category: 'Resiliência' },
  { id: 126, season: 1, date: 'Planejada', title: 'O perfeccionismo que trava mais do que ajuda', status: 'planned', category: 'Perfeccionismo' },
  { id: 127, season: 1, date: 'Planejada', title: 'Feedback: o combustível que ninguém pede', status: 'planned', category: 'Feedback' },
  { id: 128, season: 1, date: 'Planejada', title: 'A diferença entre estar ocupado e estar avançando', status: 'planned', category: 'Progresso Real' },
  { id: 129, season: 1, date: 'Planejada', title: 'Ambientes que produzem por você', status: 'planned', category: 'Ambiente' },

  // TEMPORADA 2 (APRENDIZAGEM — 27 Aulas Mapeadas)
  { id: 201, season: 2, date: 'Planejada', title: 'Aprender rápido é aprender errado', status: 'planned', category: 'Aprendizagem' },
  { id: 202, season: 2, date: 'Planejada', title: 'Repetição espaçada: o segredo que a escola não te contou', status: 'planned', category: 'Memória' },
  { id: 203, season: 2, date: 'Planejada', title: 'Prática deliberada, o que separa amador de especialista', status: 'planned', category: 'Talento & Prática' },
  { id: 204, season: 2, date: 'Planejada', title: 'A curiosidade que a escola matou em você', status: 'planned', category: 'Curiosidade' },
  { id: 205, season: 2, date: 'Planejada', title: 'Metacognição: pensar sobre o seu próprio pensar', status: 'planned', category: 'Metacognição' },
  { id: 206, season: 2, date: 'Planejada', title: 'Por que você esquece quase tudo que estuda', status: 'planned', category: 'Retenção' },
  { id: 207, season: 2, date: 'Planejada', title: 'O erro é a matéria-prima do aprendizado', status: 'planned', category: 'Medo de Errar' },
  { id: 208, season: 2, date: 'Planejada', title: 'Ensinar é a forma mais rápida de aprender', status: 'planned', category: 'Técnica Feynman' },
  { id: 209, season: 2, date: 'Planejada', title: 'Como ler um livro difícil sem desistir', status: 'planned', category: 'Leitura Profunda' },
  { id: 210, season: 2, date: 'Planejada', title: 'A ilusão de competência: por que reler não é estudar', status: 'planned', category: 'Estudos' },
  { id: 211, season: 2, date: 'Planejada', title: 'Interleaving: misturar assuntos para aprender melhor', status: 'planned', category: 'Generalismo' },
  { id: 212, season: 2, date: 'Planejada', title: 'Sono e consolidação de memória', status: 'planned', category: 'Neurociência' },
  { id: 213, season: 2, date: 'Planejada', title: 'Como fazer perguntas melhores que as respostas', status: 'planned', category: 'Pensamento Crítico' },
  { id: 214, season: 2, date: 'Planejada', title: 'Transferência de conhecimento entre áreas diferentes', status: 'planned', category: 'Polimatia' },
  { id: 215, season: 2, date: 'Planejada', title: 'O generalista aprende diferente do especialista', status: 'planned', category: 'Generalismo' },
  { id: 216, season: 2, date: 'Planejada', title: 'Motivação para aprender vem depois de entender o porquê', status: 'planned', category: 'Motivação' },
  { id: 217, season: 2, date: 'Planejada', title: 'Mapas mentais funcionam, mas não do jeito que você pensa', status: 'planned', category: 'Organização' },
  { id: 218, season: 2, date: 'Planejada', title: 'A zona de desenvolvimento proximal: o ponto certo de desafio', status: 'planned', category: 'Desafio' },
  { id: 219, season: 2, date: 'Planejada', title: 'Como estudar quando o assunto é chato', status: 'planned', category: 'Disciplina' },
  { id: 220, season: 2, date: 'Planejada', title: 'Aprendizagem ativa x aprendizagem passiva', status: 'planned', category: 'Métodos' },
  { id: 221, season: 2, date: 'Planejada', title: 'O papel da dificuldade produtiva no aprendizado real', status: 'planned', category: 'Resiliência' },
  { id: 222, season: 2, date: 'Planejada', title: 'Como organizar o conhecimento em rede, não em lista', status: 'planned', category: 'Taxonomia' },
  { id: 223, season: 2, date: 'Planejada', title: 'A curva do esquecimento e como driblar ela', status: 'planned', category: 'Memória' },
  { id: 224, season: 2, date: 'Planejada', title: 'Aprender em público, o compromisso que acelera o processo', status: 'planned', category: 'Prestação de Contas' },
  { id: 225, season: 2, date: 'Planejada', title: 'Quando parar de estudar teoria e começar a praticar', status: 'planned', category: 'Prática' },
  { id: 226, season: 2, date: 'Planejada', title: 'Vieses cognitivos que sabotam seu julgamento', status: 'planned', category: 'Psicologia' },
  { id: 227, season: 2, date: 'Planejada', title: 'O papel do cochilo e do sono na criatividade e no insight', status: 'planned', category: 'Insight' },

  // TEMPORADA 3 (COMUNICAÇÃO — 27 Aulas Mapeadas)
  { id: 301, season: 3, date: 'Planejada', title: 'Falar bem não é o mesmo que comunicar bem', status: 'planned', category: 'Comunicação Base' },
  { id: 302, season: 3, date: 'Planejada', title: 'A primeira impressão se forma antes de você abrir a boca', status: 'planned', category: 'Linguagem Corporal' },
  { id: 303, season: 3, date: 'Planejada', title: 'Escuta ativa, o ingrediente que falta em toda conversa', status: 'planned', category: 'Escuta' },
  { id: 304, season: 3, date: 'Planejada', title: 'Por que ninguém lembra o que você disse, só como fez sentir', status: 'planned', category: 'Psicologia' },
  { id: 305, season: 3, date: 'Planejada', title: 'Persuasão não é manipulação, é clareza com intenção', status: 'planned', category: 'Persuasão' },
  { id: 306, season: 3, date: 'Planejada', title: 'O silêncio como ferramenta de comunicação', status: 'planned', category: 'Oratória' },
  { id: 307, season: 3, date: 'Planejada', title: 'Como discordar sem destruir a relação', status: 'planned', category: 'Relações' },
  { id: 308, season: 3, date: 'Planejada', title: 'Storytelling, por que histórias convencem mais que dados', status: 'planned', category: 'Storytelling' },
  { id: 309, season: 3, date: 'Planejada', title: 'Comunicação não violenta na prática', status: 'planned', category: 'CNV' },
  { id: 310, season: 3, date: 'Planejada', title: 'Linguagem corporal, o que o seu corpo diz antes de você', status: 'planned', category: 'Expressão' },
  { id: 311, season: 3, date: 'Planejada', title: 'Como simplificar uma ideia complexa sem perder profundidade', status: 'planned', category: 'Clareza' },
  { id: 312, season: 3, date: 'Planejada', title: 'O erro de comunicar para impressionar, não para conectar', status: 'planned', category: 'Conexão' },
  { id: 313, season: 3, date: 'Planejada', title: 'Perguntas que abrem conversas, perguntas que fecham', status: 'planned', category: 'Perguntas' },
  { id: 314, season: 3, date: 'Planejada', title: 'Como dar feedback que a pessoa realmente escuta', status: 'planned', category: 'Feedback' },
  { id: 315, season: 3, date: 'Planejada', title: 'A arte de pedir o que você quer sem rodeios', status: 'planned', category: 'Assertividade' },
  { id: 316, season: 3, date: 'Planejada', title: 'Comunicação assertiva, nem passivo, nem agressivo', status: 'planned', category: 'Postura' },
  { id: 317, season: 3, date: 'Planejada', title: 'Como ler o clima emocional de uma conversa', status: 'planned', category: 'Empatia' },
  { id: 318, season: 3, date: 'Planejada', title: 'Falar em público, o medo que todo mundo finge não ter', status: 'planned', category: 'Falar em Público' },
  { id: 319, season: 3, date: 'Planejada', title: 'O poder do nome próprio numa conversa', status: 'planned', category: 'Relações' },
  { id: 320, season: 3, date: 'Planejada', title: 'Como encerrar uma conversa difícil sem deixar mágoa', status: 'planned', category: 'Conflitos' },
  { id: 321, season: 3, date: 'Planejada', title: 'A diferença entre informar e convencer', status: 'planned', category: 'Persuasão' },
  { id: 322, season: 3, date: 'Planejada', title: 'Comunicação escrita, por que clareza é gentileza', status: 'planned', category: 'Escrita' },
  { id: 323, season: 3, date: 'Planejada', title: 'Como negociar sem tratar o outro como adversário', status: 'planned', category: 'Negociação' },
  { id: 324, season: 3, date: 'Planejada', title: 'O que sua voz comunica além das palavras', status: 'planned', category: 'Voz & Tom' },
  { id: 325, season: 3, date: 'Planejada', title: 'Empatia cognitiva x empatia emocional na prática', status: 'planned', category: 'Psicologia' },
  { id: 326, season: 3, date: 'Planejada', title: 'Como se comunicar bem em momentos de conflito', status: 'planned', category: 'Gestão de Conflito' },
  { id: 327, season: 3, date: 'Planejada', title: 'A escuta que cura, comunicação como forma de acolhimento', status: 'planned', category: 'Acolhimento' },

  // AULAS LINEARES (PEDAGÓGICAS E ROTEIRIZADAS — 14 Aulas Gravadas)
  { id: 401, season: 'L', date: 'Aula 1', title: 'Produtividade não é organização', status: 'recorded', category: 'Produtividade' },
  { id: 402, season: 'L', date: 'Aula 2', title: 'A importância da sobriedade ao decidir', status: 'recorded', category: 'Decisão' },
  { id: 403, season: 'L', date: 'Aula 3', title: 'Todo mundo se sente frustrado. Todo mundo tem medo de fracassar. [reflexão]', status: 'recorded', category: 'Fracasso & Medo' },
  { id: 404, season: 'L', date: 'Aula 4', title: 'Consuma arte de verdade', status: 'recorded', category: 'Repertório' },
  { id: 405, season: 'L', date: 'Aula 5', title: 'SPRINT - Como ficar bom em várias coisas diferentes', status: 'recorded', category: 'Generalismo' },
  { id: 406, season: 'L', date: 'Aula 6', title: 'Brain fog', status: 'recorded', category: 'Cognição' },
  { id: 407, season: 'L', date: 'Aula 7', title: 'A psicologia sobre conhecer pessoas', status: 'recorded', category: 'Relações' },
  { id: 408, season: 'L', date: 'Aula 8', title: 'Sobre o fracasso e a melhoria constante', status: 'recorded', category: 'Fracasso & Melhoria' },
  { id: 409, season: 'L', date: 'Aula 9', title: 'A curiosidade é sua aliada, mas você precisa despertá-la', status: 'recorded', category: 'Curiosidade' },
  { id: 410, season: 'L', date: 'Aula 10', title: 'Vontade de potência intelectual', status: 'recorded', category: 'Filosofia Prática' },
  { id: 411, season: 'L', date: 'Aula 11', title: 'Torne-se um especialista generalista', status: 'recorded', category: 'Generalismo' },
  { id: 412, season: 'L', date: 'Aula 12', title: 'Pense mais uma vez', status: 'recorded', category: 'Pensamento Crítico' },
  { id: 413, season: 'L', date: 'Aula 13', title: 'Maldito talento', status: 'recorded', category: 'Talento & Esforço' },
  { id: 414, season: 'L', date: 'Aula 14', title: 'Minha visão sobre fazer dinheiro', status: 'recorded', category: 'Dinheiro & Carreira' },

  // ESTUDO DE CASO — DESAFIO DAS 16 SEMANAS (em andamento, semana 5 de 16)
  { id: 501, season: 'D', date: '09/08/2026', title: 'Semana 1 — Desafio das 16 semanas', status: 'recorded', category: 'Estudo de Caso' },
  { id: 502, season: 'D', date: '16/08/2026', title: 'Semana 2 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 503, season: 'D', date: '23/08/2026', title: 'Semana 3 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 504, season: 'D', date: '30/08/2026', title: 'Semana 4 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 505, season: 'D', date: '06/09/2026', title: 'Semana 5 — Desafio das 16 semanas', status: 'recorded', category: 'Estudo de Caso' },
  { id: 506, season: 'D', date: '13/09/2026', title: 'Semana 6 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 507, season: 'D', date: '20/09/2026', title: 'Semana 7 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 508, season: 'D', date: '27/09/2026', title: 'Semana 8 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 509, season: 'D', date: '04/10/2026', title: 'Semana 9 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 510, season: 'D', date: '11/10/2026', title: 'Semana 10 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 511, season: 'D', date: '18/10/2026', title: 'Semana 11 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 512, season: 'D', date: '25/10/2026', title: 'Semana 12 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 513, season: 'D', date: '01/11/2026', title: 'Semana 13 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 514, season: 'D', date: '08/11/2026', title: 'Semana 14 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 515, season: 'D', date: '15/11/2026', title: 'Semana 15 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
  { id: 516, season: 'D', date: '22/11/2026', title: 'Semana 16 — Desafio das 16 semanas', status: 'planned', category: 'Estudo de Caso' },
];

// --- APP STATE ---
let currentSeasonFilter = 'all';
let currentStatusFilter = 'all';
let currentSearchQuery = '';
let activeTopicFilter = null;
let visibleLessonsLimit = 6; // Initial 6 cards (3 + 3) before 'Ver Mais' button

const SEASON_NAMES = {
  'all': 'Todas as Temporadas',
  '0': 'Temporada 0 (Geral — 25 Aulas Gravadas)',
  '1': 'Temporada 1 (Produtividade — 13 Gravadas + 16 Mapeadas)',
  '2': 'Temporada 2 (Aprendizagem — 27 Aulas Mapeadas)',
  '3': 'Temporada 3 (Comunicação — 27 Aulas Mapeadas)',
  'L': 'Aulas Lineares (14 Aulas Gravadas)',
  'D': 'Estudo de Caso — Desafio das 16 Semanas'
};

// --- DOM INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initHeroZoomScroll();
  initHeaderScroll();
  renderLessons();
  initFilterControls();
  initModals();
  initMetricsCounter();
  initReveal();
  initTypewriter();
  initDocCounters();
  initMouseZoom();
  initSampleVideo();
});

// 1. Opening portal reveals practical situations; welcome headline stays in normal flow.
function initHeroZoomScroll() {
  const pinWrapper = document.getElementById('hero-pin-wrapper');
  const opening = document.getElementById('hero-lock');
  const emblem = document.getElementById('emblem-portal-box');
  const text = document.getElementById('lock-text-group');
  const trigger = document.getElementById('scroll-trigger');
  const situations = document.getElementById('hero-situations');
  if (!pinWrapper || !opening || !emblem || !situations) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));

  function update() {
    const distance = Math.max(1, pinWrapper.offsetHeight - window.innerHeight);
    const progress = clamp(-pinWrapper.getBoundingClientRect().top / distance);

    // Dobra 1: Opening Portal fades out as user scrolls
    const openingOpacity = reducedMotion.matches ? 1 : 1 - clamp((progress - 0.2) / 0.25);
    opening.style.opacity = openingOpacity;
    opening.style.visibility = openingOpacity < 0.01 ? 'hidden' : 'visible';
    opening.inert = openingOpacity < 0.2;
    opening.setAttribute('aria-hidden', String(openingOpacity < 0.2));

    emblem.style.transform = reducedMotion.matches ? 'none' : `scale(${1 + Math.pow(clamp(progress / 0.45), 1.5) * 14})`;
    if (text) text.style.opacity = reducedMotion.matches ? 1 : 1 - clamp(progress / 0.25);
    if (trigger) trigger.style.opacity = reducedMotion.matches ? 1 : 1 - clamp(progress / 0.2);

    // Dobra 2: Practical Situations — enters after zoom, exits before pin ends
    const entra = clamp((progress - 0.28) / 0.2);
    const sai = clamp((progress - 0.80) / 0.14);
    const reveal = reducedMotion.matches ? 1 : entra * (1 - sai);
    situations.style.opacity = reveal;
    situations.style.transform = reducedMotion.matches ? 'none' : `translateY(${(1 - reveal) * 28}px)`;
    situations.style.visibility = reveal < 0.01 ? 'hidden' : 'visible';
    situations.inert = reveal < 0.5;
    situations.setAttribute('aria-hidden', String(reveal < 0.5));
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  reducedMotion.addEventListener('change', update);
  update();

  trigger?.addEventListener('click', () => {
    window.scrollTo({
      top: window.scrollY + pinWrapper.getBoundingClientRect().top + (pinWrapper.offsetHeight - window.innerHeight) * 0.65,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  });
}

// 2. Floating Navbar Visibility
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      header.classList.remove('hidden-header');
    } else {
      header.classList.add('hidden-header');
    }
  });
}

// 3. Render Lesson Cards with "Ver Mais" Pagination
function renderLessons() {
  const grid = document.getElementById('lessons-grid');
  const visibleCountEl = document.getElementById('visible-count');
  const totalCountEl = document.getElementById('total-count');
  const seasonBadgeEl = document.getElementById('season-name-badge');
  const activeBadgeEl = document.getElementById('active-filter-badge');
  const loadMoreContainer = document.getElementById('load-more-container');

  if (!grid) return;

  // Filter logic
  const filtered = LESSONS_DATA.filter(lesson => {
    if (currentSeasonFilter !== 'all' && lesson.season.toString() !== currentSeasonFilter) {
      return false;
    }
    if (currentStatusFilter !== 'all' && lesson.status !== currentStatusFilter) {
      return false;
    }
    if (activeTopicFilter) {
      const q = activeTopicFilter.toLowerCase();
      const titleMatch = lesson.title.toLowerCase().includes(q);
      const catMatch = lesson.category.toLowerCase().includes(q);
      if (!titleMatch && !catMatch) return false;
    }
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      const titleMatch = lesson.title.toLowerCase().includes(q);
      const catMatch = lesson.category.toLowerCase().includes(q);
      const dateMatch = lesson.date.toLowerCase().includes(q);
      if (!titleMatch && !catMatch && !dateMatch) return false;
    }
    return true;
  });

  const seasonTotal = (currentSeasonFilter === 'all') 
    ? LESSONS_DATA.length 
    : LESSONS_DATA.filter(l => l.season.toString() === currentSeasonFilter).length;

  // Slice for compact initial view (Ver mais)
  const visibleSlice = filtered.slice(0, visibleLessonsLimit);

  totalCountEl.textContent = seasonTotal;
  visibleCountEl.textContent = visibleSlice.length;

  if (seasonBadgeEl) {
    seasonBadgeEl.textContent = SEASON_NAMES[currentSeasonFilter] || 'Todas as Temporadas';
  }

  if (activeTopicFilter) {
    activeBadgeEl.classList.remove('hidden');
    activeBadgeEl.textContent = `Tópico: ${activeTopicFilter} (Limpar ×)`;
    activeBadgeEl.onclick = () => {
      activeTopicFilter = null;
      visibleLessonsLimit = 6;
      renderLessons();
    };
  } else {
    activeBadgeEl.classList.add('hidden');
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--gold-border);">
        <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 12px;">Nenhuma aula encontrada para os filtros selecionados.</p>
        <button onclick="resetAllFilters()" class="btn-cta-outline btn-sm">Limpar todos os filtros</button>
      </div>
    `;
    if (loadMoreContainer) loadMoreContainer.innerHTML = '';
    return;
  }

  grid.innerHTML = visibleSlice.map((lesson, i) => {
    const isRecorded = lesson.status === 'recorded';
    const seasonTitleMap = {
      0: 'TEMPORADA 0 (GERAL)',
      1: 'TEMPORADA 1 (PRODUTIVIDADE)',
      2: 'TEMPORADA 2 (APRENDIZAGEM)',
      3: 'TEMPORADA 3 (COMUNICAÇÃO)',
      L: 'AULAS LINEARES',
      D: 'ESTUDO DE CASO'
    };
    const seasonLabel = seasonTitleMap[lesson.season] || `TEMPORADA ${lesson.season}`;
    const badgeText = isRecorded ? 'GRAVADA' : 'PLANEJADA';

    return `
      <article class="lesson-card lesson-sprout" style="--delay:${i * 70}ms" onclick="openLessonPreview(${lesson.id})">
        <div>
          <div class="card-top">
            <span class="lesson-date">${lesson.date}</span>
            <span class="status-badge ${lesson.status}">${badgeText}</span>
          </div>
          <h3 class="lesson-title">${lesson.title}</h3>
        </div>
        <div class="card-footer">
          <span class="season-tag">${seasonLabel}</span>
          <svg class="card-action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </article>
    `;
  }).join('');

  sproutLessons(grid);

  // "Ver Mais Aulas" Button Logic
  if (loadMoreContainer) {
    const remaining = filtered.length - visibleSlice.length;
    if (remaining > 0) {
      loadMoreContainer.innerHTML = `
        <button id="load-more-btn" class="btn-cta-outline btn-lg" onclick="showMoreLessons()">
          Ver mais aulas (${remaining} restantes)
        </button>
      `;
    } else {
      loadMoreContainer.innerHTML = '';
    }
  }
}

window.showMoreLessons = function () {
  visibleLessonsLimit += 12;
  renderLessons();
};

// Obsidian Graph Topic Click Filter Hook
window.filterLessonsByTopic = function (topicName) {
  activeTopicFilter = topicName;
  currentSearchQuery = '';
  currentSeasonFilter = 'all';
  visibleLessonsLimit = 6;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-season="all"]')?.classList.add('active');

  const searchInput = document.getElementById('lesson-search-input');
  if (searchInput) searchInput.value = '';

  renderLessons();
};

function resetAllFilters() {
  currentSeasonFilter = 'all';
  currentStatusFilter = 'all';
  currentSearchQuery = '';
  activeTopicFilter = null;
  visibleLessonsLimit = 6;

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.tab-btn[data-season="all"]')?.classList.add('active');

  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-pill[data-status="all"]')?.classList.add('active');

  const searchInput = document.getElementById('lesson-search-input');
  if (searchInput) searchInput.value = '';

  renderLessons();
}

// 4. Tab & Search Listeners
function initFilterControls() {
  const seasonTabs = document.getElementById('season-tabs-container');
  if (seasonTabs) {
    seasonTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        seasonTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        activeTopicFilter = null;
        currentSeasonFilter = e.target.getAttribute('data-season');
        visibleLessonsLimit = 6; // reset pagination when switching tabs
        renderLessons();
      }
    });
  }

  const statusContainer = document.getElementById('status-filter-container');
  if (statusContainer) {
    statusContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-pill')) {
        statusContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentStatusFilter = e.target.getAttribute('data-status');
        visibleLessonsLimit = 6;
        renderLessons();
      }
    });
  }

  const searchInput = document.getElementById('lesson-search-input');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      visibleLessonsLimit = 6;
      if (clearBtn) {
        if (currentSearchQuery.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      renderLessons();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      visibleLessonsLimit = 6;
      clearBtn.classList.add('hidden');
      renderLessons();
    });
  }
}

// 5. Lesson preview modal
function initModals() {
  const lessonModal = document.getElementById('lesson-preview-modal');
  const closeLessonModalBtn = document.getElementById('close-lesson-modal-btn');
  const closePreview = () => lessonModal?.classList.add('hidden');
  closeLessonModalBtn?.addEventListener('click', closePreview);
  window.addEventListener('click', (event) => {
    if (event.target === lessonModal) closePreview();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePreview();
  });
}

function openLessonPreview(lessonId) {
  const lesson = LESSONS_DATA.find(l => l.id === lessonId);
  if (!lesson) return;

  const modal = document.getElementById('lesson-preview-modal');
  const content = document.getElementById('lesson-modal-content');
  if (!modal || !content) return;

  const seasonNames = {
    0: 'Temporada 0 (Geral)',
    1: 'Temporada 1 (Produtividade)',
    2: 'Temporada 2 (Aprendizagem)',
    3: 'Temporada 3 (Comunicação)'
  };
  const seasonText = seasonNames[lesson.season] || `Temporada ${lesson.season}`;
  const isRecorded = lesson.status === 'recorded';

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="eyebrow-tag" style="margin-bottom: 8px;">DETALHES DO ENCONTRO • ${seasonText}</span>
      <h3 style="font-family: var(--font-display); font-size: 1.8rem; line-height: 1.25; margin-bottom: 12px;">${lesson.title}</h3>
      <div style="display: flex; gap: 12px; align-items: center; font-size: 0.85rem;">
        <span class="lesson-date">${lesson.date}</span>
        <span class="status-badge ${lesson.status}">${isRecorded ? 'Gravada com Data e Hora' : 'Planejada / Em Breve'}</span>
      </div>
    </div>
    
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: var(--radius-md); margin-bottom: 24px; font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
      <p style="margin-bottom: 10px;"><strong style="color: var(--text-main);">Pilar / Tema:</strong> ${lesson.category}</p>
      <p style="margin-bottom: 10px;"><strong style="color: var(--text-main);">Formato:</strong> Encontro gravado em tempo real, documentando a aplicação prática na vida de Júlio César.</p>
      <p><strong style="color: var(--text-main);">Acesso:</strong> ${isRecorded ? 'Esta aula já está disponível para os membros da Academia Polímatas.' : 'Esta aula está planejada e ainda não está disponível. A assinatura dá acesso ao acervo já gravado.'}</p>
    </div>

    <a href="https://pay.kiwify.com.br/OizrzJd" class="btn-cta-gold btn-full">
      Entrar na Academia
    </a>
  `;

  modal.classList.remove('hidden');
}

// 6. Metrics Counter Animation
function initMetricsCounter() {
  const metricCards = document.querySelectorAll('.metric-number[data-target]');
  if (!metricCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const step = Math.max(1, Math.floor(target / 40));

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = count;
          }
        }, 40);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricCards.forEach(card => observer.observe(card));
}


// 7. Reveal on scroll: fades elements up once, then stops observing.
function initReveal() {
  // Avisa o <head> que a camada nova está no ar: sem isto o prazo de
  // segurança derruba a classe e as animações não acontecem.
  window.__animacaoAtiva = true;
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => observer.observe(el));

  // Rede de segurança. Num navegador que pinta quadros, algo no primeiro
  // écran revela em milissegundos. Se depois de 2,5s NADA revelou, o
  // observador não está rodando — acontece em painéis de pré-visualização
  // que não compõem quadros, em abas de fundo e sob bloqueios. Nesse caso a
  // animação é abandonada e todo o conteúdo volta a aparecer, porque página
  // em branco é pior que página sem animação.
  setTimeout(() => {
    if (document.querySelector('[data-reveal].is-revealed')) return;
    document.documentElement.classList.remove('anim-on');
    targets.forEach(el => el.classList.add('is-revealed'));
    document.querySelectorAll('.lesson-sprout').forEach(el => el.classList.add('is-sprouted'));
  }, 2500);
}

// 8. Typewriter that keeps inline markup (<span>, <strong>, <br>) intact.
function initTypewriter() {
  const blocks = document.querySelectorAll('[data-typewrite]');
  if (!blocks.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  blocks.forEach(block => {
    // Screen readers get the whole sentence; the split is decorative only.
    block.setAttribute('aria-label', block.textContent.trim().replace(/\s+/g, ' '));
    if (reduced) return;

    let index = 0;
    // Passo por caractere adaptado ao tamanho: a frase do hero (36 chars) e a
    // citação das Temporadas (158) precisam terminar em tempos parecidos,
    // senão a longa arrasta por mais de quatro segundos.
    const totalChars = block.textContent.trim().length || 1;
    const STEP = Math.max(9, Math.min(30, Math.round(1500 / totalChars)));

    const split = (node) => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          [...child.textContent].forEach(ch => {
            const span = document.createElement('span');
            span.className = 'tw-c';
            span.setAttribute('aria-hidden', 'true');
            span.style.setProperty('--d', (index++ * STEP) + 'ms');
            span.textContent = ch;
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          split(child);
        }
      });
    };
    split(block);

    const caret = document.createElement('span');
    caret.className = 'tw-cursor';
    caret.setAttribute('aria-hidden', 'true');
    block.appendChild(caret);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        block.classList.add('is-typing');
        // Caret stops blinking when the last character has landed.
        setTimeout(() => caret.classList.add('is-done'), index * STEP + 700);
        observer.unobserve(block);
      });
    }, { threshold: 0.35 });
    observer.observe(block);
  });
}

// 9. Counters for the "o que existe hoje" figures.
function initDocCounters() {
  const numbers = document.querySelectorAll('[data-count]');
  if (!numbers.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      observer.unobserve(el);

      if (reduced || !Number.isFinite(target)) {
        el.textContent = target;
        return;
      }

      const DURATION = 1100;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        // desacelera no fim, para o número assentar em vez de travar
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.55 });

  numbers.forEach(el => observer.observe(el));
}

// 10. Pointer-following zoom: the focal point tracks the mouse instead of
// scaling the whole photo. Two modes — one element, or a whole group at once.
function initMouseZoom() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  // Aponta o foco de um elemento para a posição do ponteiro, limitando a
  // 0-100%: quando o mouse está fora, a foto amplia no ponto mais próximo.
  const apontar = (alvo, event) => {
    const r = alvo.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = ((event.clientX - r.left) / r.width) * 100;
    const y = ((event.clientY - r.top) / r.height) * 100;
    alvo.style.setProperty('--zx', Math.max(0, Math.min(100, x)) + '%');
    alvo.style.setProperty('--zy', Math.max(0, Math.min(100, y)) + '%');
  };

  document.querySelectorAll('[data-mouse-zoom]').forEach(card => {
    const move = (e) => apontar(card, e);
    card.addEventListener('pointerenter', (e) => { move(e); card.classList.add('is-hovered'); });
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));
  });

  // Grupo: um único movimento do ponteiro reposiciona o foco de todas as
  // fotos ao mesmo tempo, cada uma no seu próprio referencial.
  document.querySelectorAll('[data-mouse-zoom-group]').forEach(grupo => {
    const fotos = [...grupo.children];
    if (!fotos.length) return;
    const move = (e) => fotos.forEach(f => apontar(f, e));
    grupo.addEventListener('pointerenter', (e) => { move(e); grupo.classList.add('is-hovered'); });
    grupo.addEventListener('pointermove', move);
    grupo.addEventListener('pointerleave', () => grupo.classList.remove('is-hovered'));
  });
}


// 11. Lesson cards sprout in. Waits for the grid to be on screen the first
// time, so the entrance is not spent off-view during page load.
let lessonsGridSeen = false;
function sproutLessons(grid) {
  const cards = [...grid.querySelectorAll('.lesson-sprout')];
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(card => card.classList.add('is-sprouted'));
    return;
  }

  const run = () => cards.forEach(card => {
    card.classList.add('is-sprouting');
    // Limpa a animação no fim: com fill "both" o transform congelado
    // venceria o translateY(-4px) do hover.
    card.addEventListener('animationend', () => {
      card.classList.remove('is-sprouting');
      card.classList.add('is-sprouted');
    }, { once: true });
  });

  if (lessonsGridSeen) { run(); return; }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      lessonsGridSeen = true;
      observer.disconnect();
      run();
    });
  }, { threshold: 0.08 });
  observer.observe(grid);
}


// 12. Sample video: silent preview starts on its own, and one click restarts
// it from the beginning with sound.
function initSampleVideo() {
  const film = document.querySelector('[data-sample-film]');
  if (!film) return;
  const video = film.querySelector('video');
  const start = film.querySelector('[data-sample-start]');
  if (!video || !start) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let carregou = false;

  // A legenda de duração vem do próprio arquivo: assim nunca desencontra do
  // vídeo publicado quando o corte muda.
  const rotulo = film.querySelector('[data-sample-duracao]');
  video.addEventListener('loadedmetadata', () => {
    if (!rotulo || !Number.isFinite(video.duration)) return;
    const m = Math.floor(video.duration / 60);
    const s2 = Math.round(video.duration % 60);
    rotulo.textContent = `${m}min${String(s2).padStart(2, '0')}s · com legendas`;
  });

  const previa = () => {
    if (!carregou) { video.load(); carregou = true; }
    video.muted = true;
    // Autoplay com som é bloqueado pelo navegador; no mudo é permitido.
    video.play().catch(() => {});
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!reduced && start.classList.contains('is-hidden') === false) previa();
      } else if (!video.paused && video.muted) {
        // Fora da tela a prévia para: não gasta banda nem bateria à toa.
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  observer.observe(film);

  start.addEventListener('click', () => {
    start.classList.add('is-hidden');
    video.controls = true;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  // Terminou: o convite volta, para quem chegar depois poder rever do início.
  video.addEventListener('ended', () => {
    video.controls = false;
    video.muted = true;
    start.classList.remove('is-hidden');
  });
}
