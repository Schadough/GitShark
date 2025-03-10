import {Icon} from '@components/shark-icon';
import {theme} from '@constants';
import {TouchableRipple} from 'react-native-paper';
import * as React from 'react';
import {Animated, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {useDynamicValue} from 'react-native-dark-mode';

interface SharkIconButtonProps {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: any;
  disabled?: boolean;
  primaryColor?: boolean;
}

export const SharkIconButton = ({
  iconName,
  onPress,
  style = {},
  iconStyle = {},
  disabled = false,
  primaryColor = true,
}: SharkIconButtonProps) => {
  const accentColor = useDynamicValue(theme.colors.primary);
  const onSurfaceColor = useDynamicValue(theme.colors.on_surface);

  const iconColor = primaryColor ? accentColor : onSurfaceColor;

  return (
    <TouchableRipple
      style={[styles.iconPadding, style]}
      onPress={onPress}
      disabled={disabled}>
      <Animated.View style={iconStyle}>
        <Icon name={iconName} size={24} color={iconColor} />
      </Animated.View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  iconPadding: {
    padding: theme.spacing.xs,
  },
});
