import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    FlatList,
    View,
    RefreshControl,
    Platform,
    AsyncStorage,
    ActivityIndicator
    } from "react-native";
import { Card, Button, List, ListItem } from "react-native-elements";

import Head from "./head";
import ListFooter from "./ListFooter";
import Subnav from "./SubNav";
import moment from 'moment';
import styles from "./Styles";
import { gaTrack, dbTables, fabricUserSet } from "../helper";
import Icon from 'react-native-vector-icons/FontAwesome';

import {Session} from '../services/data/Session'
import Events from '../services/Events';
import { _storeAPIRxData, _getUserData, _getNotifySettings, _saveNotifySettings } from '../services/data/DataStore';

import { UrbanAirship } from 'urbanairship-react-native';

const DisplayMsg = (props) => {
    var msgTxtSuccess="You approved the Rx for "+props.rxName+".";
    var msgTxtErr="You denied the Rx for "+props.rxName+".";
    if(props.showMsg){

        if(props.msgType === "approve"){

            return (
                <View style={[styles.rxDetailsColRow]}>
                    <View style={[styles.rxDetailsColAction, styles.marR10]}>
                        <Icon
                            name='check-circle-o'
                            size={25}
                            style={[styles.blue]}
                        />
                    </View>
                    <View style={[styles.rxDetailsColEditable, styles.alignVCenter]}>
                        <Text style={styles.blue}>{msgTxtSuccess}</Text>
                    </View>
                </View>
            );

        }
        if(props.msgType === "deny"){

            return (
                <View style={[styles.rxDetailsColRow]}>
                    <View style={[styles.rxDetailsColAction, styles.marR10]}>
                        <Icon
                            name='times-circle-o'
                            size={25}
                            style={[styles.red]}
                        />
                    </View>
                    <View style={[styles.rxDetailsColEditable, styles.alignVCenter]}>
                        <Text style={styles.red}>{msgTxtErr}</Text>
                    </View>
                </View>
            );

        }

    }

    return null;

};



export default class Home extends Component {


    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: true,

            items:[],
            userData:{},

