import * as React from 'react';
import {Animated, Text, View} from 'react-native';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {AnimatedDropdownArrow} from '@components/animated-dropdown-arrow';
import {theme} from '@constants';
import {TouchableRipple} from 'react-native-paper';

const animTiming = 150;

interface CommitMessageDropdownProps {
  message: string;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommitMessageDropdown = ({
  message,
  expanded,
  setExpanded,
}: CommitMessageDropdownProps) => {
  const [smallTextHeight, setSmallTextHeight] = React.useState(0);
  const [bigTextHeight, setBigTextHeight] = React.useState(0);
  const styles = useDynamicStyleSheet(dynamicStyles);

  const smallText = (
    <Text style={styles.text} numberOfLines={3} ellipsizeMode={'tail'}>
      {message}
    </Text>
  );

  const isLongText = React.useMemo(() => {
    if (!smallTextHeight || !bigTextHeight) return true;
    if (smallTextHeight < bigTextHeight) return true;
    return false;
  }, [smallTextHeight, bigTextHeight]);

  const bigText = <Text style={styles.text}>{message}</Text>;

  const [animatedHeight] = React.useState(new Animated.Value(0));
  const [animatedBottom] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // - 20 for half icon
    const collapsedArrowBottom = smallTextHeight / 2 - 20;
    // We want 8 padding, but bottom padding is already 12
    const expandedArrowBottom = -4;

    if (expanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: bigTextHeight,
          duration: animTiming,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBottom, {
          toValue: expandedArrowBottom,
          duration: animTiming,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: smallTextHeight,
          duration: animTiming,
          useNativeDriver: false,
        }),
        Animated.timing(animatedBottom, {
          toValue: collapsedArrowBottom,
          duration: animTiming,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [
    expanded,
    animatedHeight,
    animatedBottom,
    smallTextHeight,
    bigTextHeight,
  ]);

  return (
    <>
      {isLongText && (
        <TouchableRipple
          style={[styles.container, styles.marginContainer]}
          onPress={() => setExpanded(v => !v)}>
          <Animated.View
            style={[styles.innerContainer, {height: animatedHeight}]}>
            <View style={styles.textContainer}>
              {!expanded ? <>{smallText}</> : <>{bigText}</>}
            </View>
            <View style={styles.fakeIcon} />
            <Animated.View
              style={[styles.dropdownArrow, {bottom: animatedBottom}]}>
              <AnimatedDropdownArrow
                expanded={expanded}
                setExpanded={setExpanded as any}
              />
            </Animated.View>
          </Animated.View>
        </TouchableRipple>
      )}
      {!isLongText && (
        <View style={[styles.container, styles.marginContainer]}>
          <View style={styles.innerContainer}>
            <View style={styles.textContainer}>{smallText}</View>
          </View>
        </View>
      )}
      <View style={styles.offScreenView}>
        {!smallTextHeight && (
          <View
            onLayout={event => {
              const {height: eventHeight} = event.nativeEvent.layout;
              setSmallTextHeight(eventHeight);
            }}>
            <View style={[styles.innerContainer, styles.marginContainer]}>
              <View style={styles.textContainer}>{smallText}</View>
              <View style={styles.fakeIcon} />
            </View>
          </View>
        )}
        {!bigTextHeight && (
          <View
            onLayout={event => {
              const {height: eventHeight} = event.nativeEvent.layout;
              setBigTextHeight(eventHeight);
            }}>
            <View style={[styles.innerContainer, styles.marginContainer]}>
              <View style={styles.textContainer}>{bigText}</View>
              <View style={styles.fakeIcon} />
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {
    borderRadius: theme.borderRadius.regular,
    borderWidth: theme.borders.normal,
    borderColor: theme.colors.tint_on_surface_16,
    backgroundColor: theme.colors.tint_on_surface_04,
    paddingLeft: theme.spacing.s,
    paddingVertical: theme.spacing.s,
    paddingRight: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
  },
  // This margin makes the horizontal sizing of the text component smaller, which makes the
  // height larger on text overflow. We have to conditionally apply that logic to the "text height"
  // render comps
  marginContainer: {
    marginHorizontal: theme.spacing.m,
  },
  innerContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  textContainer: {
    flexGrow: 1,
    width: 1,
  },
  text: {
    ...theme.textStyles.caption_02,
    color: theme.colors.on_surface,
  },
  fakeIcon: {
    width: 40,
    marginLeft: theme.spacing.xs,
  },
  dropdownArrow: {
    position: 'absolute',
    right: theme.spacing.xs,
    // This is not correct for the collapsed state, thanks to font scaling
    bottom: theme.spacing.m,
  },
  offScreenView: {
    position: 'absolute',
    right: '5000%',
    width: '100%',
  },
});
