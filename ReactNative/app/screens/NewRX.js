import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    Alert,
    Keyboard,
    View,
    ReactNative,
    TextInput,
    Dimensions,
    LayoutAnimation,
    } from "react-native";

import { FormLabel, FormInput, Button } from 'react-native-elements'
import styles from "./Styles";
import moment from 'moment';
import Events from '../services/Events';
import {gaTrack} from "../helper";
import { _addOutboxDraft, _buildRxObj, _saveNewRx } from '../services/data/DataStore'
import {Session} from '../services/data/Session'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextInputMask } from 'react-native-masked-text'


export default class NewRX extends Component {

    constructor(props) {

        super(props);

        this.state = {

            fontLoaded: true,
            isLoading: false,
            isFormDirty: false,
            userinfo:{},

            visibleHeight: null,

            //RX Vars
            rx_phone:'',
            rx_pet_name:'',
            rx_patient_name:'',
            rx_medication:'',
            rx_instructions:'',
            rx_qty:'',
            rx_number_refills:'',
            rx_vetname:'',

            //Validation Vars
            formValid:false,
            isPhoneValid:true,
            isPetNameValid:true,
            isPatientNameValid:true,
            isMedValid:true,
            isQtyValid:true,
            isRefillsValid:true,
            isVetNameValid:false,

            isError:false,
            errMsg:"OK",

        };

    }


    componentDidMount() {
        
        this.setState({  rx_vetname:Session.user.vetName });
        gaTrack( "New PreRx" );
    }


