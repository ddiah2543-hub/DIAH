# Revisão de design: DIAH Solutions (8 Nov 2026)

Revisão do site completo (versão local, branch `dev`) feita pelo agente de design com Playwright, a 1440, 1280, 1024, 768 e 375px, nos temas claro e escuro, em PT, com verificação de EN e FR. Ainda nada foi corrigido.

**Veredicto:** o site está limpo, sóbrio e coerente (navy e dourado nos dois temas, hero com mensagem clara). Como montra para uma empresa de tecnologia ainda tem pouca credibilidade: um só projecto e nenhuma prova social. Há também alguns defeitos de usabilidade e de ritmo vertical.

## Prioridade alta

1. **O menu mobile tapa os próprios controlos** (abaixo de 1024px). O painel (`.mobile-nav`, `z-index: 950`) fica por cima do cabeçalho (`z-index: 900`) e esconde o botão do menu e o de tema. Não há botão para fechar e o CTA não aparece no menu.
   - Correcção: subir o cabeçalho ou os controlos acima do painel (por exemplo `z-index: 960`) e acrescentar o CTA ao fundo do menu.
2. **Credibilidade.** Há um só projecto, "Em desenvolvimento", com uma capa genérica. Não há clientes, números, testemunhos, dados da empresa (telefone, NIF) nem rodapé completo.
   - Sugestão: uma faixa de clientes ou números por baixo do hero, screenshots reais dos projectos, e telefone ou WhatsApp no Contacto e no rodapé.
3. **Espaço vertical a mais.** `.section { padding-block: var(--space-10) }` dá 128px em cima e em baixo em todas as larguras acima de 760px, ou seja, cerca de 256px entre secções.
   - Correcção: `padding-block: clamp(4rem, 8vw, 7rem)` e `.section-head { margin-bottom: clamp(2rem, 4vw, 4rem) }`.
4. **Botão "voltar ao topo" em mobile.** Tapa os ícones + / − do acordeão do Sobre e outros conteúdos.
   - Correcção: escondê-lo abaixo de 760px ou mostrá-lo só depois de bastante scroll.
5. **Texto pequeno ou com pouco contraste.**
   - Tema escuro: `--text-faint` (#6E6E68 sobre #0A0A0C) dá cerca de 3.7:1, abaixo do mínimo AA (4.5:1). Afecta os títulos e o copyright do rodapé, o eyebrow do hero, as legendas do contacto e o "Descer".
   - Os botões PT/EN/FR inactivos dão cerca de 4.1:1, nos dois temas.
   - Vários rótulos mono têm 11.5px e o texto dos cards tem 15px.
   - Correcção: clarear `--text-faint` no tema escuro (cerca de #8A8A82) e escurecê-lo no claro (cerca de #5E5E56). Usar no mínimo 12–13px nos rótulos e 1rem nos cards.
6. **Alinhamentos inconsistentes.**
   - Contacto: o bloco está centrado (760px), mas o texto está alinhado à esquerda e os botões centrados.
   - Projectos: o card único está centrado debaixo de um título alinhado à esquerda.
   - Sobre, a 768px: a coluna de 640px fica encostada à esquerda.

## Prioridade média

7. **Alvos de toque entre 761 e 1023px.** O menu e o botão de tema têm 36px, os botões de língua 33x29 e os links do rodapé 21px de altura. A regra dos 44px só se aplica abaixo de 760px, mas o menu hambúrguer aparece abaixo de 1024px.
   - Correcção: mover essa regra para `max-width: 1023px` ou `pointer: coarse`.
8. **Fontes não carregadas.** O CSS declara Space Grotesk, Inter e JetBrains Mono, mas nenhum ficheiro de fonte é carregado. Quem não as tiver instaladas vê fontes do sistema.
   - Correcção: alojar os ficheiros WOFF2 no site, com `font-display: swap` e preload.
9. **Typewriter do hero.** Quando a palavra está vazia aparece "digitais |.", e o número de linhas do título muda conforme a palavra.
   - Correcção: reservar a altura do título.
10. **Hero.** O subtítulo é estreito e pequeno e o eyebrow é muito discreto.
    - Sugestão: `max-width: 56ch`, um tamanho maior e uma linha de credibilidade por baixo dos CTAs.
11. **Cards de serviços.** As etiquetas quebram de forma desigual. Os cards também não têm link, por isso os links do dropdown param em cards sem acção.
    - Sugestão: um link "Saber mais" ou um CTA em cada card.
12. **Modal de projecto.** O botão "Fechar" não está alinhado ao canto do painel e o diálogo não tem `aria-labelledby`.
13. **Rodapé.** Os ícones sociais levam a `#`, o que faz scroll até ao topo: convém escondê-los até haver URLs. O lema repete o do hero.
    - Sugestão: acrescentar telefone e morada.

## Prioridade baixa

- **CTA com dois textos:** "Fale connosco" no menu e no Contacto, mas "Falar connosco" no hero. Convém uniformizar.
- O copyright diz "© 2026 DIAH"; deveria dizer "DIAH Solutions".
- Os títulos do rodapé são `<h4>` sem `<h3>` antes.
- Usar dourado nos pontos dos eyebrows também no tema claro, para reforçar a marca.
- O menu mobile não tem focus trap (não testado).
- EN e FR não têm overflow em nenhuma largura. Nada a corrigir.

## O que está bem e deve ficar

- O sistema navy e dourado: navy para texto no tema claro, dourado a 10:1 no tema escuro.
- Bom contraste no texto principal e linhas com largura confortável.
- A mensagem do hero e os CTAs estão visíveis logo no primeiro ecrã.
- Os logótipos têm variantes por tema e o alt correcto.
- Não há overflow horizontal em nenhuma largura.
- Skip link, `aria-expanded` e foco visível.
- Os breakpoints fazem sentido.
