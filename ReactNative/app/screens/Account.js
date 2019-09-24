import React, { Component } from 'react';
import { View, ScrollView, Linking } from "react-native";
import { Text, Divider } from "react-native-elements";

import styles from "./Styles";

import {Session} from '../services/data/Session'

import {gaTrack, appVersion} from "../helper";

export default class Account extends Component {


    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            userinfo:{
                vetName:"DocDoggyDog",
                vetFullName:"Andreas Von Schiffen",
                vetEmail:"Grandpaw4Lyfe@PetDocs.org",
                vetPhone:"323-324-3243",
                vetLicence:"4342352",
            }
        };

    }

    // static navigationOptions = ({ navigation }) => {
    //     const { params } = navigation.state;

    //     return {
    //         title: params ? params.otherParam : 'A Nested Details Screen',
    //         // header:
    //     }
    // };


    componentDidMount() {
        this.setState({ userinfo:Session.user });
        gaTrack( "Account" );
    }


    goToOtherScreen() {
        this.props.navigation.navigate('OtherScreen');
    }

    callNumber = (url) =>{
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    _onPress = () => {

    };


    render() {

        const {userinfo} = this.state;

        return (
            <View style={styles.container}>

                {this.state.fontLoaded ?
                    <View style={{flex:1,padding:0,margin:0}}>
                        <ScrollView contentContainerStyle={{ paddingVertical: 0 }}>

                            <Text style={[styles.selfCenter,styles.padl70,styles.padr70,styles.padT30,styles.padB30, styles.borderBottom1,{textAlign:'center'} ]}>
                                To edit account details, call us at <Text style={styles.blue} onPress={()=> this.callNumber('tel:+18887386331')}>1-888-738-6331</Text>.
                            </Text>

                            <Divider style={ { backgroundColor: 'rgba(248,250,252, 1)' }} />

                            <View style={[styles.padScreen,styles.marB20]}>
                                <Text style={styles.displayLabel}>USERNAME</Text>
                                <Text style={[styles.marT5,{fontSize:16}]}>{userinfo.vetId}</Text>
                            </View>
                            <View style={[styles.padScreen,styles.marB20]}>
                                <Text style={styles.displayLabel}>FULL NAME</Text>
                                <Text style={[styles.marT5,{fontSize:16}]}>{userinfo.vetName}</Text>
                            </View>
                            <View style={[styles.padScreen,styles.marB20]}>
                                <Text style={styles.displayLabel}>EMAIL</Text>
                                <Text style={[styles.marT5,{fontSize:16}]}>{userinfo.vetEmail}</Text>
                            </View>
                            <View style={[styles.padScreen,styles.marB20]}>
                                <Text style={styles.displayLabel}>PHONE NUMBER</Text>
                                <Text style={[styles.marT5,{fontSize:16}]}>{userinfo.vetPhone}</Text>
                            </View>
                            <View style={[styles.padScreen,styles.marB20]}>
                                <Text style={styles.displayLabel}>STATE LICENSE NO.</Text>
                                <Text style={[styles.marT5,{fontSize:16}]}>{userinfo.vetLicence}</Text>
                            </View>

                        </ScrollView>
                        <View style={[styles.fullBtnStikyBottom,{padding:5,margin:0,alignItems:'flex-end'}]}><Text style={styles.displayLabel}>ver. {appVersion()}</Text></View>
                    </View>
                    :
                    <Text>Loading...</Text>
                }

            </View>
        );
    }


}
