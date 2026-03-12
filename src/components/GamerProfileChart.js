import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

const CHART_LABELS = [
  'Strategy',
  'Abstract',
  'Worker Placement',
  'Trick-taking',
  'Resource Mgmt',
  'Card Games',
  'Area Control',
  'Euro',
  'Campaign',
  'Ameritrash',
];

const CHART_KEYS = [
  'strategy',
  'abstract',
  'workerPlacement',
  'trickTaking',
  'resourceManagement',
  'cardGames',
  'areaControl',
  'euro',
  'campaign',
  'ameritrash',
];

const DEFAULT_DATA = {
  strategy: 75,
  abstract: 50,
  workerPlacement: 85,
  trickTaking: 60,
  resourceManagement: 90,
  cardGames: 65,
  areaControl: 70,
  euro: 88,
  campaign: 55,
  ameritrash: 45,
};

const buildChartHtml = (data) => {
  const values = CHART_KEYS.map((k) => Math.min(100, Math.max(0, data[k] ?? 0)));
  const labelsJson = JSON.stringify(CHART_LABELS);
  const valuesJson = JSON.stringify(values);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; display: flex; align-items: center; justify-content: center; min-height: 260px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .chart-wrap { width: 100%; max-width: 320px; height: 240px; padding: 8px; }
  </style>
</head>
<body>
  <div class="chart-wrap">
    <canvas id="radar"></canvas>
  </div>
  <script>
    const labels = ${labelsJson};
    const values = ${valuesJson};
    const ctx = document.getElementById('radar').getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Interest',
          data: values,
          borderColor: '#2E7D32',
          backgroundColor: 'rgba(46, 125, 50, 0.25)',
          borderWidth: 2,
          pointBackgroundColor: '#2E7D32',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#1B5E20'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            pointLabels: { font: { size: 10 }, color: '#374151' },
            grid: { color: 'rgba(55, 65, 81, 0.15)' },
            angleLines: { color: 'rgba(55, 65, 81, 0.2)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  </script>
</body>
</html>
  `.trim();
};

const buildBarChartHtml = (data) => {
  const values = CHART_KEYS.map((k) => Math.min(100, Math.max(0, data[k] ?? 0)));
  const labelsJson = JSON.stringify(CHART_LABELS);
  const valuesJson = JSON.stringify(values);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; display: flex; align-items: center; justify-content: center; min-height: 260px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .chart-wrap { width: 100%; max-width: 320px; height: 240px; padding: 8px; }
  </style>
</head>
<body>
  <div class="chart-wrap">
    <canvas id="bar"></canvas>
  </div>
  <script>
    const labels = ${labelsJson};
    const values = ${valuesJson};
    const ctx = document.getElementById('bar').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Interest',
          data: values,
          backgroundColor: 'rgba(46, 125, 50, 0.7)',
          borderColor: '#2E7D32',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(55, 65, 81, 0.1)' },
            ticks: { font: { size: 10 }, color: '#6B7280' }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 9 }, color: '#374151', maxRotation: 0 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  </script>
</body>
</html>
  `.trim();
};

/**
 * Reusable gamer profile chart card with flip: radar (front) and bar (back with "Adventurous Gamer").
 * @param {Object} props
 * @param {Object} [props.data] - Data points for both charts
 * @param {string} [props.title] - Front card title (default "Your Gaming Profile")
 * @param {string} [props.backTitle] - Back card title (default "Adventurous Gamer")
 */
const FLIP_THRESHOLD = 144; // 80% of 180deg

const GamerProfileChart = ({
  data = DEFAULT_DATA,
  title = 'Your Gaming Profile',
  backTitle = 'Adventurous Gamer',
}) => {
  const rotation = useSharedValue(0);
  const [showBarChart, setShowBarChart] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const radarHtml = buildChartHtml(data);
  const barHtml = buildBarChartHtml(data);

  useAnimatedReaction(
    () => rotation.value >= FLIP_THRESHOLD,
    (shouldShowBar) => {
      runOnJS(setShowBarChart)(shouldShowBar);
    },
  );

  const flip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    rotation.value = withSpring(nextFlipped ? 180 : 0, {
      damping: 15,
      stiffness: 120,
    });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value}deg` }],
  }));

  return (
    <Pressable onPress={flip} style={styles.pressable}>
      <View style={styles.perspective}>
        <Animated.View style={[styles.card, styles.cardContainer, cardAnimatedStyle]}>
          {showBarChart ? (
            <View style={styles.barChartUnflip}>
              <Text style={styles.title}>{backTitle}</Text>
              <View style={styles.chartWrapper}>
                <WebView
                  source={{ html: barHtml }}
                  style={styles.webview}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  originWhitelist={['*']}
                  javaScriptEnabled
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.chartWrapper}>
                <WebView
                  source={{ html: radarHtml }}
                  style={styles.webview}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  originWhitelist={['*']}
                  javaScriptEnabled
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  perspective: {
    transformStyle: 'preserve-3d',
  },
  card: {
    overflow: 'visible',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardContainer: {
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartWrapper: {
    height: 260,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barChartUnflip: {
    transform: [{ scaleX: -1 }],
    flex: 1,
  },
  webview: {
    height: 260,
    backgroundColor: 'transparent',
  },
});

export default GamerProfileChart;
export { CHART_KEYS, CHART_LABELS };
