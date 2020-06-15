import * as React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {textStyles, theme} from '@constants';
import {SharkButton, SharkButtonProps} from '../shark-button';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';

interface SharkSubheaderProps {
  calloutText: string;
  buttonText?: string;
  onButtonClick?: () => void;
  style?: StyleProp<ViewStyle>;
  buttonType?: SharkButtonProps['type'];
  buttonDisabled?: boolean;
}

export const SharkSubheader = ({
  calloutText,
  buttonText,
  onButtonClick = () => {},
  style = {},
  buttonType,
  buttonDisabled = false,
}: SharkSubheaderProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View style={[styles.subheaderContainer, style]}>
      <Text style={styles.subheaderText}>{calloutText}</Text>
      {!!buttonText && (
        <SharkButton
          onPress={onButtonClick}
          text={buttonText}
          style={styles.calloutButton}
          type={buttonType}
          disabled={buttonDisabled}
        />
      )}
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  subheaderContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignContent: 'center',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    padding: 16,
    alignItems: 'center',
  },
  subheaderText: {
    ...textStyles.callout,
    flexGrow: 1,
    color: theme.colors.on_surface,
  },
  calloutButton: {
    marginLeft: 16,
  },
});
