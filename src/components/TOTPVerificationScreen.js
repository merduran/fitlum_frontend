import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import deviceStorage from '../../services/deviceStorage.js';

export default class TOTPVerificationScreen extends React.Component {
  
  	constructor(props){
	    super(props);
	}


  	render(){
	    return (
	    	<CodeInput
		      ref="TOTPVerificationCode"
		      keyboardType="numeric"
		      codeLength={6}
		      spacing={10}
		      className='border-circle'
		      autoFocus={false}
		      codeInputStyle={{ fontWeight: 'bold', color: 'yellow' }}
		      onFulfill={(code) => this._onFulfill(code)}
		    />
		);
	}

	_onFulfill(code){
		_this = this;
		fetch('http://localhost:8000/api/totp_verify', {
	        method: 'POST',
	        headers: {
	        Accept: 'application/json',
	          'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({
	          email: _this.props.navigation.getParam('email'),
	          totpCode: code
	        }),
	    })
	    .then((response) => {
	    	return response.json();
	    })
	    .then((response_Json) => {
	    	if (response_Json.token){
	    		console.log("token = ", response_Json)
	    		deviceStorage.saveItem('id_token', response_Json.token)
          		// _this.setState({ token: response_Json.token })
          		_this.props.navigation.navigate('Home');
	    	} else {
	    		// Incorrect/expired code
	    	}
	    	
	    })
	}
}

const styles = StyleSheet.create({
	codeInputContainer: {
		backgroundColor: 'yellow'
	}
  // container: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  // },
  // form: {
  //   flexDirection: 'row',
  // },
  // container_style: {
  //   backgroundColor: 'green',
  // },
  // input_style: {
  //   backgroundColor: 'red',
  // }
});
