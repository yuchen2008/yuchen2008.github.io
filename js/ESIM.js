var EID_val = '';
var ICCID_val = '';
var APDU_a = '1'; // 03+eid 返回APDU，a
var APDU_b = ''; // 卡片 发 a 回 b
var UPDATA_OK = ''; // DP POST: data=04 + b(去掉前2字符) 回 UPDATA_OK
var APDU_c = ''; // DP POST: data=05 + b(去掉前2字符) 回 APDU,c1,c2,c3,c4
var APDU_d = ''; // 卡片 顺序发 c1~c4 回 d
var DP_d = ''; //DP POST: DP POST: data= d


function fnGetEid(){
    
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    // 设置所使用的读卡器名称
    if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            fnRunAPDU('00a4040409676F74656C6C417070');
            fnGetSW();
             fnRunAPDU('001A000010');
             // lReturn = myScc.RunAPDU('00150000569321E1F57E6036E0D05F3022951457C63044022067CBB0F75707A43E1043636DF342699FD6163F9CE3B7A4BEF45CB49E051D340602203BCFFEC7945EF359031224ACFEC8C124D193B687894CE8AD658CA8C658264D92');
            // console.log(lReturn + '----0015');
            // 获取命令返回状态字
            fnGetSW();
            // 获取EID
            fnGetRetData('EID');
            // return EID_val;
            console.log(EID_val);
            showloading();
            var checkValue_ = fnCheckICCID();
            // console.log(typeof checkValue_);
            // console.log('==='+ checkValue_);
            if(checkValue_=="false"){
                return;
            }else{
               fnGetDP_iccid();
            }   
        }
    }
}
//provisioning
function fnGetProvisioning() {
     if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            fnRunAPDU('00a4040409676F74656C6C417070');
             // 获取命令返回状态字
            fnGetSW();

            fnRunAPDU('00E290000CBF33'+document.getElementById("provisioning_select").value);
            // 获取命令返回状态字
            fnGetSW();
            // 获取EID
            fnGetRetData('ICCID');
            // fnRunAPDU('80E2900002BF2D');
            // if(ICCID_val.length >= 22){
            //     var I_length = ICCID_val.length / 22 ;
            //     console.log(I_length + '------')
            //      console.log(typeof I_length + '------')
            //      var ICCID_list = []
            //     for(var i = 0; i< I_length ;i++){
            //           console.log(i);
            //           console.log(i*22 +'----'+ 22*(1+i))  
            //           console.log(ICCID_val.substring(i*22,(i+1)*22).substring(2) +'-----')
            //           ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
            //     }
            //     console.log(ICCID_list + '-------')
            //     // 断开卡片
            //             fnCardOff();
            //             // 将读卡器释放
            //             fnFreeReader();
            //     alert(ICCID_list);
            // }else{
            //     // 断开卡片
            //             fnCardOff();
            //             // 将读卡器释放
            //             fnFreeReader();
            //     // alert(ICCID_val);
            //     // return;
            // }
        }
    }



    // if(ICCID_val.length >= 22){
    //     var I_length = ICCID_val.length / 22 ;
    //     console.log(I_length + '------')
    //      console.log(typeof I_length + '------')
    //      var ICCID_list = []
    //     for(var i = 0; i< I_length ;i++){
    //           console.log(i);
    //           console.log(i*22 +'----'+ 22*(1+i))  
    //           console.log(ICCID_val.substring(i*22,(i+1)*22).substring(2) +'-----')
    //           ICCID_list[i] = ICCID_val.substring(i*22,(i+1)*22).substring(2);

    //           var objOption = document.createElement("OPTION");
    //           objOption.text = ICCID_val.substring(i*22,(i+1)*22).substring(2)[i];
    //           objOption.value = ICCID_val.substring(i*22,(i+1)*22).substring(2)[i];
    //           Provisioning.options.add(objOption);
    //     }
    //     console.log(ICCID_list + '-------')
    //     // 断开卡片
    //     fnCardOff();
    //     // 将读卡器释放
    //     fnFreeReader();
    //     return ICCID_list;
    // }else{
    //     // 断开卡片
    //     alert("No Data");
    //     fnCardOff();
    //     // 将读卡器释放
    //     fnFreeReader();
    //     // alert(ICCID_val);
    //     return;
    // }
}
function fnCheckICCID(){
    // 执行apdu命令
    fnRunAPDU('00a4040409676F74656C6C417070');
     // 获取命令返回状态字
    fnGetSW();
    fnRunAPDU('80E2900002BF2D');
    // 获取命令返回状态字
    fnGetSW();
    // 获取EID
    fnGetRetData('ICCID');
    if(ICCID_val.length >= 22){
        var I_length = ICCID_val.length / 22 ;
         var ICCID_list = []
        for(var i = 0; i< I_length ;i++){
              ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
              // console.log( typeof ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2)));
              if(document.getElementById("ChooseSIMCard").value ==ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2)) ){
                hiddenLoading();
                alert("Same profile has been downloaded in the SIM card, cannot be download again.");

                return "false";
              }
        }
        // console.log(ICCID_list + '-------')
        // 断开卡片
                // fnCardOff();
                // // 将读卡器释放
                // fnFreeReader();
        return "true";
    }else{
        // 断开卡片
                // fnCardOff();
                // // 将读卡器释放
                // fnFreeReader();
        alert("No Data");
        return "true";
    }
}
// DP
// A_id       输出id
// A_data     post数据前缀
// A_valueid  获取值id
// A_num  截取字符串数字  ， 默认为空--不截取
function fnAjaxAPDU(A_id,A_data,A_valueid,A_num) {
    // if(document.getElementById("GetEid").innerHTML == ''){
    //     fnGetEid();
    // }
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
    // console.log(A_value + '-----A_value')
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        // async : "true",
        async : false,
        //dataType:"json",
        data: {'data': A_value},
        beforeSend:function(){
            //some js code
        },
        success:function(msg){
            // document.getElementById(A_id).innerHTML = msg.responseText;
            console.log(msg.responseText+ '------msg.responseText');
            console.log(A_id + '---A_id----')
            if(A_id == 'APDU_a'){
                APDU_a = msg.responseText;
                console.log(APDU_a + '---APDU_a--1--')
                fnRunAPDUBACK('APDU_b',APDU_a,5);
                console.log(APDU_b +'----卡片 发 a 回 b');
            }
            if(A_id == 'UPDATA_OK'){
                UPDATA_OK = msg.responseText;
                console.log(UPDATA_OK + '-------DP POST: data=04 + b(去掉前2字符) 回 UPDATA_OK');
                // fnAjaxAPDU('APDU_c','05',APDU_b,2);
                fnAjaxAPDU_c1_c4('APDU_c','05',APDU_b,2);
                console.log(APDU_c+'------DP POST: data=05 + b(去掉前2字符) 回 APDU,c1,c2,c3,c4');
                 
            }
        
            if(A_id == 'APDU_d'){
                 fnAjaxAPDU('DP_d','',APDU_c);
                 console.log(DP_d);
            }

            if(A_id=='DP_d'){
console.log('----DP_d');
                                // hiddenLoading();
                                       // 断开卡片
                                    // fnCardOff();
                                    // 将读卡器释放
                                    // fnFreeReader();
                                //hiddenLoading();
            }

            
            // console.log(msg.response+ '------msg.response');
        },
        error:function(e){
            console.log("error--"+ e);
            console.log("error-e-"+ JSON.stringify(e));
        }
    })
}

