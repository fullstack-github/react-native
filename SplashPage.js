'use strict';

import React,{Component} from 'react';
import {
  View,
  Text, } from 'react-native';

class SplashPage extends Component {
  componentWillMount() {
    var navigator = this.props.navigator;
     navigator.replace({
        id: 'MainPage',
      });
  }
  render() {
    return (
      <View>
      </View>
    );
  }
}

module.exports = SplashPage;