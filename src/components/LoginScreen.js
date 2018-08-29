import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import deviceStorage from '../../services/deviceStorage.js';
import PasswordInputText from 'react-native-hide-show-password-input';
var validator = require('email-validator');

export default class LoginScreen extends React.Component {
  
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

  _signIn(){
    is_email_valid = validator.validate(this.state.email);
    this.state.password !== "" ? is_password_valid = true : is_password_valid = false;
    this.setState({ is_email_valid: is_email_valid, is_password_valid: is_password_valid });
    if (is_password_valid && is_email_valid) {
      _this = this;
      fetch('http://localhost:8000/api/sign_in', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: _this.state.email,
          password: _this.state.password,
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((response_Json) => {
        if (response_Json.error) {
          response_Json.error.valueOf() === 'Incorrect email' ? this.setState({ is_email_valid: false, invalid_email_msg: response_Json.error }) : this.setState({ is_password_valid: false, invalid_password_msg: response_Json.error })
        } else {          
          deviceStorage.saveItem('id_token', response_Json.token);
          this.props.navigation.navigate('Home', { email: _this.state.email, token: response_Json.token });
        }
      });
    } else {
      if (!is_email_valid) { this.setState({ invalid_email_msg: 'Valid email required' }); }
      if (!is_password_valid) { this.setState({ invalid_password_msg: 'Valid password is required' }); }
    }
  }

  // _signOut(){
  //   this.deleteJWT();
  //   console.log("token - ", this.state.token);
  // }

  // _submitListAll(){
  //   _this = this;
  //   console.log("_this.state.token submit list all = ", this.state.token)
  //   console.log("this.state.token = ", this.state.token);
  //   fetch('http://localhost:8000/api/get_users', {
  //     method: 'GET',
  //     headers: {
  //       Authorization: _this.state.token,
  //     },
  //   })
  //   .then((users) => console.log("YA = ", users.json()))
  // }

  _warnInvalidCredentials(credential){
    if (!credential.is_credential_valid) {
        return <FormValidationMessage>{credential.credential_name}</FormValidationMessage>;
    }
  }

  render(){
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
            credential_name: this.state.invalid_email_msg
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
            credential_name: this.state.invalid_password_msg
          }
        )}        
        <TouchableOpacity onPress={this._signIn.bind(this)} style={{backgroundColor: 'black', margin: 20, padding: 20, borderRadius: 2}}>
          <Text style={{textAlign: 'center', color: 'white', letterSpacing: 3, fontSize: 20}}>
            SIGN IN
          </Text>
        </TouchableOpacity>
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
