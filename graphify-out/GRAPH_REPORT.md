# Graph Report - Teste  (2026-09-02)

## Corpus Check
- 54 files · ~5,134,020 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 298 nodes · 311 edges · 72 communities (31 shown, 41 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cartas de Raça (raca.js)
- Schema characters (description/type)
- Mapa & Páginas de Raça
- Landing Page (index.html)
- Schema characters (root)
- package.json (deps npm)
- pad_preambulos.py (sincronização)
- validate-api.mjs (teste API)
- Codex 22 Berseks (7 guerreiros)
- História (Super/Codex/Geografia)
- Ritual UI (rituals.js)
- build_api_json.ps1 (parser)
- screenshots.mjs (smoke visual)
- Schema characters (tipos)
- Partículas & HexToRgb (raca.js)
- pad_demonios.py (padronização)
- convert_webp.py (pipeline webp)
- smoke.mjs (smoke E2E)
- relatorio-arte.md (pendências conteúdo)
- Memoria.md (linha do tempo)
- build_racas.ps1 (gera racas/*.html)
- relatorio_arte.py (gerador relatório)
- Homônimo Ulthar (Mutantes + Deuses)
- Homônimo Vespera (Mutantes + Meio-Sangue)
- Codex 03 Ordens e Guerreiros (22 cavaleiros)
- Codex 04 Onis (31 guerreiros vulcânicos)
- Codex 11 Seres do Vazio (20 abissais)
- Batalhas & Conflitos
- Batalha Erupção + Fenda Central
- Service Worker (sw.js)
- make-favicons.mjs
- Codex 06 Desconhecidos (15 errantes)
- Codex 07 Gigantes (26 testemunhas)
- Codex 08 Monstros (37 fauna mutada)
- Codex 09 Semideuses (30 com Sementes)
- Codex 10 Observadores (9 arquitetos)
- Codex 12 Magos (23 catalogadores)
- Codex 14 Demônios do Caos (11 parasitas)
- Codex 15 Aspectos (9 guardiães)
- Codex 16 Alvamortos (20 monges)
- Codex 18 Canibais (21 tribos)
- Codex 19 Bárbaros (17 clãs)
- Codex 20 Amaldiçoados (8 votados)
- README.md (gerado)
- Crise dos Mutantes (Codex do Mundo)
- Era de Ouro dos Observadores
- Guerra da Fenda Central
- Linha de Geada
- Bastille (Super História)
- Friede-V-1 (Super História)
- Gintoki (Super História)
- Gloop (Super História)
- Iulia (Super História)
- Kairon (Super História)
- Kaolan (Super História)
- Knull-V-1 (Super História)
- Ren-Kun-V-1 (Super História)
- Vanath-V-1 (Super História)
- README.md (gerado)

## God Nodes (most connected - your core abstractions)
1. `abrirRitual()` - 14 edges
2. `Galeria Aetheria Codex` - 13 edges
3. `boot()` - 13 edges
4. `esc()` - 12 edges
5. `goTo()` - 10 edges
6. `splitTitle()` - 7 edges
7. `renderStage()` - 7 edges
8. `Codex dos Bersek de Aetheria (A Fúria do Último Voto)` - 6 edges
9. `initParticles()` - 6 edges
10. `buildRoster()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Aokiji, o Sentinela do Gelo Eterno` --semantically_similar_to--> `A Chacina da Linha de Geada (batalha)`  [INFERRED] [semantically similar]
  codex/01_Humanos/Aetheria_Codex_de_Humano.md → Historia/Aetheria_Dados_do_Mundo.md
- `O Fosso Infernal (região)` --conceptually_related_to--> `Codex 05 Demônios (41 entidades, padronizado 19/09)`  [INFERRED]
  Historia/Aetheria_Dados_do_Mundo.md → codex/05_Demonios/Aetheria_Codex_de_Demônios.md
- `Codex 05 Demônios (41 entidades, padronizado 19/09)` --shares_data_with--> `racas/05_Demonios.html (página gerada de raça)`  [INFERRED]
  codex/05_Demonios/Aetheria_Codex_de_Demônios.md → racas/05_Demonios.html
- `Dados do Mundo de Aetheria (fonte estruturada)` --shares_data_with--> `Mapa Aetheria (Mesa de Guerra Arcana)`  [EXTRACTED]
  Historia/Aetheria_Dados_do_Mundo.md → Mapa_Aetheria.html
- `O Norte Sub-Frost (região)` --conceptually_related_to--> `Codex 01 Humanos (24 personagens, formato bulleted-bold)`  [INFERRED]
  Historia/Aetheria_Dados_do_Mundo.md → codex/01_Humanos/Aetheria_Codex_de_Humano.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **22 raças do Aetheria Codex (fonte primária em codex/)** — codex_01_humanos_aetheria_codex_de_humano_md, codex_02_mutantes_aetheria_codex_de_mutantes_md, codex_03_ordens_e_guerreiros_aetheria_codex_de_ordens_e_guerreiros_md, codex_04_onis_aetheria_codex_de_onis_md, codex_05_demonios_aetheria_codex_de_demonios_md, codex_06_desconhecidos_aetheria_codex_de_desconhecidos_md, codex_07_gigantes_aetheria_codex_de_gigantes_md, codex_08_monstros_aetheria_codex_de_monstros_md, codex_09_semi_deuses_aetheria_codex_de_semideuses_md, codex_10_os_observadores_aetheria_codex_de_observadores_md, codex_11_seres_do_vazio_aetheria_codex_de_seres_do_vazio_md, codex_12_magos_aetheria_codex_de_magos_md, codex_13_deuses_aetheria_codex_de_deuses_md, codex_14_demonios_do_caos_aetheria_codex_de_demonios_do_caos_md, codex_15_os_aspectos_aetheria_codex_de_aspectos_md, codex_16_alvamortos_aetheria_codex_de_alvamortos_md, codex_17_meio_sangue_aetheria_codex_de_meio_sangue_md, codex_18_canibais_aetheria_codex_de_canibais_md, codex_19_barbaros_aetheria_codex_de_barbaros_md, codex_20_amaldicoados_aetheria_codex_de_amaldicoados_md, codex_21_demonios_akuma_gani_aetheria_codex_de_demonios_akuma_gani_md, codex_22_bersek_aetheria_codex_de_berseks_md [EXTRACTED 0.95]
- **8 personagens com mesmo nome em raças diferentes (variantes intencionais)** — codex_02_mutantes_homonimo_ulthar, codex_02_mutantes_homonimo_vespera, codex_13_deuses_aetheria_codex_de_deuses_md, codex_17_meio_sangue_aetheria_codex_de_meio_sangue_md, codex_06_desconhecidos_aetheria_codex_de_desconhecidos_md, codex_12_magos_aetheria_codex_de_magos_md, codex_10_os_observadores_aetheria_codex_de_observadores_md, codex_15_os_aspectos_aetheria_codex_de_aspectos_md, codex_14_demonios_do_caos_aetheria_codex_de_demonios_do_caos_md, docs_relatorio_arte_homonimos [EXTRACTED 1.00]
- **Conflito central: Deuses/Aspectos vs Seres do Vazio (Erupção do Abismo)** — historia_aetheria_dados_do_mundo_batalha_erupcao_do_abismo, historia_aetheria_dados_do_mundo_regiao_abismo_das_profundezas, codex_11_seres_do_vazio_aetheria_codex_de_seres_do_vazio_md, codex_13_deuses_aetheria_codex_de_deuses_md, codex_15_os_aspectos_aetheria_codex_de_aspectos_md [INFERRED 0.85]

## Communities (72 total, 41 thin omitted)

### Community 0 - "Cartas de Raça (raca.js)"
Cohesion: 0.11
Nodes (40): abrirRitual(), animateCopy(), animateSwap(), boot(), buildDots(), buildPicker(), buildRoster(), closePicker() (+32 more)

### Community 1 - "Schema characters (description/type)"
Cohesion: 0.06
Nodes (35): description, type, description, pattern, type, description, pattern, type (+27 more)

### Community 2 - "Mapa & Páginas de Raça"
Cohesion: 0.08
Nodes (28): Codex 01 Humanos (24 personagens, formato bulleted-bold), Aokiji, o Sentinela do Gelo Eterno, Shanks, o Imperador da Vontade Suprema, Codex 02 Mutantes (48 personagens, esquema Classe Mutagênica), Amalgam-V-1, o Colosso da Mente Parasita, Codex 05 Demônios (41 entidades, padronizado 19/09), Aatrox-V-1, o Tirano de Sangue, Surtur-V-1, o Gigante do Apocalipse (+20 more)

### Community 3 - "Landing Page (index.html)"
Cohesion: 0.18
Nodes (14): Galeria Aetheria Codex, Auto-load por sentinel IntersectionObserver, Cards-carta com foil holo e tilt 3D, Favoritos persistentes, Focus trap do modal, Glow ambiente na cor da raça ativa, Hero do Códice com stats e destaque do dia, Modal folheável com ficha completa (+6 more)

### Community 4 - "Schema characters (root)"
Cohesion: 0.17
Nodes (11): additionalProperties, description, examples, $id, required, $schema, title, type (+3 more)

### Community 5 - "package.json (deps npm)"
Cohesion: 0.18
Nodes (10): description, name, private, scripts, all, screens, test, validate (+2 more)

### Community 6 - "pad_preambulos.py (sincronização)"
Cohesion: 0.36
Nodes (8): Path, achar_indice_primeira_ficha(), contar_fichas(), main(), Conta quantas fichas `## N.` existem no arquivo (N = 1+)., Posicao do `## 1.` (ou primeira ficha) - delimita o final do preambulo., Le o arquivo, sincroniza o numero do preambulo, retorna (n_antigo, n_novo,…, sincronizar()

### Community 7 - "validate-api.mjs (teste API)"
Cohesion: 0.25
Nodes (7): allChars, api, errors, idMap, root, slugs, warnings

### Community 8 - "Codex 22 Berseks (7 guerreiros)"
Cohesion: 0.29
Nodes (6): 1. Ashura, 2. Guts-V-1, 3. Kargan-V-1, o Portador do Voto Quebrado, 4. Vhalor-V-1, o Devorador de Juramentos, 5. Xathur-V-1, Codex dos Bersek de Aetheria (A Fúria do Último Voto)

### Community 9 - "História (Super/Codex/Geografia)"
Cohesion: 0.33
Nodes (7): Aetheria Codex do Mundo, Plano do Escudo de Almas, Primeira Ruptura, Aetheria Geografia e Batalhas, Aetheria: A Guerra das Sete Fronteiras, Convex, Primeira Fratura

### Community 11 - "build_api_json.ps1 (parser)"
Cohesion: 0.47
Nodes (4): Find-ImageFile(), Find-LabeledValue(), Get-CharacterFields(), Normalize-Name()

### Community 12 - "screenshots.mjs (smoke visual)"
Cohesion: 0.33
Nodes (5): __dirname, OUT, shots, shotsMobile, VIEWPORT

### Community 13 - "Schema characters (tipos)"
Cohesion: 0.40
Nodes (5): type, additionalProperties, description, type, attributes

### Community 14 - "Partículas & HexToRgb (raca.js)"
Cohesion: 0.60
Nodes (5): hexToRgb(), initParticles(), frame(), resize(), spawn()

### Community 16 - "pad_demonios.py (padronização)"
Cohesion: 0.67
Nodes (3): main(), padronizar_ficha(), Aplica as transformações 3a, 3b, 3c a uma ficha isolada.

### Community 17 - "convert_webp.py (pipeline webp)"
Cohesion: 0.67
Nodes (3): fmt(), main(), convert_webp.py — converte PNGs do codex/ para WebP. Uso: python…

### Community 20 - "relatorio-arte.md (pendências conteúdo)"
Cohesion: 0.67
Nodes (3): 8 homônimos entre pastas (Ulthar, Vanek, Aurelion, Garrion, Kyran, Nyxaris, Stellaris, Vespera), docs/relatorio-arte.md (pendências: 6 órfãos, 8 homônimos, 3 quase-duplicatas), Pendências de conteúdo (6 órfãos, 8 homônimos, dívida consciente)

### Community 21 - "Memoria.md (linha do tempo)"
Cohesion: 0.67
Nodes (3): Comando 'atualização de personagens' (gatilho + checklist 8 passos), Lições PowerShell 5.1 (encoding, regex, BOM), Memoria.md (linha do tempo oficial)

## Knowledge Gaps
- **128 isolated node(s):** `1. Ashura`, `2. Guts-V-1`, `3. Kargan-V-1, o Portador do Voto Quebrado`, `4. Vhalor-V-1, o Devorador de Juramentos`, `5. Xathur-V-1` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `properties` connect `Schema characters (description/type)` to `Schema characters (root)`, `Schema characters (tipos)`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `attributes` connect `Schema characters (tipos)` to `Schema characters (description/type)`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `1. Ashura`, `2. Guts-V-1`, `3. Kargan-V-1, o Portador do Voto Quebrado` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cartas de Raça (raca.js)` be split into smaller, more focused modules?**
  _Cohesion score 0.11074197120708748 - nodes in this community are weakly interconnected._
- **Should `Schema characters (description/type)` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `Mapa & Páginas de Raça` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._