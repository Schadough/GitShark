import {View} from 'react-native';
import * as React from 'react';
import {ChangesArrayItem} from '@services';
import {FileChangeListItem} from './file-change-list-item';
import {SharkCheckbox} from '../shark-checkbox';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {theme} from '@constants';

interface FileChangeListItemProps {
  fileName: string;
  onPress?: () => void;
  fileStatus: ChangesArrayItem['fileStatus'];
  onToggle?: () => void;
  isChecked: boolean;
}

export const FileChangeListItemWithCheckbox = ({
  fileName,
  onPress = () => {},
  fileStatus,
  onToggle = () => {},
  isChecked,
}: FileChangeListItemProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.checkbox}>
        <SharkCheckbox checked={isChecked} onValueChange={onToggle} />
      </View>
      <FileChangeListItem
        fileName={fileName}
        onPress={onPress}
        fileStatus={fileStatus}
        style={styles.listItem}
      />
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  checkbox: {
    padding: theme.spacing.xs,
  },
  listItem: {
    flexGrow: 1,
    paddingLeft: 0,
  },
});