function fnGetDP_iccid(){
    var data_val = new Date().getTime();
    console.log("twtest_"+ data_val);
    console.log(EID_val + '----EID_val');
    console.log(document.getElementById("ChooseSIMCard").value+'---iccid');
    console.log(typeof document.getElementById("ChooseSIMCard").value+'---document.getElementById("ChooseSIMCard").value');
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
                //some js code
            },
            success:function(msg){
                console.log(msg.responseText.iccid + '----msg');
                console.log(msg.iccid + '----iccid');
                // if()
                // document.getElementById(A_id).innerHTML = msg.responseText;
                if(msg.status == 200){
                    ajax({
                        type:"POST",
                        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es2plus/confirmOrder",
                        contentType:"application/json;",
                        async : false,
                        //dataType:"json",
                        data: JSON.stringify({
                            'eid':EID_val,
                            'iccid':document.getElementById('ChooseSIMCard').value,
                            'releaseFlag': true 
                        }),
                        beforeSend:function(){
                            //some js code
                        },
                        success:function(msg){
                            // document.getElementById(A_id).innerHTML = msg.responseText;
                            if(msg.status == 200){
                                fnAjaxAPDU('APDU_a','03',EID_val);
                                console.log(APDU_a + '------APDU_000000a---data=03 + eid 返回 APDU,a');
                         
                            }
                            console.log(msg.responseText+ '------msg.responseText');
                            // console.log(msg.response+ '------msg.response');
                        },
                        error:function(e){
                            console.log("error" + "--" + e);

                        }
                    })
                }
                console.log(msg.responseText+ '------msg.responseText');
                // console.log(msg.response+ '------msg.response');
            },
            error:function(e){
                console.log("error" + "--" + e);

            }
        })
}