    /*****************************************************************/
    //  Keyboard related functions
    /*****************************************************************/
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));


        if( this.props.navigation.state.params !== undefined && this.props.navigation.state.params.refreshData !== undefined ){
            this.props.navigation.state.params.refreshData = undefined;
            this.resetData();
        }

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
    }

    keyboardDidHide (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            // visibleHeight: Dimensions.get('window').height
            visibleHeight: null
        })
    }

    _scrollToInput (reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.scrollToFocusedInput(reactNode)
    }

    /*****************************************************************/
    // End of Keyboard related functions
    /*****************************************************************/

    /**
     * @param {String} text the text AFTER mask is applied.
    */
    onPhoneChange(text) {
        this.setState({ rx_phone: text });
        if(!this._chkEmptyVal(text))
            this.setState({ isPhoneValid: true });
        else
            this.setState({ isPhoneValid: false });

    }

    /**
     * @param {String} previous the previous text in the masked field.
     * @param {String} next the next text that will be setted to field.
     * @return {Boolean} return true if must accept the value.
    */
    checkPhone(previous, next) {
        return previous !== next;
    }

    _chkEmptyVal = (val) => {
        if( val === null || val === "" )
            return true;
        return false;
    }

    _validateDraft = () => {

        var petValid = true, patientValid = true, errMsg = "OK";

        
        if( this._chkEmptyVal(this.state.rx_pet_name) ){
            // this.rx_pet_name_input
            petValid = false;
            if(errMsg == "OK")
                errMsg = "Pet Name is required!";
        }
        if( this._chkEmptyVal(this.state.rx_patient_name) ){
            // this.rx_pet_name_input
            patientValid = false;
            if(errMsg == "OK")
                errMsg = "Client Name is required!";
        }

        if( !petValid || !patientValid ){
            this.setState({
                isPetNameValid:petValid,
                isPatientNameValid:patientValid,
                isError:true,
                errMsg:errMsg,
            });
            return false;
        }
        else{
            this.setState({
                isPetNameValid:true,
                isPatientNameValid:true,
                isError:false,
            });
        }
        return true;
    }


    

    /**
     * Function to Submit the New RX to Draft or to 100PetMeds server
     */
    _submitDraftRx = () => {

        var _nav = this.props.navigation;
        var _this = this;

        // Validate Draft First
        if( !this._validateDraft())
            return false;

        try{
            _this.setState({ isLoading: true });
            _addOutboxDraft(
                [
                    this.state.rx_phone,
                    this.state.rx_pet_name,
                    this.state.rx_patient_name,
                    this.state.rx_medication,
                    this.state.rx_instructions,
                    this.state.rx_qty,
                    this.state.rx_number_refills
                ],
                function(rxId){
                    //refresh List on Outbox
                    Events.publish('RefreshList');

                    _this.setState({ isLoading: false });
                    _nav.navigate('NewRXDraftConfirm',{
                        rxId:rxId,
                        petname:_this.state.rx_pet_name,
                        fullname:_this.state.rx_patient_name,
                    });
                }
            )
        }catch (error) {
            console.log(error.message);
        }
    }


    _validateRxForm = () => {

        var phoneValid = true, petValid = true, patientValid = true, medValid = true, qtyValid = true, refillValid = true, vetNameValid = true, errMsg = "OK";

        //Phone
        if( this._chkEmptyVal(this.state.rx_phone) ){
            // this.rx_pet_name_input
            phoneValid = false;
            if(errMsg == "OK")
                errMsg = "Phone Number is required!";
        }
        if( this._chkEmptyVal(this.state.rx_pet_name) ){
            // this.rx_pet_name_input
            petValid = false;
            if(errMsg == "OK")
                errMsg = "Pet Name is required!";
        }
        if( this._chkEmptyVal(this.state.rx_patient_name) ){
            // this.rx_pet_name_input
            patientValid = false;
            if(errMsg == "OK")
                errMsg = "Client Name is required!";
        }
        if( this._chkEmptyVal(this.state.rx_medication) ){
            // this.rx_pet_name_input
            medValid = false;
            if(errMsg == "OK")
                errMsg = "Medication is required!";
        }
        if( this._chkEmptyVal(this.state.rx_qty) ){
            // this.rx_pet_name_input
            qtyValid = false;
            if(errMsg == "OK")
                errMsg = "Qty is required!";
        }
        if( this._chkEmptyVal(this.state.rx_number_refills) ){
            // this.rx_pet_name_input
            refillValid = false;
            if(errMsg == "OK")
                errMsg = "Refill is required!";
        }
        if( this._chkEmptyVal(this.state.rx_vetname) ){
            // this.rx_vetname
            vetNameValid = false;
            if(errMsg == "OK")
                errMsg = "Refill is required!";
        }

        if( !phoneValid || !petValid || !patientValid || !medValid || !qtyValid || !refillValid || !vetNameValid ){
            this.setState({
                isPhoneValid:phoneValid,
                isPetNameValid:petValid,
                isPatientNameValid:patientValid,
                isMedValid:medValid,
                isQtyValid:qtyValid,
                isRefillsValid:refillValid,
                isVetNameValid:vetNameValid,
                isError:true,
                errMsg:errMsg,
            });
            return false;
        }
        else{
            this.setState({
                isPhoneValid:true,
                isPetNameValid:true,
                isPatientNameValid:true,
                isMedValid:true,
                isQtyValid:true,
                isRefillsValid:true,
                isVetNameValid:true,
                isError:false,
            });
        }
        return true;
    }

    _saveNewRx = () => {

        var _nav = this.props.navigation;
        var _this = this;

        // Validate Data First
        if( !this._validateRxForm())
            return false;

        try{
            _this.setState({ isLoading: true });

            obj = _buildRxObj(
                                moment().unix(),
                                "PET*"+moment().unix(),
                                this.state.rx_phone,
                                this.state.rx_pet_name,
                                this.state.rx_patient_name,
                                this.state.rx_medication,
                                this.state.rx_instructions,
                                this.state.rx_qty,
                                this.state.rx_number_refills,
                                "",
                                false
                            );
            obj.vetName = this.state.rx_vetname;

            _saveNewRx( obj, function(res){
                if(res!==undefined || res!==null ){

                    _this.setState({ isLoading: false });
                    //refresh List on Outbox
                    Events.publish('RefreshList');

                    if(res.status == "true"){
                        // _nav.navigate('Outbox', { refreshData:true });
                        _nav.navigate('NewRXConfirm',{
                            // rxId:rxId,
                            petname:_this.state.rx_pet_name,
                            fullname:_this.state.rx_patient_name,
                        });
                    }
                    else{
                        Alert.alert(
                            'Error!',
                            res.error,
                            [{text: 'Okay', onPress: () => {}, style: 'cancel'}],
                            { cancelable: false }
                            )
                    }
                }
            });
        }catch (error) {
            console.log(error.message);
        }

    }

    resetData = () => {
        this.setState({
            rx_phone:null,
            rx_pet_name:null,
            rx_patient_name:null,
            rx_medication:null,
            rx_instructions:null,
            rx_qty:null,
            rx_number_refills:null,
            rx_vetname:Session.user.vetName,

            //Validation Vars
            formValid:false,
            isPhoneValid:true,
            isPetNameValid:true,
            isPatientNameValid:true,
            isMedValid:true,
            isQtyValid:true,
            isRefillsValid:true,
            isVetNameValid:false
        })
    }


    onFocusChange = () => {

        // this.scroll.scrollToFocusedInput(this)
        // console.log(this.)
        this.rx_qty_input.shake()
        // console.log(this.refs.rx_qty_input)
    }


    render() {

        const {
            isFormDirty,
            isLoading,
            rx_phone,
            rx_pet_name,
            rx_patient_name,
            rx_medication,
            rx_instructions,
            rx_qty,
            rx_number_refills,
            rx_vetname,
            isPhoneValid,
            isPetNameValid,
            isPatientNameValid,
            isMedValid,
            isQtyValid,
            isError,
            errMsg,
            isRefillsValid,
            isVetNameValid
        } = this.state;


        return (
            <View style={[styles.container,{maxHeight :this.state.visibleHeight}]}>

                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT30]} >

                            <View style={[styles.overlayActionBar,styles.padScreen]}>
                                <Text
                                    style={[styles.overlayActionBarLeft, styles.grey]}
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                        }}
                                    >
                                    CANCEL
                                </Text>
                                <Text
                                    style={[styles.overlayActionBarRight, styles.blue]}
                                    onPress={() => {
                                            // this.props.navigation.navigate('NewRXDraftConfirm');
                                            this._submitDraftRx()
                                        }}
                                    >
                                    SAVE AS DRAFT
                                </Text>
                            </View>

                            <View style={[styles.listWrapper,{}]}>

                                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} contentContainerStyle={{}}  enableOnAndroid={true} >

                                    <View style={[styles.formContainerFull,{paddingTop:0,}]}>

                                        <View style={[styles.inputContainer, styles.fade,{}]}>
                                            <FormLabel labelStyle={[!isPhoneValid && styles.error]}>PHONE NUMBER</FormLabel>

                                            <TextInputMask
                                                refInput={(ref) => this.rx_phone_input = ref}
                                                type={'cel-phone'}
                                                placeholder=""
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                options={{
                                                    dddMask: '999-999-9999',
                                                    getRawValue: function(value, settings) {
                                                        return value;
                                                    },
                                                }}
                                                style={[styles.input, !isPhoneValid && styles.error, {}]}
                                                onChangeText={(phone) => { this.onPhoneChange(phone) } }
                                                checkText={this.checkPhone.bind(this)}
                                                ref={(input) => this.rx_phone_input = input}
                                                value={rx_phone}
                                                onSubmitEditing={() => this.rx_pet_name_input.focus()}
                                                errorMessage={isPhoneValid ? null : 'Please enter Valid Phone'}

                                            />
                                        </View>

                                        <View style={[styles.inputContainer, {}]}>
                                            <FormLabel labelStyle={[!isPetNameValid && styles.error]}>PET NAME</FormLabel>
                                            <FormInput
                                                value={rx_pet_name}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                containerStyle={[!isPetNameValid && styles.error]}
                                                inputStyle={[{ marginLeft: 0 }, !isPetNameValid && styles.error]}
                                                placeholder={''}
                                                ref={(input) => this.rx_pet_name_input = input}
                                                onSubmitEditing={() => this.rx_patient_name_input.focus()}
                                                onChangeText={rx_pet_name => this.setState({ rx_pet_name })}
                                                errorMessage={isPetNameValid ? null : 'Pet Name is Required!'}
                                            />

                                        </View>

                                        <View style={styles.inputContainer}>
                                            <FormLabel labelStyle={[!isPatientNameValid && styles.error]}>CLIENT FULL NAME</FormLabel>
                                            <FormInput
                                                value={rx_patient_name}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                containerStyle={[!isPatientNameValid && styles.error]}
                                                inputStyle={[{ marginLeft: 0 }, !isPatientNameValid && styles.error]}
                                                placeholder={''}
                                                ref={(input) => this.rx_patient_name_input = input}
                                                onSubmitEditing={() => this.rx_medication_input.focus()}
                                                onChangeText={rx_patient_name => this.setState({ rx_patient_name })}
                                                errorMessage={isPatientNameValid ? null : 'Pet Name is Required!'}
                                            />
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <FormLabel labelStyle={[!isMedValid && styles.error]}>MEDICATION</FormLabel>
                                            <FormInput
                                                value={rx_medication}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                containerStyle={[]}
                                                inputStyle={[{ marginLeft: 0 },!isMedValid && styles.error]}
                                                placeholder={''}
                                                ref={(input) => this.rx_medication_input = input}
                                                onSubmitEditing={() => this.rx_instructions_input.focus()}
                                                onChangeText={rx_medication => this.setState({ rx_medication })}
                                                errorMessage={isMedValid ? null : 'Pet Name is Required!'}
                                            />
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <FormLabel>INSTRUCTIONS</FormLabel>
                                            <FormInput
                                                value={rx_instructions}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                containerStyle={{}}
                                                inputStyle={[{ marginLeft: 0 }]}
                                                placeholder={''}
                                                ref={(input) => this.rx_instructions_input = input}
                                                onSubmitEditing={() => this.rx_qty_input.focus()}
                                                onChangeText={rx_instructions => this.setState({ rx_instructions })}
                                            />

                                        </View>

                                        <View style={styles.inputContainer}>
                                            <FormLabel labelStyle={[!isQtyValid && styles.error]}>QUANTITY</FormLabel>
                                            <FormInput
                                                value={rx_qty}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                style={[{ marginLeft: 0 }, styles.rawInput, !isQtyValid && styles.error]}
                                                placeholder={''}
                                                ref={input => this.rx_qty_input = input}
                                                onSubmitEditing={() => this.rx_number_refills_input.focus()}
                                                onChangeText={rx_qty => this.setState({ rx_qty })}
                                                // onFocus={this.onFocusChange}
                                            />

                                        </View>

                                        <View style={styles.inputContainer}>
                                            <FormLabel labelStyle={[!isRefillsValid && styles.error]}>NUMBER OF REFILLS</FormLabel>
                                            <FormInput
                                                value={rx_number_refills}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'next'}
                                                blurOnSubmit={true}
                                                containerStyle={[!isRefillsValid && styles.error]}
                                                inputStyle={[{ marginLeft: 0 }, isRefillsValid && styles.error]}
                                                placeholder={''}
                                                ref={(input) => this.rx_number_refills_input = input}
                                                onSubmitEditing={() => this.rx_vetname_input.focus()}
                                                onChangeText={rx_number_refills => this.setState({ rx_number_refills })}
                                                errorMessage={isRefillsValid ? null : 'Pet Name is Required!'}
                                            />

                                        </View>

                                        <View style={styles.inputContainer}>
                                            <FormLabel labelStyle={[!isVetNameValid && styles.error]}>VetName</FormLabel>
                                            <FormInput
                                                value={rx_vetname}
                                                keyboardAppearance='light'
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='default'
                                                returnKeyType={'done'}
                                                blurOnSubmit={true}
                                                containerStyle={[!isVetNameValid && styles.error]}
                                                inputStyle={[{ marginLeft: 0 }, isVetNameValid && styles.error]}
                                                placeholder={''}
                                                ref={(input) => this.rx_vetname_input = input}
                                                onSubmitEditing={(text) => {}}
                                                onChangeText={rx_vetname => this.setState({ rx_vetname })}
                                                errorMessage={isVetNameValid ? null : 'VetName is Required!'}
                                            />

                                        </View>
                                    </View>

                                </KeyboardAwareScrollView>

                            </View>
                            {isError &&
                                        <View><Text adjustsFontSizeToFit={true} numberOfLines={1} style={[{fontSize:12},styles.red, styles.marB10, styles.selfCenter]}>
                                            {errMsg}
                                        </Text></View>
                                    }
                            <View style={styles.footernopad}>
                                <Button
                                    title="Send Rx"
                                    loadingProps={{ color: 'rgba(111, 202, 186, 1)'}}
                                    titleStyle={{fontWeight: '700'}}
                                    buttonStyle={[styles.fullBtn,{marginBottom:0}]}
                                    containerViewStyle={{marginTop: 0}}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    disabledStyle={styles.disabledBtn}
                                    onPress={() => {
                                        // this.props.navigation.navigate('NewRXDraftConfirm');
                                        this._saveNewRx()
                                    }}
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
