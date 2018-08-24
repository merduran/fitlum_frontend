import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import TOTPVerificationScreen from './components/TOTPVerificationScreen';
import HomeScreen from './components/HomeScreen';

// console.log("ENTERING APP")
const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    TOTPVerification: TOTPVerificationScreen,
    Home: HomeScreen

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

