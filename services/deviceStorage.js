import { AsyncStorage } from 'react-native';
const deviceStorage = {
	async saveItem(key, value){
		try {
			await AsyncStorage.setItem(key, value);
		} catch (error) {
			console.log('AsyncStorage Error: ' + error.message);
		}
	},
	async loadJWT(){
		try {
			const value = await AsyncStorage.getItem('id_token');
			console.log("loading JWT = ", value)
			if (value != null) {
				console.log("loading JWT which exists = ", value);
				this.setState({ token: value })
			} else {
				console.log("no JWT = ", value);
				this.setState({ token: '' })
			}
		} catch (error) {
			console.log('AsyncStorage Error: ' + error.message);
		}
	},
	async deleteJWT(){
		try {
			const value = await AsyncStorage.removeItem('id_token')
			.then(() => {
				this.setState({ token: '' })
			})
			if (value != null) {
				this.setState({ token: value })
			} else {
				this.setState({ token: '' })
			}
		} catch (error) {
			console.log('AsyncStorage Error: ' + error.message);
		}
	}
};

export default deviceStorage;