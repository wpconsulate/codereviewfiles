import React, { Component } from 'react';
import { 
    Platform, 
    TouchableOpacity, 
    Image,
    Text, 
    View 
    } from "react-native";

import { Button } from 'react-native-elements'
    
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from "./Styles";


const Nav = [
    {
      key: 'Home',
      name: "PENDING"
    },
    {
        key: 'Outbox',
        name: "OUTBOX"
    },
    {
        key: 'Processed',
        name: "PROCESSED"
    }
  ];


export default class SubNav extends Component {


    render() {
        return (
            <View style={styles.tabCont}>

                    {Nav.map(({ name, key }) => (

                        <Button
                            key={key}
                            // disabled={isLoading}
                            clear
                            onPress={() => this.props.navigation.push(key)}
                            containerStyle={{ flex: 1 }}
                            buttonStyle={[styles.tabTitle, this.props.active===key && styles.selectedTabTitle ]}
                            color={'#000000'}
                            fontSize={14}
                            title={name}
                        />

                    ))}

            </View>
        );
    }
  
}
