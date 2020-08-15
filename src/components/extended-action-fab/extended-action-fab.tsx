import {Animated, TouchableWithoutFeedback, View} from 'react-native';
import * as React from 'react';
import {MutableRefObject} from 'react';
import {theme} from '@constants';
import {Surface} from 'react-native-paper';
import {NavigationAwarePortal} from '../navigation-aware-portal';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';

type ActionFabReactNode = (toggleAnimation: () => void) => React.ReactNode;

interface ExtendedActionFabProps {
  fab: ActionFabReactNode;
  fabActions: ActionFabReactNode;
  fabBottom?: MutableRefObject<Animated.Value>;
  scale?: MutableRefObject<Animated.Value>;
}

export const ExtendedActionFab = ({
  fab,
  fabActions,
  fabBottom: fabBottomProps,
  scale: scaleProps,
}: ExtendedActionFabProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const [extended, setExtended] = React.useState(false);
  const [fabSize, setFabSize] = React.useState({height: 0, width: 0});
  const [fabActionSize, setFabActionSize] = React.useState({
    height: 0,
    width: 0,
  });
  const fabPanelHeight = React.useRef(new Animated.Value(190));
  const actionSizeOpacity = React.useRef(new Animated.Value(0));
  const fabOpacity = React.useRef(new Animated.Value(1));
  const fabBottomLocal = React.useRef(new Animated.Value(16));
  const fabBottom = fabBottomProps || fabBottomLocal;
  const scaleLocal = React.useRef(new Animated.Value(1));
  // This code did work previously, leaving it there so we can quickly enable it again when it works
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scale = scaleProps || scaleLocal;

  React.useEffect(() => {
    const height =
      fabSize.height < fabActionSize.height
        ? fabSize.height
        : fabActionSize.height;

    fabPanelHeight.current = new Animated.Value(height);
  }, [fabSize.height, fabActionSize.height]);

  const width =
    fabSize.width > fabActionSize.width ? fabSize.width : fabActionSize.width;

  const toggleAnimation = React.useCallback(() => {
    if (extended) {
      Animated.parallel([
        Animated.timing(fabPanelHeight.current, {
          toValue: fabSize.height,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(actionSizeOpacity.current, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(fabOpacity.current, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setExtended(false);
      });
    } else {
      Animated.parallel([
        Animated.timing(fabPanelHeight.current, {
          toValue: fabActionSize.height,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(actionSizeOpacity.current, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(fabOpacity.current, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setExtended(true);
      });
    }
  }, [fabActionSize.height, fabSize.height, extended]);

  const animatedHeight = {
    width: width,
    height: fabPanelHeight.current,
  };

  const animatedFab = {
    opacity: fabOpacity.current,
  };

  const animatedFabActions = {
    opacity: actionSizeOpacity.current,
    width,
    // If this is not present, the actions will overlay the FAB and cause presses to not be passed
    marginBottom: extended ? 0 : 1000,
  };

  const fabDisplay = React.useMemo(() => fab(toggleAnimation), [
    fab,
    toggleAnimation,
  ]);
  const fabActionDisplay = React.useMemo(() => fabActions(toggleAnimation), [
    fabActions,
    toggleAnimation,
  ]);

  const fabBottomStyle = {
    bottom: fabBottom.current,
    // TODO: FIXME // https://github.com/facebook/react-native/issues/19637
    // scaleX: scale.current,
    // scaleY: scale.current,
  };

  return (
    <NavigationAwarePortal>
      <Animated.View style={[styles.mainContainer, fabBottomStyle]}>
        <Surface style={styles.fabSurface}>
          <Animated.View style={animatedHeight}>
            <Animated.View style={[styles.fabContents, animatedFab]}>
              <View
                onLayout={event => {
                  const {height, width: eventWidth} = event.nativeEvent.layout;
                  setFabSize({height, width: eventWidth});
                }}>
                {fabDisplay}
              </View>
            </Animated.View>
            <Animated.View style={[styles.fabContents, animatedFabActions]}>
              <View
                onLayout={event => {
                  const {height, width: eventWidth} = event.nativeEvent.layout;
                  setFabActionSize({height, width: eventWidth});
                }}>
                {fabActionDisplay}
              </View>
            </Animated.View>
          </Animated.View>
        </Surface>
      </Animated.View>
      {extended && (
        <TouchableWithoutFeedback
          style={styles.scrim}
          onPress={() => toggleAnimation()}>
          <View style={styles.scrim} />
        </TouchableWithoutFeedback>
      )}
    </NavigationAwarePortal>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.s,
    width: '100%',
    zIndex: 10,
    position: 'absolute',
  },
  fabSurface: {
    position: 'absolute',
    bottom: 0,
    borderRadius: theme.borderRadius.regular,
    backgroundColor: theme.colors.primary,
    elevation: 6,
  },
  fabContents: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
