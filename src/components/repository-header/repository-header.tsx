import * as React from 'react';
import {Divider, Menu} from 'react-native-paper';
import {HeaderActionNumber} from './header-action-number/header-action-number';
import {useNavigation} from '@react-navigation/native';
import git from 'isomorphic-git/index.umd.min.js';
import {fs} from '../../constants';
import http from 'isomorphic-git/http/web/index.js';
import {SharkIconButton} from '../shark-icon-button';
import {AppBar} from '../app-bar';
import {SharkMenu} from '../shark-menu';
import {RootState} from '../../store';
import {useSelector} from 'react-redux';

export const RepositoryHeader = () => {
  const {repo} = useSelector((state: RootState) => state.repository);
  const history = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <AppBar
      leftIcon="arrow-left"
      onLeftSelect={() => history.goBack()}
      headline="Repository"
      caption="Last fetched: 5min ago"
      rightChild={
        <>
          <HeaderActionNumber iconName="arrow-up-circle" val={4} />
          <HeaderActionNumber iconName="arrow-down-circle" val={0} />
          <SharkMenu
            visible={isMenuOpen}
            onDismiss={() => setIsMenuOpen(false)}
            anchor={
              <SharkIconButton
                iconName="dots-horizontal"
                onPress={() => setIsMenuOpen(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setIsMenuOpen(false);
                console.log(repo);
                git.fetch({
                  fs,
                  http,
                  dir: repo.path,
                  url:
                    'https://github.com/unicorn-utterances/batteries-not-included.git',
                  ref: repo.currentBranchName,
                  depth: 1000,
                  singleBranch: true,
                });
              }}
              title="Fetch"
            />
            <Divider />
            <Menu.Item onPress={() => {}} title="Open Folder" />
            <Menu.Item onPress={() => {}} title="Rename" />
          </SharkMenu>
        </>
      }
    />
  );
};
