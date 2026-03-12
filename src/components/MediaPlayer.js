import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { WebView } from 'react-native-webview';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

/** Format milliseconds to M:SS */
const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

// ─── Direct video: expo-video (only rendered when we have videoUri)
const DirectVideoPlayer = ({ uri, title, subtitle, autoPlay, style, videoHeight }) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    if (autoPlay) p.play();
  });
  return (
    <View style={[styles.container, style]}>
      <VideoView
        style={[styles.videoView, { height: videoHeight }]}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
        nativeControls
      />
      {(title || subtitle) && (
        <View style={styles.videoInfo}>
          {title && <Text style={styles.videoTitle}>{title}</Text>}
          {subtitle && <Text style={styles.videoSubtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

// ─── Direct audio: expo-audio (only rendered when we have audioUri)
const DirectAudioPlayer = ({
  uri,
  title,
  subtitle,
  poster,
  autoPlay,
  style,
  onEnd,
}) => {
  const player = useAudioPlayer(uri, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (autoPlay && status.isLoaded) player.play();
  }, [autoPlay, status.isLoaded, player]);

  useEffect(() => {
    if (status.didJustFinish && !status.loop && onEnd) {
      onEnd();
    }
  }, [status.didJustFinish, status.loop, onEnd]);

  const toggle = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const positionMs = status.currentTime * 1000;
  const durationMs = status.duration * 1000;
  const progress = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;
  const thumbnailUrl = poster;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.audioCard}>
        <View style={styles.audioChrome}>
          <View style={styles.audioInfo}>
            {thumbnailUrl ? (
              <Image source={{ uri: thumbnailUrl }} style={styles.audioPoster} contentFit="cover" />
            ) : (
              <View style={[styles.audioPoster, styles.audioPosterPlaceholder]}>
                <Ionicons name="musical-notes" size={32} color="rgba(255,255,255,0.6)" />
              </View>
            )}
            <View style={styles.audioText}>
              {title && <Text style={styles.audioTitle} numberOfLines={2}>{title}</Text>}
              {subtitle && <Text style={styles.audioSubtitle} numberOfLines={1}>{subtitle}</Text>}
            </View>
          </View>
          {!status.isLoaded ? (
            <View style={styles.audioControls}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <View style={styles.audioControls}>
              <Pressable style={styles.playButton} onPress={toggle}>
                <Ionicons name={status.playing ? 'pause' : 'play'} size={36} color="#fff" />
              </Pressable>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.timeText}>
                {formatTime(positionMs)} / {formatTime(durationMs)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

/** MediaPlayer: YouTube { type:'youtube', videoId } or direct URI { type:'uri', uri } with mode 'video'|'audio' */
const MediaPlayer = ({
  source,
  mode = 'video',
  title,
  subtitle,
  poster,
  autoPlay = false,
  style,
  onEnd,
}) => {
  const { width, height } = useWindowDimensions();

  const isYouTube = source?.type === 'youtube' && source?.videoId;
  const isDirectUri = source?.type === 'uri' && source?.uri;
  const videoUri = isDirectUri && mode === 'video' ? source.uri : null;
  const audioUri = isDirectUri && mode === 'audio' ? source.uri : null;

  const videoHeight = Math.max(200, Math.min(height * 0.5, width * (9 / 16)));

  if (videoUri) {
    return (
      <DirectVideoPlayer
        uri={videoUri}
        title={title}
        subtitle={subtitle}
        autoPlay={autoPlay}
        style={style}
        videoHeight={videoHeight}
      />
    );
  }

  if (audioUri) {
    return (
      <DirectAudioPlayer
        uri={audioUri}
        title={title}
        subtitle={subtitle}
        poster={poster}
        autoPlay={autoPlay}
        style={style}
        onEnd={onEnd}
      />
    );
  }

  const thumbnailUrl = isYouTube
    ? `https://img.youtube.com/vi/${source.videoId}/mqdefault.jpg`
    : poster;

  if (isYouTube) {
    const embedUrl = `https://www.youtube.com/embed/${source.videoId}?autoplay=${autoPlay ? 1 : 0}&playsinline=1&rel=0`;
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
      <View style={[styles.container, style]}>
        <View style={[styles.videoWrap, mode === 'audio' && styles.audioWrap]}>
          <WebView
            source={{ html: htmlSource, baseUrl: 'https://www.youtube.com/' }}
            originWhitelist={['*']}
            style={[
              styles.webview,
              mode === 'video' && { height: videoHeight },
              mode === 'audio' && { height: 180 },
            ]}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            scrollEnabled={false}
            domStorageEnabled
            startInLoadingState
            mixedContentMode="compatibility"
            renderLoading={() => (
              <View style={[styles.loading, { height: mode === 'video' ? videoHeight : 120 }]}>
                <ActivityIndicator size="large" color="#2E7D32" />
              </View>
            )}
          />
          {mode === 'audio' && (
            <View style={styles.audioCard}>
              <View style={styles.audioChrome}>
                <View style={styles.audioInfo}>
                  {thumbnailUrl && (
                    <Image source={{ uri: thumbnailUrl }} style={styles.audioPoster} contentFit="cover" />
                  )}
                  <View style={styles.audioText}>
                    {title && <Text style={styles.audioTitle} numberOfLines={2}>{title}</Text>}
                    {subtitle && <Text style={styles.audioSubtitle} numberOfLines={1}>{subtitle}</Text>}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.centered, style]}>
      <Ionicons name="videocam-off-outline" size={48} color="#9CA3AF" />
      <Text style={styles.error}>No valid source provided</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrap: {
    flex: 1,
    position: 'relative',
  },
  audioWrap: {
    flex: 1,
  },
  webview: { width: '100%', backgroundColor: '#000' },
  videoView: { width: '100%', backgroundColor: '#000' },
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
    minHeight: 120,
  },
  error: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  videoInfo: {
    padding: 12,
    backgroundColor: '#fff',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  videoSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  audioCard: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 16,
  },
  audioChrome: {
    gap: 12,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  audioPoster: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  audioPosterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioText: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  audioSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  audioControls: {
    gap: 8,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});

export default MediaPlayer;