            // Show Message Values
            rxName:'Client',
            showMsg:false,
            msgType:'error',  // Possible success/warning/error/approve/deny

        };

    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            headerBackTitle: null,
            // title: params ? params.otherParam : 'A Nested Details Screen',
            header:  <Head navigation={navigation} />  // Your custom header
        }
    };

    componentWillMount() {
        
    }

    componentDidMount() {
        this._loadData(this);
        this.refreshEvent = Events.subscribe('RefreshList', () => this._loadData(this));

        // GA Track
        gaTrack( "Pending List" );

        // Fabric Tracking
        fabricUserSet(Session.user);

        this.subs = [
            this.props.navigation.addListener('didFocus', () => this._onScreenFocus()),
        ];

        this.__updateUAPushStatus(true);
        
    }

    componentWillUnmount () {
        this.refreshEvent.remove();
        this.subs.forEach(sub => sub.remove());
    }

    _loadData = (th) => {
        //update Store API Data
        var _this = th;
        _this.setState({ isLoading: true });
        _getUserData(function(userdata){
            if(userdata.vetId !== undefined){
                Session.user = userdata;
                Session.db =  dbTables(userdata.vetId);
                _storeAPIRxData( Session.db.pending, function(data){
                    if(data !== null)
                        _this.setState({ items: data.pendingRx, isLoading:false });
                }); 
            }
        });
    }

    _onScreenFocus(){
    }

    __updateUAPushStatus = (status) => {
        UrbanAirship.setUserNotificationsEnabled(status);
        UrbanAirship.addTag(Session.user.vetId);
        // UrbanAirship.setNamedUser(Session.user.vetId);

        // Call the API to save default settings
        this.__updateAPISettings();
    }

    __updateAPISettings(){
        // removeItem('APPLOADED');
        // Code block to restart the App on Load
        AsyncStorage.getItem('APPLOADED')
        .then(res => {
            if (res === null) {
                if(Platform.OS !== 'ios'){
                    AsyncStorage.setItem('APPLOADED', "true");
                    _getNotifySettings(function(settings){
                        settings.pushEnabled = 1;
                        settings.pendingRxEnabled = 1;
                        _saveNotifySettings(settings);
                        _this.setState(settings);
                    })
                }
            }
        })
        .catch(err => reject(err));
    }

    _keyExtractor = (item, index) => {
        // return ( "rx_" + item.rxID.replace(/[^\w\s]/gi, '')+index).toString();
        return Math.floor((Math.random() * 100000000) + 1).toString();
    }


    _renderItem (row) {
        
        return (
            <ListItem
                    roundAvatar
                    key={row.item.rxID}
                    containerStyle={styles.rowCont}
                    title={
                        <View style={styles.titleViewCont}>
                            <View style={styles.itemStatus}>
                                {!row.item.read &&
                                    <Icon
                                        name='circle'
                                        size={10}
                                        style={styles.unredDot}
                                    />
                                }
                            </View>
                            <View style={styles.titleSec}>
                                <Text style={styles.dateView}>{ moment(row.item.vetdate).format('MM/DD/YYYY') }</Text>
                                <Text style={[styles.titleView, !row.item.read && styles.titleUnread]}>{row.item.client?row.item.client:"N/A"}</Text>
                                <Text style={styles.subtitleView}>{row.item.petname + " / "+row.item.rx}</Text>
                            </View>
                            <View style={styles.viewLink}>
                                <Button
                                    onPress={() => {
                                        this.props.navigation.navigate('Approve', {
                                            rxID: row.item.rxID,
                                            onum: row.item.onum,
                                            pageTitle: row.item.client,
                                            subTitle: ".....",
                                        });
                                      }}
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={[styles.viewBtn]}
                                    color={"rgba(0, 96, 169, 1)"}
                                    fontSize={14}
                                    title={'View'}
                                />
                            </View>
                        </View>
                    }
                    hideChevron={true}
                    // avatar={{uri:item.avatar_url}}
            />
        )
    }



    render() {

        // Check and Show the Display Message for Approve/Deny
        if(
            this.props.navigation.state.params !== undefined &&
            this.props.navigation.state.params.refreshData === true &&
            ( this.props.navigation.state.params.action === "approve" || this.props.navigation.state.params.action === "deny" )
         ){
            this.setState({
                showMsg:true,
                msgType:this.props.navigation.state.params.action,
                rxName:(this.props.navigation.state.params.rxName!==undefined)?this.props.navigation.state.params.rxName:'Client',
            });
            this.props.navigation.state.params.refreshData = undefined;
            this._loadData(this);
            setTimeout(function() {
                    this.props.navigation.state.params.action = undefined;
                    this.setState({showMsg:false});
                }
                .bind(this),
                10000
            );
        }
        
        //Reset Badge Count works on iOS only
        if(Platform.OS === 'ios')
            UrbanAirship.setBadgeNumber(0);
        
        //Clear all Notifications
        UrbanAirship.clearNotifications();

        const { navigate } = this.props.navigation;

        if(!this.state.isLoading){

            if(this.state.items.length){

                    return (
                        <View style={styles.container}>

                            {this.state.fontLoaded ?
                                <View style={styles.flexContainer} >

                                    <Subnav navigation={this.props.navigation} active={'Home'} />
                                    <View style={styles.listWrapper}>

                                        <ScrollView contentContainerStyle={{ paddingVertical: 0, borderWidth:0 }}
                                            refreshControl={
                                                <RefreshControl
                                                refreshing={this.state.isLoading}
                                                onRefresh={()=>{this._loadData(this)}}
                                                />
                                            }
                                            >

                                            <DisplayMsg showMsg={this.state.showMsg} msgType={this.state.msgType} rxName={this.state.rxName}  />


                                            <List containerStyle={styles.listContainer}>
                                                <FlatList
                                                    data={this.state.items}
                                                    extraData={this.state}
                                                    keyExtractor={this._keyExtractor}
                                                    renderItem={item => this._renderItem(item)}
                                                />
                                            </List>
                                        </ScrollView>
                                    </View>

                                    <ListFooter navigation={this.props.navigation} />

                                </View>
                                :
                                <Text>Loading...</Text>
                            }

                        </View>
                    );
            }
            else{
                return (
                    <View style={styles.container}>
                        {this.state.fontLoaded ?
                            <View style={styles.flexContainer} >

                                <Subnav navigation={this.props.navigation} active={'Home'} />

                                <View style={[styles.listWrapper, styles.flexContainer,styles.alignVCenter,styles.alignItems]}>

                                    <ScrollView contentContainerStyle={{ paddingVertical: 0, borderWidth:0 }}
                                            refreshControl={
                                                <RefreshControl
                                                refreshing={this.state.isLoading}
                                                onRefresh={()=>{this._loadData(this)}}
                                                />
                                            }
                                            >

                                            <DisplayMsg showMsg={this.state.showMsg} msgType={this.state.msgType} rxName={this.state.rxName}  />

                                            <Text style={[styles.selfCenter]} >No Record Found!</Text>

                                    </ScrollView>


                                </View>

                                <ListFooter navigation={this.props.navigation} />

                            </View>
                            :
                            <Text>Loading...</Text>
                        }

                    </View>
                );
            }
        }
        else{
            return (
                <View style={styles.container}>
                    <View style={styles.flexContainer} >
                        <Subnav navigation={this.props.navigation} active={'Home'} />
                        <View style={[styles.listWrapper, {justifyContent:'center',alignItems:'center'}]}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    </View>
                </View>
            );
        }

    }


}