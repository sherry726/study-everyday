/**
 * 数据显示两种情况：
一：一条流程一条数据
      1、我管理的模板全部（前后端管理员数据） workflowManageManager.testPaging
      2、我督办的：全部、待办、已办（非节点、泳道查询、当前待办人） superviseManager.getAllSuperviseList4Col
二：一条事项一条数据   workflowManageManager.getSuperviseListForOverDue
     1、我部门的下三个页签（全部、已超期、七天超期）
     2、我督办的：已超期、七天超期页签、节点、泳道查询、当前待办人
 */

     var grid;
     var searchobj;
     var layoutObj;
     var toolbar;
     var reloadObj;//列表请求后，保留请求对象数据，用于操作刷新列表用
     var isSearch = false;
     var lastQueryType = "simple"; // 上次的查询类型，普通查询（simple）或高级查询（more），用于删除数据后自动刷新
     var _resizeGridHeight=function () {
         var relHeight=_getGridHeight();
         if(grid!=null){
             $(grid.grid.bDiv).height(relHeight-37);
         }
     }
     var hasProcessShowType = false;
     //密级开关
     var secretLevelEnable=false;
     var dealStateArr = [
         {value:'0',label:'全部'},
         // {value:'1',label:'待发'},
         // {value:'2',label:'已发'},
         {value:'3',label:'待办'},
         {value:'4',label:'已办'},
         // {value:'5',label:'取消'},
         // {value:'6',label:'回退'},
         // {value:'7',label:'取回'},
         // {value:'8',label:'竞争执行'},
         // {value:'15',label:'终止'},
         
     ];
     //下拉多选
      new CtpUiMultiSelect($("#name_text4").get(0), {
         search: false,
         type: "CtpUiMultiSelect",
         disabled: false,
         options: dealStateArr
     })
     $(window).resize(function () {
         _resizeGridHeight();
     })
     //获取表格的实际高度信息
     var _getGridHeight=function(){
         var pageHeight= parent.$("#detailIframe").height();
     
         if(!pageHeight){
             pageHeight=parseFloat(parent.document.getElementById("main").style.height);
             pageHeight=pageHeight;
         }
     
     //   需要减去界面标题栏区域的高度
         if($("#north").get(0) && $("#north").get(0).style.display!="none"){
             //13表示north的上边距
             pageHeight=pageHeight-$("#north").height();
         }
         //如果工具栏存在 则需要减去工具栏的高度
         if($("#toolbar").get(0).style.display!="none"){
             pageHeight=pageHeight-$("#toolbar").height();
         }
         //如果查询区域存在 则减去查询区域的高度
         if($("#queryBody").get(0).style.display!="none"){
             //这里的8 是间距的宽度
             pageHeight=pageHeight-$("#queryBody").height()-8;
         }
     
         //如泳道询区域存在 则减去泳道区域的高度
         if($("#processShowTypeBody").get(0).style.display!="none"){
             //这里的8 是间距的宽度
             pageHeight=pageHeight-$("#processShowTypeBody").height()-16;
         }
     
         //由于存在分页条  所以传入的高度 需要减去其中的分页高度
         pageHeight=pageHeight-53;
         return pageHeight;
     }
     
     
     
     $(document).ready(function() {
         if(isShowStatisticalToolBar=="1"){
             $("#north").show();
         }
         if (isAdmin) {
             $("#queryBody").show();
         }
         initEventFun();
         $("#senders").removeClass("color_gray");
         loadToolBar();
         if(quotaType && quotaType!=""){
             dataTypeChange(null,quotaType);
         } else {
             var dataTypeDom = $("#dataTypeTapDiv .menu_item:first");
             //没有选择板块的时候,默认显示第一个板块
             if (dataTypeDom.length == 0) {
                 dataTypeChange(null, 'all');
             } else {
                 dataTypeDom.click();
             }
         }
         loadTabCount();
         $("input").attr("autocomplete", "off");
         $("select").attr("autocomplete", "off");
     
         if(isShowTotal=="0"){
             $("#overdueCount").hide();
             $("#sevenDayOverdueCount").hide();
             $("#workflowProblemCount").hide();
         }
         modifyTip();
         //密级是否开启
         secretLevelEnable = callBackendMethod("secretAjaxManager", "secretLevelEnable");
     });
     
     /**
      * 加载页签数字
      */
     function loadTabCount(){
         //已超期\七天内超期\流程异常(未处理)
         // 动态决定是否需要请求统计数
         var hasNeedCountModule = (haveOverdue || haveNoOverdue || haveProcessException);
         //当只有流程异常的时候,reloadObj为undefined,不请求总数,流程异常页面加载完后刷新总数
         if(!isAdmin && isShowStatisticalToolBar=="1" && isShowTotal=="1" && hasNeedCountModule){
             var obj = reloadObj || {};
             obj.haveOverdue = haveOverdue;
             obj.haveNoOverdue = haveNoOverdue;
             obj.haveProcessException = haveProcessException;
             obj.managerType = managerType;
     
             callBackendMethod("affairManager","getProcessSuperviseCountMap",obj,{
                 success : function (data) {
                     $("#overdueCount").text(data.overdue);
                     $("#sevenDayOverdueCount").text(data.sevenDayOverdue);
                     $("#workflowProblemCount").text(data.workflowBug);
                 }
             });
         }
     }
     var gridObj=null;
     function _initGridTable(data,minWidth) {
         if(gridObj!=null){
             var parentEl=$('#processShowTypeBody').parent();
             gridObj.destructor();
             $('#processShowTypeBody').remove();
             parentEl.html("<div class=\"query_area_body clearfix\" id=\"processShowTypeBody\" style=\"border:0;width:100%;overflow: auto;\"></div>");
         }
         var maxHeight=4*35+10;
         if(data.length*35+10<maxHeight){
             maxHeight=data.length*35+10;
         }
         gridObj = $('#processShowTypeBody').ajaxEditorGrid({
             colModel: [
                 {
                     display: "title",
                     name: 'subject',
                     sortable : true,
                     validator:'NotEmpty',
                     type:'ro',
                     width: '120'
                 }, {
                     display: "time",
                     name: 'startDate',
                     sortable : true,
                     type:'ro',
                     width: minWidth
                 }
             ],
             width:$("#processShowTypeBody").width(),
             gridType:"flexGrid",
             usepager:false,
             containerId:"mainPage",
             height: maxHeight,
             autoload:false
         });
         gridObj.detachHeader&&gridObj.detachHeader(0);
         gridObj.splitAt&&gridObj.splitAt(1);
         return gridObj;
     }
     
     function initProcessShowType() {
         //operationTypeIds
         var maxHeight=4*40+30;
         var minWidth=parseFloat($("#gridBodyDiv").width())-170;
         var o = reloadObj;
         o.showType = showType;
     
         callBackendMethod("superviseManager","getProcessMsgByTemplates",o,{
             success : function (data) {
                 if (data && data.length > 0) {
                     var gridHeight=data.length*40+30;
                     //如果列表高度大于了最大高度
                     if(gridHeight>maxHeight){
                         gridHeight=maxHeight;
                     }
                     $("#processShowTypeBody").parent().css("backgroundColor","#FFF");
                     $("#processShowTypeBody").show();
                     //初始化表格
                     var gridObj=_initGridTable(data,minWidth);
                     var total=0;
                     // var processHTML = "";
                     for (var i = 0; i < data.length; i++) {
                         var templateName = "";
                         var templateHTML = "";
     
                         var map = data[i];
     
                         for(var key in map) {
                             if (key == "templateName") {
                                 templateName = map[key];
                             }else if(key == "templateId"){
                                 // 不处理
                             } else {
                                 templateHTML += "<span style='margin-right: 10px;color:#1F85EC;cursor: pointer' onclick='chooseNode("+ key +", \"" + map.templateId + "\")' >" + map[key] + "</span>"
                             }
                         }
     
                         $("<span id='tempSapn' style='visibility: hidden;display:inline-block;white-space:nowrap;'>"+templateHTML+"</span>").appendTo($(document.body));
                         //获取表格单元格的宽度
                         if($("#tempSapn").width()>total&&$("#tempSapn").width()>minWidth){
                             total=$("#tempSapn").width();
                             gridObj.setColWidth&&gridObj.setColWidth(1,$("#tempSapn").width())
                         }
                         $("#tempSapn").remove();
                         //添加相应的数据
                         gridObj.addRow&&gridObj.addRow(gridObj.uid(),['<div class="frist_td">'+templateName+'&nbsp;</div>',templateHTML+"&nbsp;"]);
     
                     }
                     $(".frist_td").parent().css("backgroundColor","#F6F9FC");
                 } else {
                     $("#processShowTypeBody").hide();
                 }
                 _resizeGridHeight();
             }
         });
     }
     
     var isClick = true;
     /**
      * 切换页签方法
      */
     function dataTypeChange(eleObj, dataType) {
         //防止js快速切换tab
         if(!isClick) {
             return void(0);
         }
         isClick=false;
         if (isShowTotal=="1" && dataType != "done" && showType != "undefined" && showType != "" && showType != "0") {
             hasProcessShowType = true;
         } else {
             hasProcessShowType = false;
         }
     
         if (dataType == "processException") {//流程异常
             $("#gridBodyDiv").hide();
             $("#processException").show();
     
         } else {
             $("#gridBodyDiv").show();
             $("#processException").hide();
         }
     
         //点击恢复默认按钮
         resetBtnClickFunc(dataType);
         if(searchobj){
             searchobj.g.clearCondition();
         }
         _dataType = dataType;
         if (isAdmin || managerType == "mySupervise") {
             $("#processOperationTypeDiv").hide();
             $("#AllOperationTypeDiv").show();
         } else {
             $("#processOperationTypeDiv").show();
             $("#AllOperationTypeDiv").hide();
         }
         if(managerType == "mySupervise"){
             $("#doneStateDiv").show();
             $("#flowstateDiv").hide();
         } else {
             $("#doneStateDiv").hide();
             $("#flowstateDiv").show();
         }
     
         if(managerType == "deptAdmin" || dataType != "all"){
             $("#flowstateDiv input[name='flowstate']").attr("disabled", "disabled");
         } else {
             $("#flowstateDiv input[name='flowstate']").attr("disabled", false);
         }
     
     
         if(managerType == "mySupervise" && dataType != "all"){
             $("#doneStateDiv input[name='status']").attr("disabled", "disabled");
         } else {
             $("#doneStateDiv input[name='status']").attr("disabled", false);
         }
     
         if ((dataType == "all" || dataType == "pending" || dataType == "done")
                 && (managerType == "mySupervise" || managerType == "deptAdmin")) {
             $("#currentNodesInfoDiv").hide();
         } else {
             $("#currentNodesInfoDiv").show();
         }
     
         if(dataType == "all" || dataType == "pending"  || dataType == "done"){
             toolbar.showBtn("exportExcel");
         } else {
             toolbar.hideBtn("exportExcel");
         }
     
         if(dataType == "done"){
             toolbar.hideBtn("editWorkFlow");
             toolbar.hideBtn("batchEditWorkFlow");
             toolbar.hideBtn("batchIconBtn");
         }else{
             toolbar.showBtn("editWorkFlow");
             toolbar.showBtn("batchEditWorkFlow");
             toolbar.showBtn("batchIconBtn");
         }
     
     
         $("#dataTypeTapDiv .menu_item").removeClass("active_item");
         $("#dataTypeTapDiv .menu_item").removeClass("active_item");
         if (eleObj) {
             $(eleObj).addClass("active_item");
         } else {
             $("#dataTypeTapDiv ." + dataType).addClass("active_item");
         }
         $("#dataType").val(dataType);
         //页签切换时默认隐藏督办的删除按钮
         if (dataType == "done"){
             toolbar.showBtn("deleteSupervise");
         }else{
             toolbar.hideBtn("deleteSupervise");
         }
     
         if (dataType == "processException") {//流程异常
             $(".common_search_condition ").hide();
             var detailIframe=document.getElementById('processExceptionIframe').contentWindow;
             detailIframe.location.href = _ctxPath + "/workflow/designer.do?method=workflowProblemList"
                 + CsrfGuard.getUrlSurffix();
         } else {
             $(".common_search_condition ").show();
             loadGrid(dataType);
         }
     
         //节点or泳道（当不显示统计数的时候，就不显示节点与泳道）
         if (hasProcessShowType) {
             initProcessShowType();
         } else {
             $("#processShowTypeBody").hide();
         }
         setTimeout(function() {
             isClick = true;
         }, 500);//一秒内不能重复点击
     }
     //点击恢复默认按钮-新增方法
     function resetBtnClickFunc(dataType){
         console.log($("#name_text4").get(0));
         // console.log('resetBtnClickFunc dataType===>',dataType);
         //点击恢复默认按钮
         $("#emergLevel").val("");
         $("#queryBody").find("input[type='text']").val("");
         $("#queryBody").find("input[type='hidden']").val("");
         $("#queryBody").find("input:radio[value='0']").attr('checked','true');
         $("#flowstateDiv").find("input:radio[value='0']").attr('checked','true');
         if(dataType=='all'||dataType=='pending'||dataType=='overdue'||dataType=='sevenDayOverdue' || dataType==undefined){
             $("#doneStateDiv").find("input:radio[value='0']").attr('checked','true');
         }else{
             $("#doneStateDiv").find("input:radio[value='1']").attr('checked','true');
         }
         $("#queryBody").find("input:radio[value='self']").attr('checked','true');
         if($.ctx.hasPlugin("edoc") && openForm == 'govdoc'){
             $("#condition").val("401");
             $("#importantLevel").attr("disabled", true);
         }else{
             $("#condition").val("1");
             $("#importantLevel").attr("disabled", false);
         }
         $("#importantLevel").val("");
         $("#templateName").hide();
         if(dataType!=undefined){
             toolbar.hideBtn("processRevive");
             toolbar.showBtn("SkipNode");
             toolbar.showBtn("stepBackToTargetNode");
             toolbar.showBtn("NodeReplacebatch");
         }
     
         if(typeof(templateOrginalData)!='undefined' && templateOrginalData != null ){
             templateOrginalData=new Object();
         }
     }
     //删除已办结记录
     function deleteSupervise() {
         var rows = grid.grid.getSelectRows();
         var len = rows.length;
         var str = "";
         for (var i = 0; i < len; i++) {
             str += rows[i].id;
             str += ",";
         }
         if (len === 0) {
             //请选择一条督办记录!
             $.alert($.i18n('collaboration.workflow.label.pleaseChoose'));
             return false;
         }
         str = str.substring(0, str.length - 1);
         $.confirm({'msg' : $.i18n('collaboration.common.supervise.sureDeleteSupervise') , //确定要删除督办记录?'
             ok_fn : function() {
                 var sup = new superviseManager();
                 sup.deleteSupervisedAjax(str, {
                     success : function() {
                         for (var i = 0; i < rows.length; i++) {
                             try {
                                 var _affairId = getSenderAffairId(rows[i].summaryId);
                                 closeOpenMultyWindow(_affairId);
                             } catch (e) {
                             };
     
                         }
                         //刷新列表
                         if(isSearch==true){
                             search(lastQueryType);
                         }else{
                             loadGrid(_dataType);
                         }
                     },
                     error : function(request, settings, e) {
                         $.alert(e);
                     }
                 });
             }
         });
     }
     function loadToolBar() {
     
         var toolbarArray = new Array();
     
         if(managerType != "deptAdmin"){
             toolbarArray.push({
                 id: "editWorkFlow",
                 name: $.i18n('common.design.workflow.label'),//编辑流程
                 className: "ico16 process_16",
                 click: editFlowChart
             });
     
             var submenu = new Array();
             submenu.push({
                 id:"batchEditFlow",
                 name: $.i18n("collaboration.common.workflow.supervise.batch.modify"),//批量修改流程
                 click: batchEditFlowChart
             });
             submenu.push({
                 id:"batchEditAllFlow",
                 name: $.i18n("collaboration.common.workflow.supervise.batch.modify.all"),//修改所有流程
                 click: batchEditAllFlowChart
             });
     
     
             toolbarArray.push({
                 id: "batchEditWorkFlow",
                 name:  $.i18n("collaboration.common.workflow.supervise.batch.modify"),
                 className: "ico16 process_16",
                 subMenu: submenu
             });
     
             toolbarArray.push({
                 id:"batchIconBtn",
                 img:'syIcon sy-help-line',
                 color:'#f00',
                 className:'syIcon sy-help-line modify_supervise_tip',
                 btnType:'iconBtn',
                 click:function(){}
             });
     
             toolbarArray.push({
                 id: "editWorkFlowLog",
                 name: $.i18n('collaboration.common.workflow.supervise.batch.modify.log'),//修改日志
                 className: "ico16 process_16",
                 click: editWorkFlowLog
             });
         }
     
         if (isAdmin || managerType == "formAdmin") {
             toolbarArray.push({
                 id: "processEnd",
                 name: $.i18n('supervise.process.End'),//流程终止
                 className: "ico16 termination_16",
                 click: stopWorkflow
             });
             toolbarArray.push({
                 id: "processRevoke",
                 name: $.i18n('common.toolbar.repeal.label'),//流程撤销
                 className: "ico16 revoked_process_16",
                 click: repealWorkflow
             });
     
     
     
              if(!IE8()){ //flash不支持节点跳转
                 toolbarArray.push({
                      id: "SkipNode",
                      name: $.i18n('workflow.manager.skipthisnode.label.js'),//节点跳转
                      className: "ico16 sign_16",
                      click: skipNodeFn
                  });
              }
     
              toolbarArray.push({
                  id: "stepBackToTargetNode",
                  name: $.i18n('common.workflow.specialback.label'),//指定回退
                  className: "ico16 tobackflow_16",
                  click: specifiesReturn
              });
              toolbarArray.push({
                  id: "NodeReplacebatch",
                  name: $.i18n('workflow.manager.nodeReplaceItem.label.js'),//节点批量替换
                  className: "ico16 replace_16",
                  click: nodeReplaceBatchFn
              });
     
     
             toolbarArray.push({
                 id: "processRevive",
                 name: $.i18n('supervise.process.revive'),//流程复活
                 className: "ico16 recommend_16",
                 click: reliveProcess
             });
         }
     
         toolbarArray.push({
             id: "urge",
             name: $.i18n('common.portal.section.affair.remind.label'),//催办
             className: "ico16 notify_16",
             // click: notifyFn
             //客开 催办 start
             click: kkcb
             //客开 end
         });
         toolbarArray.push({
             id: "exportExcel",
             name: $.i18n('common.export.label'),//导出
             className: "ico16 export_excel_16",
             click: exportExcel
         });
         //打印
         toolbarArray.push({
             id: "print",
             name: $.i18n('common.toolbar.print.label'),
             className: "ico16 print_16",
             click: function() {
                 var html = $('#mydata').clone(true);
                 $("span", html).removeAttr("onclick");
                 popprint(html.html());
             }
         });
         //如果选中的是已办结可以加载出删除
         toolbarArray.push({
             id : "deleteSupervise",
             name : $.i18n('common.toolbar.delete.label') ,//删除
             className : "ico16 del_16",
             click : deleteSupervise
         });
     
         toolbar = $("#toolbar").toolbar({
             toolbar: toolbarArray
         });
         toolbar.hideBtn("deleteSupervise");
         if(isAdmin || managerType == "formAdmin"){
             setTimeout(function(){
                 toolbar.hideBtn("processRevive");
             },10);
         }
     
         if (!isAdmin) {
             setTimeout(function(){
                 //查询条件
                 var condition = new Array();
                 condition.push({
                     id: 'title',
                     name: 'title',
                     type: 'input',
                     text: $.i18n("common.subject.label"), //标题
                     value: 'subject',
                     maxLength: 100
                 });
                 if(managerType == "mySupervise"){
                     condition.push({id: 'importent',name: 'importent',type: 'select',text: $.i18n("common.importance.label"),value: 'importantLevel',
                         items: [{
                             text: $.i18n("common.importance.putong"),//普通
                             value: '1'
                         }, {
                             text: $.i18n("common.importance.zhongyao"),//重要
                             value: '2'
                         }, {
                             text: $.i18n("common.importance.feichangzhongyao"),//非常重要
                             value: '3'
                         }]
                     });
                     //发起人
                     condition.push({id: 'startMemberName',name: 'startMemberName',type: 'input',text: $.i18n("common.sender.label"),value: 'startMemberName'});
                     //发起时间
                     condition.push({id: 'datetime',name: 'datetime',type: 'datemulti',text: $.i18n("common.date.sendtime.label"),value: 'createDate',ifFormat:'%Y-%m-%d',dateTime: false});
                     condition.push({id:'deadlineDatetimeSearch',name:'deadlineDatetime',type:'datemulti',text:$.i18n("common.date.deadlineName.label"),value:'deadlineDatetime',ifFormat:'%Y-%m-%d',dateTime:false});
                 } else if(managerType == "deptAdmin"){
                     //事项所属人
                     condition.push({id: 'belongMember',name: 'belongMember',type: 'input',text: $.i18n("supervise.affair.belong.member"),value: 'belongMember'});
                 } else if(managerType == "formAdmin"){
                     //发起人
                     condition.push({id: 'startMemberName',name: 'startMemberName',type: 'input',text: $.i18n("common.sender.label"),value: 'startMemberName'});
                     //发起时间
                     condition.push({id: 'datetime',name: 'datetime',type: 'datemulti',text: $.i18n("common.date.sendtime.label"),value: 'createDate',ifFormat:'%Y-%m-%d',dateTime: false});
                 }
                 //相对渲染,避免计算高度不对
                 searchobj = $("#simpleQuery").searchCondition({
                     searchHandler: function() { //chenxd
                         lastQueryType = 'simple';
                         search('simple');
                     },
                     conditions: condition
                 });
             },10)
     
         }
     }
     
     
     /**
      * 跳过节点
      * @returns
      */
     function skipNodeFn(){
     
         if(!checkSizeForToolBar()){
               return;
         }
     
         var selectRow = grid.grid.getSelectRows()[0];
     
           if(selectRow.bodyType == "20"){
               selectRow.spk = "collaboration_template_form";
               selectRow.nps = "form";
           }
           selectRow.isSkipNode = "true";
           selectRow.callBackFn = reloadGridData;
           editFlowChartFn(selectRow);
     
           // 还原，影响到了其他场景
           selectRow.isSkipNode = "false";
     }
     
     /**
      * 我督办的，我部门的，我管理的模板列表数据（由于列表查询数据不同、表头不同、查询条件也不同，切换页签变更不同grid）
      */
     function loadGrid(dataType) {
         //先将高度还原
         $("#processShowTypeBody").height(0);
         $("#processShowTypeBody").parent().css("backgroundColor","#F1F2F4");
     
         var _colModelFirst = [{
             name: 'id',
             display: 'id',
             width: '3%',
             type: 'checkbox',
             align: 'center'
         }, {
             display: $.i18n('common.subject.label'), //标题
             name: 'subject',
             width: '25%'
         }, {
             display: $.i18n('common.sender.label'), //发起人
             name: 'initiator',
             width: '10%'
         }, {
             display: $.i18n('common.date.sendtime.label'), //发起时间
             name: 'sendTime',
             width: '10%'
         }, {
             display: $.i18n("collaboration.list.currentNodesInfo.label"), //当前处理人
             name: 'currentNodesInfo',
             sortable: true,
             width: '12%'
         }];
         var _colModelLast = [{
             display: $.i18n('common.date.deadlineName.label'), //流程期限
             name: 'deadlineDatetimeName',
             width: '10%'
         }, {
             display: $.i18n('common.workflow.log.label'), //流程日志
             name: 'processLog',
             width: '8%'
         }];
         if (grid) {
             grid.grid.destroyGrid();
             grid.grid = null;
         }
         var showTotal = isShowTotal=="0" ? true : false;
     
         var managerName = "";
         var managerMethod = "";
         var colModel;
         if (dataType == "all" && (managerType == "admin" || managerType == "formAdmin")) {
             //我管理的模板全部（前后端管理员数据，一条流程一条数据，查询数据主表为colSummary,edocSummary）
             _colModelFirst.splice(1, 1, {
                 display:$.i18n('common.subject.label'), //标题
                 name: 'subject',
                 width: '30%'
             });
             _colModelFirst.splice(3, 1, {
                 display:$.i18n('common.date.sendtime.label'), //发起时间
                 name: 'sendTime',
                 width: '15%'
             });
             managerName = "workflowManageManager";
             managerMethod = "testPaging";
             colModel = _colModelFirst.concat(_colModelLast);
         } else if (managerType == "mySupervise" && (dataType == "all" || dataType == "pending" || dataType == "done")) {
             //协同督办全部（一条流程一条数据，查询数据主表为colSummary,ctpSuperivseDetail,ctpSupervisor）
             var mySupervise_colModel = new Array();
             var mySupervise_frist = [{
                 display: 'id',
                 name: 'id',
                 width: '3%',
                 sortable: false,
                 type: 'checkbox',
                 align: 'center'
             }, {
                 display: $.i18n('common.subject.label'),
                 name: 'title',
                 width: '25%',
                 sortable: true
             }, {
                 display: $.i18n('common.sender.label'),
                 name: 'senderName',
                 width: '10%',
                 sortable: true
             }, {
                 display: $.i18n('common.date.sendtime.label'), //发起时间
                 name: 'sendDate',
                 width: '10%',
                 cutsize: 10,
                 sortable: true
             }, {
                 display: $.i18n("collaboration.list.currentNodesInfo.label"), //当前处理人
                 name: 'currentNodesInfo',
                 width: '12%',
                 sortable: true
             }, {
                 display: $.i18n('common.date.deadlineName.label'), //流程期限
                 name: 'deadlineName',
                 width: '10%',
                 sortable: true
             }, {
                 display: $.i18n('common.workflow.log.label'), //流程日志
                 name: 'processLog',
                 width: '8%'
             }];
     
             if (hasProcessShowType) {
                 mySupervise_colModel =  _colModelFirst.concat(_colModelLast);
             } else {
                 mySupervise_colModel = mySupervise_frist;
             }
             mySupervise_colModel.push({
                 display: $.i18n('supervise.col.remark'), //督办摘要
                 name: '_summarybutton',
                 width: '6%'
             });
             mySupervise_colModel.push({
                 display: $.i18n('supervise.col.deadline'), //督办期限
                 name: 'awakeDate',
                 width: '10%',
                 sortable: true
             });
     
             if (hasProcessShowType) {
                 managerName = "workflowManageManager";
                 managerMethod = "getSuperviseListForOverDue";
     
             } else {
                 managerName = "superviseManager";
                 managerMethod = "getAllSuperviseList4Col";
             }
             colModel = mySupervise_colModel;
         } else {
             //其它查询（我部门的下三个页签和其它已超期、七天超期页签数据，一条事项一条数据。主要查询ctpAffair）
             if(managerType == "deptAdmin"){
                 _colModelFirst
                 _colModelFirst.splice(1, 0, {
                     display:$.i18n('supervise.affair.belong.member'), //事项所属人
                     name: 'memberName',
                     sortable: true,
                     width: '9%'
                 });
             } else {
                 _colModelFirst.push({
                     display:$.i18n('supervise.affair.belong.member'), //事项所属人
                     name: 'memberName',
                     sortable: true,
                     width: '9%'
     
                 });
             }
             _colModelFirst.push({
                 display:$.i18n('pending.deadlineDate.label'), //处理期限（节点期限）
                 name: 'processDeadlineDatetimeName',
                 sortable: true,
                 width: '10%'
     
             });
             if (managerType == "mySupervise") {
                 _colModelFirst.push({
                     display: $.i18n('supervise.col.remark'), //督办摘要
                     name: '_summarybutton',
                     width: '6%'
                 });
                 _colModelFirst.push({
                     display: $.i18n('supervise.col.deadline'), //督办期限
                     name: 'awakeDate',
                     width: '10%',
                     sortable: true
                 });
             }
     
             managerName = "workflowManageManager";
             managerMethod = "getSuperviseListForOverDue";
             colModel = _colModelFirst.concat(_colModelLast);
     
         }
         //泳道只能通过affair查询
     
         grid = $("#mytable").ajaxgrid({
             render: rendForAll,
             click: titleClick,
             resizable:false,
             customize:false,
             noTotal:showTotal,
             colModel: colModel,
             height: _getGridHeight(),
             callBackTotle:function(data){
                 callBackTotle(data);
             },
             managerName: managerName,
             managerMethod: managerMethod
         });
     
         if (!isAdmin) {
             var o = new Object();
     
             if ((managerType == "admin" || managerType == "formAdmin")) {
                 o.condition = $("#condition").val() ? $("#condition").val() : "2";
             }
             o.managerType = managerType;
             if (managerType != "mySupervise") {
                 o.operationType = "template";
             }
             o.dataType = $("#dataType").val();
             o.flowstate = "0";
             o.sourceType = sourceType;
     
             o = initSearchByBoard(o, dataType);
     
             if (srcFrom == "bizconfig" && templeteIds != null) {
                 o.operationType = "template";
                 o.operationTypeIds = templeteIds;
             }
     
             reloadObj = o;
             $("#mytable").ajaxgridLoad(o);
         }
     }
     
     function initSearchByBoard(serchObj, dataType) {
         //业务类型
         if (sourceType == "1") {
             serchObj.operationType = "self";
         }
         //办理未办理
         if (dataType == "pending") {
             serchObj.status = "0";
         } else if (dataType == "done") {
             serchObj.status = "1";
             $('input[name="status"][value="1"]').attr('checked','true');
     
         }
         //我部门下的
         if (managerType == "deptAdmin" && senders != "undefined" && senders != "") {
             serchObj.currentNodesInfo = senders;
             $("#currentNodesInfoStr").val(senders);
             $("#currentNodesInfo").val(memberName);
         }
     
         //节点\泳道
         if ("" != templateIds) {
             serchObj.operationType = "template";
             serchObj.operationTypeIds = templateIds;
             if (managerType == "mySupervise") {
                 $('input[name="operationType"][value="template"]').attr('checked','true');
                 $("#operationTypeIds").val(templateIds);
                 $("#templateName").val(templateName);
                 $("#templateName").show();
             } else {
                 $("#processOperationTypeIds").val(templateIds);
                 $("#processTemplateName").val(templateName);
             }
         }
     
         return serchObj;
     }
     
     function chooseNode(nodeId, templateId) {
     
         var newReloadObj = reloadObj;
         if(templateId){
             newReloadObj = $.extend({}, reloadObj, {"operationTypeIds" : templateId});
         }
     
         if (showType =="1") {
             //按节点
             reloadObj.activityId = nodeId;
             newReloadObj.activityId = nodeId;
     
         } else if (showType == "2"){
             //按泳道
             reloadObj.swimlaneId = nodeId;
             newReloadObj.swimlaneId = nodeId;
         }
     
         $("#mytable").ajaxgridLoad(newReloadObj);
     }
     
     function rendForAll(txt, data, r, c, col) {
         if (col.name == 'title' || col.name == 'subject') {
             if (data.importantLevel && data.importantLevel != "" && data.importantLevel != 1 && data.importantLevel != -1) {
                 if(data.appEnum == 4){
                     if (data.importantLevel === 2) {
                         txt = "<input class='important-level important-level-2' style='float: left;color: white;' readonly='readonly' value='" + $.i18n('govdoc.quick.normal') + "'/>" + txt;
                     } else if (data.importantLevel === 3) {
                         txt = "<input class='important-level important-level-3' style='float: left;color: white;' readonly='readonly' value='" + $.i18n('govdoc.quick.expedited') + "'/>" + txt;
                     } else if (data.importantLevel === 4) {
                         txt = "<input class='important-level important-level-4' style='float: left;color: white;' readonly='readonly' value='" + $.i18n('govdoc.quick.express') + "'/>" + txt;
                     } else if (data.importantLevel === 5) {
                         txt = "<input class='important-level important-level-5' style='float: left;color: white;' readonly='readonly' value='" + $.i18n('govdoc.quick.teti') + "'/>" + txt;
                     }
                 }else{
                     txt = "<span class='ico16 important" + data.importantLevel + "_16 '></span>" + txt;
                 }
     
     
             }
             //填充完成、终止等状态图标
             if (data.state != null && data.state != "" && data.state != "0") {
                 txt = "<span style='float: left;' class='ico16  flow" + data.state + "_16 '></span>" + txt;
             }
             if(data.hasAttachment){
                 txt = "<span class='title_cell text_overflow'>"+txt+"</span>" + "<span class='ico16 affix_16'></span>";
             }
             if(data.formAppId && data.formAppId !== "0" && data.appEnum != '4'){ // data.formAppId !== "0" 是为了兼容老数据，以前保存待发会把appId设置成0，已做修改
                 txt = "<span class='title_cell text_overflow'>"+txt+"</span>" + "<span class='form_text_16'></span>";
             }
             //填充协同正文类型
             if (data.bodyType && data.bodyType != "10" && data.bodyType != "90") // 10 HTML正文，90 第三方正文
             {
                 txt = txt + "<span class='ico16 office" + data.bodyType + "_16'></span>";
             }
         }
         if (col.name == 'currentNodesInfo') {
             if(data.quickSend && data.quickSend == true)
             {
                 return txt;
             }
             else
             {
                 return "<a href='javascript:void(0)' onclick='showFlowChart(\"" + data.appName + "\",\"" + data.caseId + "\",\"" + data.processId + "\",\"" + data.templeteId + "\",\"" + data.activityId + "\",\"" + data.appEnumStr + "\",\"" + data.spk + "\",\"" + data.nps + "\", \"" + data.bodyType + "\", \"" + data.summaryId + "\")'>" + txt + "</a>";
             }
         }
         if (col.name == 'processLog') {
             return "<span class='ico16 view_log_16' onclick='showDetailLogDialog(\"" + data.summaryId + "\",\"" + data.processId + "\",2)' title=''></span> ";
         }
         if (col.name == '_summarybutton') {
             return "<a href='javascript:void(0)' class='noClick' onclick='superviseContent(\"" +
                 data.summaryId +
                 "\"," +
                 data.status +
                 ",\"" +
                 (data.superviseDetailId ? data.superviseDetailId : data.id) +
                 "\")'>" + $.i18n('supervise.superviseDetailList.content') + "</a>"; //[内容]
         }
         if (col.name == 'deadlineDatetimeName' || col.name == 'deadlineName' || col.name == 'processDeadlineDatetimeName') {
             if (isRedDate(txt)) {
                 txt = "<span class='color_red'>" + txt + "</span>"
             }
         }
     
         if (col.name == 'awakeDate') {
             var awakeId = data.id;
             if (data.superviseDetailId) {
                 awakeId = data.superviseDetailId;
             }
             if (isRedDate(txt)) {
                 return "<a id='ssss" + awakeId +
                     "' class='noClick' href='javascript:void(0)' onclick='changeAwake(event,\"" +
                     awakeId +
                     "\")'><span class='noClick color_red'>" + txt +
                     "</span></a>";
             } else {
                 return "<a id='ssss" + awakeId +
                     "' class='noClick' href='javascript:void(0)' onclick='changeAwake(event,\"" +
                     awakeId + "\")'>" + txt + "</a>";
             }
         }
     
         return txt;
     }
     
     function initEventFun() {
         $("#templateName").click(function() {
            
             var params = {};
             params.state = "0,1";
             params.hasAuth = "false";
             params.isAll = "true";
             if (managerType == "mySupervise") {
                 return;
                 templateChoose(templateChooseCallback, "1,2", true, "", "MaxScope", "", null, null, null, templateIds,50,null,null,null,null, params);
             } else {
                 templateChoose(templateChooseCallback, null, true, "", "MaxScope", "", null, null, null, templateIds,50,null,null,null,null, params);
             }
         });
         if(managerType == "mySupervise"){
             $("#doneStateDiv input[name='status']").on("click",function () {
                 if($(this).val() == "0"){
                     //未办结 显示编辑流程，批量修改流程按钮，隐藏删除按钮
                     toolbar.showBtn("editWorkFlow");
                     toolbar.showBtn("batchEditWorkFlow");
                     toolbar.hideBtn("deleteSupervise");
                     toolbar.showBtn("batchIconBtn");
                 }else{
                     //已办结 隐藏编辑流程，批量修改流程按钮，显示删除按钮
                     toolbar.hideBtn("editWorkFlow");
                     toolbar.hideBtn("batchEditWorkFlow");
                     toolbar.showBtn("deleteSupervise");
                     toolbar.hideBtn("batchIconBtn");
                 }
     
             });
         }
         if((isAdmin || managerType == "formAdmin") && _dataType == "all"){
             // //默认流程复活不可用
             $("#flowstateDiv input[name='flowstate']").on("click",function () {
     
                 if($(this).val() == "0"){ //运行中
                     toolbar.hideBtn("processRevive");
                     toolbar.showBtn("SkipNode");
                     toolbar.showBtn("stepBackToTargetNode");
                     toolbar.showBtn("NodeReplacebatch");
     
                     toolbar.showBtn("batchEditWorkFlow");
                     toolbar.showBtn("batchIconBtn");
                 }else{
                     toolbar.showBtn("processRevive");
     
                     toolbar.hideBtn("SkipNode");
                     toolbar.hideBtn("stepBackToTargetNode");
                     toolbar.hideBtn("NodeReplacebatch");
     
                     toolbar.hideBtn("batchEditWorkFlow");
                     toolbar.hideBtn("batchIconBtn");
     
                 }
     
             });
     
         }
     
     
     
         $("#queryBtn").click(function() {
             lastQueryType = 'more';
             search('more');
         });
         resetBtnClickFunc();
         // $("#resetBtn").click(function() {
         //     $("#queryBody").find("input[type='text']").val("");
         //     $("#queryBody").find("input[type='hidden']").val("");
         //     $("#queryBody").find("input:radio[value='0']").attr('checked','true');
         //     $("#queryBody").find("input:radio[value='self']").attr('checked','true');
         //     if($.ctx.hasPlugin("edoc") && openForm == 'govdoc'){
         //     	$("#condition").val("401");
         //     	 $("#importantLevel").attr("disabled", true);
         //     }else{
         //     	$("#condition").val("1");
         //     }
         //     $("#importantLevel").val("");
         //     $("#templateName").hide();
         //
         //     toolbar.hideBtn("processRevive");
         //
         //     toolbar.showBtn("SkipNode");
         //     toolbar.showBtn("stepBackToTargetNode");
         //     toolbar.showBtn("NodeReplacebatch");
         //
         //     if(typeof(templateOrginalData)!='undefined' && templateOrginalData != null ){
         //         templateOrginalData=new Object();
         //     }
         // });
         $("#selfCreate").click(function() {
             //<点击选择>
             //$("#templateName").attr("disabled", true).val($.i18n('collaboration.common.workflow.clickSelect'));
             $("#templateName").hide();
         });
         $("#templateFlow").click(function() {
             //<点击选择>
             //$("#templateName").attr("disabled", false).val($.i18n('collaboration.common.workflow.clickSelect'));
             $("#templateName").show();
         });
         $("#condition").change(function() {
             // 每次选择应用分类的时候，清空已经选择的模板
             rv = null;
             $("#templateName").val("");
             $("#operationTypeIds").val("");
             templateOrginalData = null;
             if ($("#condition").val() == 2) {
                 $("#selfCreate").attr("disabled", true);
                 $("#templateFlow").click();
             } else {
                 $("#selfCreate").attr("disabled", false);
                 $("#selfCreate").click();
             }
     
             if($("#condition").val() !=1 && $("#condition").val() !=2){
                 $("#importantLevel").val("");
                 $("#importantLevel").attr("disabled", true);
             } else {
                 $("#importantLevel").attr("disabled", false);
             }
         });
     
         $("#senders").click(function() {
             var tempValue = $("#sendersStr").val();
             var tempText = $("#senders").val();
             $.selectPeople({
                 type: 'selectPeople',
                 panels: 'Department,Team,Post,Outworker,RelatePeople,OrgMetadataTag',
                 selectType: 'Account,Department,Member,Team,Post,OrgMetadataTag',
                 minSize: 0,
                 text: $.i18n('common.default.selectPeople.value'),
                 returnValueNeedType: true,
                 showFlowTypeRadio: false,
                 onlyLoginAccount: (isAdministrator == "true"),
                 showConcurrentMember: true, //是否显示兼职人员(只外单位)
                 params: {
                     text: tempText,
                     value: tempValue
                 },
                 targetWindow: getCtpTop(),
                 callback: function(res) {
                     if (res && res.text) {
                         $("#sendersStr").val(res.value);
                         $("#senders").val(res.text);
                     } else {
                         $("#sendersStr").val("");
                         $("#senders").val($.i18n('collaboration.common.workflow.clickSelect'));
                     }
                 }
             });
         });
         //start  
         $("#operator").click(function() {
             var tempValue = $("#operatorStr").val();
             var tempText = $("#operator").val();
             $.selectPeople({
                 type: 'selectPeople',
                 panels: 'Department,Team,Post,Outworker,RelatePeople,OrgMetadataTag',
                 selectType: 'Account,Department,Member,Team,Post,OrgMetadataTag',
                 minSize: 0,
                 text: $.i18n('common.default.selectPeople.value'),
                 returnValueNeedType: true,
                 showFlowTypeRadio: false,
                 onlyLoginAccount: (isAdministrator == "true"),
                 showConcurrentMember: true, //是否显示兼职人员(只外单位)
                 params: {
                     text: tempText,
                     value: tempValue
                 },
                 targetWindow: getCtpTop(),
                 callback: function(res) {
                     if (res && res.text) {
                         $("#operatorStr").val(res.value);
                         $("#operator").val(res.text);
                     } else {
                         $("#operatorStr").val("");
                         $("#operator").val($.i18n('collaboration.common.workflow.clickSelect'));
                     }
                 }
             });
         });
         $("#sendDepartment").click(function() {
             var tempValue = $("#sendDepartmentStr").val();
             var tempText = $("#sendDepartment").val();
             $.selectPeople({
                 panels: "Department,BusinessDepartment",
                 selectType: "Department,BusinessDepartment",
                 maxSize: "1",
                 minSize: 0,
                 isAllowContainsChildDept: true,
                 isNeedCheckLevelScope: true,
                 showAllOuterDepartment: false,
                 compCode: "",
                 params: {
                     text: tempText,
                     value: tempValue
                 },
                 targetWindow: getCtpTop(),
                 callback: function(res) {
                     if (res && res.text) {
                         $("#sendDepartmentStr").val(res.value);
                         $("#sendDepartment").val(res.text);
                     } else {
                         $("#sendDepartmentStr").val("");
                         $("#sendDepartment").val($.i18n('collaboration.common.workflow.clickSelect'));
                     }
                 }
             });
         });
         //end
         $("#selectAvailablePeople").click(function() {
             var tempValue = $("#currentNodesInfoStr").val();
             var tempText = $("#currentNodesInfo").val();
             if( $("#isAvailablePeople").val()=="true"){
                 tempValue = "";
                 tempText = "";
             }
             $.selectPeople({
                 type: 'selectPeople',
                 panels: 'Department,Team,Post,Outworker,RelatePeople',
                 selectType: 'Member', //,Team,Post,Level,Role,Email,Mobile
                 minSize: 0,
                 text: $.i18n('common.default.selectPeople.value'),
                 returnValueNeedType: true,
                 showFlowTypeRadio: false,
                 onlyLoginAccount: !isGroupAdmin,
                 showConcurrentMember: true ,//是否显示兼职人员(只外单位)
                 params: {
                     text: tempText,
                     value: tempValue
                 },
                 targetWindow: getCtpTop(),
                 callback: function(res) {
                     if (res && res.text) {
                         $("#currentNodesInfoStr").val(res.value);
                         $("#currentNodesInfo").val(res.text);
                     } else {
                         $("#currentNodesInfoStr").val("");
                         $("#currentNodesInfo").val("");
                     }
                 }
             });
         });
         $("#selectUnavailablePeople").click(function() {
             var tempValue = $("#currentNodesInfoStr").val();
             var tempText = $("#currentNodesInfo").val();
             var param = new Object();
             param["callBack"] = function(result){
                 var id = new Array();
                 var name = new Array();
                 for(var i=0, len=result.length; i<len; i++){
                     id.push(result[i]["type"]+"|"+result[i]["id"]);
                     name.push(result[i]["name"]);
                 }
                 $("#currentNodesInfoStr").val(id.join(","));
                 $("#currentNodesInfo").val(name.join(","));
                 $("#isAvailablePeople").val("true");
             };
             param["column"] = [{
                     display: 'id',
                     name: 'id',
                     width: '10%',
                     sortable: false,
                     align: 'left',
                     type: 'checkbox',
                     isToggleHideShow:true
                 },{
                     display: $.i18n("collaboration.appointStepBack.memberName.js"), //人员名称
                     name: 'name',
                     width: '20%',
                     sortable: true,
                     align: 'left',
                     isToggleHideShow:false
                 },{
                     display: $.i18n("common.workflow.dep"), //所属部门
                     name: 'departName',
                     width: '20%',
                     sortable: true,
                     align: 'left',
                     isToggleHideShow:false
                 },{
                     display: $.i18n("common.subordinate.account.label"),//所属单位
                     name: 'accountShortName',
                     width: '20%',
                     sortable: true,
                     align: 'left'
                 },{
                     display: $.i18n("common.coll.state.label"), //状态
                     name: 'status',
                     width: '15%',
                     sortable: true,
                     align: 'left',
                     isToggleHideShow:false
                 }];
             param["title"] = $.i18n("workflow.manager.selectUnavailablePeople.js");
             param["maxSize"] = 20;
             param["orgType"] = "V3xOrgMember";
             param["searchLabel"] = $.i18n("workflow.manager.selectUnavailablePeople.search.js");
             selectUnavailableNodeFunction(param);
         });
     }
     
     function processTemplateChoose() {
         if (managerType == "formAdmin") {
             templateChoose(processTemplateChooseCallback, "2", true, "", "Cap3AndCap4", "", null, null, null, templateIds, 50);
         } else {
             var params = {};
             params.state = "0,1";
             params.hasAuth = "false";
             params.isAll = "true";
             templateChoose(processTemplateChooseCallback, "1,2", true, "", "MaxScope", "", null, null, null, templateIds,50,null,null,null,null, params);
         }
     }
     
     function search(flag) {
         var o = searchConditions(flag);
     
         if (srcFrom == "bizconfig" && templeteIds != null) {
             o.operationType = "template";
             o.operationTypeIds = templeteIds;
         }
         reloadObj = o;
         isSearch = true;
         o.page = 1;
         $("#mytable").ajaxgridLoad(o);
         //如果本次查询
         var concludeFlag =  document.getElementById("statusRadio2").checked;
         if(concludeFlag){
             toolbar.showBtn("deleteSupervise");
             //V5-29517 张瑞敏：toolbar中的按钮不变
             //toolbar.hideBtn("urge");
         }else{
             toolbar.hideBtn("deleteSupervise");
             toolbar.showBtn("urge");
         }
     
     }
     
     function searchConditions(flag){
         if (!validate()) {
             $.alert($.i18n('collaboration.rule.date')); //开始时间不能大于结束时间
             return;
         }
         var o = new Object();
         if (flag == "simple") {
             o = initSearchByBoard(o, _dataType);
             //depAdmin没有应用类型，只查询协同模板和表单模板
             if (managerType == "formAdmin"||managerType == "admin") {
                 o.condition = $("#condition").val() ? $("#condition").val() : "2";
             }
             o.managerType = managerType;
             if (managerType != "mySupervise") {
                 o.operationType = "template";
             }
             o.dataType = $("#dataType").val();
             var choose = $('#'+searchobj.p.id).find("option:selected").val();
             $("#subject").val('');
             if(choose == 'subject'){
                 o.subject = $('#title').val();
                 $("#subject").val($('#title').val());
             } else if(choose == 'importantLevel'){
                 o.importantLevel = $("#importent").val();
             } else if(choose == 'startMemberName'){
                 o.startMemberName = $("#startMemberName").val();
             } else if(choose == 'createDate'){
                 var fromDate = $('#from_datetime').val();
                 var toDate = $('#to_datetime').val();
                 if(fromDate != "" && toDate != "" && fromDate > toDate){
                     //$.alert($.i18n('collaboration.rule.date'));//开始时间不能早于结束时间 (搜索组件已经提示了)
                     return;
                 }
                 o.beginDate = fromDate;
                 o.endDate = toDate;
             } else if(choose == 'deadlineDatetime'){
                 var fromDate = $('#from_deadlineDatetimeSearch').val();
                 var toDate = $('#to_deadlineDatetimeSearch').val();
                 if(fromDate != "" && toDate != "" && fromDate > toDate){
                     //$.alert($.i18n('collaboration.rule.date'));//开始时间不能早于结束时间 (搜索组件已经提示了)
                     return;
                 }
                 o.deadlineBeginDate = fromDate;
                 o.deadlineEndDate = toDate;
             } else if(choose == 'belongMember'){
                 o.belongMember = $("#belongMember").val();
             }
             o.flowstate = "0";
         } else if (flag == "more") {
             //depAdmin没有应用类型，只查询协同模板和表单模板
             if (managerType == "formAdmin"||managerType == "admin") {
                 o.condition = $("#condition").val() ? $("#condition").val() : "2";
             }
             //o.condition = $("#condition").val() ? $("#condition").val() : "2";
             o.importantLevel = $("#importantLevel").val();
             o.subject = $("#subject").val();
             o.senders = $("#sendersStr").val();
             o.currentNodesInfo = $("#currentNodesInfoStr").val();
             o.flowstate = $("input[name='flowstate']:checked").val();
             o.beginDate = $("#beginDate").val();
             o.endDate = $("#endDate").val();
             o.deadlineBeginDate = $("#deadlineBeginDate").val();
             o.deadlineEndDate = $("#deadlineEndDate").val();
             o.dataType = $("#dataType").val();
             o.status = $("input[name='status']:checked").val();
             if (srcFrom == "bizconfig" && templeteIds != null) {
                 o.operationType = "template";
                 o.operationTypeIds = templeteIds;
             } else if (isAdmin || managerType == "mySupervise") {
                 o.operationType = getOperationTypeValue();
                 if ($("#templateName").val() != $.i18n('collaboration.common.workflow.clickSelect')) {
                     o.operationTypeIds = $("#operationTypeIds").val();
                 }
             } else {
                 o.operationType = "template";
                 o.operationTypeIds = $("#processOperationTypeIds").val();
             }
             o.managerType = managerType;
         }
         if (_dataType == "done") {
             o.status = "1";
         } else if (_dataType == "pending") {
             o.status = "0";
         }
         return o;
     }
     
     function getOperationTypeValue() {
         if ($("#selfCreate").attr("checked") == "checked") {
             return $("#selfCreate").val();
         }
         if ($("#templateFlow").attr("checked") == "checked") {
             return $("#templateFlow").val();
         }
         //since8.1SP1 模板页面未显示全集团的模板 功能存在问腿
         var selectVal = $("#condition").val();
         if (selectVal == 1) {
             if (isGroupAdmin && isGroupAdmin == 'true') {
                 //集团管理只能查询全部数据
                 return ""
             }
             return "self"
         }
         if (selectVal == 2) {
             return "template"
         }
     }
     
     function validate() {
         try {
             var beginDate = $("#beginDate").val();
             var endDate = $("#endDate").val();
             if (beginDate === "" || endDate === "") {
     
             } else {
                 //OA-68717
                 var strDate = beginDate.replace(/-/g, "/");
                 var begin = new Date(strDate);
                 strDate = endDate.replace(/-/g, "/");
                 var end = new Date(strDate);
                 if (begin > end) {
                     return false;
                 }
             }
             var deadlineBeginDate = $("#deadlineBeginDate").val();
             var deadlineEndDate = $("#deadlineEndDate").val();
             if (deadlineBeginDate === "" || deadlineEndDate === "") {
     
             } else {
                 //OA-68717
                 var deadlinestrDate = deadlineBeginDate.replace(/-/g, "/");
                 var deadlinebegin = new Date(deadlinestrDate);
                 deadlinestrDate = deadlineEndDate.replace(/-/g, "/");
                 var deadlineend = new Date(deadlinestrDate);
                 if (deadlinebegin > deadlineend) {
                     return false;
                 }
             }
         } catch (e) {}
         return true;
     }
     
     function reset() {
         window.location.reload();
     }
     
     function reloadGridData(){
         $("#mytable").ajaxgridLoad(reloadObj);
     }
     
     function getDataIds(data){
         var processIdAndCaseIdAndFormAppIdAndMasterId="";
         for(var i = 0; i< data.length; i++){
             if(processIdAndCaseIdAndFormAppIdAndMasterId==""){
                 processIdAndCaseIdAndFormAppIdAndMasterId = data[i].processId+"_"+data[i].caseId+"_"+data[i].formAppId+"_"+data[i].formRecordId;
             }else{
                 processIdAndCaseIdAndFormAppIdAndMasterId += "," + data[i].processId+"_"+data[i].caseId+"_"+data[i].formAppId+"_"+data[i].formRecordId;
             }
         }
         return processIdAndCaseIdAndFormAppIdAndMasterId;
     }
     
     //显示流程图
     function showFlowChart(appName,_contextCaseId, _contextProcessId, _templateId, _contextActivityId, _appName, SPK, NPS, bodyType,summaryId) {
         if (!SPK || SPK == "undefined") {
             SPK = "freeFlow";
         }
         if (!NPS || NPS == "undefined") {
             NPS = "default";
         }
         if(typeof(appName)=='undefined'){
             var selectRow = grid.grid.getSelectRows()[0];
             appName=selectRow.appEnumStr;
         }
         var isTemplate = _templateId&&_templateId!="null";
         var options = {
             targetWin: getCtpTop(),
             caseId: _contextCaseId,
             processId: _contextProcessId,
             isTemplate: isTemplate,
             showHastenButton: false,
             appName: appName,
             currentNodeId: _contextActivityId,
             scene: 3,
             SPK: SPK,
             NPS: NPS,
             canExePrediction : (bodyType === "20" || NPS === "form") && $.ctx.hasPlugin("workflowAdvanced")
         }
         showDiagram(options);
     
         if(typeof(summaryId)!='undefined'){
             //更新待办人
             callBackendMethod("colPubManager","updateCurrentNodesInfoAjax",summaryId);
         }
     }
     
     
     // 打印
     function popprint(content) {
         var printContentBody = "";
         var cssList = new ArrayList();
         var pl = new ArrayList();
         var contentBody = content;
         var contentBodyFrag = "";
         //cssList.add(_ctxPath +"/skin/default/skin.css");
         contentBodyFrag = new PrintFragment(printContentBody, contentBody);
         pl.add(contentBodyFrag);
         printList(pl, cssList);
     }
     
     function templateChooseCallback(ids, names) {
         $("#templateName").val(names);
         $("#operationTypeIds").val(ids);
     }
     
     function processTemplateChooseCallback(ids, names) {
         $("#processTemplateName").val(names);
         $("#processOperationTypeIds").val(ids);
     }
     //导出
     var exportObj = null;
     function exportExcel() {
         //显示遮罩
         var exportExcelProce = null;
         if($("#mytable")[0].p.total < 10000){
             //显示遮罩
             exportExcelProce = $.progressBar();
         }
         var o = new Object();
         if(isAdmin){
             o.condition = $("#condition").val() ? $("#condition").val() : "2";
             o.importantLevel = $("#importantLevel").val();
             o.subject = $("#subject").val();
             o.senders = $("#sendersStr").val();
             o.currentNodesInfo = $("#currentNodesInfoStr").val();
             o.flowstate = $("input[name='flowstate']:checked").val();
             o.beginDate = $("#beginDate").val();
             o.endDate = $("#endDate").val();
             o.deadlineBeginDate = $("#deadlineBeginDate").val();
             o.deadlineEndDate = $("#deadlineEndDate").val();
             o.dataType = $("#dataType").val();
             o.status = $("input[name='status']:checked").val();
             if (srcFrom == "bizconfig" && templeteIds != null) {
                 o.operationType = "template";
                 o.operationTypeIds = templeteIds;
             } else if (isAdmin || managerType == "mySupervise") {
                 o.operationType = getOperationTypeValue();
                 if ($("#templateName").val() != $.i18n('collaboration.common.workflow.clickSelect')) {
                     o.operationTypeIds = $("#operationTypeIds").val();
                 }
             } else {
                 o.operationType = "template";
                 o.operationTypeIds = $("#processOperationTypeIds").val();
             }
             o.managerType = managerType;
         } else {
             o = reloadObj;
         }
         var url = _ctxPath + "/workflowmanage/workflowmanage.do?method=workflowDataToExcel";
         $.batchExport($("#mytable")[0].p.total, function(page, size) {
             o["page"] = page;
             o["size"] = size;
             o["fileName"] = "workflowData_" + page; //文件名
             getCtpTop().onbeforeunload = null;
     
             if(exportExcelProce != null){
                 exportExcelProce.close();
             }
             $("#editFlowForm").jsonSubmit({
                 "action": url,
                 "paramObj": o,
                 callback: function() {
                     //getCtpTop().bindOnbeforeunload();
                 }
             });
         });
     }
     
     /**
      * 明细日志 弹出对话框
      * showFlag  初始化时 显示的内容 1:显示处理明细 2:显示流程日志 3:显示催办(督办)日志
      */
     function showDetailLogDialog(summaryId, processId, showFlag) {
         var dialog = $.dialog({
             //url : _ctxPath+'/collaboration/collaboration.do?method=showDetailLog&summaryId='+summaryId+'&processId='+processId+"&showFlag="+showFlag,
             url: _ctxPath + '/detaillog/detaillog.do?method=showDetailLog&summaryId=' + summaryId + '&processId=' + processId + "&showFlag=" + showFlag,
             width: 1040,
             height: 590,
             title: $.i18n('collaboration.sendGrid.findAllLog'), //查看明细日志
             targetWindow: getCtpTop()
         });
     }
     
     //督办摘要
     function superviseContent(summaryId, status, superviseId) {
         var url = _ctxPath +
             "/supervise/supervise.do?method=showDescription&summaryId=" +
             summaryId + "&superviseId=" + superviseId;
         var but = new Array();
         var dialogs = "";
         //当是未办结状态时，才显示确定按钮
         if (status == 0) {
             but.push({
                 text: $.i18n('common.button.ok.label'),
                 handler: function() {
                     var returnValue = dialogs.getReturnValue();
                     if (returnValue != null) {
                         var map = $.parseJSON(returnValue);
                         var content = map.content;
                         var url = _ctxPath +
                             "/supervise/supervise.do?method=updateContent&content=" +
                             content + "&superviseId=" + map.superviseId;
                         $("#grid_detail").jsonSubmit({
                             action: url,
                             callback: function() {
                                 setTimeout(function() {
                                     dialogs.close();
                                     reloadGridData();
                                 }, 10);
                             }
                         });
                     }
                 }
             });
             but.push({
                 text: $.i18n('common.button.cancel.label'),
                 handler: function() {
                     dialogs.close();
                 }
             });
         } else {
             but.push({
                 text: $.i18n('common.button.close.label'),
                 handler: function() {
                     dialogs.close();
                 }
             });
         }
         //督办摘要 弹出dialog
         dialogs = $.dialog({
             url: url,
             width: 500,
             height: 350,
             targetWindow: getCtpTop(),
             title: $.i18n('supervise.col.label'),
             buttons: but
         });
     }
     
     function showQueryViews(openFrom) {
         var min = 40;
         var max = $("#queryBody").height() - 20;
         if ($("#queryBody").css("display") === "none") {
             // 则显示查询区域
             $("#queryBody").show();
             $(".common_search_condition ").hide();
             lastQueryType = "more";
         } else {
             // 则不显示查询区域
             $("#queryBody").hide();
             $(".common_search_condition ").show();
             lastQueryType = "simple"
         }
         _resizeGridHeight();
     }
     
     function isRedDate(dateStr) {
         if (dateStr) {
             var str = dateStr.replace(/-/g, '/').replace(/&nbsp;/ig, " ");
             var date = new Date(str);
             var now = new Date();
             return now > date;
         }
         return false;
     }
     
     //标题点击穿透
     function titleClick(data, rowIndex, colIndex) {
         // 取消上次延时未执行的方法
         //clearTimeout(TimeFn);
         //我部门的页签下标题下标处理
         if(managerType == "deptAdmin"){
             if(colIndex == 2){
                 colIndex = 1;
             } else {
                 colIndex = 2;
             }
         }
         if (colIndex == 1) {
             //开启密级时候只能看流程图
             if (secretLevelEnable&&secretLevelEnable==true){
                 editFlowChart(data);
                 return;
             }
             if (managerType == "mySupervise") {
                 var url = "";
                 var callerResponder = new CallerResponder();
                 var _superviseManager = new superviseManager();
                 var obj = new Object();
                 obj.objId = data.summaryId;
                 obj.openFrom = "supervise";
     
                 var reBack = _superviseManager.checkSuperviseIsCancel(obj);
                 if (reBack) {
                     $.alert(reBack);
                     return;
                 }
                 var detailPageUrl = data.detailPageUrl;
                 if (!detailPageUrl) {
                     detailPageUrl = "collaboration/collaboration.do?method=summary";
                 }
                 var _affairId = null;
                 if (_dataType == "all") {
                     _affairId = getSenderAffairId(data.summaryId);
                 } else {
                     _affairId = data.id;
                 }
     
                 url = _ctxPath + "/" + detailPageUrl + "&affairId=" + _affairId + "&summaryId=" + data.summaryId +
                     "&openFrom=supervise&type=" + data.status;
                 collaborationApi.showSummayDialogByURL(url);
             } else if (isAdmin) {
                 if(data.quickSend && data.quickSend == true)
                 {
                     return;
                 }
                 showFlowChart(data.appName,data.caseId, data.processId, data.templeteId, data.activityId, data.appEnumStr, data.spk, data.nps, data.bodyType);
             } else {
                 var _superviseManager = new superviseManager();
                 var isInProcess = _superviseManager.isMemberInProcess(data.summaryId);
                 if (isInProcess) {
                     var url = _ctxPath + "/collaboration/collaboration.do?method=summary&summaryId=" + data.summaryId;
                     collaborationApi.showSummayDialogByURL(url);
                 } else {
                     showFlowChart(data.appName,data.caseId, data.processId, data.templeteId, data.activityId, data.appEnumStr, data.spk, data.nps, data.bodyType);
                 }
             }
         }
     }
     
     function getSenderAffairId(summaryId) {
         var _affairId = 0;
         var _superviseManager = new superviseManager();
         var objSum = _superviseManager.getSenderAffair(summaryId);
     
         if (null != objSum && objSum.affairId != null) {
             _affairId = objSum.affairId;
         }
         return _affairId;
     }
     
     var changeAwakeID;
     function changeAwake(e, id) {
         changeAwakeID = id;
         var time = getCurrentTime();
         var maintop = parseInt($(getCtpTop().document).find(".layout_content").css("top"))||0;
         var left = (parseFloat(getCtpTop().document.documentElement.clientWidth) - 295) / 2-130;
         var top = (parseFloat(getCtpTop().document.documentElement.clientHeight - 260)) / 2 - 120- maintop;
         $.calendar({
             displayArea: "ssss" + id,
             position: [left, top],
             returnValue: true,
             ifFormat: "%Y-%m-%d %H:%M",
             daFormat: "%Y-%m-%d %H:%M",
             dateString: time,
             singleClick: true,
             showsTime: true,
             onUpdate: getDateTime,
             autoShow: true,
             isClear: true
         });
     }
     
     function getDateTime(awake) {
         var date1 = getCurrentDate();
         var date1s = date1.split("-");
         var bdate = new Date(date1s[0], date1s[1] - 1, date1s[2]);
         var date2 = awake.substring(0, 10);
         var date2s = date2.split("-");
         var edate = new Date(date2s[0], date2s[1] - 1, date2s[2]);
         var url = _ctxPath +
             "/supervise/supervise.do?method=modifySupervise&superviseId=" +
             changeAwakeID + "&awakeDate=" + awake + "&app=1";
         url = addUrlPath(url);
         if (bdate.getTime() > edate.getTime()) {
             var confirm = $
                 .confirm({
                     'msg': $.i18n('collaboration.common.supervise.thisTimeXYouset'), //您设置的督办日期小于当前日期,是否继续?
                     ok_fn: function() {
                         $("#mytable").jsonSubmit({
                             action: url,
                             callback: function() {
                                 setTimeout(function() {
                                     reloadGridData();
                                 }, 10);
                             }
                         });
                     },
                     cancel_fn: function() {
                         confirm.close();
                     }
                 });
         } else {
             $("#mytable").jsonSubmit({
                 action: url,
                 callback: function() {
                     setTimeout(function() {
                         reloadGridData();
                     }, 10);
                 }
             });
         }
     }
     
     function getCurrentTime() {
         var date = new Date();
         var year = date.getFullYear();
         var month = date.getMonth() + 1;
         var day = date.getDate();
         var hour = date.getHours();
         var time = year + "-" + month + "-" + day + " " + hour + ":" + "00";
         return time;
     }
     
     function getCurrentDate() {
         var date = new Date();
         var year = date.getFullYear();
         var month = date.getMonth() + 1;
         var day = date.getDate();
         var date = year + "-" + month + "-" + day;
         return date;
     }
     
     function addUrlPath(urlStr) {
         var _url = urlStr;
         var _loca = window.location.href;
         if (_loca.indexOf("srcFrom=bizconfig") != -1) {
             //控制面包削
             _url += "&srcFrom=bizconfig&condition=templeteIds&templeteIds=" + $("#templeteIds").val();
         }
         return _url;
     }
     //催办
     function notifyFn() {
         if(checkSizeForToolBar()){
             var selectRow = grid.grid.getSelectRows()[0];
             if(selectRow.endFlag=="0" || selectRow.finished){
                 $.alert($.i18n('collaboration.bpm.supervise.wf.isFinish'));
                 return;
             }
     
             var _affairId = selectRow.affairId;
             var _url = _ctxPath+"/hasten.do?method=openHasten&summaryId="+selectRow.summaryId;
             var _this = this;
             var canHandle = true;
             this[_affairId] = $.dialog({
                 id: 'hasten' + _affairId,
                 width: 300,
                 height: 420,
                 url: _url,
                 shadow: false,
                 checkMax: false,
                 transParams: {
                     pwindow: window
                 },
                 buttons: [{
                     text: $.i18n("message.pwd.ok"),
                     isEmphasize: true,
                     handler: function() {
                         if(!canHandle){
                             return;
                         }
                         canHandle = false;
                         var _getReturnValue = JSON.parse(_this[_affairId].getReturnValue());
                         var returnValue = _getReturnValue.returnValue;
                         if (_getReturnValue.success) {
                             callBackendMethod("hastenManager", "hasten", returnValue, {
                                 success: function(_result) {
                                     $.infor(_result);
                                     _this[_affairId].close();
                                     canHandle = true;
                                 },
                                 error: function(error) {
                                     console.error(error);
                                     canHandle = true;
                                 }
                             });
                         }
                     }
                 }, {
                     text: $.i18n("message.pwd.cancle"),
                     handler: function() {
                         _this[_affairId].close();
                     }
                 }]
             });
         }
     }
     //客开批量催办
     function kkcb() {
     
         var selectRow = grid.grid.getSelectRows();
         if (selectRow.length === 0) {
             $.alert($.i18n('supervise.please.select.operation.data')); //请选择要操作的数据！
             return false;
         }
         callBackendMethod("kkcbManager", "plcb",selectRow, {
             success : function(returnVal) {
                 $.alert(returnVal);
             }
         });
     }
     
     function repealWorkflow(opin, dialog) {
         toolbar.disabled("processRevoke");
         var selectRow = grid.grid.getSelectRows()[0];
         repealWorkflowFn(selectRow, dialog);
         toolbar.enabled("processRevoke");
     }
     
     function stopWorkflow(opin, dialog) {
         toolbar.disabled("processEnd");
         var selectRow = grid.grid.getSelectRows()[0];
         stopWorkflowFn(selectRow, dialog,null,function () {
             toolbar.enabled("processEnd");
         });
         //代码防护下 如果长时间没还原按钮状态 则自动还原
         setTimeout(function () {
             toolbar.enabled("processEnd");
         },3000);
     }
     
     
     
     //二维码传参
     function precodeCallback(){
         var obj = searchConditon();
         obj.openFrom = "supervise";
         return obj;
     }
     
     function searchConditon(){
         var o = new Object();
         o.app = "1";
     
         o.condition = $("#condition").val() ? $("#condition").val() : "2";
         o.importantLevel = $("#importantLevel").val();
         o.subject = $("#subject").val();
         o.senders = $("#sendersStr").val();
         o.currentNodesInfo = $("#currentNodesInfoStr").val();
         o.flowstate = $("input[name='flowstate']:checked").val();
         o.beginDate = $("#beginDate").val();
         o.endDate = $("#endDate").val();
         o.deadlineBeginDate = $("#deadlineBeginDate").val();
         o.deadlineEndDate = $("#deadlineEndDate").val();
         o.dataType = $("#dataType").val();
         o.status = $("input[name='status']:checked").val();
         if (isAdmin || managerType == "mySupervise") {
             o.operationType = getOperationTypeValue();
             if ($("#templateName").val() != $.i18n('collaboration.common.workflow.clickSelect')) {
                 o.operationTypeIds = $("#operationTypeIds").val();
             }
         } else {
             o.operationType = "template";
             o.operationTypeIds = $("#processOperationTypeIds").val();
         }
         o.managerType = managerType;
         o.flowstate = "0";
         o.onlyCount = "0";
         return o;
     }
     
     /**
      * 流程复活
      */
     var reliveProcessCount = 0;
     function reliveProcess(){
         toolbar.disabled("processRevive");
     
         reliveProcessCount = addOneSub(reliveProcessCount);
         if(parseInt(reliveProcessCount)>=2) {
             alert($.i18n('collaboration.common.repeat.click.js'));//请不要重复点击！
             return;
         }
         toolbar.disabled("processRevive");
     
         if(checkSizeForToolBar()){
             var selectRow = grid.grid.getSelectRows()[0];
             var caseId = selectRow.caseId;
             var processId = selectRow.processId;
             var summaryId = selectRow.summaryId;
     
             var app = selectRow.appEnum;
             var tempMap = new Object();
             tempMap["caseId"] = caseId;
             tempMap["processId"] = processId;
             tempMap["summaryId"] = summaryId;
             if(app == "1"){
                 tempMap["appName"] = "collaboration";
             }else if(app == "2"){
                 tempMap["appName"] = "form";
             }else{
                 tempMap["appName"] = "edoc";
             }
             callBackendMethod("workflowManageManager", "beforeReliveProcess", tempMap, {
                 success : function(ret){
                     var validateResult = $.parseJSON(ret);
                     if(validateResult.success == "true"){
                         var confirm = $.confirm({
                             'msg': validateResult.validateResult,
                             ok_fn: function () {
                                 callBackendMethod("workflowManageManager", "reliveProcess", tempMap, {
                                     success: function(msg) {
                                         var result = JSON.parse(msg);
                                         if(result.success == "true"){
                                             $.infor(result.validateResult);
                                         }else{
                                             $.alert(result.validateResult);
                                         }
                                         reloadGridData();
                                         toolbar&&toolbar.enabled("processRevive");
                                         reliveProcessCount = 0;
                                     }
                                 });
                             },
                             cancel_fn:function(){
                                 toolbar&&toolbar.enabled("processRevive");
                                 reliveProcessCount = 0;
                             },
                             close_fn:function () {
                                 toolbar&&toolbar.enabled("processRevive");
                                 reliveProcessCount = 0;
                             }
                         });
                     }else{
                         toolbar&&toolbar.enabled("processRevive");
                         reliveProcessCount = 0;
                         $.alert(validateResult.validateResult);
                     }
                 },
                 error : function(request, settings, e){
                     console.log(request);
                     $.alert(e);
                     toolbar&&toolbar.enabled("processRevive");
                     reliveProcessCount = 0;
                 }
             });
         }else {
             toolbar&&toolbar.enabled("processRevive");
             reliveProcessCount = 0;
         }
     }
     
     function editFlowChart(_selectRow) {
     
         toolbar.disabled("editWorkFlow");
         if (checkSizeForToolBar()) {
     
             if(_selectRow && !_selectRow.outerHTML){
                 // 不知道什么逻辑这里会做合并， 但是 _selectRow 这个有可能是 dom， 这个时候不合并
                 $.extend(grid.grid.getSelectRows()[0], _selectRow);
             }
             var selectRow = grid.grid.getSelectRows()[0];
     
     
             var isCollaboration = selectRow.appEnumStr=="collaboration" || selectRow.appName == "collaboration";
             var dataType = $("#dataType").val();
             var isForm = false;
             if(managerType == "mySupervise" && dataType == "all"){
                 isForm = selectRow.formAppId && selectRow.bodyType == "20";
             }else{
                 isForm = selectRow.formAppId && selectRow.templeteId;
             }
             if (isCollaboration && isForm) {
                 selectRow.spk = "collaboration_template_form";
                 selectRow.nps = "form";
             }
     
             editFlowChartFn(selectRow);
         }
         toolbar.enabled("editWorkFlow");
     }
     
     
     /**
      * 指定回退
      * @returns
      */
     var specifiesReturnCount = 0;
     function specifiesReturn(){
     
         specifiesReturnCount = addOneSub(specifiesReturnCount);
         if(parseInt(specifiesReturnCount)>=2) {
             alert($.i18n('collaboration.common.repeat.click.js'));//请不要重复点击！
             return;
         }
     
         toolbar.disabled("stepBackToTargetNode");
         if(checkSizeForToolBar()){
             var selectRow = grid.grid.getSelectRows()[0];
     
             if(selectRow.endFlag=="0"){
                 $.alert($.i18n('collaboration.worklfow.state.error.msg.js'));
                 toolbar.enabled("stepBackToTargetNode");
                 specifiesReturnCount=0
                 return;
             }
             selectStepBackNode(selectRow);
         }
     
         toolbar.enabled("stepBackToTargetNode");
         specifiesReturnCount = 0;
     }
     
     /**
      * 节点查找和替换
      * @returns
      */
     function nodeReplaceBatchFn(){
         var currentNodeInfoValue = $("#currentNodesInfoStr").val();
         var currentNodeInfoText = $("#currentNodesInfo").val();
         var app = managerType=="formAdmin"?"2":$("#condition").val();
         if(checkSizeForToolBar(true)){
               var selectRow = grid.grid.getSelectRows();
     
               var selectObjectIds = new Array();
               var hasFinishProcess = false;
               for (var i = 0; i < selectRow.length; i++) {
                   selectObjectIds.push(selectRow[i].summaryId);
                   if(selectRow[i].endFlag=="0"){
                     hasFinishProcess = true;
                 }
             }
               if(hasFinishProcess){
                   $.alert($.i18n("workflow.manager.hasProcessFinish.js"));
                   return;
               }
     
               nodeReplaceBatch(selectRow,"",currentNodeInfoValue,currentNodeInfoText,selectObjectIds,app,$("#isAvailablePeople").val());
         }
     }
     
     function isOldEdoc(selectRow){
         if(selectRow.nps=="edocRec" || selectRow.nps=="edocSend" || selectRow.nps=="edocSign" ){
     
             return true;
     
         }else{
             return false;
         }
     }
     
     
     function IE8() {
         try{
             var ua = navigator.userAgent;
             var isMSIE = (navigator.appName == "Microsoft Internet Explorer")||ua.indexOf('Trident')!=-1;
             var isMSIE8 = isMSIE && (ua.indexOf('MSIE 8') != -1);
             return isMSIE8;
         }catch(e){
             return false;
         }
     }
     
     function batchEditFlowChart(){
         callBackendMethod("superviseManager","canBatchModifyData",{
              success:function(result){
                 if("true" == result.currentOperation){
                     $.alert($.i18n("workflow.manager.supervise.modify.msg3.js"));
                 }else{
     
                     toolbar.disabled("batchEditFlow");
                     if (checkSameTemplate()) {
     
                         var selectRows = grid.grid.getSelectRows();
                         var selectRow = JSON.parse(JSON.stringify(selectRows[0])); //克隆对象
                         var processIdAndCaseIdAndFormAppIdAndMasterId="";
                         for(var i = 0 ;i<selectRows.length;i++){
                             if(processIdAndCaseIdAndFormAppIdAndMasterId==""){
                                 processIdAndCaseIdAndFormAppIdAndMasterId = selectRows[i].processId+"_"+selectRows[i].caseId+"_"+selectRows[i].formAppId+"_"+selectRows[i].formRecordId;
                             }else{
                                 processIdAndCaseIdAndFormAppIdAndMasterId += "," + selectRows[i].processId+"_"+selectRows[i].caseId+"_"+selectRows[i].formAppId+"_"+selectRows[i].formRecordId;
                             }
     
                         }
                         var isCollaboration = selectRow.appEnumStr=="collaboration" || selectRow.appName == "collaboration";
                         var dataType = $("#dataType").val();
                         var isForm = false;
                         if(managerType == "mySupervise" && dataType == "all"){
                             isForm = selectRow.formAppId && selectRow.bodyType == "20";
                         }else{
                             isForm = selectRow.formAppId && selectRow.templeteId;
                         }
                         if (isCollaboration && isForm) {
                             selectRow.spk = "collaboration_template_form";
                             selectRow.nps = "form";
                         }
                   var o = {
                             teamplateId : selectRow.templeteId
                         }
                         callBackendMethod("superviseManager","canBatchModifyTempleData",o,{ 
     
                             success:function(res){
                                    if("true" == res.isLoopBranch){
                                     $.alert($.i18n("循环流程模板不支持批量编辑"));
                  }else{
                  var tmanager = new templateManager();
                  tmanager.getCtpTemplate(selectRow.templeteId, {
                             success : function(obj) {
                                 if (obj == null || obj == "") {
                                     $.alert(obj);
                                 } else if(!obj.workflowId && obj.type=='text'){
                                     $.alert($.i18n("workflow.manager.supervise.modify.mag0.js"));//"格式模板不能批量修改流程"
                                 }else{
                                     selectRow.formAppId = obj.formAppId;
                                     selectRow.flowPermAccountId = obj.flowPermAccountId || obj.orgAccountId;
                                     selectRow.caseId = "-1";
                                     batchEditFlowChartFn(selectRow,processIdAndCaseIdAndFormAppIdAndMasterId,obj);
                                 }
                             }
                         });
                                     //研发修改
                                    toolbar.enabled("batchEditAllFlow");
                                 }
                             }
                        });
                     }
                     toolbar.enabled("batchEditFlow");
                 }
              }
         });
     
     }
     function batchEditFlowChartFn(selectRow,processIdAndCaseIdAndFormAppIdAndMasterId,obj,total){
             var targetWin = window.parent;
             var caseId = selectRow.caseId;
             var valueWin = window.parent;
             var defaultNodeName= selectRow.defaultNodeName;
             var defaultNodeLable=selectRow.defaultNodeLable;
             var SPK = selectRow.spk;
             var NPS = selectRow.nps;
     
             var _repealWorkflow = repealWorkflow;
             var _stopWorkflow = stopWorkflow;
             var processState = wfAjax.getProcessState(obj.workflowId);
             if(processState == 1){
                 $.alert($.i18n('collaboration.worklfow.state.error.msg.js'));//流程已结束或者终止，无法继续进行操作！
                 return;
             }
             var isTemplate = selectRow.isTemplate;
             if(typeof(isTemplate)=='undefined'){
                 isTemplate = selectRow.isFromTemplete;
             }
             var appName = selectRow.appName;
             if(typeof(appName)=='undefined'){
                 appName=selectRow.appEnumStr;
             }
             var accountId = selectRow.accountId;
             if(selectRow.flowPermAccountId){
                 accountId = selectRow.flowPermAccountId;
             }
     
             var _formAppId = selectRow.formAppId;
             var _masterId = selectRow.formRecordId;
             if (!SPK || SPK == "undefined") {
                 SPK = "freeFlow";
             }
             if (!NPS || NPS == "undefined") {
                 NPS = "default";
             }
             var options = {
                     targetWin: getCtpTop(),
                     valueWin: valueWin,
                     caseId: caseId,
                     processId: obj.workflowId,
                     isTemplate: isTemplate,
                     showHastenButton: false,
                     appName: appName,
                     scene: 5,
                     currentUserId: _wfcurrentUserId,
                     flowPermAccountId: accountId,
                     defaultPolicyId: defaultNodeName,
                     defaultPolicyName: defaultNodeLable,
                     SPK: SPK,
                     NPS: NPS,
                     isSkipNode:selectRow.isSkipNode,
                     formAppId : _formAppId,
                     masterId : _masterId,
                     title: $.i18n('common.design.workflow.label'),
                     isAdminMangerModel: true,
                     isSuperviseBatch: true,
                     processIdAndCaseIdAndFormAppIdAndMasterId:processIdAndCaseIdAndFormAppIdAndMasterId,
                     canExePrediction : selectRow.bodyType === "20" && $.ctx.hasPlugin("workflowAdvanced"),
                     templateSubject : obj.subject,
                     modifyTotal : total,
                     buttons: [{
                         "id": "saveDBOK",
                         "callBackFn": batchModifyCallBack
                     },
                     {
                         "id": "close"
                     }
                     ],
                     callBackFn:selectRow.callBackFn
             }
             showDiagram(options);
     }
     
     function batchModifyCallBack(ret){
         if(ret && ret.modifyTotal){//批量修改所有
             var o = searchConditions("more");
             o.superviseBatchModify = "true";
     
             if(ret.modifyTotal <= 200){//同步处理
                 o.pageSize = "200";
                 var re, ids = "";
                 if(managerType == "mySupervise"){
                     o.managerType="mySupervise";
     
                     var _superviseManager = new superviseManager();
                     re = _superviseManager.getAllSuperviseList4Col({},JSON.stringify(o));
                     ids = getDataIds(re.data);
                 }else{
                     var wmManager = new workflowManageManager();
                     re = wmManager.getSuperviseAllTemplateData(JSON.stringify(o));
                     ids = getDataIds(re);
                 }
     
                 ret.processIdAndCaseIdAndFormAppIdAndMasterId = ids;
                 var result = wfAjax.saveSuperviseBatchModifyWorkflowData(ret);
                 if(result){
                     $.alert($.i18n("collaboration.common.workflow.supervise.batch.modify.title",result.updateCount,result.allCount-result.updateCount));
                     $("#mytable").ajaxgridLoad(reloadObj);
                 }
             }else{//大于200条数据异步处理
                 var confirm = $.confirm({
                     'msg': $.i18n('workflow.manager.supervise.modify.msg1.js'),
                     "ok_fn": function(){
                         o.modifyTotal = ret.modifyTotal;
                         ret.isModifyAll = "true";
                         var param = {
                                 modifyData : ret,
                                 modifyTotal : ret.modifyTotal,
                                 isModifyAll : "true",
                                 serchData : o
                         };
                           callBackendMethod("superviseManager","saveSuperviseBatchModifyWorkflowData",param,{
                                success:function(result){
     
                                }
                         });
                     },
                     "cancel_fn":function(){}
                 });
     
             }
     
         }else if(ret && ret.allCount){
             $.alert($.i18n("collaboration.common.workflow.supervise.batch.modify.title",ret.updateCount,ret.allCount-ret.updateCount));
             $("#mytable").ajaxgridLoad(reloadObj);
         }
     }
     
     function batchEditAllFlowChart(){
     
         callBackendMethod("superviseManager","canBatchModifyData",{
              success:function(result){
                 if("true" == result.currentOperation){
                     $.alert($.i18n("workflow.manager.supervise.modify.msg3.js"));
                 }else{
     
                     toolbar.disabled("batchEditAllFlow");
                     var teamplateId="";
                     if (isAdmin || managerType == "mySupervise") {
                         teamplateId = getOperationTypeValue();
                         if ($("#templateName").val() != $.i18n('collaboration.common.workflow.clickSelect')) {
                             teamplateId = $("#operationTypeIds").val();
                         }
                     } else {
                         teamplateId = $("#processOperationTypeIds").val();
                     }
                     if(teamplateId=="" || typeof(teamplateId)=="undefined"){
                         $.alert($.i18n('workflow.manager.supervise.modify.mag14.js'));//请选择一个模板
                         toolbar.enabled("batchEditAllFlow");
                         return;
                     }
                     if(teamplateId.indexOf(",") > 0){
                         $.alert($.i18n('workflow.manager.supervise.modify.mag2.js'));//批量操作只能修改同一模板的数据！
                         toolbar.enabled("batchEditAllFlow");
                         return;
                     }
     
                     /**
                      *
                      * 1.查询数据total
                      * 2.小于200条数据同步处理，大于200条异步处理
                      * 3.打开流程图
                      * 4.修改流程后确定（异步分页获取数据并修改对应流程）
                      * 5.完了以后发送消息
                      *
                      */
                     var tmanager = new templateManager();
                     tmanager.getCtpTemplate(teamplateId, {
                         success : function(obj) {
                             if (obj == null || obj == "") {
                                 $.alert(obj);
                             } else {
                                 var o = searchConditions("more");
                                 //o.superviseBatchModify = "true";
                                 o.onlyFindCount = "true";
                                 var re;
                                 if(managerType == "mySupervise"){
                                     o.managerType="mySupervise";
     
                                     var _superviseManager = new superviseManager();
                                     re = _superviseManager.getAllSuperviseList4Col({},JSON.stringify(o));
                                     if(re && re.total == 0){
                                         $.alert($.i18n('workflow.manager.supervise.modify.mag13.js'));
                                         toolbar.enabled("batchEditAllFlow");
                                         return;
                                     }
                                     if(re && re.total){
                                         
                                         __batchEdit(obj,re.total,true);
                                     }
                                 }else{
                                     var wmManager = new workflowManageManager();
                                     re = wmManager.getSuperviseAllTemplateData(JSON.stringify(o));
                                     
                                     if(re && re[0] == "0"){
                                         $.alert($.i18n('workflow.manager.supervise.modify.mag13.js'));
                                         toolbar.enabled("batchEditAllFlow");
                                         return;
                                     }
                                     if(re && re[0]){
                                         __batchEdit(obj,parseInt(re[0]),true);
                                     }
                                 }
                                 toolbar.enabled("batchEditAllFlow");
                             }
                         }
                     });
                     
                     toolbar.enabled("batchEditAllFlow");
                 }
              }
         });
         
     }
     
     function __batchEdit(obj,data,modifyAll){
         var processIdAndCaseIdAndFormAppIdAndMasterId = "";
         var selectRow = {};
         var dataType = $("#dataType").val();
         var isForm = false;
         if(!modifyAll){//
             for(var i = 0; i< data.length; i++){
                 if(processIdAndCaseIdAndFormAppIdAndMasterId==""){
                     processIdAndCaseIdAndFormAppIdAndMasterId = data[i].processId+"_"+data[i].caseId+"_"+data[i].formAppId+"_"+data[i].formRecordId;
                 }else{
                     processIdAndCaseIdAndFormAppIdAndMasterId += "," + data[i].processId+"_"+data[i].caseId+"_"+data[i].formAppId+"_"+data[i].formRecordId;
                 }
             }
             selectRow = data[0];
             var isCollaboration = selectRow.appEnumStr=="collaboration" || selectRow.appName == "collaboration";
             
             if(managerType == "mySupervise" && dataType == "all"){
                 isForm = selectRow.formAppId && selectRow.bodyType == "20";
             }else{
                 isForm = selectRow.formAppId && selectRow.templeteId;
             }
             if (isCollaboration && isForm) {
                 selectRow.spk = "collaboration_template_form";
                 selectRow.nps = "form";
             }
         }else{//批量修改所有
             if(obj.moduleType == "1" && (obj.type == "template" || obj.type == "appWorkflow")){
                 if(obj.formAppId){
                     selectRow.spk = "collaboration_template_form";
                     selectRow.nps = "form";
                     selectRow.appName = "collaboration";
                 }else{
                     selectRow.spk = "collaboration_template";
                     selectRow.nps = "default";
                     selectRow.appName = "collaboration";
                 }
                 
             }else{
                 var rows = grid.grid.getPageRows();
                 var row = rows[0];// 获取表格中得第一个数据来获取默认节点权限
                 selectRow.defaultNodeName = row.defaultNodeName;
                 selectRow.defaultNodeLable = row.defaultNodeLable;
                 if((obj.moduleType == "401" || obj.moduleType == "402" || obj.moduleType == "404" || obj.moduleType == "4") 
                         && (obj.type == "template" || obj.type == "appWorkflow") && obj.formAppId){
                     selectRow.appName = "edoc";
                     
                 }
                 selectRow.spk = "freeFlow";
                 selectRow.nps = getEdocType(obj.moduleType);
             }
         }
         selectRow.formAppId = obj.formAppId;
         selectRow.flowPermAccountId = obj.flowPermAccountId || obj.orgAccountId;
         //batchEditFlowChartFn(selectRow,processIdAndCaseIdAndFormAppIdAndMasterId,obj.workflowId,obj.subject);
         batchEditFlowChartFn(selectRow,processIdAndCaseIdAndFormAppIdAndMasterId,obj,data);
         return;
     }
     
     function getEdocType(type){
         
         var edocType = "default";
         if(type == "401"){
             edocType = "govdocSend";
         }else if(type == "402"){
             edocType = "govdocRec";
         }else if(type == "404"){
             edocType = "govdocSign";
         }
         return edocType;
     }
     
     
     function editWorkFlowLog(){
            var dialog = $.dialog({
                 url: _ctxPath + '/detaillog/detaillog.do?method=showSuperviseBatchModifyDetailLog',
                 width: 1040,
                 height: 590,
                 title: $.i18n('collaboration.sendGrid.findAllLog'), //查看明细日志
                 targetWindow: getCtpTop()
             });
     }
     function modifyTip(){
         var modifyTip =$(".modify_supervise_tip");
         var tipDesc = $.i18n("workflow.manager.supervise.modify.mag4.js")
                                + "<br/>"
                                + "1."+$.i18n("workflow.manager.supervise.modify.mag5.js")
                                + "<br/>"
                                + "2."+$.i18n("workflow.manager.supervise.modify.mag6.js")
                                + "<br/>"
                                + "3."+$.i18n("workflow.manager.supervise.modify.mag7.js");
         var div_tipDesc = "<div style='font-size:12px; color:green;'>"+tipDesc+"</div>";
         var tooltipObj = null;
     
         modifyTip.each(function(){
               var $this = $(this);
             $this.mouseenter(function () {
                 var _targetId = $this.attr("id").replace("#", "");
                 var tipOptions = {
                             event:true,
                             direction: 'TR',
                             msg : div_tipDesc,
                             targetId: _targetId
                     }
                 tooltipObj = new MxtToolTip(tipOptions);
                 tooltipObj.setPoint(null,null);
                 tooltipObj.show();
             }).mouseleave(function() {
                 if(tooltipObj){
                     tooltipObj.close();
                     tooltipObj = null;
                 }
             });
     
             $(this).tooltip({
                     singleTon : false,
                     event:false,
                     direction: 'TR',
                     msg : div_tipDesc
             })
         });
     }
     
     //表格加载完成后,刷新数字
     function callBackTotle(data) {
         $(".query_menu_bar .active_item .item_number").text(data);
         if (hasProcessShowType) {
             if (showType =="1") {
                 //按节点
                 $("#count_"+reloadObj.activityId).text(data);
             } else if (showType == "2"){
                 //按泳道
                 $("#count_"+reloadObj.swimlaneId).text(data);
             }
         }
     }
     