function fnRunAPDUBACK(A_id,A_value,A_num) {
    // body...
    console.log(A_value + '---back')
    var data_value = A_value;
    var A_valueback = '';
    if(!A_num){
        A_valueback = data_value;
    }else{
        A_valueback = data_value.substring(A_num);
    }   
    lReturn = myScc.RunAPDU(A_valueback);
      console.log("CardOn----------- err:"+lReturn);
    if(lReturn!=0)
        alert("CardOn err:卡片 发 a 回 b"+"status:"+lReturn);
    // 获取命令返回状态字
    fnGetSW();
    // 获取返回数据
    fnGetRetData(A_id);
    console.log(APDU_b + '------fnAjaxAPDU(UPDATA_OK,04,APDU_b,2);')
    fnAjaxAPDU('UPDATA_OK','04',APDU_b,2);
    
}

function fnRunAPDU_C(A_id,A_value) {
    // body...
    // if(!A_value){
    //     alert("请先执行上面的步骤");
    //     return;
    // }
    var A_valueback =A_value;
    var result = A_valueback.split(",");
    console.log(result[1] + '----1');
    console.log(result[2] + '----2');
    console.log(result[3] + '----3');
    console.log(result[4] + '----4');
    // console.log(A_valueback + '------A_valueback')
    lReturn = myScc.RunAPDU(result[1]);
    if(lReturn!=0)
        alert("C1--:"+lReturn);
    lReturn = myScc.RunAPDU(result[2]);
    if(lReturn!=0)
        alert("C2--:"+lReturn);
    lReturn = myScc.RunAPDU(result[3]);
    if(lReturn!=0)
        alert("C3--:"+lReturn);
    lReturn = myScc.RunAPDU(result[4]);
    if(lReturn!=0)
        alert("C4--:"+lReturn);
    // 获取命令返回状态字
    fnGetSW();
    // 获取返回数据
    console.log(A_id + '----a_id');
    fnGetRetData(A_id);
    sRes = myScc.GetRetData();
    console.log(sRes + '----sres--')

        ajax({
            type:"POST",
            url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
            contentType:"application/x-www-form-urlencoded;",
            // async : "true",
            async : false,
            //dataType:"json",
            data: {'data': sRes},
            beforeSend:function(){
                //some js code
            },
            success:function(msg){
                // document.getElementById(A_id).innerHTML = msg.responseText;
                console.log(msg.responseText+ '------msg.responseText');
                alert("ok")
                hiddenLoading();

                // console.log(msg.response+ '------msg.response');
            },
            error:function(e){
                console.log("error--"+ e);
                console.log("error-e-"+ JSON.stringify(e));
            }
        })

     // fnAjaxAPDU('DP_d','',APDU_c);
     //             console.log(DP_d);
}
function fninputAPDU(A_id){
    var inputvalue = document.getElementById(A_id).value;
    if(!inputvalue){
        alert("请输入指令")
        return;
    }
    lReturn = myScc.RunAPDU(inputvalue);
    // document.getElementById("SetReader").innerHTML ="状态：0是成功----" + lReturn;
    if(lReturn!=0)
        alert("CardOn err:"+lReturn);
    // console.log(lReturn + '-------lReturn ---------执行apdu命令');
    sSW = myScc.GetSW();
    // console.log( sSW + '----2');
    fnGetRetData("GetRetData");
}

