import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert,AsyncStorage, Platform } from "react-native";
import { Text, Button, List, ListItem } from "react-native-elements";

import QuiteHrs from '../components/QuiteHrs';
import styles from "./Styles";
import {gaTrack} from "../helper";
import moment from 'moment';
import { _getNotifySettings, _saveNotifySettings } from '../services/data/DataStore'
import { Session } from '../services/data/Session';
import {
    UrbanAirship,
    UACustomEvent,
  } from 'urbanairship-react-native';
import { retrieveItem,storeItem,removeItem } from '../services/data/DataStore'


const qhTemplate = {
                        on: "weekdays",                                   // This value needs to be determined but varname will remain the same
                        from: moment().format('HH:mm'),                   // Unix Timestamp
                        to: moment().add(1, 'day').format('HH:mm')        // Unix Timestamp
                    };



export default class Notifications extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isLoading: false,
            fontLoaded: true,
            quiteHrsCount:0,

            pushEnabled: false,
            pendingRxEnabled: false,
            quiteHrsEnabled: false,
            quiteHrs:null
        };

    }

    componentDidMount() {

        const _this = this;
        // removeItem('APPLOADED');
        // Code block to restart the App on Load
        AsyncStorage.getItem('APPLOADED')
        .then(res => {
            
            if (res === null) {
                if(Platform.OS !== 'ios'){
                    AsyncStorage.setItem('APPLOADED', "true");
                    console.log(res)
                    _getNotifySettings(function(settings){
                        settings.pushEnabled = 1;
                        settings.pendingRxEnabled = 1;
                        _saveNotifySettings(settings);
                        _this.setState(settings);
                    })
                }
                else{
                    _getNotifySettings(function(settings){
                        _this.setState(settings);
                    });
                }
            }
            else{
                _getNotifySettings(function(settings){
                    _this.setState(settings);
                });
            }
        })
        .catch(err => reject(err));

        // console.log(Session);


        gaTrack( "Notification Settings" );

    }

    addNewQuiteHrs = () => {
        const _this = this;
        _getNotifySettings(function(settings){

            settings.quiteHrs.push(qhTemplate);
            settings.quiteHrsCount= parseInt(settings.quiteHrsCount)+1;
            _this.setState(settings);
            _saveNotifySettings(settings);

        })

    }

    removeQuiteHrs = (removeIndex) => {
        const _this = this;
        _getNotifySettings(function(settings){
            settings.quiteHrs.splice(removeIndex, 1);
            settings.quiteHrsCount= parseInt(settings.quiteHrsCount)-1;
            _this.setState(settings);
            _saveNotifySettings(settings);
        })

    }


    updateQuiteHours = (index, key, val) => {
        const _this = this;
        _getNotifySettings(function(settings){
            settings.quiteHrs[index][key]=moment(val, ["h:mm A"]).format("HH:mm");
            console.log(settings);
            _this.setState(settings);
            _saveNotifySettings(settings);
        })
    }
    

    //Remove QH from Arr
    _handleRemoveQH = (index) => {
        Alert.alert(
            'Delete QH?',
            'Are you Sure you want to delete this Quite Hours Window?',
            [
                {text: 'Yes Please!', onPress: () => {
                                                    console.log("Removing..."+index)
                                                    this.removeQuiteHrs(index);
                                                    }
                },
                {text: 'Cancel', style: 'cancel'}
            ],
            { cancelable: false }
        )
    }


    //Quite Hours Select update
    _handleDayChange = (index, day) => {
        const _this = this;
        _getNotifySettings(function(settings){
            settings.quiteHrs[index]['on']=day;
            _this.setState(settings);
            _saveNotifySettings(settings);
        })
    }


    _handleTimeFromChange = (index, time) => {
        this.updateQuiteHours(index, 'from', time);
    }


    _handleTimeToChange = (index, time) => {
        this.updateQuiteHours(index, 'to', time);
    }
    

    __updateUAPushStatus = (status) => {
        console.log(status)
        UrbanAirship.setUserNotificationsEnabled(status);
        UrbanAirship.addTag(Session.user.vetId);
        // UrbanAirship.setNamedUser(Session.user.vetId);
    }

    
    _switchPush = (status) => {
        const _this = this;
        this.__updateUAPushStatus(status);
        _getNotifySettings(function(settings){
            // console.log(settings)
            settings.pushEnabled = (status)?1:0;
            _this.setState(settings);
            _saveNotifySettings(settings);
        })
    }


    _switchPendingRX = (status) => {
        const _this = this;
        _getNotifySettings(function(settings){
            settings.pendingRxEnabled = (status)?1:0;
            _this.setState(settings);
            _saveNotifySettings(settings);
        })
    }


    _switchQuiteHrs = (status) => {
        const _this = this;
        _getNotifySettings(function(settings){
            settings.quiteHrsEnabled = (status)?1:0;
            _this.setState(settings);
            _saveNotifySettings(settings);
        })
    }


    goToOtherScreen() {
        this.props.navigation.navigate('OtherScreen');
    }


    _keyExtractor = (item, index) => {
        return index.toString();
    }


    render() {
        return (
            <View style={styles.container}>

                {this.state.fontLoaded ?
                    <View style={{flex:1,padding:0,margin:0}}>
                        <KeyboardAvoidingView behavior='position'>
                            <ScrollView contentContainerStyle={{ paddingVertical: 0 }}>
                                <List containerStyle={styles.listContainer}>

                                    <ListItem
                                        // component
                                        key={'0'}
                                        containerStyle={styles.rowCont}
                                        title={'Push notifications'}
                                        titleStyle={{color:'black'}}

                                        subtitle="To enable push notifications, please see settings"
                                        // subtitleContainerStyle={{}}
                                        // subtitleStyle={''}
                                        subtitleNumberOfLines={2}
                                        onPress={() => {
                                        }}
                                        hideChevron={true}
                                        switchButton={true}
                                        switchDisabled={false}
                                        switched={(this.state.pushEnabled)?true:false}
                                        switchTintColor='rgba(218,230,239, 0.99)'
                                        switchOnTintColor='rgba(0, 96, 169, 0.99)'
                                        // switchThumbTintColor={this.state.pushEnabled?'rgba(0, 96, 169, 0.99)':'rgba(227,24,55,1)'}

                                        onSwitch={this._switchPush}
                                        // leftIcon={{name: row.item.icon}}
                                    />
                                    {this.state.pushEnabled ?
                                        <View>
                                            <ListItem
                                                // component
                                                key={'1'}
                                                containerStyle={styles.rowCont}
                                                title={'Pending Rx Requests'}
                                                titleStyle={{color:'black'}}
                                                subtitle="Turn this on to receive a notification when you receive a prescription that needs your approval. "
                                                // subtitleContainerStyle={{}}
                                                // subtitleStyle={''}
                                                subtitleNumberOfLines={3}
                                                onPress={() => {}}
                                                hideChevron={true}
                                                switchButton={true}
                                                switchDisabled={false}
                                                switched={(this.state.pendingRxEnabled)?true:false}
                                                switchOnTintColor='rgba(0, 96, 169, 0.99)'
                                                // switchThumbTintColor='rgba(0, 96, 169, 0.99)'
                                                // switchTintColor='rgba(0, 96, 169, 0.99)'
                                                onSwitch={this._switchPendingRX}
                                                // leftIcon={{name: row.item.icon}}
                                            />

                                            <ListItem
                                                // component
                                                key={'2'}
                                                containerStyle={styles.rowCont}
                                                title={'Observe Quiet Hours Rules'}
                                                titleStyle={{color:'black'}}
                                                subtitle="You are currently set up to receive notifications immediately. When this is turned to “On,” you will only receive notifications during the times selected below. "
                                                // subtitleContainerStyle={{}}
                                                // subtitleStyle={''}
                                                subtitleNumberOfLines={5}
                                                onPress={() => {
                                                }}
                                                hideChevron={true}
                                                switchButton={true}
                                                switchDisabled={false}
                                                switched={(this.state.quiteHrsEnabled)?true:false}
                                                switchOnTintColor='rgba(0, 96, 169, 0.99)'
                                                // switchThumbTintColor='rgba(0, 96, 169, 0.99)'
                                                // switchTintColor='rgba(0, 96, 169, 0.99)'
                                                onSwitch={this._switchQuiteHrs}
                                                // leftIcon={{name: row.item.icon}}
                                            />
                                            {this.state.quiteHrsEnabled ?
                                                <View>
                                                    <QuiteHrs
                                                        itemKey={this.state.quiteHrsCount}
                                                        day={'weekdays'}
                                                        qHrs={this.state.quiteHrs}
                                                        quiteHrsCount={this.state.quiteHrsCount}

                                                        _handleDayChange={this._handleDayChange}
                                                        _handleTimeFromChange={this._handleTimeFromChange}
                                                        _handleTimeToChange={this._handleTimeToChange}
                                                        _handleRemoveQH={this._handleRemoveQH}
                                                    />
                                                    <Text
                                                        style={[styles.quiteHoursAddBtn, styles.marContainerScreen, styles.blue]}
                                                        // onPress={() => console.log('1st')}
                                                        onPress={this.addNewQuiteHrs}
                                                        >
                                                        + Create Another Active Window
                                                    </Text>
                                                </View>
                                            :
                                                <Text>&nbsp;</Text>
                                            }

                                        </View>
                                    :
                                        <Text>&nbsp;</Text>
                                    }


                                </List>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>

                    :
                    <Text>Loading...</Text>
                }

            </View>
        );
    }


}
