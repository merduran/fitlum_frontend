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
      token: '',
      email: '',
      password: '',
      hidden: true,
      // Initialize is_email_valid and is_password_valid to true so
      // that credentials are not warned at first.
      is_email_valid: true,
      is_password_valid: true,
    };
    console.log("constructor")
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
    // console.log("initial token = ", this.state.token);
  }


  _signUp(){
    _this = this;
    is_email_valid = validator.validate(this.state.email);
    this.state.password !== "" ? is_password_valid = true : is_password_valid = false;
    // console.log("is_password_valid = ", is_password_valid)
    this.setState({ is_email_valid: is_email_valid, is_password_valid: is_password_valid });
    if (is_password_valid !== "" && is_email_valid) {
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
          console.log("NAVIGATE");
          _this.props.navigation.navigate('TOTPVerification');
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

  _signIn(){
    is_email_valid = validator.validate(this.state.email);
    this.state.password !== "" ? is_password_valid = true : is_password_valid = false;
    console.log("is_password_valid = ", is_password_valid, ", is_email_valid = ", is_email_valid)
    this.setState({ is_email_valid: is_email_valid, is_password_valid: is_password_valid });
    console.log("is_password_valid 2 = ", is_password_valid, ", is_email_valid 3 = ", is_email_valid)
    if (is_password_valid !== "" && is_email_valid) {
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
        }),
      })
      .then((response) => {
        return response.json();
      })
      .then((response_Json) => {
        deviceStorage.saveItem('id_token', response_Json.token);
        _this.setState({ token: response_Json.token })

        // console.log("response_Json.token = ", response_Json.token)
        // _this.setState({ token: response_Json.token })
      })
    }
      // fetch('http://localhost:8000/api/get_users', {
      //   method: 'GET',
      // })
      // .then((users) => console.log("users = ", users.json()))
      // .then((response_Json) => {
      //   if (response_Json.error) {
      //     this.setState({ 
      //       is_email_valid: false,
      //       credential_name: 'email_already_exists'
      //     });
      //   }
      //   else if (response_Json.token) console.log("token = ", response_Json.token)
      // });
      
    // } else if (!is_email_valid) {
    //   this.setState({ 
    //     credential_name: 'email_invalid'
    //   });
    // }
  }

  _signOut(){
    this.deleteJWT();
    console.log("token - ", this.state.token);
  }

  _submitListAll(){
    _this = this;
    console.log("this.state.token = ", this.state.token);
    fetch('http://localhost:8000/api/get_users', {
      method: 'GET',
      headers: {
        Authorization: _this.state.token,
      },
    })
    .then((users) => console.log("YA = ", users.json()))
  }

  _warnInvalidCredentials(credential){
    console.log("credential = ", credential)
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
    console.log("render")
    var width = Dimensions.get('window').width;
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
        <TouchableOpacity onPress={this._signIn.bind(this)} style={{backgroundColor: 'blue', margin: 20, padding: 20, borderRadius: 2}}>
          <Text style={{textAlign: 'center', color: 'white', letterSpacing: 3, fontSize: 20}}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._submitListAll.bind(this)} style={{backgroundColor: 'green', margin: 20, padding: 20, borderRadius: 2}}>
          <Text style={{textAlign: 'center', color: 'white', letterSpacing: 3, fontSize: 20}}>
            LIST USERS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._signOut()} style={{backgroundColor: 'purple', margin: 20, padding: 20, borderRadius: 2}}>
          <Text style={{textAlign: 'center', color: 'white', letterSpacing: 3, fontSize: 20}}>
            SIGN OUT
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
