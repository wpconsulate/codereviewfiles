import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    View,
    ActivityIndicator
    } from "react-native";
import { Button } from "react-native-elements";
import * as Print from "expo-print";
import styles from "./Styles";

import moment from 'moment';
import {Session} from '../services/data/Session'
import {gaTrack} from "../helper";
import {_updateRxReadStatus, _getRxItem} from '../services/data/DataStore'
import {
        _editRxItem,
        _editInstructions,
        _editQty,
        _editRefill,
        } from './components/RxEditActions'

export default class ProcessedView extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isLoading: false,
            makingAPICall: false,

            pageTitle : "Louise Reich",
            subTitle : "REF #3084073",

            itemId:null,
            item:null
        };

    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle:  <View style={[styles.selfCenter, styles.headerCenterWidth]}>
                                <View style={styles.selfCenter}><Text style={styles.pageTitle}>{params.pageTitle}</Text></View>
                                <View style={styles.selfCenter}><Text style={styles.pageSubTitle}>{params.subTitle}</Text></View>
                            </View>,
            headerStyle:styles.headerStyle2
        }
    };

    componentWillMount() {
        //Load the Data from DB once
        if( this.props.navigation.state.params.refreshData !== undefined || this.state.item === null ){
            this.props.navigation.state.params.refreshData = undefined;
            this._loadItem();
        }
    }

    componentDidMount() {
        gaTrack( "Processed Rx View" );
    }

    _loadItem(){

        const _this = this;

        if(this.state.makingAPICall) return;
        _this.setState({makingAPICall:true});

        // Set Params set by Parent Screen
        const itemId = this.props.navigation.getParam('rxID', null);
        const onum = this.props.navigation.getParam('onum', null);

        // Fetch RXItem Data and update State
        _getRxItem(Session.db.processed, itemId, onum, function(data){

            console.log(data);

            if(data !== undefined){
                _this.setState({
                    fontLoaded: true,
                    itemId: itemId,
                    makingAPICall: false,
                    item: data
                });

                //Set Subtitle
                _this.props.navigation.setParams({
                    subTitle:data.ref_id
                });

                pageTitle = data.vetauthname;

                // Mark this Item as Read
                _this._markAsRead(itemId);
            }
            else{
                console.log(data)
            }

        });
    }

    _markAsRead = (itemId) => {
        if( itemId != null ){
            _updateRxReadStatus( itemId, false );
        }
    }

    printDoc = () => {
        console.log("Printing...")
        Print.printAsync({
            html:'<table border="0px solid #000;" style="margin:0 auto;font-family: arial;width:100%"><tbody><tr><td>'+
                    '<table width="100%" style="padding: 25px;"><tbody><tr>'+
                        '<td> <h5 style="color: rgba(155,155,155); margin: 0; font-size: 18px;">ORDER DATE</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.order_date+'</span></td>'+
                        '<td><h5 style="color: rgba(155,155,155); margin: 0; font-size: 18px;">CUSTOMER#</h5><span style="padding-bottom: 15px;font-size: 20px;">'+this.state.item.customer_id+'</span></td>'+
                    '</tr><tr>'+
                        '<td> <h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">CUSTOMER FULL NAME</h5><span style="padding-bottom: 15px;">'+this.state.item.client+'</span></td>'+
                        '<td><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">PHONE</h5><span style="padding-bottom: 15px;font-size: 20px;">'+this.state.item.phone+'</span></td>'+
                    '</tr><tr>'+
                        '<td> <h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">PET NAME</h5><span style="padding-bottom: 15px;">'+this.state.item.petname+'</span></td>'+
                        '<td><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">BREED</h5><span style="padding-bottom: 15px;font-size: 20px;">'+this.state.item.breed+'</span></td>'+
                    '</tr><tr>'+
                        '<td colspan=2><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">ADDRESS</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.address+'</span></td>'+
                    '</tr><tr>'+
                        '<td colspan=2><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 45px; font-size: 18px;">RX ITEM</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.rx+'</span></td>'+
                    '</tr><tr>'+
                        '<td colspan=2><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">INSTRUCTIONS</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.instruction+'</span></td>'+
                    '</tr><tr>'+
                        '<td colspan=2><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">QUANTITY/NUMBER AUTHORIZED</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.qty+'</span></td>'+
                    '</tr><tr>'+
                        '<td colspan=2><h5 style="color: rgba(155,155,155); margin: 0; padding-top: 10px; font-size: 18px;">NUMBER OF REFILLS</h5><span style="padding-bottom: 15px; font-size: 20px;">'+this.state.item.refill+'</span></td>'+
                    '</tr></tbody></table>'+
			    '</td></tr></tbody></table>'
        })
    }


    render() {

        const {navigation} = this.props;

        

        const {
            item,
            itemId
        } = this.state;


        if(  itemId != null && item != null ){

            return (
                <View style={styles.container}>
                    {this.state.fontLoaded ?
                        <View style={styles.flexContainer} >

                            <View style={[styles.listWrapper]}>

                                <ScrollView contentContainerStyle={{ paddingVertical: 0, borderWidth:0 }}>

                                    <View style={styles.rxSecContainer}>

                                            <View style={styles.rxDetailsColRow}>

                                                <View style={styles.rxDetailsColLeft}>
                                                    <Text style={styles.rxDetailsLabel}>ORDER DATE</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.order_date}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColRight}>
                                                    <Text style={styles.rxDetailsLabel}>CUSTOMER #</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.customer_id}</Text>
                                                </View>

                                            </View>

                                            <View style={styles.rxDetailsColRow}>

                                                <View style={styles.rxDetailsColLeft}>
                                                    <Text style={styles.rxDetailsLabel}>CUSTOMER FULL NAME</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.client}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColRight}>
                                                    <Text style={styles.rxDetailsLabel}>PHONE</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.phone}</Text>
                                                </View>

                                            </View>


                                            <View style={styles.rxDetailsColRow}>

                                                <View style={styles.rxDetailsColLeft}>
                                                    <Text style={styles.rxDetailsLabel}>PET NAME</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.petname}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColRight}>
                                                    <Text style={styles.rxDetailsLabel}>BREED</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.breed}</Text>
                                                </View>

                                            </View>

                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsCol}>
                                                    <Text style={styles.rxDetailsLabel}>ADDRESS</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.address}</Text>
                                                </View>
                                            </View>
                                    </View>


                                    <View style={[styles.rxSecContainer,{borderBottomColor:'white'}]}>
                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>RX ITEM</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.rx}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>INSTRUCTIONS</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.instruction}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>QUANTITY/NUMBER AUTHORIZED</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.qty}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>NUMBER OF REFILLS</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.refill}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>Status</Text>
                                                <Text style={styles.rxDetailsTxt}>{ item.rxstat == "DENY"?"Denied":"Approved" } by {item.responder}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                            </View>
                                        </View>

                                        {item.rxstat == "DENY" &&
                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsColEditable}>
                                                    <Text style={styles.rxDetailsLabel}>Reason</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.reason}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColAction}>
                                                </View>
                                            </View>
                                        }

                                    </View>

                                </ScrollView>

                            </View>


                            <View style={styles.footer}>
                                <Button
                                    onPress={()=>{this.printDoc()}}
                                    loading={this.state.isLoading}
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={[styles.fullBtnInverse,{height:50}]}
                                    containerViewStyle={{ }}
                                    color={"rgba(0, 96, 169, 1)"}
                                    fontSize={14}
                                    title={"Print Prescription"}
                                    titleStyle={{fontWeight: '700'}}
                                />
                            </View>

                        </View>

                    :
                        <Text>Loading...</Text>
                    }

                </View>
                );

            }else{

                return (
                    <View style={styles.container}>
                        <View style={styles.flexContainer} >
                            <View style={[styles.listWrapper, {justifyContent:'center',alignItems:'center'}]}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        </View>
                    </View>
                );
            }
        }


}
