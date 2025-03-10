/**
 * Keep in mind that despite being a "View", this is embedded inside of
 * "repository-history" as it's part of the dropdown component there
 */
import * as React from 'react';
import {ScrollView, Text} from 'react-native';
import {DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';
import {SharkSubheader} from '@components/shark-subheader';
import {SharkDivider} from '@components/shark-divider';
import {BranchListItem} from './components/branch-list-item';
import {RemoteBranchListItem} from './components/remote-branch-list-item';
import {DropdownContent} from '@components/dropdown-content';
import {AnimatedDropdownArrow} from '@components/animated-dropdown-arrow';
import {SharkIconButton} from '@components/shark-icon-button';
import {theme} from '@constants';
import {TouchableRipple} from 'react-native-paper';
import {RemoteBranch, Remotes} from '@types';
import {ReduxRepo} from '@entities';

interface BranchesUIProps {
  localBranches: string[];
  repo: ReduxRepo | null;
  remotes: Remotes[];
  remoteBranches: RemoteBranch[];
  onCreateBranch: () => void;
  onCreateRemote: () => void;
  onDeleteLocalBranch: (branchName: string) => Promise<void>;
  onCheckoutBranch: (branchName: string) => Promise<void>;
  onBranchRename: (props: {
    branchName: string;
    selected: boolean;
    oldBranchName: string;
  }) => Promise<void>;
}

export const BranchesUI = ({
  localBranches,
  repo,
  remotes,
  remoteBranches,
  onCreateBranch,
  onCreateRemote,
  onDeleteLocalBranch,
  onCheckoutBranch,
  onBranchRename,
}: BranchesUIProps) => {
  const styles = useDynamicStyleSheet(dynamicStyles);

  /**
   * This currently is the "expanded" prop for ALL branches and remotes and everything else
   * This should be refactored into their own components so that each can be expanded and
   * shrunk on their own
   */
  const [remoteExpanded, setRemoteExpanded] = React.useState('');

  return (
    <ScrollView style={styles.container}>
      <SharkSubheader
        calloutText="Local"
        buttonText="Add new"
        onButtonClick={onCreateBranch}
      />
      {!!localBranches &&
        localBranches.map(branch => {
          const isSelected = branch === repo?.currentBranchName;
          return (
            <BranchListItem
              key={branch}
              isFavorite={false}
              selected={isSelected}
              branch={{
                name: branch,
                up: 0, // TODO: Hook this up when our branch diff logic is faster
                down: 0,
              }}
              onDeleteLocalBranch={onDeleteLocalBranch}
              onCheckoutBranch={onCheckoutBranch}
              onBranchRename={onBranchRename}
              localBranches={localBranches}
            />
          );
        })}
      <SharkDivider style={styles.remoteDivider} />
      <SharkSubheader
        calloutText="Remotes"
        buttonText="Add new"
        onButtonClick={onCreateRemote}
      />
      {remotes.map(remote => {
        const expanded = remoteExpanded === remote.remote;
        return (
          <>
            <TouchableRipple
              key={remote.remote}
              style={styles.dropDownHeader}
              onPress={() =>
                setRemoteExpanded(v =>
                  v === remote.remote ? '' : remote.remote,
                )
              }>
              <>
                <AnimatedDropdownArrow
                  setExpanded={val =>
                    setRemoteExpanded(val ? remote.remote : '')
                  }
                  expanded={expanded}
                />
                {/* This is a mock, we'll need to replace it with the list of real remotes soon */}
                <Text style={styles.remoteHeader}>{remote.remote}</Text>
                {/*<SharkIconButton iconName="menu" onPress={() => {}} />*/}
              </>
            </TouchableRipple>
            <DropdownContent expanded={expanded}>
              {remoteBranches
                .filter(branch => branch.remote === remote.remote)
                .map(branch => {
                  return (
                    <RemoteBranchListItem
                      key={branch.name}
                      branch={{
                        name: branch.name,
                      }}
                      style={styles.remoteBranch}
                      onSelect={() => onCheckoutBranch(branch.name)}
                    />
                  );
                })}
            </DropdownContent>
          </>
        );
      })}
    </ScrollView>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  container: {},
  remoteBranch: {
    paddingLeft: 56,
  },
  remoteDivider: {
    marginTop: theme.spacing.m,
  },
  dropDownHeader: {
    padding: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  remoteHeader: {
    marginHorizontal: theme.spacing.xs,
    color: theme.colors.on_surface,
    width: 1,
    flexGrow: 1,
    ...theme.textStyles.callout,
  },
});
