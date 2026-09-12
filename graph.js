/* ==========================================================================
   OBSIDIAN KNOWLEDGE GRAPH CANVAS (BLOCO 2)
   Interactive 2D node-edge network with spring physics for Academia Polímatas
   ========================================================================== */

(function () {
  const canvas = document.getElementById('obsidian-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = window.devicePixelRatio || 1;

  // Micro-explosão de entrada: cada bolinha nasce com estouro de escala e um
  // empurrão para fora do centro. burst fica null até a seção entrar na tela.
  let burst = null;
  const POP_MS = 460;
  const POP_STAGGER = 38;

  function burstProgress(node) {
    if (burst === null) return 0;
    const t = (performance.now() - burst - node.order * POP_STAGGER) / POP_MS;
    return Math.max(0, Math.min(1, t));
  }

  // easeOutBack: passa de 1 e volta, que é o "estouro" da bolinha.
  function popScale(t) {
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }

  // 32 Topics from prompt
  const TOPICS = [
    { name: 'Produtividade', category: 'produtividade', priority: 1.4 },
    { name: 'Disciplina', category: 'produtividade', priority: 1.3 },
    { name: 'Motivação', category: 'produtividade', priority: 1.2 },
    { name: 'Autoestima', category: 'geral', priority: 1.0 },
    { name: 'Ansiedade', category: 'geral', priority: 1.3 },
    { name: 'Identidade', category: 'geral', priority: 1.2 },
    { name: 'Taxonomia do conhecimento', category: 'aprendizagem', priority: 1.4 },
    { name: 'Masculinidade', category: 'geral', priority: 1.1 },
    { name: 'Controle da mente', category: 'geral', priority: 1.2 },
    { name: 'Sucesso', category: 'produtividade', priority: 1.1 },
    { name: 'Esporte', category: 'geral', priority: 1.0 },
    { name: 'Metas', category: 'produtividade', priority: 1.2 },
    { name: 'Desistência', category: 'geral', priority: 1.1 },
    { name: 'Estudos', category: 'aprendizagem', priority: 1.3 },
    { name: 'Comunicação', category: 'comunicacao', priority: 1.4 },
    { name: 'Medo de errar', category: 'comunicacao', priority: 1.2 },
    { name: 'Rotina', category: 'produtividade', priority: 1.1 },
    { name: 'Resolução de problemas', category: 'aprendizagem', priority: 1.2 },
    { name: 'Memória', category: 'aprendizagem', priority: 1.3 },
    { name: 'Momentos difíceis', category: 'geral', priority: 1.1 },
    { name: 'Inteligência Artificial', category: 'aprendizagem', priority: 1.3 },
    { name: 'Tomada de decisão', category: 'aprendizagem', priority: 1.2 },
    { name: 'Leveza', category: 'geral', priority: 1.0 },
    { name: 'Crise existencial', category: 'geral', priority: 1.4 },
    { name: 'Generalismo', category: 'aprendizagem', priority: 1.5 },
    { name: 'Brain fog', category: 'produtividade', priority: 1.0 },
    { name: 'Psicologia das relações', category: 'comunicacao', priority: 1.3 },
    { name: 'Fracasso', category: 'geral', priority: 1.1 },
    { name: 'Curiosidade', category: 'aprendizagem', priority: 1.3 },
    { name: 'Potência intelectual', category: 'aprendizagem', priority: 1.2 },
    { name: 'Talento', category: 'aprendizagem', priority: 1.0 },
    { name: 'Dinheiro', category: 'geral', priority: 1.0 }
  ];

  // Explicit connections between topic names (Obsidian Graph Edges)
  const CONNECTIONS = [
    ['Crise existencial', 'Identidade'],
    ['Crise existencial', 'Ansiedade'],
    ['Crise existencial', 'Generalismo'],
    ['Crise existencial', 'Brain fog'],
    ['Crise existencial', 'Desistência'],
    ['Crise existencial', 'Momentos difíceis'],
    ['Crise existencial', 'Motivação'],
    ['Produtividade', 'Disciplina'],
    ['Produtividade', 'Motivação'],
    ['Produtividade', 'Rotina'],
    ['Produtividade', 'Metas'],
    ['Produtividade', 'Brain fog'],
    ['Produtividade', 'Resolução de problemas'],
    ['Taxonomia do conhecimento', 'Estudos'],
    ['Taxonomia do conhecimento', 'Generalismo'],
    ['Taxonomia do conhecimento', 'Memória'],
    ['Taxonomia do conhecimento', 'Potência intelectual'],
    ['Taxonomia do conhecimento', 'Curiosidade'],
    ['Taxonomia do conhecimento', 'Inteligência Artificial'],
    ['Comunicação', 'Medo de errar'],
    ['Comunicação', 'Psicologia das relações'],
    ['Comunicação', 'Autoestima'],
    ['Comunicação', 'Tomada de decisão'],
    ['Disciplina', 'Esporte'],
    ['Disciplina', 'Desistência'],
    ['Disciplina', 'Controle da mente'],
    ['Disciplina', 'Fracasso'],
    ['Generalismo', 'Talento'],
    ['Generalismo', 'Curiosidade'],
    ['Generalismo', 'Potência intelectual'],
    ['Generalismo', 'Dinheiro'],
    ['Generalismo', 'Tomada de decisão'],
    ['Ansiedade', 'Controle da mente'],
    ['Ansiedade', 'Leveza'],
    ['Masculinidade', 'Identidade'],
    ['Sucesso', 'Dinheiro'],
    ['Sucesso', 'Metas']
  ];

  let nodes = [];
  let edges = [];
  let mouse = { x: -1000, y: -1000, active: false, draggedNode: null };
  let hoveredNode = null;

  function resize() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }

  function initNodes() {
    // Spread out naturally across canvas
    nodes = TOPICS.map((topic, i) => {
      const cols = 6;
      const rows = Math.ceil(TOPICS.length / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);

      const cellW = width / cols;
      const cellH = height / rows;

      const x = cellW * 0.5 + col * cellW + (Math.random() - 0.5) * (cellW * 0.6);
      const y = cellH * 0.5 + row * cellH + (Math.random() - 0.5) * (cellH * 0.6);

      const size = 6 + topic.priority * 5;

      return {
        id: i,
        name: topic.name,
        category: topic.category,
        priority: topic.priority,
        x: Math.max(50, Math.min(width - 50, x)),
        y: Math.max(50, Math.min(height - 50, y)),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: size,
        originalRadius: size,
        pulseOffset: Math.random() * 10,
        order: i,
        popped: false
      };
    });

    // Build edge list from CONNECTIONS
    edges = [];
    CONNECTIONS.forEach(([nameA, nameB]) => {
      const nodeA = nodes.find(n => n.name === nameA);
      const nodeB = nodes.find(n => n.name === nameB);
      if (nodeA && nodeB) {
        edges.push({ source: nodeA, target: nodeB, restLength: 130 });
      }
    });
  }

  function updatePhysics() {
    // 1. Spring forces along defined edges (Pull connected nodes when dragged!)
    edges.forEach(edge => {
      let n1 = edge.source;
      let n2 = edge.target;
      let dx = n2.x - n1.x;
      let dy = n2.y - n1.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        let delta = dist - edge.restLength;
        let force = delta * 0.008; // Spring stiffness

        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;

        if (n1 !== mouse.draggedNode) {
          n1.vx += fx;
          n1.vy += fy;
        }
        if (n2 !== mouse.draggedNode) {
          n2.vx -= fx;
          n2.vy -= fy;
        }
      }
    });

    // 2. Node dynamics & repulsion
    for (let i = 0; i < nodes.length; i++) {
      let n1 = nodes[i];

      if (n1 === mouse.draggedNode) {
        n1.x = mouse.x;
        n1.y = mouse.y;
        n1.vx = 0;
        n1.vy = 0;
        continue;
      }

      // Gentle drift
      n1.x += n1.vx;
      n1.y += n1.vy;

      // Soft boundary bounce
      const margin = 50;
      if (n1.x < margin) { n1.x = margin; n1.vx *= -0.5; }
      if (n1.x > width - margin) { n1.x = width - margin; n1.vx *= -0.5; }
      if (n1.y < margin) { n1.y = margin; n1.vy *= -0.5; }
      if (n1.y > height - margin) { n1.y = height - margin; n1.vy *= -0.5; }

      // Mouse attraction when hovering nearby
      if (mouse.active && !mouse.draggedNode) {
        let dx = mouse.x - n1.x;
        let dy = mouse.y - n1.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 1) {
          let force = (120 - dist) / 120 * 0.08;
          n1.vx += (dx / dist) * force;
          n1.vy += (dy / dist) * force;
        }
      }

      // Node repulsion to maintain spacing
      for (let j = i + 1; j < nodes.length; j++) {
        let n2 = nodes[j];
        let dx = n2.x - n1.x;
        let dy = n2.y - n1.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let minDist = (n1.radius + n2.radius) * 2.5 + 45;

        if (dist < minDist && dist > 1) {
          let force = (minDist - dist) / minDist * 0.08;
          let fx = (dx / dist) * force;
          let fy = (dy / dist) * force;

          if (n1 !== mouse.draggedNode) { n1.vx -= fx; n1.vy -= fy; }
          if (n2 !== mouse.draggedNode) { n2.vx += fx; n2.vy += fy; }
        }
      }

      // Damping / friction
      n1.vx *= 0.94;
      n1.vy *= 0.94;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw graph edges
    edges.forEach(edge => {
      let n1 = edge.source;
      let n2 = edge.target;
      let dx = n2.x - n1.x;
      let dy = n2.y - n1.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      let isConnectedToHover = (hoveredNode && (n1 === hoveredNode || n2 === hoveredNode)) ||
                               (mouse.draggedNode && (n1 === mouse.draggedNode || n2 === mouse.draggedNode));

      let alpha = isConnectedToHover ? 0.7 : Math.max(0.08, 0.35 - (dist / 300));

      const bornBoth = Math.min(burstProgress(n1), burstProgress(n2));
      if (bornBoth <= 0) return;
      alpha *= bornBoth;

      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.strokeStyle = isConnectedToHover ? '#f0c85a' : `rgba(138, 153, 173, ${alpha})`;
      ctx.lineWidth = isConnectedToHover ? 2 : 1;
      ctx.stroke();
    });

    // Draw nodes & labels
    let time = Date.now() * 0.002;
    hoveredNode = null;

    nodes.forEach(node => {
      const grown = burstProgress(node);
      if (grown <= 0) return;

      if (!node.popped) {
        node.popped = true;
        const ang = Math.atan2(node.y - height / 2, node.x - width / 2);
        node.vx += Math.cos(ang) * 1.1;
        node.vy += Math.sin(ang) * 1.1;
      }

      ctx.globalAlpha = Math.min(1, grown * 1.5);

      let isHover = false;
      if (mouse.active) {
        let dx = mouse.x - node.x;
        let dy = mouse.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 14) {
          isHover = true;
          hoveredNode = node;
        }
      }

      let isDragged = node === mouse.draggedNode;
      let isConnectedToDragged = mouse.draggedNode && edges.some(e => 
        (e.source === mouse.draggedNode && e.target === node) || 
        (e.target === mouse.draggedNode && e.source === node)
      );

      let pulse = Math.sin(time + node.pulseOffset) * 1.5;
      let currentRadius = (isHover || isDragged || isConnectedToDragged) ? node.originalRadius * 1.4 : node.originalRadius + pulse;
      currentRadius *= popScale(grown);

      // Glow behind node
      let grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, currentRadius * 2.8);
      if (isHover || isDragged || isConnectedToDragged) {
        grad.addColorStop(0, 'rgba(240, 200, 90, 0.7)');
        grad.addColorStop(1, 'rgba(212, 166, 58, 0)');
      } else {
        grad.addColorStop(0, 'rgba(212, 166, 58, 0.25)');
        grad.addColorStop(1, 'rgba(10, 15, 20, 0)');
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = (isHover || isDragged || isConnectedToDragged) ? '#f0c85a' : '#d4a63a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = (isHover || isDragged) ? 2 : 0.8;
      ctx.stroke();

      // Label text
      ctx.font = (isHover || isDragged || isConnectedToDragged) ? '600 14px "Instrument Sans"' : '400 12px "Instrument Sans"';
      ctx.fillStyle = (isHover || isDragged || isConnectedToDragged) ? '#ffffff' : 'rgba(245, 247, 250, 0.85)';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + currentRadius + 16);

      ctx.globalAlpha = 1;
    });

    canvas.style.cursor = (hoveredNode || mouse.draggedNode) ? 'grab' : 'default';

    updatePhysics();
    requestAnimationFrame(draw);
  }

  // Mouse & Touch Listeners
  function updateMousePos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.active = true;
  }

  canvas.addEventListener('mousemove', (e) => {
    updateMousePos(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.draggedNode = null;
  });

  canvas.addEventListener('mousedown', (e) => {
    updateMousePos(e.clientX, e.clientY);
    if (hoveredNode) {
      mouse.draggedNode = hoveredNode;
      canvas.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mouseup', () => {
    mouse.draggedNode = null;
  });

  // Click on a node filters the season lessons in Bloco 3
  canvas.addEventListener('click', () => {
    if (hoveredNode && window.filterLessonsByTopic) {
      window.filterLessonsByTopic(hoveredNode.name);
      
      const seasonsSection = document.getElementById('temporadas');
      if (seasonsSection) {
        seasonsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  window.addEventListener('resize', () => {
    resize();
    initNodes();
    // Já explodiu: as bolinhas voltam prontas em vez de renascer.
    if (burst !== null) burst = performance.now() - 1e6;
  });

  // A explosão dispara quando a seção aparece, não no carregamento, senão
  // acontece fora da tela e o visitante nunca vê.
  function armBurst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      burst = performance.now() - 1e6;
      return;
    }
    const alvo = canvas.parentElement || canvas;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        burst = performance.now();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    observer.observe(alvo);
  }

  // Initialization
  resize();
  initNodes();
  armBurst();
  draw();
})();
