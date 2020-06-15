import * as React from 'react';
import {View, Animated, StyleProp, ViewStyle} from 'react-native';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {SharkButton} from '@components/shark-button';

interface StageButtonToggleProps {
  isStage: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  animTiming?: number;
  onStageAll: () => void;
  onStage: () => void;
}
export const StageButtonToggle = ({
  isStage,
  buttonStyle,
  animTiming = 150,
  onStageAll,
  onStage,
}: StageButtonToggleProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  /**
   * To make sure the content does not appear to shrink visually
   * when hiding, we are finding the height of the bottom layer
   * and setting that directly using onLayout
   */
  const [stageWidth, setStageWidth] = React.useState(0);
  const [stageAllWidth, setStageAllWidth] = React.useState(0);

  const [animatedWidth] = React.useState(new Animated.Value(0));
  const [stageAllOpacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isStage) {
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue: stageWidth,
          duration: animTiming,
          useNativeDriver: false,
        }),
        Animated.timing(stageAllOpacity, {
          toValue: 0,
          duration: animTiming,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue: stageAllWidth,
          duration: animTiming,
          useNativeDriver: false,
        }),
        Animated.timing(stageAllOpacity, {
          toValue: 1,
          duration: animTiming,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [
    isStage,
    stageAllOpacity,
    animTiming,
    animatedWidth,
    stageAllWidth,
    stageWidth,
  ]);

  return (
    <>
      <Animated.View
        style={[
          styles.textContainer,
          {
            width: animatedWidth,
          },
        ]}>
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: stageAllOpacity,
            },
          ]}>
          <SharkButton
            onPress={onStageAll}
            text={'Stage all'}
            textProps={{numberOfLines: 1}}
            style={buttonStyle}
          />
        </Animated.View>

        <View style={styles.buttonContainer}>
          <SharkButton
            onPress={onStage}
            text={'Stage'}
            textProps={{numberOfLines: 1}}
            style={buttonStyle}
          />
        </View>
      </Animated.View>
      {/* Unrender the children once the height is calcuated */}
      {/* This is the children to grab the height from. It's rendered */}
      {/* Offscreen, then we unrender it. This is because the `animatedHeight` is */}
      {/* Set to `0` and the children are set to `0` as a result. This fixes that */}
      {!stageWidth && (
        <View
          style={styles.offscreenView}
          onLayout={event => {
            const {width: eventWidth} = event.nativeEvent.layout;
            setStageWidth(eventWidth);
          }}>
          <SharkButton
            onPress={() => {}}
            text={'Stage'}
            textProps={{numberOfLines: 1}}
            style={buttonStyle}
          />
        </View>
      )}
      {!stageAllWidth && (
        <View
          style={styles.offscreenView}
          onLayout={event => {
            const {width: eventWidth} = event.nativeEvent.layout;
            setStageAllWidth(eventWidth);
          }}>
          <SharkButton
            onPress={() => {}}
            text={'Stage All'}
            textProps={{numberOfLines: 1}}
            style={buttonStyle}
          />
        </View>
      )}
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  textContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  offscreenView: {
    position: 'absolute',
    right: '5000%',
  },
});
