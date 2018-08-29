import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import TOTPVerificationScreen from './components/TOTPVerificationScreen';
import HomeScreen from './components/HomeScreen';
import SignupScreen from './components/SignupScreen'

// console.log("ENTERING APP")
const RootStack = createStackNavigator(
  {
    Signup: SignupScreen,
    Login: LoginScreen,
    TOTPVerification: TOTPVerificationScreen,
    Home: HomeScreen,

  },
  {
    initialRouteName: 'Signup',
  }
);

export default class App extends React.Component {

  render() {

   return <RootStack/>;
  
  }

}

