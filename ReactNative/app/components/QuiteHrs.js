import React, { Component } from 'react';
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-elements";

import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'

import moment from 'moment';

import styles from "../screens/Styles";


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
        alignSelf: 'flex-end',
    },
});

const QuiteHour= (props) => {
        return (
            <View key={"qhd_"+props.index} containerStyle={[styles.quiteHoursCard, styles.marContainerScreen]} >
                
                <View style={[styles.quiteHoursRow,{ justifyContent:'flex-end'}]}>
                        <Text
                            style={[styles.blue,{marginTop:15,marginBottom:15, height:30 }]}
                            onPress={()=>{props.removeQH(props.index)}}
                            >
                            Remove
                        </Text>
                </View>

                <View style={[styles.quiteHoursRow, styles.alignVCenter]}>
                    <View style={[styles.quiteHoursRowLeft, styles.selfCenter]}>
                        <Text>{props.daysLabel}</Text>
                    </View>
                    <View style={[styles.quiteHoursRowRight,styles.selfCenter]}>
                        <RNPickerSelect
                            placeholder={{
                                label: props.daysEmptyLabel,
                                value: null,
                            }}
                            items={props.qhDays}
                            onValueChange={(value) => {
                                props.onChangeSelectPicker(props.index, value)
                            }}
                            onUpArrow={() => {}}
                            onDownArrow={() => {}}
                            hideIcon={true}
                            style={{ ...pickerSelectStyles }}
                            value={props.day}
                        />
                    </View>
                </View>
                <View style={styles.quiteHoursRow}>
                    <View style={[styles.quiteHoursRowLeft, styles.selfCenter]}>
                    <Text>{props.fromLabel}</Text>
                    </View>
                    <View style={[styles.quiteHoursRowRight]}>
                        <DatePicker
                            style={styles.dateTimePickerCont}
                            date={props.timeFrom}
                            mode="time" //enum/date/datetime/time
                            placeholder="select date"
                            format="h:mm A"
                            is24Hour={false}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                                dateInput: styles.dateTimePickerInput
                            }}
                            onDateChange={(time) => {
                                props.onChangeTimeFrom(props.index, time)
                            }}
                        />
                    </View>
                </View>
                <View style={styles.quiteHoursRow}>
                    <View style={[styles.quiteHoursRowLeft, styles.selfCenter]}>
                        <Text>{props.toLabel}</Text>
                    </View>
                    <View style={[styles.quiteHoursRowRight,styles.selfCenter]}>
                        <DatePicker
                            style={styles.dateTimePickerCont}
                            date={props.timeTo}
                            mode="time" //enum/date/datetime/time
                            placeholder="select date"
                            format="h:mm A"
                            is24Hour={false}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                                dateInput: styles.dateTimePickerInput
                            }}
                            onDateChange={(time) => {
                                props.onChangeTimeTo(props.index, time)
                            }}
                        />
                    </View>
                </View>
                
            </View>
        );
}

export default class QuiteHrs extends Component {
    constructor(props) {
        super(props);
        this.inputRefs = {};
        this.state = {
            qhDays: [
                {
                    label: 'Sunday',
                    value: 'sunday',
                },
                {
                    label: 'Monday',
                    value: 'monday',
                },
                {
                    label: 'Tuesday',
                    value: 'tuesday',
                },
                {
                    label: 'Wednesday',
                    value: 'wednesday',
                },
                {
                    label: 'Thursday',
                    value: 'thursday',
                },
                {
                    label: 'Friday',
                    value: 'friday',
                },
                {
                    label: 'Saturday',
                    value: 'saturday',
                },
                {
                    label: 'Weekdays (Mon-Fri)',
                    value: 'weekdays',
                },
            ]
        };
    }


    render() {

        const quiteDaysDD  = this.props.qHrs.map((item, index) => {
                // console.log(this.props.qHrs.length);
                return (
                        <View key={"QH_"+index} style={styles.quiteHoursCard} >
                            <QuiteHour
                                index={index}

                                daysLabel={"On:"}
                                daysEmptyLabel={"Select Day(s)"}
                                qhDays={this.state.qhDays}
                                onChangeSelectPicker={this.props._handleDayChange}
                                day={item.on}

                                fromLabel={"From:"}
                                timeFrom={moment(item.from, ["HH:mm"])}
                                onChangeTimeFrom={this.props._handleTimeFromChange}
                                onCloseModal={this.onCloseModal}

                                toLabel={"To:"}
                                timeTo={moment(item.to, ["HH:mm"])}
                                onChangeTimeTo={this.props._handleTimeToChange}
                                removeQH={this.props._handleRemoveQH}
                                />

                                {(index != (this.props.qHrs.length-1)) ? <Text style={styles.quiteHoursAndTxt}>{"And"}</Text> : <Text></Text> }
                        </View>

                    );
        });

        // var QHItems = this.state.hvItems.map(function (hvItem, index) {
        //     return <HighValueItemsForm key={"hvitem_" + index} index={index} hvItem={hvItem} removeTrigger={window.HVItems.removeHVItem} />;
        // });
        
        return (
                <View>{quiteDaysDD}</View>
                );
        
    }
}
