import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import deviceStorage from '../../services/deviceStorage.js';

export default class HomeScreen extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			token: ''
		};
		this.deleteJWT = deviceStorage.deleteJWT.bind(this);
	    this.loadJWT = deviceStorage.loadJWT.bind(this);
	    this.loadJWT();
	}
  	
  	render(){
	    return (
	    	<Text>HomeScreen + {this.state.token}</Text>
		);
	}

	
}
