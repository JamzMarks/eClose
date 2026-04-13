import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View,
  type ColorValue,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WebView, type WebViewNavigation } from "react-native-webview";

import { OutlineButton, PrimaryButton } from "@/components/ui";
import { AppPalette } from "@/constants/palette";

export type LegalWebDocumentViewerProps = {
  /** URL principal (HTTPS ou file:// após resolver asset). */
  uri: string;
  backgroundColor: ColorValue;
  /** Cópia offline opcional (file://) após falha da rede. */
  fallbackFileUri?: string | null;
  retryLabel: string;
  openInBrowserLabel: string;
  loadErrorMessage: string;
  offlineFallbackLabel: string;
};

function trustedNavigationTarget(
  url: string,
  trustedHost: string | null,
  documentIsLocalFile: boolean,
): "allow" | "external_browser" | "system_link" {
  if (url.startsWith("about:") || url.startsWith("blob:") || url.startsWith("data:")) {
    return "allow";
  }
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("sms:")) {
    return "system_link";
  }
  if (url.startsWith("file://") || url.startsWith("content://")) {
    return "allow";
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "system_link";
    }
    /** Documento empacotado: não seguir http(s) no WebView (abrir no browser). */
    if (documentIsLocalFile) {
      return "external_browser";
    }
    if (!trustedHost) {
      return "allow";
    }
    if (parsed.host === trustedHost) {
      return "allow";
    }
    return "external_browser";
  } catch {
    return "allow";
  }
}

/**
 * WebView para documentos legais HTML: loading, erro/retry, fallback offline, links externos no browser.
 */
export function LegalWebDocumentViewer({
  uri,
  backgroundColor,
  fallbackFileUri,
  retryLabel,
  openInBrowserLabel,
  loadErrorMessage,
  offlineFallbackLabel,
}: LegalWebDocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeUri, setActiveUri] = useState(uri);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  useEffect(() => {
    setActiveUri(uri);
    setFallbackAttempted(false);
    setLoadError(false);
    setLoading(true);
  }, [uri]);

  const trustedHost = useMemo(() => {
    try {
      if (activeUri.startsWith("file://") || activeUri.startsWith("content://")) {
        return null;
      }
      return new URL(activeUri).host;
    } catch {
      return null;
    }
  }, [activeUri]);

  const documentIsLocalFile = useMemo(
    () => activeUri.startsWith("file://") || activeUri.startsWith("content://"),
    [activeUri],
  );

  const handleShouldStart = useCallback(
    (request: WebViewNavigation) => {
      const target = trustedNavigationTarget(request.url, trustedHost, documentIsLocalFile);
      if (target === "allow") {
        return true;
      }
      if (target === "system_link") {
        void Linking.openURL(request.url).catch(() => {});
        return false;
      }
      void WebBrowser.openBrowserAsync(request.url).catch(() => {});
      return false;
    },
    [trustedHost, documentIsLocalFile],
  );

  const tryOfflineFallback = useCallback(() => {
    if (!fallbackFileUri || fallbackAttempted) return;
    setFallbackAttempted(true);
    setLoadError(false);
    setLoading(true);
    setActiveUri(fallbackFileUri);
  }, [fallbackFileUri, fallbackAttempted]);

  const retryRemote = useCallback(() => {
    setFallbackAttempted(false);
    setLoadError(false);
    setLoading(true);
    setActiveUri(uri);
  }, [uri]);

  const openInBrowser = useCallback(() => {
    void WebBrowser.openBrowserAsync(activeUri).catch(() => {});
  }, [activeUri]);

  if (loadError) {
    return (
      <View style={[styles.errorWrap, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: AppPalette.error }]}>{loadErrorMessage}</Text>
        <View style={styles.errorActions}>
          <PrimaryButton title={retryLabel} onPress={retryRemote} fullWidth accessibilityLabel={retryLabel} />
          {fallbackFileUri && !fallbackAttempted ? (
            <OutlineButton title={offlineFallbackLabel} onPress={tryOfflineFallback} fullWidth />
          ) : null}
          <OutlineButton title={openInBrowserLabel} onPress={openInBrowser} fullWidth />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.webWrap}>
      {loading ? (
        <View style={[styles.webLoading, { backgroundColor }]}>
          <ActivityIndicator size="large" color={AppPalette.primary} />
        </View>
      ) : null}
      <WebView
        key={activeUri}
        source={{ uri: activeUri }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
          setLoadError(false);
        }}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        onHttpError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        onShouldStartLoadWithRequest={handleShouldStart}
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  errorWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  errorActions: {
    gap: 12,
    marginTop: 8,
  },
});
