import * as React from 'react';
import {CreateRepositoryDialog} from '../create-repository-dialog';
import {AddExistingRepositoryDialog} from '../add-existing-repository-dialog';
import {CloneRepositoryDialog} from '../clone-repository-dialog';
import {DialogSelection} from './types';
import {
  RepoListExtendedFab,
  RepoListExtendedFabProps,
} from './repo-list-extended-fab';

interface DialogsProps
  extends Omit<RepoListExtendedFabProps, 'setSelectedAction'> {
  findRepos: () => Promise<void>;
}

export const DialogsAndFab = ({findRepos, ...props}: DialogsProps) => {
  const [selectedAction, setSelectedAction] = React.useState<
    DialogSelection | ''
  >('');

  const onDismiss = React.useCallback(
    (didUpdate: boolean) => {
      if (didUpdate) {
        findRepos();
      }
      setSelectedAction('');
    },
    [findRepos],
  );

  return (
    // The dialogs must come AFTER the FAB otherwise there will be a z-index problem when the dialogs are open
    <>
      <RepoListExtendedFab {...props} setSelectedAction={setSelectedAction} />
      <CreateRepositoryDialog
        visible={selectedAction === 'create'}
        onDismiss={onDismiss}
      />
      <AddExistingRepositoryDialog visible={true} onDismiss={onDismiss} />
      <CloneRepositoryDialog
        visible={selectedAction === 'clone'}
        onDismiss={onDismiss}
      />
    </>
  );
};
