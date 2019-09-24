/* global fetch */
import apiConfig from '../config';
// import { _getUserData } from "../data/DataStore";
import {Session} from '../data/Session'


const _makeAPICall = (callableURL, callback) => {
    fetch( callableURL, {
        method: "POST",
        headers: {
            'API_KEY': apiConfig.clientId,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json() )
    .then((responseData) => {
        // console.log(callableURL);
        // console.log(responseData);

        if(callback !== undefined)
            callback(responseData);

    })
    .done();
}

/**
 * 
 * @param var data = { 'userpm': 'asda', 'passwordpm': 'tesasdat', 'method': 'vetloginpm'}; data 
 * @param {*} callback 
 */
const _postAPICall = (data, callback) => {

    var formBody = [];
    for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch( apiConfig.baseURL, {
        method: "POST",
        headers: {
            'API_KEY': apiConfig.clientId,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body:formBody
    })
    .then((response) => response.json() )
    .then((responseData) => {
        // console.log(data);
        // console.log(responseData);

        if(callback !== undefined)
            callback(responseData);

    })
    .done();
}



export const _userSignIn = (username, password, callback) => {

    _postAPICall({
        userpm:username,
        passwordpm:password,
        method:apiConfig.methods.login
    }, callback);

}


/**
 * Function for User registeration
 * signup_data = {
                fullname:fullname,
                email:email,
                username:username,
                password:password,
                phone:phone,
                lic_number:lic_number
            }
 */
export const _userSignup = (signup_data, callback) => {

    _postAPICall({
        userpm:signup_data.username,
        passwordpm:signup_data.password,
        method:apiConfig.methods.signup,
        phonenumberpm:signup_data.phone,
        licensepm:signup_data.lic_number,
        emailpm:signup_data.email,
        namepm:signup_data.fullname
    }, callback);

}


/**
 * Function to Forgot Username API Call
 * @param {*} email
 * @param {*} callback
 */
export const _forgotUser = (email, callback) => {

    _postAPICall({
        userpm:email,
        method:apiConfig.methods.forgot_user
    }, callback);

}


/**
 * Function to Make Forgot User Password API Call
 * @param {*} username
 * @param {*} callback
 */
export const _forgotPass = (username, callback) => {

    _postAPICall({
        userpm:username,
        method:apiConfig.methods.forgot_pass
    }, callback);

}


//-----------------------------------------------------------------------
//  Secure API Calls Requires the Login creds and VetId
//-----------------------------------------------------------------------

/**
 * Function to fetch the list of Rx's
 */
export const _getVetList = (callback) => {


    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.vet_list
        }, callback);

    }

}


/**
 * Function to fetch the list of Rx's
 */
export const _getRxDetails = ( typeKey, rx, onum, callback) => {

    if(Session.user.vetId !== undefined){

        if( typeKey === Session.db.processed )
            _getProcessedRx(rx, onum, callback);
        else
            _getPendingRx(rx, onum, callback);

    }

}


/**
 * Function to fetch the list of Rx's
 */
export const _getPendingRx = ( rx, onum, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.rx_details,
            rx : rx,
            oid : onum
        }, callback);

    }

}

/**
 * Function to fetch the list of Rx's
 */
export const _getProcessedRx = ( rx, onum, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.getprocessed,
            rx : rx,
            oid : onum
        }, callback);

    }

}

/**
 * Function to fetch the list of Rx's
 */
export const _updateRx = ( rxdata, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.update_rx,
            vetName : Session.user.vetName,
            oid : rxdata.onum,
            rx : rxdata.rxID,
            answer : rxdata.answer,
            qtycomment : rxdata.qtycomment,
            refillcomment : rxdata.refillcomment,
            instructioncomment : rxdata.instructioncomment,
            instruction : rxdata.instruction,
            rxnum : rxdata.rxnum,
            info : rxdata.info,
            refill : rxdata.refill,
            qty : rxdata.qty,
            vetauthname : rxdata.vetauthname,
            weightcomment : ""
        }, callback);

        // callback({
        //     "error": "OK",
        //     "status": "true"
        // });

    }

}



