import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image, Dimensions, Button } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import CodeInput from 'react-native-confirmation-code-input';
import deviceStorage from '../../services/deviceStorage.js';

export default class TOTPVerificationScreen extends React.Component {
  
  	constructor(props){
	    super(props);
	    this.state = {
	    	totp_error: false
	    };
	}

  	render(){
  		const height = Dimensions.get('window').height;
  		const width = Dimensions.get('window').width;
  		console.log("this.state.email = ", this.props.navigation.getParam('email'));
	    return (
	    	<View style={{flex: 1}}>
	    		<View style={{ marginTop: height * 0.20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			    	<Text>Please enter the confirmation code sent to</Text>
				   	<Text style={{ fontSize: 20, marginTop: 20, fontWeight: 'bold' }}>{this.props.navigation.getParam('email')}</Text>
		    	</View>

		    	<CodeInput
			      ref="TOTPVerificationCode"
			      keyboardType="numeric"
			      codeLength={6}
			      spacing={10}
			      className='border-box'
			      autoFocus={false}
			      codeInputStyle={{ color: 'black', borderColor: 'black', borderWidth: 1.5 }}
			      containerStyle={{ marginTop: 40, flex: 0, flexDirection: 'row', justifyContent: 'center' }}
			      onFulfill={(code) => this._onFulfill(code)}
			    />
			    {this._warnInvalidTOTPToken()}
			    <View style={{ position: 'absolute', bottom: 100 }}>
			    	<Text style={{width: width, textAlign: 'center', color: 'blue', flex: 1}} onPress={this._resendCode.bind(this)}>Click here to resend code</Text>
		    	</View>
		    </View>
		);
	}

	_resendCode(){
		_this = this;
		fetch('http://localhost:8000/api/totp_resend_totp', {
	        method: 'POST',
	        headers: {
	        Accept: 'application/json',
	          'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({
	          email: _this.props.navigation.getParam('email'),
	        })
	    });
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
	    		deviceStorage.saveItem('id_token', response_Json.token)
          		_this.props.navigation.navigate('Home', { email: _this.state.email, token: response_Json.token });
	    		this.setState({ totp_error: false })
	    	} else {
	    		// Incorrect/expired code
	    		console.log("TOTP error = ", response_Json.error);
	    		this.setState({ totp_error: true })
	    		this.refs.TOTPVerificationCode.clear();
	    	}
	    	
	    })
	}

	_warnInvalidTOTPToken(){
	    if (this.state.totp_error) {
	        return(
	        	<View style={{marginTop: 40, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
	        		<FormValidationMessage>{'Confirmation code is invalid or has expired'}</FormValidationMessage>
	        		<FormValidationMessage>{'Please try again or request new code'}</FormValidationMessage>
	        	</View>
	        ); 
	    }
	}

}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'yellow',
		// flex: 0.5,
	 //    flexDirection: 'column',
	    // justifyContent: 'center',
	},
	codeInputContainer: {
		backgroundColor: 'blue',
		padding: 10,
		height: 20
	},
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
