import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonCard = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 180],
  });

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonTeamBlock}>
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX }] }
            ]}
          />
        </View>
        <View style={styles.skeletonVS}>
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX }] }
            ]}
          />
        </View>
        <View style={styles.skeletonTeamBlock}>
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX }] }
            ]}
          />
        </View>
      </View>
      <View style={styles.skeletonStatus}>
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX }] }
          ]}
        />
      </View>
      <View style={styles.skeletonInfo}>
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX }] }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    height: 180,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    padding: 14,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonTeamBlock: {
    width: 70,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  skeletonVS: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  skeletonStatus: {
    width: 90,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  skeletonInfo: {
    width: '60%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 8,
  },
});

export default SkeletonCard;