// 获取iccid
function fnGetICCID(){
    // 获取系统中所安装读卡器名称
    // fnListReaders();
    var provisioning_select = document.getElementById("provisioning_select");
    if(fnListReaders() == "OK"){
        // 连接智能卡
        if(fnConnect_Card(document.getElementById("ChooseReader").value)){
            // 重置读卡器获取atr值
            fnGetATR();
            // 执行apdu命令
            fnRunAPDU('00a4040409676F74656C6C417070');
             // 获取命令返回状态字
            fnGetSW();
            fnRunAPDU('80E2900002BF2D');
            // 获取命令返回状态字
            fnGetSW();
            // 获取EID
            fnGetRetData('ICCID');
            if(ICCID_val.length >= 22){
                var I_length = ICCID_val.length / 22 ;
                console.log(I_length + '------')
                 console.log(typeof I_length + '------')
                 var ICCID_list = []
                for(var i = 0; i< I_length ;i++){
                
                      console.log(ICCID_val.substring(i*22,(i+1)*22).substring(2) +'-----')
                      var objOption = document.createElement("OPTION");
                      objOption.text = ICCID_val.substring(i*22,(i+1)*22).substring(2);
                      objOption.value = ICCID_val.substring(i*22,(i+1)*22).substring(2);
                      provisioning_select.options.add(objOption);
                      ICCID_list[i] = ChangeNums(ICCID_val.substring(i*22,(i+1)*22).substring(2));
                }
                console.log(ICCID_list + '-------')
                // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
                alert(ICCID_list);
            }else{
                // 断开卡片
                        fnCardOff();
                        // 将读卡器释放
                        fnFreeReader();
                // alert(ICCID_val);
                // return;
            }
        }
    }
}


// DP
// A_id       输出id
// A_data     post数据前缀
// A_valueid  获取值id
// A_num  截取字符串数字  ， 默认为空--不截取
function fnAjaxAPDU_c1_c4(A_id,A_data,A_valueid,A_num) {
    // if(document.getElementById("GetEid").innerHTML == ''){
    //     fnGetEid();
    // }
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
    console.log(A_value + '-----A_value')
    ajax({
        type:"POST",
        url:"https://c9dp.roam2free.com:8443/roam2free-dp-service/gsma/rsp2/es9plus/m2m/sendRes",
        contentType:"application/x-www-form-urlencoded;",
        // async : "true",
        async : false,
        //dataType:"json",
        data: {'data': A_value},
        beforeSend:function(){
            //some js code
        },
        success:function(msg){
            // document.getElementById(A_id).innerHTML = msg.responseText;
            console.log(msg.responseText+ '------msg.responseText');
            APDU_c = msg.responseText;
            fnRunAPDU_C('APDU_d',APDU_c);
            // fnRunAPDU_C()

            
            // console.log(msg.response+ '------msg.response');
        },
        error:function(e){
            console.log("error--"+ e);
            console.log("error-e-"+ JSON.stringify(e));
        }
    })
}

function fnListReaders(){
    //此处为获取系统中所安装读卡器名称的借口
    var ChooseReaders = document.getElementById("ChooseReader");
    ChooseReaders.innerHTML = '';
    try {
        s=new String(myScc.ListReaders());
         }
    catch(err){
         console.log(err); // 可执行
         alert("插件出错，请安装插件并允许ActiveX控件,使用IE浏览器打开");
         return;
    }
         cars=s.split("||");
         if(cars.length==1){
            alert("没有检测到读卡器");
            return;
         } else{
            for(var i = 0;i<cars.length-1;i++){
                var objOption = document.createElement("OPTION");
                objOption.text = cars[i];
                objOption.value = cars[i];
                ChooseReaders.options.add(objOption);
            }
         }
         // console.log(ChooseReaders.value);
        return "OK";
}
//设置所使用的读卡器名称
function fnSetReader(val){
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        alert("CardOn err:"+"设置所使用的读卡器名称.state:"+lReturn + ".");
        return false;
    }
    return true;
    // console.log(lReturn + '-------lReturn ---------设置所使用的读卡器名称')
}
function fnConnect_Card(val) {
    // body...
    lReturn = myScc.SetReader(val);
    if(lReturn!=0){
        // alert("CardOn err:"+"设置所使用的读卡器名称.state:"+lReturn + ".");
        alert("设置所使用的读卡器名称出错.");
        return;
    }
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        // alert("CardOn err:"+"连接智能卡.state:"+lReturn + ".");
        alert("连接智能卡出错.");
        return;
    }
    return true;

    
}
//连接智能卡
function fnCardOn(event) {
    lReturn = myScc.CardOn();
    if(lReturn!=0){
        alert("CardOn err:"+"连接智能卡.state:"+lReturn + ".");
        return;
    }
}
//重置读卡器获取atr值
function fnGetATR() {
    sATR = myScc.GetATR();
    // console.log(sATR + '-------sATR ---------重置读卡器获取atr值')
}
//执行apdu命令
function fnRunAPDU(val){
    lReturn = myScc.RunAPDU(val);
    console.log(val + '-------fnRunAPDU ---------执行apdu命令')
    if(lReturn!=0){
        alert("CardOn err:"+"执行apdu命令"+val+".state:"+lReturn + ".");
        return;
    }
    // console.log(lReturn + '-------lReturn ---------执行apdu命令')
}
//获取命令返回状态字
function fnGetSW() {
    //获取命令返回状态字
    sSW = myScc.GetSW();

    if(sSW!=9000){
        // console.log( sSW + '----1');
        // alert("返回状态不是9000，Get Response失败！  sSW=" + sSW);
        if(sSW.substring(0,2)=="61" || sSW.substring(0,2)=="91"){
            // console.log(sSW + '---2')
            fnRunAPDU("00C00000"+sSW.substring(2));
            fnGetSW();
        }
        if(sSW == "6A84"){
            alert("Cannot download profile to SIM card. There are already 10 profiles in SIM card. ");
        }
        // console.log( sSW + '---3');
    }

    console.log(sSW + '-------sSW ---------获取命令返回状态字')
}
//获取返回数据
function fnGetRetData(val) {
    sRes = myScc.GetRetData();
    // console.log(sRes + '-------sRes ---------获取返回数据')
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
        // console.log(APDU_d + '------APDU_d----');
        return APDU_d;
    }  
}

