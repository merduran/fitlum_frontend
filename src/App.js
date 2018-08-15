import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import TOTPVerificationScreen from './components/TOTPVerificationScreen';

console.log("ENTERING APP")
const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    TOTPVerification: TOTPVerificationScreen,

  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {

  render() {

   return <RootStack/>;
  
  }

}

