export default {
	ver: '1.0.2',
	clientId: 'e2a6fe5e10d4d609f9c5edc4f1101f4e',
    // baseURLDev: 'https://test.1800petmeds.com/vetapp/vetapipm.jsp',
    baseURL: 'https://www.1800petmeds.com/vetapp/vetapipm.jsp',
    methods:{
        login:"vetnewlogin",
        loginOrg:"vetloginpm",
        signup:"newloginpm",
        forgot_user:"forgotuserpm",
        forgot_pass:"forgotpm",
        vet_list:"vetlistpm",
        prerx_list:"vetlistprerxpm",
        pre_rx:"vetprerxpm",
        rx_details:"vetrxpmget",
        getprocessed:"getprocessed",    // Get Processed RX details
        pmdeleterx:"pmdeleterx",
        change_pass:"changepwpm",
        update_rx:"vetrxpm",
        save_settings:"savesettingspm",
    },
    USER_DATA_KEY:"userdata",
    USER_KEY:"petmeds-logged-in",
    FCM_ServerKey:'AAAAKFTjuEI:APA91bHXjuQjI2zTtT58FE0ua6zQL0Fhx-qqravBthhIHFxRPjHYF8OSmRlIn4LtZrjEuw7Kgob3tXmLPNfPC4FE_T04UjS295qBMbZR_1_ygRJl4jeMqVkwdf7rMDGsiGQLnnPaf0DbOzCaQhiez4BGrrg9GiXT9A',
    FCM_Legacy_ServerKey:'AIzaSyDBguv5zhVGuvhFWUGJhw7KHzP6u0HtBY4',
    FCM_SenderId:'173222901826'
};
