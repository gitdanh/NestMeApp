import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

export const UserSkeleton = ({ width, height }) => {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Animated.View style={[{ opacity: opacity.current, height: 50, width: 50 }, styles.skeleton]} />
        <View>
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 150, marginBottom: 10 }, styles.skeleton]} />
          <Animated.View style={[{ opacity: opacity.current, height: 20, width: 250 }, styles.skeleton]} />
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'gray',
    borderRadius: 50,
    marginLeft: 20,
  },
});