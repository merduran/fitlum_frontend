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
  	
	// _signOut(){
	//     this.deleteJWT();
	//     console.log("token - ", this.state.token);
	// }

	// static navigationOptions = {
	//     title: 'Home',
	//     headerLeft: null
	// };

	// _submitListAll(){
	//     _this = this;
	//     console.log("_this.state.token submit list all = ", this.state.token)
	//     console.log("this.state.token = ", this.state.token);
	//     fetch('http://localhost:8000/api/get_users', {
	//       method: 'GET',
	//       headers: {
	//         Authorization: _this.state.token,
	//       },
	//     })
	//     .then((response) => {
	//     	console.log("YA = ", response.json())
	//     });
	// }

  	render(){
	    return (
	    	<View>
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
