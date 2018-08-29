import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import deviceStorage from '../../services/deviceStorage.js';
import PasswordInputText from 'react-native-hide-show-password-input';
var validator = require('email-validator');

export default class SignupScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      hidden: true,
      // Initialize is_email_valid and is_password_valid to true so
      // that credentials are not warned at first.
      is_email_valid: true,
      is_password_valid: true,
    };
  }


  _signUp(){
    _this = this;
    is_email_valid = validator.validate(this.state.email);
    this.state.password !== "" ? is_password_valid = true : is_password_valid = false;
    this.setState({ is_email_valid: is_email_valid, is_password_valid: is_password_valid });
    if (is_password_valid && is_email_valid) {
      _this = this;
      fetch('http://localhost:8000/api/sign_up', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: _this.state.email,
          password: _this.state.password,
        }),
      })
      .then((response) => {
        return response.json();
      })
      .then((response_Json) => {
        if (response_Json.error) {
          this.setState({ 
            is_email_valid: false,
            credential_name: 'email_already_exists'
          });
        }
        else {
          _this.props.navigation.navigate('TOTPVerification', { email: _this.state.email });
        }
        // else if (response_Json.token) {
        //   console.log("token is = ", response_Json.token)
        //   deviceStorage.saveItem('id_token', response_Json.token)
        //   _this.setState({ token: response_Json.token })
        // }
      });
      
    } else if (!is_email_valid) {
      this.setState({ 
        credential_name: 'email_invalid'
      });
    }
  } 

  _warnInvalidCredentials(credential){
    // console.log("credential = ", credential)
    if (!credential.is_credential_valid) {
      if (credential.credential_name.valueOf() === 'email_invalid'){
        return <FormValidationMessage>{'Valid email required'}</FormValidationMessage>
      } else if (credential.credential_name.valueOf() === 'email_already_exists') {
        return <FormValidationMessage>{'Email taken'}</FormValidationMessage>
      } else {
        return <FormValidationMessage>{'Password is required'}</FormValidationMessage>
      }
    }
  }

  render() {
    const width = Dimensions.get('window').width;
    var toggle_icon;
    if (this.state.hidden){
      toggle_icon = require('../../icons/visible.png')
    } else {
      toggle_icon = require('../../icons/invisible.png')
    }
    return (
      <View style={styles.container}>
        <FormLabel labelStyle={{color: 'black', fontSize: 20}}>Email</FormLabel>
        <FormInput 
          onChangeText={(email) => this.setState({ email: email })}
          containerStyle={{borderBottomWidth: 0}} 
          inputStyle={{color: 'black', paddingRight: 30}} 
          placeholder={'john_doe@brown.edu'}
        />  
        {this._warnInvalidCredentials(
          {
            is_credential_valid: this.state.is_email_valid, 
            credential_name: this.state.credential_name
          }
        )}
        <FormLabel labelStyle={{color: 'black', fontSize: 20}}>Password</FormLabel>
        <View style={{width: width, flexDirection: 'row', justifyContent: 'space-between'}}>
          <FormInput 
            onChangeText={(password) => this.setState({ password: password })}
            containerStyle={{borderBottomWidth: 0}} 
            inputStyle={{color: 'black', width: 0.7 * width}} 
            secureTextEntry={this.state.hidden} 
            placeholder={'password'}
          />
          <TouchableOpacity onPress={() => {this.setState({ hidden: !this.state.hidden })}} style={{marginRight: 20}}>
            <Image source={toggle_icon} style={{height: 25, width: 25}}/>
          </TouchableOpacity>
        </View>
        {this._warnInvalidCredentials(
          {
            is_credential_valid: this.state.is_password_valid, 
            credential_name: 'password'
          }
        )}        
        <TouchableOpacity onPress={this._signUp.bind(this)} style={{backgroundColor: 'black', margin: 20, padding: 20, borderRadius: 2}}>
          <Text style={{textAlign: 'center', color: 'white', letterSpacing: 3, fontSize: 20}}>
            SIGN UP
          </Text>
        </TouchableOpacity>
        <View style={{ position: 'absolute', bottom: 100 }}>
          <Text style={{width: width, textAlign: 'center', marginBottom: 10, flex: 1}}>Already signed up?</Text>
          <Text style={{width: width, textAlign: 'center', color: 'blue', flex: 1}} onPress={() => this.props.navigation.navigate('Login')}>Click here to sign in</Text>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  form: {
    flexDirection: 'row',
  },
  container_style: {
    backgroundColor: 'green',
  },
  input_style: {
    backgroundColor: 'red',
  }
});
