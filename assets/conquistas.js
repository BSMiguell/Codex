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
})();
