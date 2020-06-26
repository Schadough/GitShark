import * as React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {Icon} from '@components/shark-icon';
import {textStyles, theme} from '@constants';
import {selectDirectory} from 'react-native-directory-picker';
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue,
} from 'react-native-dark-mode';

interface FolderSelectButtonProps {
  onFolderSelect: (path: string) => void;
  path: string;
  style?: StyleProp<ViewStyle>;
}

export const FolderSelectButton = ({
  onFolderSelect,
  path,
  style,
}: FolderSelectButtonProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const accent = useDynamicValue(theme.colors.primary);

  const selectDirectoryLocal = () => {
    selectDirectory(selectedPath => {
      onFolderSelect(selectedPath);
    });
  };

  return (
    <>
      {!path && (
        <TouchableRipple onPress={() => selectDirectoryLocal()} style={style}>
          <View style={styles.selectFolderBtn}>
            <Icon size={24} name="folder" color={accent} />
            <Text style={styles.selectFolderText}>Select folder...</Text>
          </View>
        </TouchableRipple>
      )}
      {!!path && (
        <TouchableRipple onPress={() => selectDirectoryLocal()} style={style}>
          <View style={styles.selectFolderBtn}>
            <Text
              ellipsizeMode="head"
              numberOfLines={1}
              style={[styles.selectFolderText, styles.selectFolderBtnWithPath]}>
              {path}
            </Text>
            <Icon size={24} name="folder" color={accent} />
          </View>
        </TouchableRipple>
      )}
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  selectFolderBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.divider,
    borderWidth: 2,
    borderRadius: theme.roundness,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectFolderBtnWithPath: {
    flexGrow: 1,
    color: theme.colors.on_surface_secondary,
    marginRight: 12,
  },
  selectFolderText: {
    color: theme.colors.primary,
    marginLeft: 8,
    ...textStyles.callout,
  },
});
