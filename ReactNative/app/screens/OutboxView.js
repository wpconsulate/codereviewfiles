import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    View,
    Alert,
    ActivityIndicator
    } from "react-native";
import { Button } from "react-native-elements";
import styles from "./Styles";
import {gaTrack} from "../helper";
import Events from '../services/Events';
import {
        _updateRxItemField,
        _getRxItem,
        _withdrawRx,
        _sendRxData,
        deleteRx,
        } from '../services/data/DataStore'
import {
        _editPhone,
        _editPetName,
        _editPatientName,
        _editRxItem,
        _editInstructions,
        _editQty,
        _editRefill,
        } from './components/RxEditActions'
import {Session} from '../services/data/Session'



export default class OutboxView extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: false,
            editing:false,
            isLoading: false,
            isSending: false,
            storage_key: null,
            refreshData:false,
            itemId:null,
            item:null,
        };

    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle:<View style={[styles.selfCenter, styles.headerCenterWidth]}>
                            <View style={styles.selfCenter}><Text style={styles.pageTitle}>{params.pageTitle}</Text></View>
                            <View style={styles.selfCenter}><Text style={styles.pageSubTitle}>{params.subTitle}</Text></View>
                        </View>,
            headerStyle:styles.headerStyle2
        }
    };


    componentDidMount() {

        this.refreshEvent = Events.subscribe( 'OutRefreshData', () => this._loadItem(this) );
        gaTrack( "Outbox Rx View" );
    }

    componentWillMount () {
        if( (this.state.item === null) || ( this.props.navigation.state.params !== undefined && this.props.navigation.state.params.refreshData !== undefined ) ){
            // set it to undefined so it doesn't keep running update
            this.props.navigation.state.params.refreshData=undefined;
            this._loadItem();
        }
    }
    componentWillUnmount () {
        this.refreshEvent.remove();
    }


    _loadItem(){

        const _this = this;

        // Set Params set by Parent Screen
        const itemId = this.props.navigation.getParam('rxID', null);
        const onum = this.props.navigation.getParam('onum', null);
        const itemType = this.props.navigation.getParam('type', null);

        // Fetch RXItem Data and update State
        if(itemType == 'sent'){
            _getRxItem(Session.db.outbox, itemId, onum, function(data){
                _this.setState({
                    fontLoaded: true,
                    itemId: itemId,
                    item: data,
                    refreshData:false,
                    storage_key: Session.db.outbox
                });
            });
        }
        else{
            _getRxItem(Session.db.outboxDraft, itemId, onum, function(data){
                _this.setState({
                    fontLoaded: true,
                    itemId: itemId,
                    item: data,
                    refreshData:false,
                    storage_key: Session.db.outboxDraft
                });
                // Mark this Item as Read
                // _this._markAsRead(itemId, Session.db.outboxDraft);
            });
        }

    }


    _withdrawConfirm(rxId){

        // this.props.navigation.navigate('WidthdrawConfirm', { rxID: rxId });

        Alert.alert(
            'Widthraw RX',
            'Are you Sure you want to withdraw this Rx?',
            [
              {text: 'Yes Please, Withdraw!', onPress: () => {
                                                            if(this.state.storage_key==Session.db.outbox) // If PreRx
                                                                this._delete(rxId)
                                                            else
                                                                this._withdraw(rxId)
                                                            }
                            },
              {text: 'Cancel', onPress: () => console.log('Cancel Withdraw!'), style: 'cancel'}
            ],
            { cancelable: false }
          )
    }


    _delete = (rxId) =>{
        const _this = this;
        _this.setState({ isLoading: true });

        deleteRx(rxId, function(res){
            _this.setState({ isLoading: false });

            if(res !== undefined && res.error !== undefined){
                if(res.error != "Error Reading Vet" && res.error != "Error Deleting RX" && res.error != "Error, Not Owner"){
                    //refresh List on Outbox
                    Events.publish('RefreshList');

                    _this.props.navigation.navigate('Outbox',{
                        refreshData:true
                    })
                }
                else{
                    Alert.alert(
                        'Widthraw Error!',
                        res.error,
                        [
                          {text: 'Cancel', style: 'cancel'}
                        ],
                        { cancelable: true }
                      )
                }
            }

        });
    }

    _withdraw = (rxId) =>{
        const _this = this;
        _this.setState({ isLoading: true });
        _withdrawRx(rxId, function(){
            _this.setState({ isLoading: false });

            //refresh List on Outbox
            Events.publish('RefreshList');

            _this.props.navigation.navigate('Outbox',{
                refreshData:true
            })
        });
    }


    _sendRxLive = (rxId)=>{
        const _this = this;
        _this.setState({ isSending: true });

        // console.log(_this.state);

        if(this.state.storage_key==Session.db.outbox){
          setTimeout(function(){
                                _this.setState({ isSending: false });
                                _this.props.navigation.navigate('Outbox',{
                                    refreshData:true
                                })
                              }, 1000);
        }else{
          _sendRxData(Session.db.outboxDraft, rxId, function(res){

              _this.setState({ isSending: false });

              if(res.status == "true"){
                    //refresh List on Outbox
                    Events.publish('RefreshList');
                    _this.props.navigation.navigate('NewRXConfirm',{
                        refreshData:true,
                        updated:true,
                        petname:_this.state.item.petname,
                        fullname:_this.state.item.client
                    })
              }
              else{
                  Alert.alert(
                        'Error!',
                        res.error,
                        [{text: 'Okay', onPress: () => {}, style: 'cancel'}],
                        { cancelable: false }
                    )
              }

          });
        }

    }




    render() {

        const {navigation} = this.props;

        

        const {
            item,
            itemId,
            isLoading,
            isSending,
            storage_key
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
                                                <View style={styles.rxDetailsColEditable}>
                                                    <Text style={styles.rxDetailsLabel}>PHONE</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.phone}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColAction}>
                                                    <Text style={styles.rxEditLink} onPress={() => { _editPhone(item.rxID, storage_key, item.phone, navigation) }}  >EDIT</Text>
                                                </View>
                                            </View>


                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsColEditable}>
                                                    <Text style={styles.rxDetailsLabel}>PET NAME</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.petname}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColAction}>
                                                    <Text style={styles.rxEditLink} onPress={() => { _editPetName(item.rxID, storage_key, item.petname, navigation) }}  >EDIT</Text>
                                                </View>
                                            </View>

                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsColEditable}>
                                                    <Text style={styles.rxDetailsLabel}>PATIENT FULL NAME</Text>
                                                    <Text style={styles.rxDetailsTxt}>{item.client}</Text>
                                                </View>
                                                <View style={styles.rxDetailsColAction}>
                                                    <Text style={styles.rxEditLink} onPress={() => { _editPatientName(item.rxID, storage_key, item.client, navigation) }}  >EDIT</Text>
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
                                                <Text style={styles.rxEditLink} onPress={() => { _editRxItem(item.rxID, storage_key, item.rx, navigation) }}  >EDIT</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>INSTRUCTIONS</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.instruction}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                                <Text style={styles.rxEditLink} onPress={() => { _editInstructions(item.rxID, storage_key, item.instruction, navigation) }}  >EDIT</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>QUANTITY/NUMBER AUTHORIZED</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.qty}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                                <Text
                                                    style={styles.rxEditLink} onPress={() => { _editQty(item.rxID, storage_key, item.qty, navigation) }}  >EDIT</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>NUMBER OF REFILLS</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.refill}</Text>
                                            </View>
                                            <View style={styles.rxDetailsColAction}>
                                                <Text style={styles.rxEditLink}  onPress={() => { _editRefill(item.rxID, storage_key, item.refill, navigation) }}  >EDIT</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rxDetailsColRow}>
                                            <View style={styles.rxDetailsColEditable}>
                                                <Text style={styles.rxDetailsLabel}>Vet Name</Text>
                                                <Text style={styles.rxDetailsTxt}>{item.vetName}</Text>
                                            </View>

                                        </View>

                                    </View>

                                </ScrollView>

                            </View>


                            <View style={styles.footer2horizontal}>
                                <Button
                                    title="Withdraw Rx"
                                    loading={isLoading}
                                    color={'red'}
                                    loadingProps={{ size: 'large',color: 'red'}}
                                    titleStyle={{fontWeight: '700'}}
                                    buttonStyle={styles.halfBtnDanger}
                                    disabled={isLoading}
                                    disabledStyle={styles.disabledBtn}
                                    containerViewStyle={{ marginLeft: 0,marginLeft: 0, padding: 0, }}
                                    onPress={() => { this._withdrawConfirm(item.rxID) }}
                                    />

                                <Button
                                    title="Send Changes"
                                    loading={isSending}
                                    loadingProps={{size: 'large', color: 'rgba(111, 202, 186, 1)'}}
                                    titleStyle={{fontWeight: '700'}}
                                    disabled={ isSending }
                                    disabledStyle={styles.disabledBtn}
                                    buttonStyle={styles.halfBtn}
                                    containerViewStyle={{ marginLeft: 0,marginLeft: 0, padding: 0, }}
                                    onPress={() => { this._sendRxLive(item.rxID) }}
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
