/* Aetheria Codex — Rituals de Invocação (Fase A) */
/* Arquitetura: RITUALS[groupKey] = fn(cardEl, modalEl, groupColor) */
/* Os rituais rodam entre o clique e a troca de conteudo do modal (hook no view-transition). */
/* Fallback: prefers-reduced-motion pula direto para o morph simples atual. */
/* Duracao maxima: 900ms; nao bloqueiam o fetch/troca de conteudo. */

(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  const RITUALS = {};

  /* --- Helpers --- */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function addTempClass(el, cls) {
    if (!el) return;
    el.classList.add(cls);
  }
  function removeTempClass(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
  }
  function runAfter(ms, fn) { setTimeout(fn, ms); }

  /* Rit ual 03 — Ordens e Guerreiros: Baixar de estandarte */
  RITUALS['03_Ordens_E_Guerreiros'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-03-banner');
    modal.classList.add('ritual-03-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-03-banner');
      modal.classList.remove('ritual-03-modal');
    });
  };

  /* Rit ual 07 — Gigantes: Impacto de passo */
  RITUALS['07_Gigantes'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-07-impact');
    modal.classList.add('ritual-07-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-07-impact');
      modal.classList.remove('ritual-07-modal');
    });
  };

  /* Rit ual 08 — Monstros: Mandibula se abre (clip-path V) */
  RITUALS['08_Monstros'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-08-jaw');
    modal.classList.add('ritual-08-modal');
    runAfter(750, function () {
      card.classList.remove('ritual-08-jaw');
      modal.classList.remove('ritual-08-modal');
    });
  };

  /* Rit ual 14 — Demonios do Caos: Fractura instavel */
  RITUALS['14_Demonios_Do_Caos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-14-fracture');
    modal.classList.add('ritual-14-modal');
    runAfter(850, function () {
      card.classList.remove('ritual-14-fracture');
      modal.classList.remove('ritual-14-modal');
    });
  };

  /* Rit ual 17 — Meio-Sangue: Duas metades se fundem */
  RITUALS['17_Meio_Sangue'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-17-merge');
    modal.classList.add('ritual-17-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-17-merge');
      modal.classList.remove('ritual-17-modal');
    });
  };

  /* Rit ual 19 — Barbaros: Machado corta o veu */
  RITUALS['19_Barbaros'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-19-axe');
    modal.classList.add('ritual-19-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-19-axe');
      modal.classList.remove('ritual-19-modal');
    });
  };

  /* Ajuste pós-print real: reaproveita a marca d'água existente (ícone da raça) como parte do ritual */
  function animateWatermark(modal, color) {
    var wm = document.querySelector('.hero-watermark') || document.querySelector('.lore-watermark');
    if (!wm) return;
    wm.classList.add('ritual-mark-active');
    runAfter(700, function () { wm.classList.remove('ritual-mark-active'); });
  }

  /* Rit ual 01 — Humanos: Chama ancestral */
  RITUALS['01_Humanos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-01-ancestral');
    modal.classList.add('ritual-01-modal');
    runAfter(600, function () {
      card.classList.remove('ritual-01-ancestral');
      modal.classList.remove('ritual-01-modal');
    });
  };

  /* Rit ual 02 — Mutantes: Transformacao instavel */
  RITUALS['02_Mutantes'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-02-mutate');
    modal.classList.add('ritual-02-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-02-mutate');
      modal.classList.remove('ritual-02-modal');
    });
  };

  /* Rit ual 04 — Onis: Sombra que consome */
  RITUALS['04_Onis'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-04-shadow');
    modal.classList.add('ritual-04-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-04-shadow');
      modal.classList.remove('ritual-04-modal');
    });
  };

  /* Rit ual 05 — Demonios: Pacto de sangue */
  RITUALS['05_Demonios'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-05-pact');
    modal.classList.add('ritual-05-modal');
    runAfter(750, function () {
      card.classList.remove('ritual-05-pact');
      modal.classList.remove('ritual-05-modal');
    });
  };

  /* Rit ual 09 — Semi-Deuses: Ascensao divina */
  RITUALS['09_Semi_Deuses'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-09-ascension');
    modal.classList.add('ritual-09-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-09-ascension');
      modal.classList.remove('ritual-09-modal');
    });
  };

  /* Rit ual 10 — Seres do Vazio: Abismo abre */
  RITUALS['10_Os_Observadores'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-10-abyss');
    modal.classList.add('ritual-10-modal');
    runAfter(850, function () {
      card.classList.remove('ritual-10-abyss');
      modal.classList.remove('ritual-10-modal');
    });
  };

  /* Rit ual 13 — Deuses: Relampago do trono */
  RITUALS['13_Deuses'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-13-thunder');
    modal.classList.add('ritual-13-modal');
    runAfter(600, function () {
      card.classList.remove('ritual-13-thunder');
      modal.classList.remove('ritual-13-modal');
    });
  };

  /* Rit ual 06 — Desconhecidos: Veu se rasga (corrigido do 15) */
  RITUALS['06_Desconhecidos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-15-veil');
    modal.classList.add('ritual-15-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-15-veil');
      modal.classList.remove('ritual-15-modal');
    });
  };

  /* Rit ual 16 — Alvamortos: Ossos ressurgem */
  RITUALS['16_Alvamortos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-16-bones');
    modal.classList.add('ritual-16-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-16-bones');
      modal.classList.remove('ritual-16-modal');
    });
  };

  /* Rit ual 18 — Magos: Encantamento arcano */
  RITUALS['18_Magos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-18-arcane');
    modal.classList.add('ritual-18-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-18-arcane');
      modal.classList.remove('ritual-18-modal');
    });
  };

  /* Rit ual 11 — Seres do Vazio: Vazio profundo */
  RITUALS['11_Seres_Do_Vazio'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-11-deep');
    modal.classList.add('ritual-11-modal');
    runAfter(900, function () {
      card.classList.remove('ritual-11-deep');
      modal.classList.remove('ritual-11-modal');
    });
  };

  /* Rit ual 12 — Magos: Encantamento arcano (corrigido do 18) */
  RITUALS['12_Magos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-20-deep');
    modal.classList.add('ritual-20-modal');
    runAfter(900, function () {
      card.classList.remove('ritual-20-deep');
      modal.classList.remove('ritual-20-modal');
    });
  };

  /* Fallback generico para grupos ainda sem ritual implementado */
  function ritualFallback(card, modal, color) {
    // Nenhuma classe adicionada; apenas retorna imediatamente.
  }

  /* Expor globalmente */
  window.AETHERIA_RITUALS = RITUALS;
  window.runRitual = function (groupKey, cardEl, modalEl, groupColor) {
    var fn = RITUALS[groupKey] || ritualFallback;
    try {
      fn(cardEl, modalEl, groupColor);
    } catch (e) {
      // Silenciosamente ignora erros de ritual; nunca quebra o fluxo principal.
    }
  };

  /* Rit ual 15 — Os Aspectos: Reflexo distorcido */
  RITUALS['15_Os_Aspectos'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-15-reflect');
    modal.classList.add('ritual-15-modal');
    runAfter(700, function () {
      card.classList.remove('ritual-15-reflect');
      modal.classList.remove('ritual-15-modal');
    });
  };

  /* Rit ual 18 — Canibais: Fome insaciavel */
  RITUALS['18_Canibais'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-18-hunger');
    modal.classList.add('ritual-18-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-18-hunger');
      modal.classList.remove('ritual-18-modal');
    });
  };

  /* Rit ual 20 — Amaldiçoados: Sombra eterna */
  RITUALS['20_Amaldiçoados'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-20-curse');
    modal.classList.add('ritual-20-modal');
    runAfter(750, function () {
      card.classList.remove('ritual-20-curse');
      modal.classList.remove('ritual-20-modal');
    });
  };

  /* Rit ual 21 — Demonios Akuma-Gani: Corrente das almas */
  RITUALS['21_Demonios_Akuma_Gani'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-21-chain');
    modal.classList.add('ritual-21-modal');
    runAfter(850, function () {
      card.classList.remove('ritual-21-chain');
      modal.classList.remove('ritual-21-modal');
    });
  };

  /* Rit ual 22 — Bersek: Furor incontrolavel */
  RITUALS['22_Bersek'] = function (card, modal, color) {
    if (prefersReduced) return;
    card.classList.add('ritual-22-rage');
    modal.classList.add('ritual-22-modal');
    runAfter(800, function () {
      card.classList.remove('ritual-22-rage');
      modal.classList.remove('ritual-22-modal');
    });
  };
})();