/**
 * Function to fetch the list of Rx's
 */
export const _getPreRxVetList = (callback) => {


    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.prerx_list
        }, callback);

    }

}


/**
 * Function to fetch the list of Rx's
 */
export const _saveUpdatePreRx = ( rxdata, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            vetName : Session.user.vetName,
            method : apiConfig.methods.pre_rx,
            rx : rxdata.rxID,
            petname : rxdata.petname,
            lastname : rxdata.client,
            phone : rxdata.phone,
            medication : rxdata.rx,
            instruction : rxdata.instruction,
            refill : rxdata.refill,
            qty : rxdata.qty
        }, callback);

    }

}


/**
 * Function to fetch the list of Rx's
 */
export const _saveRx = ( rxdata, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.pre_rx,
            rx : "",
            vetName : rxdata.vetName,
            petname : rxdata.petname,
            lastname : rxdata.client,
            phone : rxdata.phone,
            medication : rxdata.rx,
            instruction : rxdata.instruction,
            refill : rxdata.refill,
            qty : rxdata.qty
        }, callback);

    }

}

/**
 * Function to fetch the list of Rx's
 */
export const _deleteRx = ( rxID, callback) => {

    if(Session.user.vetId !== undefined){

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.pmdeleterx,
            rxid : rxID
        }, callback);

    }

}



/**
 * Function to fetch the list of Rx's
 */
export const _saveAPISettings = ( settings, callback) => {

    if(settings.pushEnabled !== undefined){

        var callableURL = apiConfig.baseURL + "?method="+apiConfig.methods.save_settings+
                                                "&vetIdpm="+Session.user.vetId+
                                                "&userpm="+Session.user.username+
                                                "&passwordpm="+Session.user.password+
                                                "&pushEnabled="+settings.pushEnabled+
                                                "&pending_rx="+settings.pendingRxEnabled+
                                                "&observe_quiet_hours="+settings.quiteHrsEnabled+
                                                "&quiteHrs=";

        
        var qhSets = "";
        for(var key in settings.quiteHrs) {

            qhSets += settings.quiteHrs[key].on+"|"+settings.quiteHrs[key].from+"|"+settings.quiteHrs[key].to;

            if( parseInt(key) !== parseInt(settings.quiteHrs.length-1) )
                qhSets += "|";

        }

        _postAPICall({
            userpm : Session.user.username,
            passwordpm : Session.user.password,
            vetIdpm : Session.user.vetId,
            method : apiConfig.methods.save_settings,
            pushEnabled : settings.pushEnabled,
            pending_rx : settings.pendingRxEnabled,
            observe_quiet_hours : settings.quiteHrsEnabled,
            quiteHrs : qhSets
        }, callback);

    }

}


/**
 * Function to fetch the list of Rx's
 */
export const _saveAPISettingsOld = ( settings, callback) => {

    if(settings.pushEnabled !== undefined){

        var callableURL = apiConfig.baseURL + "?method="+apiConfig.methods.save_settings+
                                                "&vetIdpm="+Session.user.vetId+
                                                "&userpm="+Session.user.username+
                                                "&passwordpm="+Session.user.password+
                                                "&pushEnabled="+settings.pushEnabled+
                                                "&pending_rx="+settings.pendingRxEnabled+
                                                "&observe_quiet_hours="+settings.quiteHrsEnabled+
                                                "&quiteHrs=";

        for(var key in settings.quiteHrs) {

            callableURL += settings.quiteHrs[key].on+"|"+settings.quiteHrs[key].from+"|"+settings.quiteHrs[key].to;

            if( parseInt(key) !== parseInt(settings.quiteHrs.length-1) )
                callableURL += "|";

        }

        // console.log(callableURL);

        _makeAPICall(callableURL, callback);

    }

}
