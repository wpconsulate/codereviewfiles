import {
    AsyncStorage
  } from 'react-native';

import moment from 'moment';
// import {_} from 'lodash';
// import jsonQ from 'jsonq';
import { reportError } from "../../helper";
import {
        _getVetList,
        _getRxDetails,
        _updateRx,
        _saveRx,
        _saveAPISettings,
        _getPreRxVetList,
        _saveUpdatePreRx,
        _deleteRx,
        } from "../api/index";
import {Session} from './Session'
import Events from '../Events';
import Config from '../config';

var RxStatus = {updated:null,data:{}};

//-----------------------------------------------------------------------
//  Some Overrides/extends etc
//-----------------------------------------------------------------------
isEmptyObj = (Obj) => {
    for(var key in Obj) {
        if(Obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


orderRxData = (Obj) => {
    
}


parseApiRxObj = (Obj, callback) => {
    
    // removeItem(Session.db.rxStatus);
    _getRxStatusData(function(status){
        
        // First process and save the Pending RX Data
        if( Obj !== undefined && !isEmptyObj(Obj) ){
            // console.log(Obj);
            var _map = [];
            var c = 0;
            // for(var key in Obj) {
            Object.keys(Obj).sort().forEach(function(key) {
                // console.log(Obj[key])

                if(Obj.hasOwnProperty(Obj[key][5])){

                    var read = false;

                    // const rxId = key;
                    const onum = Obj[key][5];
                    const rxKey = Obj[key][4];
                    const rx_patient_name = Obj[key][1];
                    const rx_pet_name = Obj[key][2];
                    const rx_medication = Obj[key][3];
                    var rxDate = Obj[key][0];

                    if(status.data[rxKey] !== undefined){
                        read = status.data[rxKey];
                    }

                    try{
                        rxDate = moment(rxDate, 'DD/DD/YY').valueOf();
                    }catch(e){
                        rxDate = moment().format('MM/DD/YY');
                    }

                    // console.log(rxDate);
                    // console.log(moment(rxDate).format("MM/DD/YYYY"));

                    _map.push( _buildRxObj(rxKey, onum, '111-111-1111', rx_pet_name, rx_patient_name, rx_medication, "rxKey:"+rxKey, 0, 0, rxDate, read) );
                    // _map[c] = _buildRxObj(rxKey, onum, '111-111-1111', rx_pet_name, rx_patient_name, rx_medication, "rxKey:"+rxKey, 0, 0, rxDate, read);

                    status.data[rxKey] = read;

                }
                c++;
            });
            // Updated Read Status for Items
            // _updateRxStatusData(status);

            if(callback !== undefined)
                callback(_map);
        }
        else{
            reportError("parseApiRxObj:- No data received from API");
            if(callback !== undefined)
                callback([]);
        }
    })

}


//-----------------------------------------------------------------------
//  AsyncStorage Functions
//-----------------------------------------------------------------------
//the functionality of the retrieveItem is shown below
export async function retrieveItem(key, callback) {
    try {
        const retrievedItem =  await AsyncStorage.getItem(key);

        if(retrievedItem !== null)
            var item = JSON.parse(retrievedItem);
        else
            var item = null;

        if(callback !== undefined)
            callback(item);

        return item;
    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }
}

export async function storeItem(key, item, callback) {
    try {
        item = JSON.stringify(item)
        
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        if (item)
            var jsonOfItem = await AsyncStorage.setItem(key, item);

        if(callback !== undefined)
            callback(jsonOfItem);
        else
            return jsonOfItem;

    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }
}

export async function removeItem(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}

export async function mergeItem(key, item) {
    try {
        var jsonOfItem = await AsyncStorage.mergeItem(key, JSON.stringify(item));

        return jsonOfItem;

    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }
}


//-----------------------------------------------------------------------
//  End of AsyncStorage Functions
//-----------------------------------------------------------------------

//-------------------------------------------------------------------
//  Rx Related Functions
//-------------------------------------------------------------------

export const _buildRxObj = (rxKey, onum, rx_phone, rx_pet_name, rx_patient_name, rx_medication, rx_instructions,rx_qty,rx_number_refills, rxDate, status) => {

    return {
        "vetID": Session.user.vetId,
        "vetName": Session.user.vetName,
        "rxID": rxKey,   //rx
        "onum": onum,
        "rxnum": "",
        "instruction": rx_instructions,
        "customer_id": "",
        "ref_id": "",
        "client": rx_patient_name,
        "address": "",
        "phone": rx_phone,
        "petname": rx_pet_name,
        "breed": "",
        "vetauthname": Session.user.vetName,
        "rx": rx_medication,
        "answer": "",
        "qty": rx_qty,
        "refill": rx_number_refills,
        "order_date": "",
        "vetdate": rxDate,
        "qtycomment": "",
        "instructioncomment": "",
        "refillcomment": "",
        "weightcomment": "",
        "info": "",
        "read": status,
    }
}

export const _getRxData = ( typeKey, callback) => {

    // Retrive the qhHrs first then we'll update the value at index
    retrieveItem(typeKey, function(data){
        if(data === null)
            data = [];

        if(callback !== undefined)
            callback(data);
    });

}

export const _getRxItem = (typeKey, rxId, onum, callback) => {
    
    if(rxId != undefined && typeKey != "" && typeKey != null && typeKey != undefined){
        
        // Retrive the qhHrs first then we'll update the value at index
        _getRxData(typeKey, function(data){

            for(var key in data) {

                if(data.hasOwnProperty(key) && rxId == data[key]["rxID"] ){

                    if(typeKey === Session.db.outbox || typeKey === Session.db.outboxDraft){

                        if(callback !== undefined)
                            callback(data[key]);

                        return data;

                    }else{
                        // Fetch detailed data from API
                        _getRxDetails(typeKey, rxId, onum, function(rxdata){

                            if(rxdata.rx == rxId && rxdata !== undefined ){
                                //Update Local DB Data
                                data[key].address = rxdata.Address;
                                data[key].breed = rxdata.Breed;
                                data[key].client = rxdata.Client;
                                data[key].customer_id = rxdata.Customer;
                                data[key].petname = rxdata.Pet;
                                data[key].phone = rxdata.Phone;
                                data[key].rx = rxdata.RX;
                                data[key].ref_id = rxdata.Ref;
                                data[key].instruction = rxdata.instruction;
                                data[key].qty = rxdata.qty;
                                // data[key].refill = rxdata.refill.replace(/[^a-zA-Z ]/g, ""); // removed number + Special Characters
                                // data[key].refill = rxdata.refill.replace(/[^\w\s]/gi, '');  // removed Special Characters only
                                data[key].refill = rxdata.refill.replace(/[`~!@#$%^&*_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');;  // removed Specified Special Characters only
                                // data[key].refill = rxdata.refill.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');;  // removed Specified Special Characters only
                                // data[key].refill = rxdata.refill;
                                data[key].rxnum = rxdata.rxnum;
                                data[key].order_date = rxdata.value11;
                                data[key].vetdate = rxdata.vetdate;
                                data[key].rxstat = rxdata.rxstatus;
                                data[key].reason = rxdata.reason;
                                data[key].responder = rxdata.responder;

                                //update the datastore
                                storeItem(typeKey, data);

                                if(callback !== undefined)
                                    callback(data[key]);

                                return data;
                            }

                        });
                    }

                }
                else{
                    //If No record Found
                    // if(callback !== undefined)
                    //     callback(undefined);
                    
                }
            }

        })

    }

}

export const _getLocalRx = (typeKey, rxId, callback) => {

    if(rxId != undefined && typeKey != "" && typeKey != null && typeKey != undefined){

        // Retrive the qhHrs first then we'll update the value at index
        _getRxData(typeKey, function(data){

            for(var key in data) {

                if(data.hasOwnProperty(key) && rxId == data[key]["rxID"] ){

                    if(callback !== undefined)
                        callback(data[key]);

                    return data;

                }
                else{

                    //If No record Found
                    if(callback !== undefined)
                        callback(undefined);
                }
            }

        })

    }
}

export async function _storeLoginData(item, callback) {
    try {
        if(item){
            var jsonOfItem = await AsyncStorage.setItem('user', JSON.stringify(item));
            if(callback !== undefined)
                callback(jsonOfItem);
            return jsonOfItem;
        }
    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }
}

export async function _storeAPIRxData( type, callback) {

    try {
        // jsonData = apiData;
        _getVetList(function( jsonData ){

            var _data = {pendingRx:[], processedRx:[] };
            if(jsonData.status == "false"){
                // console.log(jsonData)
                if(callback !== undefined)
                    callback(_data);
            }
            
            if( !isEmptyObj(jsonData) ) {
                
                if(type === Session.db.pending){

                    if( jsonData.pendingMap !== undefined && !isEmptyObj( jsonData.pendingMap ) ){
                        parseApiRxObj(jsonData.pendingMap, function(data){

                            _data.pendingRx = data;

                            if(Session.db.pending != null && Session.db.pending !== undefined)
                                storeItem(Session.db.pending, _data.pendingRx);

                            if(callback !== undefined)
                                callback(_data);
                        });

                    }else{
                        //If Empty Data
                        if(callback !== undefined)
                            callback(_data);
                    }

                }

                if(type === Session.db.processed){

                    if( jsonData.previousProcessedMap !== undefined && !isEmptyObj( jsonData.previousProcessedMap ) ){

                        parseApiRxObj(jsonData.previousProcessedMap, function(data){
                            _data.processedRx = data;

                            if(Session.db.processed != null && Session.db.processed !== undefined)
                              storeItem(Session.db.processed, _data.processedRx);

                            if(callback !== undefined)
                                callback(_data);
                        });

                    }else{
                        //If Empty Data
                        if(callback !== undefined)
                            callback(_data);
                    }

                }

            }

        });

    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }

}

export async function _updateRxItemField( typeKey, rxId, metaKey, metaVal, callback){

    if(rxId != undefined && typeKey != "" && typeKey != null && typeKey != undefined){

        _getRxData( typeKey, function(data){

            for(var key in data) {

                if(data.hasOwnProperty(key) && rxId == data[key]["rxID"] ){

                    data[key][metaKey] = metaVal;

                    if(typeKey !== Session.db.outboxDraft && typeKey !== Session.db.outbox){

                        // Update the data
                        storeItem( typeKey, data);
                        return _updateRx(data[key], callback);

                    }
                    else if( typeKey === Session.db.outbox){

                        //Set PreRx Fields
                        if(data[key].qtycomment != "")
                            data[key].qty = data[key].qtycomment;

                        if(data[key].refillcomment != "")
                            data[key].refill = data[key].refillcomment;

                        if(data[key].instructioncomment != "")
                            data[key].instruction = data[key].instructioncomment;

                        // Update the data
                        storeItem( typeKey, data);

                        return _saveUpdatePreRx(data[key], callback);
                    }
                    // In case draft
                    else{
                        //Set PreRx Fields
                        if(data[key].qtycomment != "")
                            data[key].qty = data[key].qtycomment;

                        if(data[key].refillcomment != "")
                            data[key].refill = data[key].refillcomment;

                        if(data[key].instructioncomment != "")
                            data[key].instruction = data[key].instructioncomment;

                        // Update the data
                        storeItem( typeKey, data);

                        if(callback !== undefined)
                            callback({ error: "OK", status: "true" });
                    }

                }
            }

        })
    }
}

//-------------------------------------------------------------------
// PreRx Functions
//-------------------------------------------------------------------

export async function _storePreRxData( callback) {

    try {
        // jsonData = apiData;
        _getPreRxVetList(function( jsonData ){
          // console.log(jsonData);
            var _data = { sentRx:[] };
            if(jsonData.status == "false"){
                console.log(jsonData)
                if(callback !== undefined)
                    callback(_data);
            }

            if( !isEmptyObj(jsonData) ) {

                if( jsonData.sentMap !== undefined && !isEmptyObj( jsonData.sentMap ) ){

                    for(var key in jsonData.sentMap) {

                        if(jsonData.sentMap.hasOwnProperty(key)){

                            var read = false;

                            const rxKey = jsonData.sentMap[key][0];
                            const rx_phone = jsonData.sentMap[key][1];
                            const rx_pet_name = jsonData.sentMap[key][2];
                            const rx_client = jsonData.sentMap[key][3];
                            const rx_medication = jsonData.sentMap[key][4];
                            const rx_instructions = jsonData.sentMap[key][5];
                            const rx_qty = jsonData.sentMap[key][6];
                            const rx_refill = jsonData.sentMap[key][7];
                            const rxDate = jsonData.sentMap[key][8];
                            const rxVetName = (jsonData.sentMap[key][9] !== undefined)?jsonData.sentMap[key][9]:Session.user.vetName;

                            // var rxDate = moment().format('MM/DD/YYYY')
                            // alert(rxDate);
                            // console.log(moment(rxDate).format("MM/DD/YYYY"));

                            if(rx_phone !== "" && rxKey != ""){
                                let sent_rx_obj = _buildRxObj(rxKey, "", rx_phone, rx_pet_name, rx_client, rx_medication, rx_instructions, rx_qty, rx_refill, rxDate, true);
                                sent_rx_obj['vetName'] = rxVetName;
                                _data.sentRx.push( sent_rx_obj );
                            }
                                

                        }
                    }   // end of for

                    //Store all Data
                    storeItem(Session.db.outbox, _data.sentRx);

                }   // end of isEmptyObj( jsonData.sentMap )

            }

            if(callback !== undefined)
                callback(_data);

        });

    } catch (error) {
        console.log(error.message);
        reportError(error.message);
    }

}

//-------------------------------------------------------------------
// User Functions
//-------------------------------------------------------------------

export const _getUserData = (callback) => {
    retrieveItem(Config.USER_DATA_KEY, function(userdata){
        if(callback !== undefined)
            callback(userdata);
        else
            return userdata;
    });
}

//-------------------------------------------------------------------
//  Rx Read Status Functions
//-------------------------------------------------------------------
export const _updateRxStatusData = (Obj) => {

    if( Obj !== undefined && !isEmptyObj(Obj) ){

        if(Obj.updated == null)
            Obj.updated = moment().format('MM/DD/YY');

        if(Session.db.rxStatus != null && Session.db.rxStatus !== undefined)
          storeItem(Session.db.rxStatus, Obj);

    }

}

export const _updateRxReadStatus = (rxId, isRead) => {
    if( rxId !== undefined ){
        _getRxStatusData(function(status){
            status.data[rxId] = isRead;
            // Updated Read Status for Items
            _updateRxStatusData(status);
            // console.log(status);
        });
    }
}

export const _getRxStatusData = (callback) => {
    
    if(Session.db.rxStatus !== undefined){

        // Retrive the qhHrs first then we'll update the value at index
        retrieveItem(Session.db.rxStatus, function(data){
            
            if(data === null) 
                data = {updated:null,data:{}};

            if(callback !== undefined)
                callback(data);
            else
                return data;
        });
    }else{
        callback({updated:null,data:{}});
    }
}

//-------------------------------------------------------------------
//  Save New / Update Rx Related Functions
//-------------------------------------------------------------------
export const _saveNewRx = ( obj, callback) => {
    //Set Order date
    obj.order_date = moment().format("MM/DD/YYYY");
    _saveRx(obj, function(res){

        if(res.status == "true"){

            saveOutboxRx(obj, callback);

        }else{
            if(callback !== undefined)
                callback(res);
        }

    });
}

export const _sendRxData = (typeKey, rxId, callback) =>{

    if(rxId != undefined && typeKey != "" && typeKey != null && typeKey != undefined){

        _getLocalRx(typeKey, rxId, function(rxdata){
            if(rxdata !== undefined){
                rxdata.order_date = moment().format("MM/DD/YY");

                _saveRx(rxdata, function(res){

                    if(res.status == "true"){

                        // Remove Rx From Drafts
                        _withdrawRx(rxdata.rxID)

                        Events.publish('RefreshList');

                        if(callback !== undefined)
                            callback(res);

                        // saveOutboxRx(rxdata, function(saveRes){
                        //     if(res.status !== "true"){
                        //         _withdrawRx(rxdata.rxID)
                        //     }
                        //     if(callback !== undefined)
                        //         callback(saveRes);
                        // })

                    }else{
                        if(callback !== undefined)
                            callback(res);
                    }

                });
            }
        })
    }
}


/**
 *
 * @param {*} rxId
 * @param {*} action approve | deny
 * @param {*} callback
 */
export const _approveDenyRx = (rxdata, action, callback) => {
    rxdata.answer = action;
    _updateRx(rxdata, callback);
}


//-------------------------------------------------------------------
//  Outbox Related Functions
//-------------------------------------------------------------------

const saveOutboxRx = (obj, callback) => {

    // Retrive the qhHrs first then we'll update the value at index
    retrieveItem(Session.db.outbox).then((data) => {
        if(typeof data === 'object' ){

            if(data == null){
                data = [ obj ];
            }else{
                // data.assign( data, { rxId : obj } )
                data.push( obj )
            }

            storeItem(Session.db.outbox, data);

            if(callback !== undefined)
                callback({
                    status:"true",
                    error:"OK"
                });
        }
    }).catch((error) => {
        console.log("(667) "+error)
        reportError(error.message);
        if(callback !== undefined)
            callback({
                error: "Internal Server Error Occurred!!!",
                status: "false",
                });
    });
}

export const _addOutboxDraft = (data, callback) => {

    // console.log(data);

    var timestamp = moment().unix();

    // const obj = _buildRxObj(rx_phone, rx_pet_name, rx_patient_name, rx_medication, rx_instructions,rx_qty,rx_number_refills, isRead);
    const obj = _buildRxObj( timestamp, timestamp, data[0], data[1], data[2], data[3], data[4],data[5],data[6], timestamp, false );
    const rxId = obj.rxID;
    // removeItem(Session.db.outboxDraft);
    // Retrive the qhHrs first then we'll update the value at index
    retrieveItem(Session.db.outboxDraft).then((data) => {

        if(typeof data === 'object' ){

            if(data == null){
                // data = { rxId : obj };
                data = [ obj ];
            }else{
                // data.assign( data, { rxId : obj } )
                data.push( obj )
            }

            // console.log(data);
            storeItem(Session.db.outboxDraft, data);

            if(callback !== undefined)
                callback(rxId);
        }
    }).catch((error) => {
        //this callback is executed when your Promise is rejected
        console.log('Promise is rejected with error: ' + error);
        reportError('Promise is rejected with error: ' + error);
    });
}

export async function _updateOutboxData(item){

    if(item.rxId != undefined){
        _getRxData( Session.db.outbox, function(data){
            for(var key in data) {
                if(data.hasOwnProperty(key) && rxId == data[key]["rxID"] ){
                    // console.log(data[key]["rxID"]);
                }
            }
        })
    }

}

export const deleteRx = (rxId, callback) => {
    _deleteRx(rxId, callback);
}

export const _withdrawRx = (rxId, callback) => {

    // Retrive the qhHrs first then we'll update the value at index
    retrieveItem(Session.db.outboxDraft).then((data) => {
        if(typeof data === 'object' ){

            if(data != null){

                for(var key in data) {
                    if(rxId === data[key].rxID){
                        data.splice(key, 1);
                    }
                }

                //update data after removing the element
                storeItem(Session.db.outboxDraft, data, callback);
                
            }else{
                if(callback !== undefined)
                    callback();
            }

        }
    }).catch((error) => {
        //this callback is executed when your Promise is rejected
        console.log('Promise is rejected with error: ' + error);
        reportError('Promise is rejected with error: ' + error);
    });
}


//-------------------------------------------------------------------
//  Nofitications Settings
//-------------------------------------------------------------------

export const _getNotifySettings = (callback) => {
    // Retrive the qhHrs first then we'll update the value at index
    retrieveItem( Session.db.notify ).then((settings) => {

        if(settings === null){
            settings = {
                pushEnabled: 0,
                pendingRxEnabled: 0,
                quiteHrsEnabled: 0,
                quiteHrsCount: 0,
                quiteHrs: [{
                    on: "weekdays",                                   // This value needs to be determined but varname will remain the same
                    from: moment().format('HH:mm'),                   // Unix Timestamp
                    to: moment().add(1, 'day').format('HH:mm')        // Unix Timestamp
                }],
            };
            _saveNotifySettings(settings);
        }


        if(callback !== undefined)
            callback(settings);
    }).catch((error) => {
        console.log(error);
        reportError('Promise is rejected with error: ' + error);
        if(callback !== undefined)
            callback(null);
    });

}

export const _saveNotifySettings = (settings, callback) => {
    storeItem(Session.db.notify, settings, function(data){
        _saveAPISettings(settings, callback)
    });
}
