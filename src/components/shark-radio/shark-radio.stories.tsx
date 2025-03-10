import React from 'react';
import {View} from 'react-native';
import {storiesOf} from '@storybook/react';
import {SharkRadio} from './shark-radio';

const SharkRadioDemo = () => {
  const [index, setIndex] = React.useState(0);
  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <View style={{marginRight: 8}}>
        <SharkRadio checked={index === 0} onValueChange={() => setIndex(0)} />
      </View>
      <View style={{marginRight: 8}}>
        <SharkRadio checked={index === 1} onValueChange={() => setIndex(1)} />
      </View>
      <View style={{marginRight: 8}}>
        <SharkRadio checked={index === 2} onValueChange={() => setIndex(2)} />
      </View>
    </View>
  );
};

storiesOf('Shark Components/Radio', module).add('default styling', () => (
  <SharkRadioDemo />
));
