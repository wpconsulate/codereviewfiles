import React, { Component } from 'react';
import { View, Linking, ScrollView, FlatList } from "react-native";
import { Text, Button, List, ListItem } from "react-native-elements";
import { onSignOut } from "../auth";

import styles from "./Styles";
import {gaTrack} from "../helper";

const list = [
    {
        key:0,
        title: 'Account Details',
        icon: 'av-timer',
        setting: 'Account'
    },
    {
        key:1,
        title: 'Notification Settings',
        icon: 'flight-takeoff',
        setting: 'Notifications'
    },

  ]

export default class Settings extends Component {


    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false
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
        gaTrack( "Settings Page" );
    }


    goToOtherScreen() {
        this.props.navigation.navigate('OtherScreen');
    }


    _keyExtractor = (item, index) => {
        return index.toString();
    }

    _renderItem (row, navigation) {
        // console.log(row)
        return (
            <ListItem
                // component
                key={row.index}
                containerStyle={styles.rowCont}
                title={row.item.title}
                titleStyle={{color:'black'}}
                chevronColor={'rgba(0,96,169, 1)'}
                onPress={() => {
                    /* 1. Navigate to the Details route with params */
                    navigation.navigate(row.item.setting, {
                      itemId: row.item.id,
                      item: row.item,
                    });
                }}
                // leftIcon={{name: row.item.icon}}
                />
        )
    }

    _feedbackPage = () => {
        // this.props.navigation.navigate('Feedback');

        const url = 'mailto:vetcomments@1800petmeds.com?subject=Vet+App+Feedback&body=';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    _logout = () => {

        onSignOut()
        .then(() => {
            this.props.navigation.navigate("SignIn")
        })
    };


    render() {
        return (
            <View style={styles.container}>

                {this.state.fontLoaded ?
                    <View style={{flex:1,padding:0,margin:0}}>
                        <ScrollView contentContainerStyle={{ paddingVertical: 0 }}>
                            <List containerStyle={styles.listContainer}>
                                {<FlatList
                                    data={list}
                                    extraData={this.state}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={item => this._renderItem(item, this.props.navigation)}
                                />}
                            </List>
                        </ScrollView>

                        <View style={styles.footer2button}>
                            <Button
                                title="Send Us Your Feedback"
                                loading={false}
                                iconContainerStyle={{marginRight: 10}}
                                containerStyle={{marginTop: 20, width: 300, height: 45}}
                                loadingProps={{size: 'large', color: 'rgba(111, 202, 186, 1)'}}
                                buttonStyle={styles.fullBtnInverse}
                                // titleStyle={{color: 'rgba(0,96,169, 1)'}}
                                color={'rgba(0,96,169, 1)'}
                                onPress={this._feedbackPage}
                                />
                            <Button
                                title="Sign Out"
                                loading={false}
                                iconContainerStyle={{marginRight: 10}}
                                loadingProps={{size: 'large', color: 'rgba(111, 202, 186, 1)'}}
                                buttonStyle={styles.fullBtn}
                                titleStyle={[styles.fullBtnTxt]}
                                containerStyle={{marginTop: 20, width: 300, height: 45}}
                                onPress={this._logout}
                                />
                        </View>
                    </View>


                    :
                    <Text>Loading...</Text>
                }

            </View>
        );
    }


}
