import React, { Component } from 'react';
import {
    ActivityIndicator,
    Text,
    View 
    } from "react-native";
import { FormLabel, FormInput } from "react-native-elements";
import styles from "../Styles";
import {Session} from '../../services/data/Session'
import {_updateRxItemField} from '../../services/data/DataStore'
import Events from '../../services/Events';

const fieldName = "qtycomment";

export default class EditQty extends Component {

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
    _onFieldChange(text) {
        this.setState({ value: text });
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

                _this.setState({ isLoading: false });
                //refresh List on Outbox
                Events.publish('OutRefreshData');

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

                            <View style={styles.inputContainer}>
                                <FormLabel>QUANTITY/NUMBER AUTHORIZED</FormLabel>
                                <FormInput
                                        value={this.state.value}
                                        keyboardAppearance='light'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType='numeric'
                                        returnKeyType={'done'}
                                        blurOnSubmit={true}
                                        multiline = {false}
                                        containerStyle={{}}
                                        inputStyle={[styles.input, this.state.isError && styles.error,{marginLeft: 0}]}
                                        placeholder={''}
                                        shake={!this.state.isError ? false : true}
                                        onChangeText={(text)=> { this._onFieldChange(text) }}
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