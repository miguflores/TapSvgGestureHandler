import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, {Circle, G, Text, TSpan} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const App = () => {
  const offset = useSharedValue({x: 0, y: 0});
  const start = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: scale.value},
        {rotateZ: `${rotation.value}rad`},
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    dragGesture,
    Gesture.Simultaneous(zoomGesture, rotateGesture),
  );

  return (
    <View style={styles.root}>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.root}>
          <AnimatedSvg style={[styles.svg, animatedStyles]}>
            <G>
              <PanelsList panels={[1, 2, 3]} />
            </G>
          </AnimatedSvg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const PanelsList = ({panels}: {panels: any}) => {
  return panels.map((panel: any, index: number) => {
    return (
      <G
        key={`${panel}-${index}`}
        onPressIn={() => {
          console.log(`touch event in ${panel}`);
        }}
        delayPressIn={Platform.OS === 'ios' ? 400 : 5}
        x={panel * 60}
        y={panel * 60}>
        <Circle r={30} fill="white" stroke="purple" strokeWidth={5} />
        <Text
          fontSize={14}
          textAnchor="middle"
          stroke={'#000'}
          fill={'#000'}
          x={0}
          y={0}>
          <TSpan cy={0} cx={0} fontWeight={'100'}>
            {panel}
          </TSpan>
        </Text>
      </G>
    );
  });
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'blue',
  },
  svg: {
    height: 300,
    width: 300,
    backgroundColor: 'skyblue',
  },
});

const MAAAIN = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <App />
    </GestureHandlerRootView>
  );
};

export default MAAAIN;