//获取返回数据
function fnGetRetData_value() {
    sRes = myScc.GetRetData();
    // console.log(sRes + '-------sRes ---------获取返回数据')
    return sRes;
}

function fnCardOff(){
    lReturn = myScc.CardOff();
    if(lReturn!=0){
        console.log("CardOff return "+lReturn);
        alert("断开卡片出错");
    }
    // console.log(lReturn + '-------lReturn ---------断开卡片')
}
function fnFreeReader(){
    lReturn = myScc.FreeReader();

    if(lReturn!=0){
        console.log("FreeReader return "+lReturn);
        alert("释放读卡器出错");
    }
    // console.log(lReturn + '-------lReturn ---------将读卡器释放');
}

// 使用原生js 封装ajax
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
    //xhr.responseType=ajaxData.dataType;
    

    // header
    // xhr.withCredentials = true;
    // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
    // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "https://c9dp.roam2free.com:8443");
    // xhr.setRequestHeader("Access-Control-Max-Age","86400");

    xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);

    xhr.setRequestHeader("Content-Type",ajaxData.contentType);
    xhr.send(convertData(ajaxData.data));
    // xhr.send(ajaxData.data);
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
        // var mf_change=false;   
        //  try   
        //  {   
             
        //   mf_change = new ActiveXObject("Msxml2.XMLHTTP");   
          
        //  }   
        //  catch (e)   
        //  {   
        //     try   
        //     {   
        //       mf_change = new ActiveXObject("Microsoft.XMLHTTP");   
        //     }   
        //     catch (E)   
        //     {   
        //       mf_change = false;   
        //     }   
        //  }  
        //  if (!mf_change && typeof XMLHttpRequest!='undefined')   
        //  {   
        //    mf_change = new XMLHttpRequest();   
        //  }   
        //  // alert(JSON.stringify(mf_change));
        //  return mf_change;  


    // if (window.ActiveXObject) {
    //     return new ActiveXObject("Microsoft.XMLHTTP");
    //      // xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    // } else if (window.XMLHttpRequest) {
    //     return new XMLHttpRequest();
    // }

    // if(window.ActiveXObject){
    //     var ieArr=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP","Microsoft.XMLHTTP"]; 
    //     for(var i=0;i<ieArr.length;i++)
    //     {
    //         var xmlhttp= new ActiveXObject(ieArr[i]);
    //     }
    //     return xmlhttp;
    //     } else if(window.XMLHttpRequest){
    //         return new XMLHttpRequest();
    //     } 
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
//传入字符串进行互换，返回结果
function ChangeNums(arr){
  var v_array = arr.split("");
  var rs=new Array();
  var value = "";
  for(var i=0;i<v_array.length;i++){
    if((i%2)!=0){//奇偶判断，这是奇数
    rs[i]=v_array[i-1];
    }else{//这是偶数
      rs[i]=v_array[i+1];
    }
  }
  value=rs.join("");
  return value;
}