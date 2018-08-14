import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import TOTPVerificationScreen from './components/TOTPVerificationScreen';

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    TOTPVerification: TOTPVerificationScreen
  },
  {
    initalRouteName: 'Login'
  }
);

export default class App extends React.Component {

  render() {

   return <RootStack/>;
  
  }

}

