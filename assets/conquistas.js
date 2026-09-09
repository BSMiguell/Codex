// §7.2 — Lógica básica de desbloqueio de conquistas
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  window.AETHERIA_CONQUISTAS = {
    carregar: function () {
      try {
        const raw = localStorage.getItem('aetheria_conquistas');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { desbloqueadas: [], progresso: {} };
    },
    salvar: function (estado) {
      try { localStorage.setItem('aetheria_conquistas', JSON.stringify(estado)); } catch (e) {}
    },
    desbloquear: function (id) {
      const est = this.carregar();
      if (!est.desbloqueadas.includes(id)) {
        est.desbloqueadas.push(id);
        this.salvar(est);
      }
    }
  };
  /* Auto-desbloqueio via eventos do site */
  function observarEventos() {
    // Quando um personagem é aberto no modal
    document.addEventListener('codex:modal-open', function () {
      window.AETHERIA_CONQUISTAS.desbloquear('explorador_inicial');
    });
    // Quando a paleta de comandos é usada
    document.getElementById('paletteTrigger')?.addEventListener('click', function () {
      window.AETHERIA_CONQUISTAS.desbloquear('busca_semantica');
    });
    // Quando um favorito é adicionado (detectado via mutation no localStorage)
    setInterval(function () {
      var est = window.AETHERIA_CONQUISTAS.carregar();
      var favs = new Set(JSON.parse(localStorage.getItem('favorites') || '[]'));
      if (favs.size >= 10 && !est.desbloqueadas.includes('favoritos_10')) {
        window.AETHERIA_CONQUISTAS.desbloquear('favoritos_10');
      }
    }, 3000);
  }
  document.getElementById('conquistasBtn')?.addEventListener('click', function () {
    var est = window.AETHERIA_CONQUISTAS.carregar();
    var desbloqueadas = est.desbloqueadas || [];
    abrirModalConquistas(est, desbloqueadas);
  });

  function abrirModalConquistas(est, desbloqueadas) {
    if (document.getElementById('modal-conquistas')) {
      document.getElementById('modal-conquistas').remove();
    }
    var overlay = document.createElement('div');
    overlay.id = 'modal-conquistas';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:300;background:radial-gradient(ellipse at 50% 20%, rgba(227,73,27,0.35) 0%, rgba(23,19,16,0.92) 70%, #0a0a12 100%);display:flex;align-items:center;justify-content:center;padding:2rem;font-family:"Fraunces",Georgia,serif;color:#f0ece4;animation:fadeIn 0.5s ease;';
    overlay.innerHTML = '<style>@keyframes fadeIn{from{opacity:0;transform:scale(0.98)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{box-shadow:0 0 12px rgba(227,73,27,0.35)}50%{box-shadow:0 0 28px rgba(227,73,27,0.7)}}.star-field{position:absolute;inset:0;background:radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 35%);pointer-events:none;overflow:hidden}.star-field span{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;opacity:0.7;animation:twinkle 3s infinite ease-in-out alternate}@keyframes twinkle{from{opacity:0.2;transform:scale(0.8)}to{opacity:1;transform:scale(1.4)}}</style><div class="star-field" id="star-field"></div>';
    var stars = overlay.querySelector('#star-field');
    for (var i = 0; i < 60; i++) {
      var s = document.createElement('span');
      s.style.cssText = 'top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 3) + 's;';
      stars.appendChild(s);
    }
    var card = document.createElement('div');
    card.style.cssText = 'position:relative;z-index:2;background:rgba(26,23,20,0.82);backdrop-filter:blur(20px);border:1px solid rgba(227,73,27,0.35);border-radius:2rem;padding:2.5rem 2rem;max-width:640px;width:100%;box-shadow:0 40px 100px -30px rgba(227,73,27,0.25),0 0 0 1px rgba(255,255,255,0.06) inset;animation:fadeIn 0.7s ease 0.15s both;';
    var header = document.createElement('div');
    header.innerHTML = '<h2 style="font-family:var(--fd);font-size:1.8rem;letter-spacing:-0.03em;margin:0 0 0.3rem;color:#f4f0e8;text-shadow:0 0 20px rgba(227,73,27,0.4);">🏆 Conquistas do Códice</h2><p style="font-size:0.95rem;color:#b8b0a4;margin:0 0 1.5rem;letter-spacing:0.05em;">Progresso de exploração e interação com o códice.</p>';
    card.appendChild(header);
    var body = document.createElement('div');
    var conquistas = [
      {id:'explorador_inicial', nome:'Primeiros Passos', descricao:'Abriu o Aetheria pela primeira vez.', icone:'🌱'},
      {id:'leitor_22', nome:'Leitor das 22 Raças', descricao:'Visitou as páginas de todas as 22 raças.', icone:'📚'},
      {id:'mapa_explorador', nome:'Explorador do Mapa', descricao:'Clicou em pelo menos 10 pins no mapa.', icone:'🗺️'},
      {id:'favoritos_10', nome:'Colecionador', descricao:'Adicionou 10 personagens aos favoritos.', icone:'♥'},
      {id:'busca_semantica', nome:'Investigador', descricao:'Usou a busca semântica por lore.', icone:'🔎'}
    ];
    conquistas.forEach(function(c) {
      var desbloqueado = desbloqueadas.includes(c.id);
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:1.2rem;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,0.06);transition:background 0.3s;';
      item.innerHTML = '<div style="font-size:2rem;line-height:1;opacity:' + (desbloqueado ? '1' : '0.35') + ';filter:' + (desbloqueado ? 'drop-shadow(0 0 8px rgba(227,73,27,0.5))' : 'none') + ';">' + c.icone + '</div><div style="flex:1;"><h3 style="font-family:var(--fs);font-size:1.05rem;font-weight:600;margin:0;color:' + (desbloqueado ? '#f4f0e8' : '#7a746a') + ';letter-spacing:0.02em;">' + (desbloqueado ? '✓ ' : '') + c.nome + '</h3><p style="font-size:0.85rem;color:#91887a;margin:0.2rem 0 0;line-height:1.5;">' + c.descricao + '</p></div><span style="font-size:0.75rem;font-weight:600;color:' + (desbloqueado ? '#e3491b' : '#5f574b') + ';text-transform:uppercase;letter-spacing:0.08em;background:' + (desbloqueado ? 'rgba(227,73,27,0.15)' : 'rgba(255,255,255,0.05)') + ';padding:0.3rem 0.7rem;border-radius:2rem;border:1px solid ' + (desbloqueado ? 'rgba(227,73,27,0.35)' : 'rgba(255,255,255,0.1)') + ';">' + (desbloqueado ? 'DESBLOQUEADO' : 'PENDENTE') + '</span>';
      body.appendChild(item);
    });
    card.appendChild(body);
    var footer = document.createElement('div');
    footer.style.cssText = 'margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;color:#7a746a;font-size:0.85rem;';
    footer.innerHTML = '<span>' + desbloqueadas.length + ' / 5 conquistas</span><button onclick="document.getElementById(\'modal-conquistas\').remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.15);color:#f0e6d2;padding:0.5rem 1.2rem;border-radius:2rem;font-family:var(--fs);font-size:0.85rem;cursor:pointer;transition:all 0.2s;">Fechar</button>';
    card.appendChild(footer);
    overlay.appendChild(card);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observarEventos);
  } else {
    observarEventos();
  }
})();
