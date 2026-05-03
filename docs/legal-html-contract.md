# Contrato HTML para páginas legais (eClose mobile)

As páginas referidas por `privacyPolicyUrl` e `termsOfServiceUrl` são carregadas num **WebView** dentro da app. A app envia query params:

| Parâmetro    | Valores        | Uso sugerido                                      |
|-------------|----------------|---------------------------------------------------|
| `app_lang`  | `pt` \| `en`   | Escolher idioma ou redirecionar para path localizado |
| `app_theme` | `light` \| `dark` | Ajustar cores (fundo, texto, tabelas)          |

## Semântica e acessibilidade

- Um único `h1` com o título do documento; secções com `h2`/`h3` hierárquicos.
- Atributo `lang` no `<html>` alinhado ao conteúdo (ex.: `lang="pt"`).
- Contraste WCAG AA em texto normal e em links.
- Links com texto descritivo (evitar só “clique aqui”).

## Tabelas

- Envolver tabelas largas num contentor com `overflow-x: auto` para scroll horizontal em ecrãs estreitos.
- Cabeçalhos de coluna com `<th scope="col">` quando aplicável.
- Evitar tabelas para layout de página inteira.

## Imagens

- `width`/`height` ou `max-width: 100%; height: auto;` para não estourar a viewport.
- `alt` descritivo; decorativas com `alt=""`.

## Links

- **Mesmo domínio** que o documento inicial: navegação mantém-se no WebView.
- **Outros domínios HTTPS**: a app abre no browser do sistema (`expo-web-browser`).
- **`mailto:` / `tel:` / `sms:`**: abertos com a app nativa.

## Tema claro / escuro

- Preferir CSS com `@media (prefers-color-scheme: dark)` **ou** ler `app_theme` e aplicar classe no `<body>` (ex.: `theme-dark`).
- Fundo e texto devem respeitar o tema escolhido para leitura prolongada.

## Versão legal

- O texto deve estar alinhado com as versões expostas na app (`legalTermsVersion` / `legalPrivacyVersion` em `expo.extra`), referenciadas no cabeçalho do modal.

## Cópia offline

- A app inclui HTML mínimo em `assets/legal/` como fallback (resolvido via `Image.resolveAssetSource` para URI no WebView). Links `http`/`https` a partir dessa cópia abrem no browser do sistema, não dentro do WebView.
- O conteúdo canónico continua a ser o publicado nas URLs de produção.
