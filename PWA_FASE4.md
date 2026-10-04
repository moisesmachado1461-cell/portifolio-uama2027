# UAMA — Fase Principal 4: PWA / aplicativo instalável

## O que foi adicionado

- Manifesto PWA.
- Ícones 192px e 512px.
- Instalação em Android/Chrome/Edge.
- Instrução de instalação para iPhone/iPad.
- Abertura em modo aplicativo (`standalone`).
- Service Worker.
- Tela offline.
- Cache somente de arquivos públicos estáticos.
- `/api/*` e `/admin` nunca são armazenados no cache offline.

## Teste

1. `npm.cmd run build`
2. `git add .`
3. `git commit -m "Transformar UAMA em PWA instalavel"`
4. `git push`
5. Aguarde o Render ficar Live.
6. Abra o site pelo celular.
7. Android/Chrome: deve aparecer a opção **Instalar app**.
8. iPhone/Safari: Compartilhar → **Adicionar à Tela de Início**.

## Observação

O PWA usa o mesmo site, o mesmo Render e o mesmo PostgreSQL.
Não é necessário pagar Play Store/App Store para instalar pelo navegador.
