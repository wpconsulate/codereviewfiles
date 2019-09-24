import React, { Component } from 'react';
import {
    ActivityIndicator,
    Text,
    View 
    } from "react-native";
import { FormLabel, FormInput } from "react-native-elements";
import { TextInputMask } from 'react-native-masked-text'
import styles from "../Styles";
import {Session} from '../../services/data/Session'
import {_updateRxItemField} from '../../services/data/DataStore'
import Events from '../../services/Events';

const fieldName = "phone";

export default class EditPhone extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            fontLoaded: true,
            isError: false,
            isLoading: false,
            rxID:null,
            tabType:null,
            value:""
        };

    }

    componentDidMount() {

        this.setState({ 
            rxID: this.props.navigation.state.params.rxID,
            value: this.props.navigation.state.params.val,
            tabType: this.props.navigation.state.params.type,
        });

    }

    _chkEmptyVal = (val) => {
        if( val === null || val === "" )
            return true;
        return false;
    }

    
    /**
     * @param {String} text the text AFTER mask is applied.
    */
    onPhoneChange(text) {
        this.setState({ value: text });
    }
    /**
     * @param {String} previous the previous text in the masked field.
     * @param {String} next the next text that will be setted to field.
     * @return {Boolean} return true if must accept the value.
    */
    checkPhone(previous, next) {
        return previous !== next;
    }


    save = ()=> {

        if(this.state.isLoading) return false;

        if( this._chkEmptyVal( this.state.value ) ){
            this.setState({ isError: true });
            return false;
        }
        this.setState({ isLoading: true });

        const _this = this;
        // this.state.value
        _updateRxItemField(
            this.state.tabType, 
            this.state.rxID, 
            fieldName, 
            this.state.value, 
            function(data){

                //refresh List on Outbox
                Events.publish('OutRefreshData');

                _this.setState({ isLoading: false });
                
                switch(_this.state.tabType){
                    case Session.db.outboxDraft:
                        _this.props.navigation.navigate('OutboxView', { itemId: _this.state.rxID, type:'draft', refreshData:true });
                        break;
                    case Session.db.outbox:
                        _this.props.navigation.navigate('OutboxView', { itemId: _this.state.rxID, type:'sent', refreshData:true });
                        break;
                    case Session.db.pending:
                        _this.props.navigation.navigate('Approve', { itemId: _this.state.rxID, refreshData:true });
                        break;
                    case Session.db.processed:
                        break;
                }

            }
        );

    }


    render() {
        
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT40]} >
                        <View style={[styles.listWrapper,{}]}>
                            
                            <View style={[styles.overlayActionBar,styles.padScreen]}>
                                <Text 
                                    style={[styles.overlayActionBarLeft, styles.grey]}
                                    onPress={() => {
                                        if(this.state.isLoading) return false;
                                        this.props.navigation.goBack();
                                      }}
                                >CANCEL</Text>
                                <Text 
                                    style={[styles.overlayActionBarRight, styles.blue]}
                                    onPress={() => {
                                        this.save()
                                    }}
                                >
                                SAVE</Text>
                            </View>


                            <View style={{}}>
                                <FormLabel>PHONE</FormLabel>
                                <TextInputMask
                                    refInput={(ref) => this.rx_phone_input = ref}
                                    type={'cel-phone'}
                                    placeholder="###-###-####"
                                    returnKeyType={'next'}
                                    blurOnSubmit={true}
                                    options={{
                                        dddMask: '999-999-9999',
                                        getRawValue: function(value, settings) {
                                            return value;
                                        },
                                    }}
                                    style={[styles.input, this.state.isError && styles.error]}
                                    onChangeText={(phone) => { this.onPhoneChange(phone) } }
                                    checkText={this.checkPhone.bind(this)}
                                    value={this.state.value}
                                    errorMessage={!this.state.isError ? null : 'Please enter Valid Phone'}

                                />
                            </View>

                            {this.state.isLoading? <ActivityIndicator size="large" color="#0000ff" /> : <View/>}

                        </View>
                    </View>

                :
                    <Text>Loading...</Text>
                }
            
            </View>
            );
        }


}
