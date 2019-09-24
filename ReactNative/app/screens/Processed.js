import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    RefreshControl,
    ActivityIndicator,
    FlatList,
    View
    } from "react-native";
import { Card, Button, List, ListItem } from "react-native-elements";

import moment from 'moment';
import Head from "./head";
import Subnav from "./SubNav";
import ListFooter from "./ListFooter";
import {gaTrack} from "../helper";
import {Session} from '../services/data/Session'
import {_storeAPIRxData} from '../services/data/DataStore'

import styles from "./Styles";

import Icon from 'react-native-vector-icons/FontAwesome';


export default class Processed extends Component {


    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: true,
            items:[],

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
        gaTrack( "Processed Listing" );

    }

    _loadData = (th) => {
        //update Store API Data
        var _this = th;
        _this.setState({ isLoading: true });

        _storeAPIRxData( Session.db.processed, function(data){
            // console.log(data);
            _this.setState({ isLoading: false, items: data.processedRx, });
        });
    }


    _keyExtractor = (item, index) => {
        return item.rxID.toString()+index;
    }


    _renderItem (row, nav) {

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
                                <Text style={styles.dateView}>{moment(row.item.vetdate).format('MM/DDD/YYYY') }</Text>
                                <Text style={[styles.titleView]}>{row.item.client}</Text>
                                <Text style={styles.subtitleView}>{row.item.petname + " / "+row.item.rx}</Text>
                            </View>
                            <View style={styles.viewLink}>
                                <Button
                                    onPress={() => {
                                        nav.navigate('ProcessedView', {
                                            rxID: row.item.rxID,
                                            onum: row.item.onum,
                                            pageTitle: row.item.client,
                                            subTitle: "...",
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


    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };




    render() {

        if(!this.state.isLoading){

            if(this.state.items.length){

                    return (
                        <View style={styles.container}>

                            {this.state.fontLoaded ?
                                <View style={styles.flexContainer} >

                                    <Subnav navigation={this.props.navigation}  active={'Processed'} />

                                    <View style={styles.listWrapper}>

                                        <ScrollView contentContainerStyle={{ paddingVertical: 0, borderWidth:0 }}
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
                                                    renderItem={item => this._renderItem(item, this.props.navigation)}
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

                                <Subnav navigation={this.props.navigation} active={'Processed'} />

                                <View style={[styles.listWrapper, styles.flexContainer,styles.alignVCenter,styles.alignItems]}>

                                    <ScrollView contentContainerStyle={{ paddingVertical: 0, borderWidth:0 }}
                                            refreshControl={
                                                <RefreshControl
                                                refreshing={this.state.isLoading}
                                                onRefresh={()=>{this._loadData(this)}}
                                                />
                                            }
                                            >

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
                            <Subnav navigation={this.props.navigation}  active={'Processed'} />
                            <View style={[styles.listWrapper, {justifyContent:'center',alignItems:'center'}]}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        </View>
                </View>
            );
        }
    }


}
