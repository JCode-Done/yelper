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
import { useTheme } from '../context/ThemeContext';

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

const buildChartHtml = (data, palette) => {
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
          borderColor: '${palette.series}',
          backgroundColor: '${palette.seriesFill}',
          borderWidth: 2,
          pointBackgroundColor: '${palette.series}',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '${palette.seriesHover}'
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
            pointLabels: { font: { size: 10 }, color: '${palette.axisLabel}' },
            grid: { color: '${palette.grid}' },
            angleLines: { color: '${palette.angleLines}' }
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

const buildBarChartHtml = (data, palette) => {
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
          backgroundColor: '${palette.barFill}',
          borderColor: '${palette.barBorder}',
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
            grid: { color: '${palette.barGrid}' },
            ticks: { font: { size: 10 }, color: '${palette.xTicks}' }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 9 }, color: '${palette.yTicks}', maxRotation: 0 }
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
  const { colors, isDark } = useTheme();

  const chartPalette = isDark
    ? {
        // Series colors pulled from dark theme
        series: colors.chartSeries,
        seriesFill: colors.chartSeriesFill,
        seriesHover: colors.chartSeriesHover,
        barFill: colors.chartBarFill,
        barBorder: colors.chartBarBorder,
        // Axes / grid for dark background
        axisLabel: '#E5E7EB',
        grid: 'rgba(148, 163, 184, 0.35)',
        angleLines: 'rgba(148, 163, 184, 0.6)',
        barGrid: 'rgba(148, 163, 184, 0.35)',
        xTicks: '#D1D5DB',
        yTicks: '#E5E7EB',
      }
    : {
        // Series colors pulled from light theme (green palette)
        series: colors.chartSeries,
        seriesFill: colors.chartSeriesFill,
        seriesHover: colors.chartSeriesHover,
        barFill: colors.chartBarFill,
        barBorder: colors.chartBarBorder,
        axisLabel: '#374151',
        grid: 'rgba(55, 65, 81, 0.15)',
        angleLines: 'rgba(55, 65, 81, 0.2)',
        barGrid: 'rgba(55, 65, 81, 0.1)',
        xTicks: '#6B7280',
        yTicks: '#374151',
      };

  const radarHtml = buildChartHtml(data, chartPalette);
  const barHtml = buildBarChartHtml(data, chartPalette);

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
        <Animated.View
          style={[
            styles.card,
            styles.cardContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            cardAnimatedStyle,
          ]}
        >
          {showBarChart ? (
            <View style={styles.barChartUnflip}>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary },
                ]}
              >
                {backTitle}
              </Text>
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
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary },
                ]}
              >
                {title}
              </Text>
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
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
    borderWidth: 1,
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
