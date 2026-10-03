# Fase — Formulário público profissional

Objetivo: reduzir erros de cadastro, minimizar exposição de dados pessoais e tornar a confirmação da inscrição coerente com a API segura.

Principais mudanças:
- confirmação pós-inscrição exibe somente protocolo, nome, status e data/hora;
- não tenta mais mostrar CPF, RG, endereço, telefone, camisa/chinelo retornados pela API;
- chinelo passa a usar seleção de 30 a 45;
- camisa passa a usar seleção padronizada (PP, P, M, G, GG, XGG, G1, G2, G3);
- servidor valida exatamente os mesmos intervalos/opções;
- protocolo usa sufixo aleatório criptográfico maior;
- validação de data/nome endurecida no servidor;
- campos recebem limites e autocomplete apropriados;
- aviso de privacidade reforçado;
- mensagens de erro ganham role=alert/aria-live.

Teste recomendado:
1. npm.cmd run build
2. npm.cmd run dev
3. Fazer uma inscrição nova.
4. Conferir protocolo e confirmação sem dados pessoais desnecessários.
5. Tentar repetir o mesmo CPF e confirmar bloqueio de inscrição duplicada.
6. Conferir a inscrição no painel /admin.
