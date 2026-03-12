import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoPlayerScreen = ({ route, navigation }) => {
  const { videoId, title } = route?.params ?? {};
  const { width, height } = useWindowDimensions();

  useLayoutEffect(() => {
    if (title && navigation?.setOptions) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  if (!videoId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No video selected</Text>
      </View>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
  const videoHeight = Math.max(200, Math.min(height * 0.5, width * (9 / 16)));
  const htmlSource = `
    <!DOCTYPE html>
    <html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;background:#000;">
      <iframe width="100%" height="100%" src="${embedUrl}" frameborder="0"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
        allowfullscreen></iframe>
    </body></html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlSource, baseUrl: 'https://www.youtube.com/' }}
        originWhitelist={['*']}
        style={[styles.webview, { height: videoHeight }]}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        scrollEnabled={false}
        domStorageEnabled
        startInLoadingState
        mixedContentMode="compatibility"
        renderLoading={() => (
          <View style={[styles.loading, { height: videoHeight }]}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    width: '100%',
    backgroundColor: '#000',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  error: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default VideoPlayerScreen;
