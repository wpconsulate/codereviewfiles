import React, { Component } from 'react';
import { 
    Platform, 
    Image,
    Text,
    TouchableOpacity,
    View 
    } from "react-native";
    
// import Icon from 'react-native-vector-icons/FontAwesome';

import styles from "./Styles";


export default class Head extends Component {

    render() {
        return (
                <View style={styles.headContainer} >
                    <View style={styles.headLeft} ><Text style={{color:'white'}} >DM</Text></View>
                    <View style={styles.headCenter}>
                        <Image style={styles.headLogo} source={require('../images/petmeds-logo.png')} />
                    </View>
                    <View style={styles.headRight} >
                        <TouchableOpacity onPress={() => this.props.navigation.push('Settings')}>
                            <Image style={styles.headLogo} style={{height: 30}} source={require('../images/user.png')}  />
                        </TouchableOpacity>
                        {/* <Icon
                            name='user'
                            color='rgba(0, 0, 0, 0.38)'
                            size={25}
                            style={{color: 'black'}}
                            onPress={() => this.props.navigation.push('Settings')}
                        /> */}
                    </View>
                </View>
        );
    }
  
}
