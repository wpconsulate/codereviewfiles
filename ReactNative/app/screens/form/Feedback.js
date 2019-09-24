import React, { Component } from 'react';
import {
    Linking,
    Text,
    View
    } from "react-native";
import { FormLabel, FormInput } from "react-native-elements";
import styles from "../Styles";


export default class Feedback extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            fontLoaded: true,
            isError: false,
            isLoading: false,
            value:""
        };

    }

    componentDidMount() {
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


    

    _feedback = () => {
        if(!this._chkEmptyVal(this.state.value)){
            
            const url = 'mailto:vetcomments@1800petmeds.com?subject=Vet+App+Feedback&body='+this.state.value;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
              }).catch(err => console.error('An error occurred', err));
        }else{
            this.setState({isError:true})
        }
    }
    


    render() {

        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT40, styles.padScreen]} >
                        <View style={[styles.listWrapper]}>
                            
                            <View style={styles.overlayActionBar}>
                                <Text 
                                    style={[styles.overlayActionBarLeft, styles.grey]}
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                      }}
                                >CANCEL</Text>
                                <Text 
                                    style={[styles.overlayActionBarRight, styles.blue]}
                                    onPress={() => {
                                        this._feedback()
                                    }}
                                >
                                SEND FEEDBACK</Text>
                            </View>

                            <View style={{}}>
                                <FormInput
                                        value={this.state.value}
                                        keyboardAppearance='light'
                                        autoCapitalize='none'
                                        autoCorrect={true}
                                        keyboardType='default'
                                        returnKeyType={'done'}
                                        blurOnSubmit={true}
                                        multiline = {true}
                                        numberOfLines = {4}
                                        containerStyle={[styles.contentWidth, { marginLeft:0 }]}
                                        inputStyle={[styles.input, this.state.isError && styles.error,{marginLeft: 0}]}
                                        placeholder={''}
                                        shake={!this.state.isError ? false : true}
                                        onChangeText={(text)=> { this._onFieldChange(text) }}
                                />
                            </View>

                        </View>
                    </View>
                    :
                    <Text>Loading...</Text>
                }
            
            </View>
            );
        }


}