var EID_val = '';
var ICCID_val = '';
var APDU_a = '1'; 
var APDU_b = ''; 
var UPDATA_OK = ''; 
var APDU_c = ''; 
var APDU_d = ''; 
var DP_d = ''; 
var provisioning_id = ''; 
var view_provisioning = '';

function fnGetEid(){
   
    if(fnListReaders() == "OK"){
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            fnGetATR();
            fnRunAPDU('00a4040409676F74656C6C417070');
            fnGetSW();
             fnRunAPDU('001A000010');
            fnGetSW();
            fnGetRetData('EID');
            showloading();
            var checkValue_ = fnCheckICCID();
            if(checkValue_=="false"){
                hiddenLoading();
                return;
            }else{
               fnGetDP_iccid();
            }   
        }
    }
}

function fnViewProvisioning(){
    if(fnListReaders() == "OK"){
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            fnGetATR();
            fnRunAPDU('00a4040409676F74656C6C417070');
            fnGetSW();
            fnRunAPDU('00A9000000');
            fnGetSW();
            fnGetRetData('provisioning_id');
            if(provisioning_id.length >= 22){
                var I_length = provisioning_id.length / 22 ;
                 var provisioning_list = []
                for(var i = 0; i< I_length ;i++){
                      provisioning_list[i] = ChangeNums(provisioning_id.substring(i*22,(i+1)*22).substring(2));
                }
                        fnCardOff();
                        fnFreeReader();
                alert(provisioning_list);
            }else{
                        fnCardOff();
                        fnFreeReader();
            }
        }
    }
}
function fnGetProvisioning() {
     if(fnListReaders() == "OK"){
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            fnGetATR();
            fnRunAPDU('00a4040409676F74656C6C417070');
            fnGetSW();

            fnRunAPDU('00E290000CBF33'+document.getElementById("provisioning_select").value);
            fnGetSW();
            fnGetRetData('provisioning_id');
                console.log(ICCID_val.substring(i*22,(i+1)*22).substring(2) +'-----')
           
            }
        }
}
function fnCheckICCID(){
    fnRunAPDU('00a4040409676F74656C6C417070');
    fnGetSW();
    fnRunAPDU('80E2900002BF2D');
    fnGetSW();
    fnGetRetData('ICCID');
    if(ICCID_val.length >= 22){
        var I_length = ICCID_val.length / 22 ;
         var ICCID_list = []
        for(var i = 0; i< I_length ;i++){
              ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
              if(document.getElementById("ChooseSIMCard").value ==ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2)) ){
                alert("Same profile has been downloaded in the SIM card, cannot be download again.");
                hiddenLoading();
                return "false";
              }
        }
        return "true";
    }else{
        alert("No Data");
        return "true";
    }
}
function fnAjaxAPDU(A_id,A_data,A_valueid,A_num) {
    var data_value = A_valueid;
    var A_value = '';
    if(A_data == ''){
        if(!A_num){
            A_value = data_value;
        }else{
            A_value = data_value.substring(A_num);
        }
    }else{
        if(!A_num){
            A_value = A_data + data_value;
        }else{
            A_value = A_data + data_value.substring(A_num);
        }

    }
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        async : false,
        data: {'data': A_value},
        beforeSend:function(){
        },
        success:function(msg){
            if(A_id == 'APDU_a'){
                APDU_a = msg.responseText;
                fnRunAPDUBACK('APDU_b',APDU_a,5);
            }
            if(A_id == 'UPDATA_OK'){
                UPDATA_OK = msg.responseText;
                fnAjaxAPDU_c1_c4('APDU_c','05',APDU_b,2);
                 
            }
        
            if(A_id == 'APDU_d'){
                 fnAjaxAPDU('DP_d','',APDU_c);
            }

            if(A_id=='DP_d'){
            }

            
        },
        error:function(e){
            alert("There are problems in download profile from server (3)");
            hiddenLoading();
        }
    })
}

