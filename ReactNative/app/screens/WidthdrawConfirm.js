import React, { Component } from 'react';
import {
    Text,
    View
    } from "react-native";
import { Button } from "react-native-elements";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import { _withdrawRx } from '../services/data/DataStore'
import {gaTrack} from "../helper";


export default class WidthdrawConfirm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: true,
            isLoading: false,
            rxId:null
        };
    }

    componentDidMount() {    

        const itemId = this.props.navigation.getParam('rxID', null);

        this.setState({ rxId: itemId });
        gaTrack( "Rx Withdraw" );
    }


    // _withdraw = (rxId) =>{
    //     const _this = this;
    //     _this.setState({ isLoading: true });
    //     _withdrawRx(rxId, function(){
    //         _this.setState({ isLoading: false });
    //         _this.props.navigation.navigate('Outbox',{
    //             refreshData:true
    //         })
    //     });
    // }


    render() {
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={[styles.flexContainer, styles.padT80, styles.padScreen]} >

                        <View style={[styles.listWrapper]}>

                            <View style={[styles.alignCenter,styles.padT80]}>
                                <Icon
                                    name='question-circle'
                                    size={40}
                                    style={[styles.darkBlue, styles.padB30]}
                                    />
                            </View>

                            <Text adjustsFontSizeToFit={true} numberOfLines={2} style={[styles.textContent, styles.padScreen]}>
                                Are you sure you want to withdraw this prescription?
                            </Text>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[styles.textContent, styles.padScreen]}>
                                This cannot be undone.
                            </Text>

                        </View>

                        <View style={styles.footer2button}>
                            <Button
                                    buttonStyle={[styles.fullBtn,styles.marB15]}
                                    backgroundColor={'rgba(0,96,169, 1)'}
                                    title="Keep Rx"
                                    onPress={() => {
                                        this.props.navigation.navigate('Outbox');
                                    }}
                                />
                            <Button
                                    buttonStyle={styles.fullBtnInverse}
                                    color={'rgba(0,96,169, 1)'}
                                    title="Withdraw Rx"
                                    loading={this.state.isLoading}
                                    disabled={this.state.isLoading}
                                    disabledStyle={styles.disabledBtn}
                                    onPress={() => {
                                        this._withdraw(this.state.rxId)
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
