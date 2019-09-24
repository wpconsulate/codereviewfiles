import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    FlatList,
    View,
    RefreshControl,
    ActivityIndicator
    } from "react-native";
import { Card, Button, List, ListItem } from "react-native-elements";
import {gaTrack} from "../helper";
import Head from "./head";
import Subnav from "./SubNav";
import ListFooter from "./ListFooter";
import moment from 'moment';

import { _getRxData,_storePreRxData} from '../services/data/DataStore'
import {Session} from '../services/data/Session'

import styles from "./Styles";
import Events from '../services/Events';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Outbox extends Component {


    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,

            draft_items:null,
            items:null
        };

    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            headerBackTitle: null,
            title: params ? params.otherParam : 'A Nested Details Screen',
            header:  <Head navigation={navigation} />  // Your custom header
        }
    };


    componentDidMount() {

        this._loadData(this);

        this.refreshEvent = Events.subscribe( 'RefreshList', () => this._loadData(this) );
        gaTrack( "Outbox Listing" );

    }

    componentWillUnmount () {
        this.refreshEvent.remove();
    }

    _loadData(th){

        const _this = th;
        _this.setState({ isLoading: true });

        _storePreRxData( function(data){
            // console.log(data);
            _this.setState({ items: data.sentRx, isLoading:false });
            _getRxData( Session.db.outboxDraft, function(drafts){
                _this.setState({ draft_items: drafts });
            });
        });
    }


    _keyExtractor = (item, index) => {
        return item.rxID.toString()+index;
    }

    _renderItem (row, nav, type) {
        // console.log(row)
        return (
            <ListItem
                    roundAvatar
                    key={row.item.rxID}
                    containerStyle={styles.rowCont}
                    title={
                        <View style={styles.titleViewCont}>
                            <View style={styles.itemStatus}>
                            </View>
                            <View style={styles.titleSec}>
                                <Text style={styles.dateView}>{type == 'sent'?"Sent "+row.item.vetdate:moment.unix(row.item.vetdate).format('MM/DD/YYYY')}</Text>
                                <Text style={[styles.titleView]}>{row.item.client}</Text>
                                <Text style={styles.subtitleView}>{row.item.petname + " / "+row.item.rx+" / "+row.item.vetName}</Text>
                            </View>
                            <View style={styles.viewLink}>
                                <Button
                                    onPress={() => {
                                        nav.navigate('OutboxView', {
                                            rxID: row.item.rxID,
                                            onum: row.item.onum,
                                            type: type,
                                            pageTitle: row.item.client,
                                            subTitle: "# "+row.item.phone,
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

        // if( this.state.items === null || ( this.props.navigation.state.params !== undefined && this.props.navigation.state.params.refreshData !== undefined ) ){
        //     //Load Outbox Data
        //     this._loadData();
        // }

        if(!this.state.isLoading){
            return (
                <View style={styles.container}>

                    {this.state.fontLoaded ?
                        <View style={styles.flexContainer}>

                            <Subnav navigation={this.props.navigation} active={'Outbox'} />

                            <View style={styles.listWrapper}>
                                <ScrollView contentContainerStyle={{ paddingVertical: 0 }}
                                    refreshControl={
                                        <RefreshControl
                                          refreshing={this.state.isLoading}
                                          onRefresh={()=>{this._loadData(this)}}
                                        />
                                      }
                                    >
                                    <List containerStyle={styles.listContainer}>
                                        <FlatList
                                            data={this.state.items}
                                            extraData={this.state}
                                            keyExtractor={this._keyExtractor}
                                            renderItem={item => this._renderItem(item, this.props.navigation, 'sent')}
                                        />
                                    </List>
                                    <View style={[styles.skybg]}>
                                        <Text style={[styles.bold, styles.marB15, styles.marT15, {marginLeft:30}]}>DRAFTS</Text>
                                        <List containerStyle={[styles.listContainer, styles.skybg]}>
                                            <FlatList
                                                data={this.state.draft_items}
                                                extraData={this.state}
                                                keyExtractor={this._keyExtractor}
                                                renderItem={item => this._renderItem(item, this.props.navigation, 'draft')}
                                            />
                                        </List>
                                    </View>
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
                        <View style={styles.flexContainer} >
                            <Subnav navigation={this.props.navigation} active={'Outbox'} />
                            <View style={[styles.listWrapper, {justifyContent:'center',alignItems:'center'}]}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        </View>
                </View>
            );
        }
    }


}
