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
    if (desbloqueadas.length === 0) {
      alert('🏆 Nenhuma conquista desbloqueada ainda.\nExplora o códice!');
    } else {
      alert('🏆 Conquistas desbloqueadas: ' + desbloqueadas.join(', '));
    }
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observarEventos);
  } else {
    observarEventos();
  }
})();
