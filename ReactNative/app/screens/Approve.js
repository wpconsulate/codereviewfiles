import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    View,
    Platform,
    ActivityIndicator,
    Keyboard,
    LayoutAnimation,
    Dimensions,
    BackHandler
    } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import styles from "./Styles";
import Events from '../services/Events';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {_updateRxReadStatus, _getRxItem, _approveDenyRx, _getUserData} from '../services/data/DataStore'
import {
        _editRxItem,
        _editInstructions,
        _editQty,
        _editRefill,
        } from './components/RxEditActions'
import { Session } from '../services/data/Session';
import { gaTrack, dbTables } from "../helper";

export default class Approve extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: true,
            isApproving: false,
            isDenying: false,
            makingAPICall: false,
            overlay: false,

            pageTitle : "Louise Reich",
            subTitle : "REF #3084073",

            qtyComment:null,
            refillComment:null,
            instructionComment:null,
            infoComments:null,
            vetauthname:null,

            isInfoCommentsValid:true,
            isQtyValid:true,
            isRefillValid:true,
            isInstructionValid:true,
            isPageDirty:false,
            isVetAuthNameValid:false,
            visibleHeight:null,

            itemId:null,
            item:null
        };

        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        // console.log(params)
        return {
            headerTitle: <View style={[styles.selfCenter, styles.headerCenterWidth]}>
                            <View style={styles.selfCenter}><Text style={styles.pageTitle}>{params.pageTitle}</Text></View>
                            <View style={styles.selfCenter}><Text style={styles.pageSubTitle}>{params.subTitle}</Text></View>
                        </View>,
            headerStyle:styles.headerStyle2
        }
    };


    //-----------------------------------------------------------------------------------------------
    //   Handle back click event
    //-----------------------------------------------------------------------------------------------
    // handleback(_this){

    //     if(_this.state.isPageDirty){
    //         alert("asdasda")
    //     }

    // }

    // onNavigatorEvent(event) {
    //     switch (event.id) {
    //       case 'willAppear':
    //         this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    //         break;
    //       case 'willDisappear':
    //         this.backPressed = 0;
    //         this.backHandler.remove();
    //         break;
    //       default:
    //         break;
    //     }
    // }

    // handleBackPress = () => {
    //     if (this.backPressed && this.backPressed > 0) {
    //       this.props.navigator.popToRoot({ animated: false });
    //       return false;
    //     }

    //     this.backPressed = 1;
    //     this.props.navigator.showSnackbar({
    //       text: 'Press one more time to exit',
    //       duration: 'long',
    //     });
    //     return true;
    // }
    //-----------------------------------------------------------------------------------------------
    //   Handle back click event
    //-----------------------------------------------------------------------------------------------


    componentDidMount() {

        //Load the Data from DB once
        if( this.props.navigation.state.params.refreshData !== undefined || this.state.item === null ){
            this._loadItem();
            // Set refreshData = undefined
            if(this.props.navigation.state.params.refreshData !== undefined)
                this.props.navigation.state.params.refreshData = undefined;
        }
        gaTrack( "Pending Rx View/Approve" );
    }

    _loadItem(){
        const _this = this;
        
        _getUserData(function(userdata){

            if(userdata.vetId !== undefined){
                  
                Session.user = userdata;
                Session.db =  dbTables(userdata.vetId);

                // Set Params set by Parent Screen
                const itemId = _this.props.navigation.getParam('rxID', null);
                const onum = _this.props.navigation.getParam('onum', null);

                // Fetch RXItem Data and update State
                _getRxItem(Session.db.pending, itemId, onum, function(data){
                    // console.log(data);
                    if(data !== undefined){
                        _this.setState({
                            fontLoaded: true,
                            itemId: itemId,
                            // makingAPICall: false,
                            qtyComment:data.qty,
                            refillComment:data.refill,
                            instructionComment:data.instruction,
                            vetauthname:data.vetauthname,
                            item: data
                        });

                        _this.props.navigation.setParams({
                            subTitle:data.ref_id
                        });

                        pageTitle = data.vetauthname;

                        // Mark this Item as Read
                        _this._markAsRead(itemId);
                    }
                    else{
                        // _this.setState({makingAPICall:true});
                        console.log(data)
                    }

                });
            }
        });
    }


    /*****************************************************************/
    //  Keyboard related functions
    /*****************************************************************/
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    keyboardDidShow (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let newSize = Dimensions.get('window').height - (e.endCoordinates.height + 0);
        this.setState({
            visibleHeight: newSize
        })
        console.log(Dimensions.get('window').height)
        console.log(e)
        console.log('keyboardDidShow')
    }

    keyboardDidHide (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            // visibleHeight: Dimensions.get('window').height
            visibleHeight: null
        })
        console.log('keyboardDidHide')
    }

    _scrollToInput (reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.scrollToFocusedInput(reactNode)
    }
    /*****************************************************************/
    // End of Keyboard related functions
    /*****************************************************************/

    

    _markAsRead = (itemId) => {
        if( itemId != null ){
            _updateRxReadStatus( itemId, true );
            Events.publish('RefreshList');
        }
    }

    onQtyChange = (val) => {
        this.setState({
            qtyComment:val,
            isPageDirty:true,
        })
    }
    onRefillChange = (val) => {
        this.setState({
            refillComment:val,
            isPageDirty:true,
        })
    }
    
    onVetAuthNameChange = (val) => {
        this.setState({
            vetauthname:val,
            isPageDirty:true,
        })
    }

    onInstructionChange = (val) => {
        this.setState({
            instructionComment:val,
            isPageDirty:true,
        })
    }
    onInfoChange = (val) => {
        this.setState({
            infoComments:val,
            isPageDirty:true,
        })
    }

    _chkEmptyVal = (val) => {
        if( val === null || val === "" )
            return true;
        return false;
    }


    _openDenyOverlay = () => {
        this.setState({overlay:true})
    }
    _hideDenyOverlay = () => {
        this.setState({overlay:false})
    }


    getFinalRx = () => {

        var instValid = true, qtyValid = true, vetAuthValid = true, refillValid = true;

        //Instructions
        if( this._chkEmptyVal(this.state.instructionComment) )  instValid = false;
        //Qty
        if( this._chkEmptyVal(this.state.qtyComment) )  qtyValid = false;
        //Refill
        if( this._chkEmptyVal(this.state.refillComment) )  refillValid = false;
        // Vetauthname
        if( this._chkEmptyVal(this.state.vetauthname) )  vetAuthValid = false;

        if(
            !instValid || !qtyValid || !refillValid || !vetAuthValid
        ){
            this.setState({
                isInstructionValid:instValid,
                isQtyValid:qtyValid,
                isRefillValid:refillValid,
                isVetAuthNameValid:vetAuthValid
            });
            return null;
        }

        var _item = this.state.item;

        _item.instructioncomment = this.state.instructionComment;
        _item.qtycomment = this.state.qtyComment;
        _item.refillcomment = this.state.refillComment;
        _item.info = this.state.infoComments;
        _item.vetauthname = this.state.vetauthname;

        return _item;

    }


    /**
     * @action = approve|deny
     */
    approveDenyRx = (action) => {
        const _this = this;

        var _item = this.getFinalRx();

        if(_item !== null){

            if(action == 'approve')
                _this.setState({ isApproving:true });
            if(action == 'deny')
                _this.setState({ isDenying:true });

            _approveDenyRx(_item, action, function(res){

                _this.setState({ isApproving:false, isDenying:false });
                if(res.status == "true"){
                    _this.props.navigation.navigate('Home', {
                        refreshData: true,
                        rxName: _item.client,
                        action: action,
                    });
                }
            })

            console.log(_item)
        }
    }


    _confirmDenyReason = () => {

        // Check Deny Comments
        if( this._chkEmptyVal(this.state.infoComments) ){
            this.setState({isInfoCommentsValid:false})
            return null;
        }else{
            this.approveDenyRx('deny')
        }

    }



    render() {

        const {
            isApproving,
            isDenying,
            qtyComment,
            refillComment,
            vetauthname,
            instructionComment,
            isInstructionValid,
            isQtyValid,
            isRefillValid,
            isVetAuthNameValid,
            item,
            itemId
        } = this.state;


        if(  itemId != null && item != null ){
            console.log("height:"+this.state.visibleHeight)
            return (
                <View style={[styles.container,{ maxHeight :this.state.visibleHeight}]} >
                    {this.state.fontLoaded ?
                        <View style={styles.flexContainer} >

                            <View style={[styles.listWrapper]}>

                                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} contentContainerStyle={{  }} enableOnAndroid={false} >

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
                                                <View style={styles.rxDetailsCol}>
                                                    <Text style={styles.rxDetailsLabel}>INSTRUCTIONS</Text>
                                                    <View style={[{}]}>
                                                        <FormInput
                                                            value={instructionComment}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            keyboardType='default'
                                                            returnKeyType={'done'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[!isQtyValid && styles.error, { marginLeft: 0,marginRight: 0, }]}
                                                            inputStyle={[{ borderWidth:0, paddingLeft:0, paddingBottom:12, paddingRight:35,paddingLeft:3 }, !isQtyValid && styles.error]}
                                                            placeholder={''}
                                                            ref={(ref) => this.qtyCommentInput = ref}
                                                            multiline = {true}
                                                            onChangeText={(Text) => this.onInstructionChange(Text) }
                                                            errorMessage={isQtyValid ? null : 'Pet Name is Required!'}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsCol}>
                                                    <Text style={styles.rxDetailsLabel}>QUANTITY/NUMBER AUTHORIZED</Text>
                                                    <View style={[{}]}>
                                                        <FormInput
                                                            value={qtyComment}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            keyboardType='default'
                                                            returnKeyType={'done'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[!isQtyValid && styles.error, { marginLeft: 0,marginRight: 0 }]}
                                                            inputStyle={[{ borderWidth:0, paddingLeft:0,paddingBottom:12, paddingRight:35,paddingLeft:3 }, !isQtyValid && styles.error]}
                                                            placeholder={''}
                                                            ref={(ref) => this.qtyCommentInput = ref}
                                                            onChangeText={(Text) => this.onQtyChange(Text) }
                                                            errorMessage={isQtyValid ? null : 'Pet Name is Required!'}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsCol}>
                                                    <Text style={styles.rxDetailsLabel}>NUMBER OF REFILLS</Text>
                                                    <View style={[{}]}>
                                                        <FormInput
                                                            value={refillComment}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            keyboardType='default'
                                                            returnKeyType={'done'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[!isRefillValid && styles.error, { marginLeft: 0,marginRight: 0 }]}
                                                            inputStyle={[{ marginLeft: 0, borderWidth:0,  paddingBottom:12, paddingRight:35,paddingLeft:3 }, !isRefillValid && styles.error]}
                                                            placeholder={''}
                                                            multiline = {true}
                                                            ref={(ref) => this.refillCommentInput = ref}
                                                            onChangeText={(Text) => this.onRefillChange(Text) }
                                                            errorMessage={isRefillValid ? null : 'Pet Name is Required!'}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.rxDetailsColRow}>
                                                <View style={styles.rxDetailsCol}>
                                                    <Text style={styles.rxDetailsLabel}>Prescribing Dr</Text>
                                                    <View style={[{}]}>
                                                        <FormInput
                                                            value={vetauthname}
                                                            keyboardAppearance='light'
                                                            autoCapitalize='none'
                                                            autoCorrect={false}
                                                            keyboardType='default'
                                                            returnKeyType={'done'}
                                                            blurOnSubmit={true}
                                                            containerStyle={[!isVetAuthNameValid && styles.error, { marginLeft: 0,marginRight: 0 }]}
                                                            inputStyle={[{ marginLeft: 0, borderWidth:0,  paddingBottom:12, paddingRight:35,paddingLeft:3 }, !isVetAuthNameValid && styles.error]}
                                                            placeholder={''}
                                                            multiline = {true}
                                                            ref={(ref) => this.vetAuthNameInput = ref}
                                                            onChangeText={(Text) => this.onVetAuthNameChange(Text) }
                                                        />
                                                    </View>
                                                </View>
                                            </View>


                                        </View>

                                    
                                </KeyboardAwareScrollView>

                            </View>

                            <View style={styles.footer2horizontal}>
                                <Button
                                    title="Deny"
                                    loading={isDenying}
                                    disabled={isDenying}
                                    disabledStyle={styles.disabledBtn}
                                    color={'red'}
                                    loadingProps={{ size: 'large',color: 'red'}}
                                    titleStyle={{fontWeight: '700'}}
                                    buttonStyle={styles.halfBtnDanger}
                                    containerViewStyle={{ marginLeft: 0,marginLeft: 0, padding: 0, }}
                                    onPress={() => {
                                        this._openDenyOverlay();
                                    }}
                                    />

                                <Button
                                    title="Approve Now"
                                    loading={isApproving}
                                    disabled={isApproving}
                                    disabledStyle={styles.disabledBtn}
                                    loadingProps={{size: 'large', color: 'rgba(111, 202, 186, 1)'}}
                                    titleStyle={{fontWeight: '700'}}
                                    buttonStyle={styles.halfBtn}
                                    containerViewStyle={{ marginLeft: 0,marginLeft: 0, padding: 0, }}
                                    onPress={() => {
                                        this.approveDenyRx('approve')
                                    }}
                                    />
                            </View>


                            {this.state.overlay?
                                <View style={[styles.overlay]}>
                                    <View style={[styles.overlayActionBar,styles.padScreen,styles.padT15,{marginBottom:0}]}>
                                        <Text
                                            style={[styles.overlayActionBarLeft, styles.grey]}
                                            onPress={() => { this._hideDenyOverlay() }}
                                        >CANCEL</Text>
                                    </View>

                                    <View style={[styles.inputContainer,styles.padScreen,{}]}>
                                        <FormLabel containerStyle={{}} labelStyle={{marginLeft:0,marginRight:0}}>REASON(S) FOR DENYING RX:</FormLabel>
                                        <FormInput
                                                value={this.state.infoComments}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'done'}
                                                blurOnSubmit={true}
                                                multiline = {true}
                                                containerStyle={styles.inputDefaultContainer}
                                                inputStyle={[styles.input, !this.state.isInfoCommentsValid && styles.error,{marginLeft: 0,borderBottomWidth:0}]}
                                                placeholder={''}
                                                onChangeText={(text)=> { this.onInfoChange(text) }}
                                        />
                                    </View>


                                    <Button
                                        title="Send Denial"
                                        loading={isDenying}
                                        disabled={isDenying}
                                        disabledStyle={styles.disabledBtn}
                                        color={'red'}
                                        loadingProps={{ size: 'large',color: 'red'}}
                                        titleStyle={{fontWeight: '700'}}
                                        buttonStyle={[styles.fullBtnInverse,{borderColor:'red'}]}
                                        containerViewStyle={[styles.fullBtnStikyBottom,{ marginLeft: 0,marginLeft: 0, padding: 0, }]}
                                        onPress={() => {
                                            this._confirmDenyReason();
                                        }}
                                        />


                                </View>
                                :
                                <View />
                            }
                        </View>
                        :
                        <Text>Loading...</Text>
                    }

                </View>
                );

            }else{
                return (
                    <View style={[styles.container,{ maxHeight :this.state.visibleHeight}]}>
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