import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {FileChangeListItemWithCheckbox} from '@components/file-change-list-item';
import {ChangesArrayItem} from '@services';
import {theme} from '@constants';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {SharkDivider} from '@components/shark-divider';
import {SharkCheckbox} from '@components/shark-checkbox';
import {SharkButton} from '@components/shark-button';

interface StagedChangesProps {
  removeFromStaged: (changes: ChangesArrayItem[]) => Promise<void>;
  stagedChanges: ChangesArrayItem[];
  onCommit: () => void;
  inSheet?: boolean;
}

export const StagedChanges = ({
  removeFromStaged,
  stagedChanges,
  onCommit,
  inSheet,
}: StagedChangesProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  const [selectedStagedChanges, setSelectedStagedChanges] = React.useState<
    ChangesArrayItem[]
  >([]);

  const stagedBtnText = selectedStagedChanges.length ? 'Unstage' : 'Commit all';
  const buttonType = selectedStagedChanges.length ? 'outline' : 'primary';

  const stagedBtnAction = React.useMemo(() => {
    if (selectedStagedChanges.length) {
      return async () => {
        await removeFromStaged(selectedStagedChanges);
        setSelectedStagedChanges([]);
      };
    }
    return onCommit;
  }, [onCommit, removeFromStaged, selectedStagedChanges]);

  const toggleSelected = (change: ChangesArrayItem) => {
    const filteredUnstaged = selectedStagedChanges.filter(
      isChange => isChange.fileName !== change.fileName,
    );
    // The array does not contain the item
    if (filteredUnstaged.length !== selectedStagedChanges.length) {
      setSelectedStagedChanges(filteredUnstaged);
      return;
    }
    setSelectedStagedChanges([...selectedStagedChanges, change]);
  };

  const floatingStyle = inSheet ? styles.subheaderFloating : {};

  const disabled = !stagedChanges.length;

  const disabledStyles = disabled ? styles.disabledStyling : {};

  return (
    <>
      <View style={[styles.subheaderContainer, floatingStyle]}>
        <SharkCheckbox
          checked={
            stagedChanges.length === selectedStagedChanges.length &&
            !!stagedChanges.length
          }
          indeterminate={!!selectedStagedChanges.length}
          onValueChange={selectAll => {
            setSelectedStagedChanges(selectAll ? stagedChanges : []);
          }}
          disabled={disabled}
        />
        <Text style={[styles.subheaderText, disabledStyles]}>{'Staged'}</Text>
        <SharkButton
          onPress={stagedBtnAction}
          text={stagedBtnText}
          style={styles.calloutButton}
          type={buttonType}
          disabled={disabled}
        />
      </View>
      {!!stagedChanges.length && <SharkDivider />}
      <ScrollView>
        {stagedChanges.map(props => {
          const isChecked = !!selectedStagedChanges.find(
            change => change.fileName === props.fileName,
          );
          return (
            <React.Fragment key={props.fileName}>
              <View style={styles.changeItem}>
                <FileChangeListItemWithCheckbox
                  isChecked={isChecked}
                  key={props.fileName}
                  onToggle={() => toggleSelected(props)}
                  {...props}
                />
              </View>
              <SharkDivider />
            </React.Fragment>
          );
        })}
      </ScrollView>
    </>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  changeItem: {},
  subheaderFloating: {
    backgroundColor: theme.colors.floating_surface,
  },
  subheaderContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignContent: 'center',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.m,
    paddingRight: theme.spacing.m,
    paddingLeft: theme.spacing.xs,
    alignItems: 'center',
  },
  subheaderText: {
    marginLeft: theme.spacing.xs,
    ...theme.textStyles.callout,
    flexGrow: 1,
    color: theme.colors.on_surface,
  },
  calloutButton: {
    marginLeft: theme.spacing.m,
  },
  disabledStyling: {
    opacity: theme.opacity.disabled,
  },
});
