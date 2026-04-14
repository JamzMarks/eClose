# react-native-maps no eClose (mobile)

Este guia explica o que foi ligado no código e o que **precisas de configurar** para o mapa funcionar em desenvolvimento e em builds de produção.

## O que já está implementado

- **Dependência:** `react-native-maps` (versão alinhada ao Expo SDK com `pnpm exec expo install react-native-maps`).
- **UI:** `src/components/tabs/explore/explore-map-view.tsx` — `MapView` em iOS/Android; no **web** mostra o texto `discover.mapWebFallback` (o módulo nativo não é carregado no bundle web).
- **Estado:** `onRegionChangeComplete` e região inicial actualizam `MapViewportProvider` (`setViewportRegion`) para alinhar com `src/lib/maps/` e pedidos à API por bbox (ver `docs/MAP_DISCOVER_BACKEND.md`).
- **Região inicial:** `useSuggestedExploreRegion()` (GPS se disponível, senão área em Portugal).

## Expo Go vs development build vs loja

| Ambiente | Notas |
|----------|--------|
| **Expo Go** | O cliente Expo inclui suporte nativo a `react-native-maps`; podes testar o mapa sem fazer `prebuild` local. |
| **Development build** (`expo run:ios` / `expo run:android` ou EAS) | Necessário quando adicionas outras libs nativas ou queres o mesmo binário que em produção. |
| **Google Play / App Store** | Em **Android**, o teu próprio binário precisa de **Maps SDK for Android** com chave válida (ver abaixo). |

## Android — chave Google Maps

O `react-native-maps` usa **Google Maps** no Android. No `app.json` está:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "REPLACE_WITH_GOOGLE_MAPS_ANDROID_API_KEY"
    }
  }
}
```

1. No [Google Cloud Console](https://console.cloud.google.com/), cria ou escolhe um projeto.
2. Activa **Maps SDK for Android**.
3. Cria uma **API key** e restringe-a (recomendado) ao `applicationId` do Android e ao SHA-1 de debug/release.
4. Substitui o placeholder pelo valor real **antes** de gerar o AAB/APK de produção.
5. Volta a correr `npx expo prebuild` (se usas prebuild local) ou deixa o EAS aplicar o `app.json` no build.

> **Nota:** A versão actual de `react-native-maps` (1.20.x) **não expõe** um config plugin Expo (`app.plugin.js`). Por isso **não** há entrada em `expo.plugins` para esta lib — a chave vai em `android.config.googleMaps` como acima.

## iOS — Apple Maps por defeito

Com o código actual **não** usamos `provider={PROVIDER_GOOGLE}` no `MapView`. Por omissão, no **iOS** o sistema usa **MapKit (Apple Maps)**, sem chave Google.

Se no futuro quiseres **Google Maps também no iOS**, terás de:

- Activa **Maps SDK for iOS** no Google Cloud.
- Criar chave restrita ao **Bundle Identifier** iOS.
- Passar `provider={PROVIDER_GOOGLE}` no `MapView` e injectar a chave no projecto iOS (via `app.config` / `Info.plist` / plugin quando existir suporte estável).

## Localização do utilizador no mapa

`showsUserLocation` está activo. Garante:

- Permissões de localização já tratadas por `expo-location` e `react-native-permissions` / mensagens no `app.json`.
- Em iOS, a string `NSLocationWhenInUseUsageDescription` vem do plugin `expo-location`.

## Web

O mapa interactivo **não** é inicializado no web (`Platform.OS === 'web'`), para evitar erros de módulo nativo. O utilizador vê o fallback traduzido.

## Checklist rápido

- [ ] Substituir `REPLACE_WITH_GOOGLE_MAPS_ANDROID_API_KEY` para builds Android próprios (loja ou APK de teste com pacote final).
- [ ] Confirmar billing / APIs activas no Google Cloud se o mapa Android aparecer vazio ou cor de fundo sem tiles.
- [ ] (Opcional) Ligar pins e `GET` por bbox conforme `MAP_DISCOVER_BACKEND.md`.
