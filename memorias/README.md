# Sistema de memórias diárias — Aetheria Codex

Esta pasta é o **novo sistema de memória diária** do projeto.

## Memória original

`Memoria.md` permanece como a **memória histórica/original do projeto**. Não deve ser apagada, substituída ou reorganizada de forma destrutiva.

## Memórias diárias

Cada dia de trabalho recebe seu próprio arquivo:

```text
memorias/
├── README.md
├── 2026-09-08.md
├── 2026-09-09.md
├── 2026-09-10.md
└── ...
```

O nome deve seguir sempre:

```text
AAAA-MM-DD.md
```

Assim a pasta fica organizada cronologicamente e não cresce em um único arquivo gigante.

## O que registrar em cada dia

Cada memória diária deve registrar somente o que aconteceu naquele dia, incluindo quando aplicável:

- objetivo da sessão;
- análise realizada;
- arquivos alterados;
- correções implementadas;
- comandos executados e resultados importantes;
- testes e validações;
- problemas encontrados;
- decisões tomadas;
- commits relevantes;
- estado da camada/gate;
- próxima etapa recomendada;
- lições técnicas que valha a pena preservar.

## Regras

1. **Não apagar o histórico de `Memoria.md`.**
2. **Não misturar dias diferentes no mesmo arquivo.**
3. Se uma sessão atravessar meia-noite, registrar cada acontecimento no arquivo correspondente à data em que ocorreu; se necessário, criar uma pequena referência cruzada.
4. Não duplicar toda a documentação do projeto. Registrar fatos e decisões que realmente aconteceram.
5. Commits devem ser registrados quando forem relevantes para entender o estado do projeto.
6. A memória diária complementa `Memoria.md`; ela não substitui a memória original.
7. `Temporario.md` continua sendo o plano operacional/camadas. `Memoria.md` continua sendo o histórico original. `memorias/` passa a ser o diário detalhado por data.

## Fluxo de atualização

```text
Trabalhar no projeto
       ↓
Registrar o que realmente aconteceu no dia
       ↓
Criar/atualizar memorias/AAAA-MM-DD.md
       ↓
Validar o arquivo
       ↓
Registrar commit quando aplicável
```

## Relação entre os arquivos

| Arquivo | Função |
|---|---|
| `Memoria.md` | Memória histórica/original e referência de longo prazo |
| `Temporario.md` | Plano de execução, camadas, gates e próximos passos |
| `memorias/AAAA-MM-DD.md` | Diário detalhado de cada dia |
| `README.md` | Documentação geral do projeto |

Este sistema deve ser usado nas próximas sessões para evitar que a memória principal fique excessivamente grande e para facilitar a recuperação do contexto de um dia específico.