function fnGetDP_iccid(){
    var data_val = new Date().getTime();
   
    ajax({
            type:"POST",
            url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es2plus/downloadOrder",
            contentType:"application/json;",
            async : false,
            dataType:"json",
            data: JSON.stringify({
                "orderId":"twtest_"+ data_val,
                "eid":EID_val+"",
                "iccid":document.getElementById("ChooseSIMCard").value
            }),
            beforeSend:function(){
            },
            success:function(msg){
                if(msg.status == 200){
                    ajax({
                        type:"POST",
                        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es2plus/confirmOrder",
                        contentType:"application/json;",
                        async : false,
                        data: JSON.stringify({
                            'eid':EID_val,
                            'iccid':document.getElementById('ChooseSIMCard').value,
                            'releaseFlag': true 
                        }),
                        beforeSend:function(){
                        },
                        success:function(msg){
                            if(msg.status == 200){
                                fnAjaxAPDU('APDU_a','03',EID_val);
                         
                            }else{
                                alert("There are problems in download profile from server (2)");
                                hiddenLoading();
                            }
                        },
                        error:function(e){
                            alert("There are problems in download profile from server (2.1)");
                            hiddenLoading();
                            console.log("error" + "--" + e);

                        }
                    })
                }else{
                    alert("There are problems in download profile from server (1)");
                    hiddenLoading();
                }
            },
            error:function(e){
                alert("There are problems in download profile from server (1.1)");
                hiddenLoading();

            }
        })
}


function fnRunAPDUBACK(A_id,A_value,A_num) {
    var data_value = A_value;
    var A_valueback = '';
    if(!A_num){
        A_valueback = data_value;
    }else{
        A_valueback = data_value.substring(A_num);
    }   
    lReturn = myScc.RunAPDU(A_valueback);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    fnGetSW();
    fnGetRetData(A_id);
    fnAjaxAPDU('UPDATA_OK','04',APDU_b,2);
    
}

function fnRunAPDU_C(A_id,A_value) {
    var A_valueback =A_value;
    var result = A_valueback.split(",");
    lReturn = myScc.RunAPDU(result[1]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[2]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[3]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    lReturn = myScc.RunAPDU(result[4]);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    fnGetSW();
    fnGetRetData(A_id);
    sRes = myScc.GetRetData();

        ajax({
            type:"POST",
            url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
            contentType:"application/x-www-form-urlencoded;",
            async : false,
            data: {'data': sRes},
            beforeSend:function(){
            },
            success:function(msg){
            
                if(msg.responseText.indexOf("CTRL")==-1){ 
                    alert("Failed to update SIM with selected profile");
                }else{
                    alert("SIM is updated successfully with selected profile");
                }
                hiddenLoading();

            },
            error:function(e){
                alert("There are problems in download profile from server (3)");
                hiddenLoading();
            }
        })

}
function fninputAPDU(A_id){
    var inputvalue = document.getElementById(A_id).value;
    if(!inputvalue){
        alert("请输入指令")
        return;
    }
    lReturn = myScc.RunAPDU(inputvalue);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        return;
    }
    sSW = myScc.GetSW();
    fnGetRetData("GetRetData");
}
function fnGetICCID(){
    if(fnListReaders() == "OK"){
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            fnGetATR();
            fnRunAPDU('00a4040409676F74656C6C417070');
            fnGetSW();
            fnRunAPDU('80E2900002BF2D');
            fnGetSW();
            fnGetRetData('ICCID');
            if(ICCID_val.length >= 22){
                var I_length = ICCID_val.length / 22 ;
                 var ICCID_list = []
                for(var i = 0; i< I_length ;i++){
                      ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
                }
                        fnCardOff();
                        fnFreeReader();
                        alert(ICCID_list);
            }else{
                        fnCardOff();
                        fnFreeReader();
            }
        }
    }
}


function fnAjaxAPDU_c1_c4(A_id,A_data,A_valueid,A_num) {
 
    var data_value = A_valueid;
    var A_value = '';
    if(A_data == ''){
        if(!A_num){
            A_value = data_value;
        }else{
            A_value = data_value.substring(A_num);
        }
    }else{
        if(!A_num){
            A_value = A_data + data_value;
        }else{
            A_value = A_data + data_value.substring(A_num);
        }

    }
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        async : false,
        data: {'data': A_value},
        beforeSend:function(){
        },
        success:function(msg){

             if(msg.status == 200){
                APDU_c = msg.responseText;
                fnRunAPDU_C('APDU_d',APDU_c);
            }else{
                alert("There are problems in download profile from server (3)");
                hiddenLoading();
            }

            

            
        },
        error:function(e){
            alert("There are problems in download profile from server (1)");
        }
    })
}

