# Instruções de instalação — NVDA real para teste de acessibilidade

Objetivo: criar o ambiente real para executar `docs/roteiro-nvda-teste.md` com leitor de tela NVDA.
Ambiente: Windows 11 Pro (10.0.22631) — conforme `docs/nvda-teste.md`.

## Pré-requisitos

- [ ] Acesso à internet (para download).
- [ ] Direitos de administrador no Windows (para instalar NVDA).
- [ ] Site `Aetheria Codex` disponível (local `http://localhost:8124` ou produção `/Codex`).

## Passo 1 — Baixar o NVDA

1. Acessar https://www.nvaccess.org/download/nvda/releases/ (ou https://www.nvaccess.org/download/ para a versão estável).
2. Baixar o arquivo `.exe` da versão mais recente (ex: `nvda_2025.1.exe` ou posterior).
3. Salvar o arquivo em um local seguro (ex: `C:\Downloads\nvda_setup.exe`).

Nota: o download do `.exe` requer interação manual — não pode ser automatizado via CLI sem direitos de administrador interativos (conforme bloqueio de segurança confirmado na sessão 2026-09-19).

## Passo 2 — Instalar o NVDA

1. Executar o arquivo `.exe` baixado (clicar duplo ou executar via PowerShell: `Start-Process -FilePath "C:\Downloads\nvda_setup.exe" -Verb RunAs`).
2. Seguir o wizard de instalação:
   - Aceitar os termos.
   - Escolher o local padrão (`C:\Program Files\NVDA`).
   - Confirmar a instalação.
3. Aguardar a conclusão (geralmente < 30 segundos).
4. Confirmar que o arquivo `C:\Program Files\NVDA\nvda.exe` existe.

## Passo 3 — Verificar instalação

Executar no terminal (PowerShell ou Bash):

```bash
node check-nvda.mjs
```

Resultado esperado:

```text
=== VERIFICAÇÃO NVDA PÓS-INSTALAÇÃO ===
Arquivo: C:\Program Files\NVDA\nvda.exe
Instalado: SIM
Status: 🟢 NVDA encontrado. Próximo: executar docs/nvda-teste.md (teste manual).
```

Se o resultado for `NÃO`, confirmar:
- O arquivo `.exe` foi executado com direitos de administrador.
- A instalação foi concluída sem erros.
- O arquivo `C:\Program Files\NVDA\nvda.exe` existe no disco.

## Passo 4 — Iniciar o NVDA

1. Executar `C:\Program Files\NVDA\nvda.exe` (ou usar `Ctrl+Alt+N` para ligar/desligar).
2. Confirmar que o NVDA está rodando:
   - Verificar no Gerenciador de Tarefas (`tasklist | findstr nvda`).
   - Confirmar que o leitor anuncia os elementos ao navegar com `Tab`.

## Passo 5 — Executar o roteiro de teste manual

1. Abrir `docs/roteiro-nvda-teste.md`.
2. Executar os passos na ordem (1 a 6):
   - `Tab` / `Shift+Tab`
   - Skip-link (`Enter`)
   - Paleta (`Ctrl+K`, `ESC`)
   - Modal (`onboarding` / `#aboutDialog`, `Tab` dentro do modal, `ESC`)
   - Chips do mapa (`política`, `magica`, `rotas`, `conflitos`)
   - Conquistas e busca
3. Registrar resultados em `docs/nvda-teste.md` (atualizar com `✅` se 0 problemas, ou listar correções se houver falhas).

## Passo 6 — Fechar o Gate E (NVDA real)

Se todos os 6 passos confirmarem com NVDA real (`✅`) e 0 problemas críticos:

- Atualizar `docs/nvda-teste.md`: marcar `Gate E (NVDA real): 🟢`.
- Atualizar `docs/checklist-validado.md`: marcar `#13` como `✅`.
- Atualizar `Temporario.md`: atualizar estado P2 (`NVDA` passa de 🟡 para 🟢).
- Criar registro de evidência (opcional): `memorias/2026-09-19-nvda-evindencia.md` com data, versão do NVDA (`tasklist | findstr nvda`), versão do site (`git rev-parse --short HEAD`) e resultados de cada passo.

Se houver problemas (mesmo pequenos):

- Listar cada problema com causa real (ex: `aria-modal` não anunciado, focus trap quebrado, `aria-activedescendant` não sincronizado).
- Corrigir o código (não mascarar o teste).
- Reexecutar o roteiro.
- Atualizar `docs/nvda-teste.md` com as correções aplicadas.

## Regra de segurança

Não mascarar limitações. Se o ambiente não tiver NVDA real, registrar como 🟡 com a causa documentada (não criar falso verde). Se o ambiente tiver NVDA real e o teste falhar, corrigir a causa real antes de marcar 🟢.
