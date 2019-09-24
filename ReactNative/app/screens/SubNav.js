import React, { Component } from 'react';
import { 
    Platform,
    TouchableOpacity, 
    Image,
    Text, 
    View 
    } from "react-native";

import { Button } from 'react-native-elements'
import OfflineNotice from '../components/OfflineNotice';
    
// import Icon from 'react-native-vector-icons/FontAwesome';

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
            <View>
                <View style={[styles.tabCont,{}]}>
                        

                        {Nav.map(({ name, key }) => (

                            <Button
                                key={key}
                                // disabled={isLoading}
                                clear
                                onPress={() => {
                                    if(this.props.active!==key)
                                        this.props.navigation.navigate(key)
                                }}
                                containerStyle={[{ flex: 1, margin: 0, padding: 0, }]}
                                buttonStyle={[styles.tabTitle, this.props.active===key && styles.selectedTabTitle]}
                                color={'#000000'}
                                fontSize={14}
                                // fontFamily={{}}
                                fontWeight={'bold'}
                                title={name}
                            />

                        ))}


                </View>
                <OfflineNotice />
            </View>
        );
    }
  
}