function fnListReaders(){
    var ChooseReaders = document.getElementById("ChooseReader");
    ChooseReaders.innerHTML = '';
    try {
        s=new String(myScc.ListReaders());
         }
    catch(err){
         alert("Please use IE browser, install and activate LPA plugin.");
         hiddenLoading();
         return;
    }
         cars=s.split("||");
         if(cars.length==1){
            alert("There is no SIM card reader found.");
            hiddenLoading();
            return;
         } else{
            for(var i = 0;i<cars.length-1;i++){
                var objOption = document.createElement("OPTION");
                objOption.text = cars[i];
                objOption.value = cars[i];
                ChooseReaders.options.add(objOption);
            }
         }
        return "OK";
}
function fnSetReader(val){
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        alert("There are problems reading SIM card reader.");
        hiddenLoading();
        return false;
    }
    return true;
}
function fnConnect_Card(val) {
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        alert("There are problems reading SIM card reader.");
        hiddenLoading();
        return;
    }
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        alert("There are problems connected to SIM card reader.");
        hiddenLoading();
        return;
    }
    return true;

    
}
function fnCardOn(event) {
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        alert("There are problems connected to SIM card reader.");
        hiddenLoading();
        return;
    }
}
function fnGetATR() {
    sATR = myScc.GetATR();
}
function fnRunAPDU(val){
    lReturn = myScc.RunAPDU(val);
    if(lReturn!=0){
        alert("There are problems in communicating with SIM card（"+lReturn+"）.");
        hiddenLoading();
        return;
    }
}
function fnGetSW() {
    sSW = myScc.GetSW();

    if(sSW!=9000){
        if(sSW.substring(0,2)=="61" || sSW.substring(0,2)=="91"){
            fnRunAPDU("00C00000"+sSW.substring(2));
            fnGetSW();
        }
        if(sSW == "6A84"){
            alert("Cannot download profile to SIM card. There are already 10 profiles in SIM card. ");
            hiddenLoading();
        }
    }
}
function fnGetRetData(val) {
    sRes = myScc.GetRetData();
    if(val == 'EID'){
        EID_val = sRes
        return EID_val;
    }
    if(val == 'ICCID'){
        ICCID_val = sRes
        return ICCID_val;
    } 
    if(val == 'APDU_b'){
        APDU_b = sRes
        return APDU_b;
    }
    if(val == 'APDU_d'){
        APDU_d = sRes
        return APDU_d;
    } 
    if(val == 'provisioning_id'){
        provisioning_id = sRes
        return provisioning_id;
    }  
    
}

function fnGetRetData_value() {
    sRes = myScc.GetRetData();
    return sRes;
}

function fnCardOff(){
    lReturn = myScc.CardOff();
    if(lReturn!=0){
        alert("There are problems ejecting SIM card / card reader");
        hiddenLoading();
        return;
    }
}
function fnFreeReader(){
    lReturn = myScc.FreeReader();

    if(lReturn!=0){
        alert("There are problems ejecting SIM card reader");
        hiddenLoading();
        return
    }
}

function ajax(){
    var ajaxData = {
        type:arguments[0].type || "GET",
        url:arguments[0].url || "",
        async:arguments[0].async || "true",
        data:arguments[0].data || null,
        dataType:arguments[0].dataType || "text",
        contentType:arguments[0].contentType || "application/x-www-form-urlencoded",
        beforeSend:arguments[0].beforeSend || function(){},
        success:arguments[0].success || function(){},
        error:arguments[0].error || function(){}
    }
    ajaxData.beforeSend()
    var xhr = createxmlHttpRequest();
    try {
        
        xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
         }
    catch(err){
         console.log(err); 
         alert("There are problems in download profile from server (0).");
         hiddenLoading();
         return;
    }
    


    
   
    xhr.setRequestHeader("Content-Type",ajaxData.contentType);
    xhr.send(convertData(ajaxData.data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200){
                ajaxData.success(xhr)
            }else{
                ajaxData.error(xhr)
            }
        }
    }
}

function createxmlHttpRequest() {     
return new XMLHttpRequest()
       
   
}

function convertData(data){
    if( typeof data === 'object' ){
        var convertResult = "" ;
        for(var c in data){
            convertResult+= c + "=" + data[c] + "&";
        }
        convertResult=convertResult.substring(0,convertResult.length-1)
        return convertResult;
    }else{
        return data;
    }
}
function ChangeNums(arr){
  var v_array = arr.split("");
  var rs=new Array();
  var value = "";
  for(var i=0;i<v_array.length;i++){
    if((i%2)!=0){
    rs[i]=v_array[i-1];
    }else{
      rs[i]=v_array[i+1];
    }
  }
  value=rs.join("");
  return value;
}