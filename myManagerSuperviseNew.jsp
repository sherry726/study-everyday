<%--
 $Author: zhangxw $
 $Rev: 2034 $
 $Date:: #$:
  
 Copyright (C) 2012 Seeyon, Inc. All rights reserved.
 This software is the proprietary information of Seeyon, Inc.
 Use is subject to license terms.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ include file="/WEB-INF/jsp/common/common.jsp"%>
<%@ include file="/WEB-INF/jsp/ctp/workflow/workflowDesigner_js_api.jsp" %>
<%@ include file="/WEB-INF/jsp/common/template/template.js.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head style="overflow: hidden;">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" type="text/css" href="${path}/apps_res/bpm/portal/css/bpmPortalIndex.css${ctp:resSuffix()}" />
    <link rel="stylesheet" type="text/css" href="${path}/common/js/ui/seeEditorTable/css/seeEditorTable.css${ctp:resSuffix()}"/>
    <link rel="stylesheet" type="text/css" href="${path}/apps_res/supervise/css/myManagerSupervise.css${ctp:resSuffix()}"/>
    <link rel="stylesheet" href="${path}/apps_res/collaboration/css/importantLevel.css${ctp:resSuffix()}"/>
    <script type="text/javascript">
        var isGroupAdmin = "${ctp:escapeJavascript(isGroupAdmin)}";
        var isAdministrator = "${ctp:escapeJavascript(isAdministrator)}";
        var isAdmin = (isGroupAdmin == "true" || isAdministrator == "true");
        var managerType = "${ctp:escapeJavascript(managerType)}";
        var _dataType = "all";
        var quotaType = "${ctp:escapeJavascript(param.quotaType)}";
        var openForm = "${ctp:escapeJavascript(param.openFrom)}";
        var isShowStatisticalToolBar = "${ctp:escapeJavascript(isShowStatisticalToolBar)}";
        var isShowTotal = "${ctp:escapeJavascript(isShowTotal)}";
        var showType = "${ctp:escapeJavascript(showType)}";
        var sourceType = "${ctp:escapeJavascript(sourceType)}";
        var templateIds = "${ctp:escapeJavascript(templateIds)}";
        var senders = "${ctp:escapeJavascript(memberId)}";
        var memberName = "${ctp:escapeJavascript(memberName)}";
        var templateName = "${ctp:escapeJavascript(templateName)}";
        var haveOverdue = ${haveOverdue};
        var haveNoOverdue = ${haveNoOverdue};
        var haveProcessException = ${haveProcessException};
        var templeteIds =  "${ctp:escapeJavascript(templeteIds)}";
        var srcFrom = "${ctp:escapeJavascript(srcFrom)}";
    </script>

    <script type="text/javascript" charset="UTF-8" src="${path}/apps_res/collaboration/js/collaboration.js${ctp:resSuffix()}"></script>
    <script src="${path}/common/js/ui/seeEditorTable/js/seeyon.ui.editorTable.js${ctp:resSuffix()}"></script>
    <script type="text/javascript" charset="UTF-8" src="${path}/apps_res/collaboration/js/CollaborationApi.js${ctp:resSuffix()}"></script>
    <script type="text/javascript" src="${path}/ajax.do?managerName=workflowManageManager"></script>

    <c:set var="isAdmin" value='${ctp:escapeJavascript(isGroupAdmin) == "true" || ctp:escapeJavascript(isAdministrator) == "true"}'></c:set>
</head>

<body class="page_color" style="background-color: #F1F2F4;overflow: hidden">
    <div id='layout'>
        <form id="editFlowForm" name="editFlowForm">
            <input type="hidden" id="process_desc_by" name="process_desc_by" value="">
            <input type="hidden" id="process_xml" name="process_xml" value="">
            <input type="hidden" id="process_info" name="process_info" value="">
            <input type="hidden" id="process_rulecontent" name="process_rulecontent" value="">
            <input type="hidden" id="process_subsetting" name="process_subsetting" value="">
            <input type="hidden" id="workflow_newflow_input" name="workflow_newflow_input" value="">
            <input type="hidden" id="workflow_node_peoples_input" name="workflow_node_peoples_input" value="">
            <input type="hidden" id="workflow_node_condition_input" name="workflow_node_condition_input" value="">
        </form>

        <input type="hidden" id="summaryIdValue" name="summaryIdValue" value="">
        <input type="hidden" id="vouchValue" name="vouchValue" value="">

        <input type="hidden" id="conditionValue" class="" />
        <input type="hidden" id="subjectValue" class="" />
        <input type="hidden" id="sendersValue" class="" />
        <input type="hidden" id="currentNodesInfoValue" class="" />
        <input type="hidden" id="flowstateValue" class="" />
        <input type="hidden" id="beginDateValue" class="" />
        <input type="hidden" id="endDateValue" class="" />
        <input type="hidden" id="deadlineBeginDateValue" class="" />
        <input type="hidden" id="deadlineEndDateValue" class="" />
        <input type="hidden" id="operationTypeValue" class="" />
        <input type="hidden" id="operationTypeIdsValue" class="" />
        <input type="hidden" id="importantLevelValue" class="" />
        <input type="hidden" id="dataType" class="" />
        <div class="comp" comp="type:'breadcrumb',comptype:'location',code:'F01_supervise'"></div>
        <!-- <div class="hr_heng"></div> -->
        <c:if test="${ haveAll || havePending || haveDone || haveOverdue || haveNoOverdue || haveProcessException}">
	        <div class="menu_bar <c:if test='${isAdmin}'>small_menu</c:if>" style="background-color:#F1F2F4;display:none;" id="north">
	            <div class="query_menu_bar <c:if test='${isAdmin}'>small_menu_item</c:if>" id="dataTypeTapDiv">
	                <c:if test="${ haveAll }">
		                <div class="menu_item active_item all" onclick="dataTypeChange(this,'all')">
		                    <div class="item_text all_text" id="dataTypeTapDivText">${ctp:i18n('common.pending.all')}</div><!-- 全部 -->
		                </div>
	                </c:if>
	                
	                <c:if test="${ havePending }">
		                <div class="menu_item active_item all" onclick="dataTypeChange(this,'pending')" style="margin-left:10px;">
		                    <div class="item_text all_text" id="dataTypeTapDivText">${ctp:i18n("common.toolbar.transacted.without.label") }</div><!-- 未办结 -->
		                </div>
	                </c:if>
	                
	                <c:if test="${ haveDone }">
		                <div class="menu_item active_item all" onclick="dataTypeChange(this,'done')" style="margin-left:10px;">
		                    <div class="item_text all_text" id="dataTypeTapDivText">${ctp:i18n("common.toolbar.transacted.done.label") }</div><!-- 已办结 -->
		                </div>
	                </c:if>
	
					<c:if test="${ haveOverdue }">
		                <div class="menu_item overdue" onclick="dataTypeChange(this,'overdue')" style="margin-left:10px;">
		                    <c:if test="${!isAdmin}">
		                        <div class="item_number over_time overdue" id="overdueCount">0</div>
		                    </c:if>
		                    <div class="item_text">${ctp:i18n('common.has.overdue.label')}</div><!-- 已超期 -->
		                </div>
					</c:if>
	
					<c:if test="${ haveNoOverdue }">
		                <div class="menu_item sevenDayOverdue" onclick="dataTypeChange(this,'sevenDayOverdue')"  style="margin-left:10px;">
		                    <c:if test="${!isAdmin}">
		                        <div class="item_number over_time sevenDayOverdue" id="sevenDayOverdueCount">0</div>
		                    </c:if>
		                    <div class="item_text">${ctp:i18n('supervise.savenDay.overdue')}</div><!-- 七天内超期 -->
		                </div>
					</c:if>
	                
	                <c:if test="${ haveProcessException }">
		                <div class="menu_item active_item processException" onclick="dataTypeChange(this, 'processException')" style="margin-left:10px;">
		                	<div class="item_number over_time sevenDayOverdue" id="workflowProblemCount">0</div>
		                    <div class="item_text" title='${ctp:i18n("supervise.process.exception")}( ${ctp:i18n("workflow.bug.not.deal") } )'>${ctp:i18n('supervise.process.exception')}( ${ctp:i18n("workflow.bug.not.deal") } )</div><!-- 流程异常(未处理) -->
		                </div>
	                </c:if>
	                
	
	            </div>
	        </div>
        </c:if>
        <div class="more_query_area clearfix" id="gridBodyDiv">
        	<div style="padding:8px 15px 0 15px;background-color:#fff;">
                <div class="query_area_body clearfix" id="processShowTypeBody" style="border:0;display: none; overflow: auto;">


                </div>
            </div>
            <div class="query_area_body clearfix" id="queryBody" style="display: block;">
                <!-- 应用类型 -->
                <c:if test="${isAdmin}">
                    <div class="record_item">
                        <div class="label">${ctp:i18n("common.app.type")}:</div>
                        <div class="content">
                            <select id="condition" name="condition">
                                <c:if test="${ctp:hasPlugin('collaboration')}">
                                    <option value="1" title="${ctp:i18n('application.1.label')}">${ctp:i18n("application.1.label")}</option><!-- 协同 -->
                                </c:if>
                                <c:if test="${ctp:hasPlugin('form') || ctp:hasPlugin('cap4')}">
                                    <option value="2" title="${ctp:i18n('common.form.label')}">${ctp:i18n('common.form.label')}</option><!-- 表单 -->
                                </c:if>
                                <!-- 判断是否有公文插件 -->
                                <c:if test="${ctp:hasPlugin('edoc')}">
                                <option value="401" title="${ctp:i18n('collaboration.pending.lable2')}" >${ctp:i18n('collaboration.pending.lable2')}</option><!-- 发文 -->
                                <option value="402" title="${ctp:i18n('collaboration.pending.lable1')}">${ctp:i18n('collaboration.pending.lable1')}</option><!-- 收文 -->
                                <option value="404" title="${ctp:i18n('collaboration.pending.lable6')}">${ctp:i18n('collaboration.pending.lable6')}</option><!-- 签报 -->
                				</c:if>
                			</select>
            			</div>
        			</div>
        		</c:if>
        <!-- 流程状态 -->
        <div class="record_item" id="flowstateDiv">
            <div class="label">${ctp:i18n("common.flow.state.label")}:</div>
            <div class="content" style="width:250px;">
                <label for="radio11" class="margin_r_5 label_value hand">
                    <input type="radio" value="0" id="radio11" name="flowstate" class="margin_r_5" checked>${ctp:i18n("collaboration.common.workflow.circulation")}</label><!-- 流转中 -->
                <label for="radio12" class="margin_r_5 label_value hand">
                    <input type="radio" value="1" id="radio12" name="flowstate" class="margin_r_5">${ctp:i18n('common.stop.label')}</label><!-- 终止 -->
                <label for="radio13" class="margin_r_5 label_value hand">
                    <input type="radio" value="3" id="radio13" name="flowstate" class="margin_r_5">${ctp:i18n('common.end.label')}</label><!-- 结束 -->
            </div>
        </div>
        <!-- 办理状态 -->
        <div class="record_item" style="display: none;" id="doneStateDiv">
            <div class="label">${ctp:i18n('collaboration.statisticalChart.handlingState.label')}:</div>
            <div class="content" style="width:250px">
                <label for="statusRadio1" class="margin_r_10 label_value hand"> 
                <input type="radio" value="0" id="statusRadio1" name="status" class="margin_r_10" checked>${ctp:i18n('common.toolbar.transacted.without.label')}</label><!--未办结 -->
                <label for="statusRadio2" class="margin_r_10 label_value hand">
                <input type="radio" value="1" id="statusRadio2" name="status" class="margin_r_10">${ctp:i18n('common.toolbar.transacted.done.label')}</label><!--已办结 -->
            </div>
        </div>
        <!-- 业务类型 -->
        <c:if test="${srcFrom ne 'bizconfig'}">
            <c:if test="${isGroupAdmin ne true}">
	            <div class="record_item" id="AllOperationTypeDiv">
	                <div class="label">${ctp:i18n("collaboration.common.workflow.typeOfBusiness")}:</div>
	                <div class="content" style="min-width: 250px;word-break:normal;word-wrap:normal;white-space:nowrap;">
	                    <label for="selfCreate" class="margin_r_10 label_value hand">
	                        <input type="radio" value="self" name="operationType" id="selfCreate" class="margin_r_10" checked>${ctp:i18n("collaboration.common.workflow.selfbuiltProcess")}</label><!-- 自建流程 -->
	                    <label for="templateFlow" class="margin_r_10 label_value hand">
	                        <input type="radio" value="template" name="operationType" id="templateFlow" class="margin_r_10">${ctp:i18n("common.pending.col")}</label><!-- 模板流程 -->
	                    <!-- <input type="text" name="templateName" id="templateName" readonly="readonly" value="${ctp:i18n('collaboration.common.workflow.clickSelect')}" style="display: none;width: 77px;">点击选择 -->
                        <input type="text" name="templateName" id="templateName" value="${ctp:i18n('collaboration.common.workflow.clickSelect')}" style="display: none;width: 77px;"><!-- 点击选择 -->
                        <input type="hidden" name="operationTypeIds" id="operationTypeIds" value="" />
	                </div>
	            </div>
            </c:if>
	        <!-- 模板流程 -->
	        <div class="record_item" style="display: none;" id="processOperationTypeDiv">
	            <div class="label">${ctp:i18n("common.pending.col")}:</div>
	            <div class="content">
                    <c:if test="${managerType=='formAdmin' }">
                        <input type="text" style="padding: 0;margin:0;"  name="inputTemplateName" id="inputTemplateName" class="margin_r_10" value="">
                    </c:if>
                    <c:if test="${managerType!='formAdmin' }">
                        <input type="text" style="padding: 0;margin:0;"  name="processTemplateName" id="processTemplateName" class="margin_r_10" value="${ctp:i18n('collaboration.common.workflow.clickSelect')}" onclick="processTemplateChoose()"><!-- 点击选择 -->
                        <input type="hidden" name="processOperationTypeIds" id="processOperationTypeIds" value="" />
                    </c:if>
	            </div>
	        </div>
        </c:if>
        <!-- 标题 -->
        <div class="record_item">
            <div class="label">${ctp:i18n('common.subject.label')}:</div>
            <div class="content">
                <input id="subject" name="subject" type="text" maxLength="80" />
            </div>
        </div>
        <!-- 发起对象 -->
        <c:if test="${managerType!='formAdmin' }">
            <div class="record_item" id="sendersDiv">
                <div class="label">${ctp:i18n('collaboration.common.workflow.originatingObject')}:</div>
                <div class="content">
                    <input type="text" id="senders" readonly="readonly" />
                    <input type="hidden" id="sendersStr" />

                </div>
            </div>
        </c:if>
        <!-- 发起时间 -->
        <c:if test="${managerType!='formAdmin' }">
            <div class="record_item">
                <div class="label">${ctp:i18n("common.date.sendtime.label")}:</div>
                <div class="content">
                    <div class="input_group">
                        <input id="beginDate" class="comp sub_input" type="text" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly">
                        <span class="tiem_icon"></span>
                    </div>
                    <span class="middle_line"></span>
                    <div class="input_group">
                        <input id="endDate" type="text" class="comp sub_input" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly"/>
                        <span class="tiem_icon"></span>
                    </div>
                </div>
            </div>
        </c:if>
        <!-- 重要程度 -->
        <c:if test="${managerType!='formAdmin' }"> 
            <div class="record_item">
                <div class="label">${ctp:i18n("common.importance.label")}:</div>
                <div class="content">
                    <select id="importantLevel" name="importantLevel">
                    <option value="" title="${ctp:i18n('common.pending.all')}">${ctp:i18n('common.pending.all')}</option> <!-- 全部 -->
                    <option value="1" title="${ctp:i18n('common.importance.putong')}">${ctp:i18n('common.importance.putong')}</option><!-- 普通 -->
                        <option value="2" title="${ctp:i18n('common.importance.zhongyao')}">${ctp:i18n("common.importance.zhongyao")}</option><!-- 重要 -->
                        <option value="3" title="${ctp:i18n('common.importance.feichangzhongyao')}">${ctp:i18n("common.importance.feichangzhongyao")}</option><!-- 非常重要 -->
                    </select>
                </div>
            </div>
        </c:if>
        <!-- 流程期限 -->
        <c:if test="${managerType!='formAdmin'}">
            <div class="record_item">
                <div class="label">${ctp:i18n("common.date.deadlineName.label")}:</div>
                <div class="content">
                    <div class="input_group">
                        <input id="deadlineBeginDate" class="comp sub_input" type="text" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly">
                        <span class="tiem_icon"></span>
                    </div>
                    <span class="middle_line"></span>
                    <div class="input_group">
                        <input id="deadlineEndDate" type="text" class="comp sub_input" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly"/>
                        <span class="tiem_icon"></span>
                    </div>
                </div>
            </div>
        </c:if>
        <!-- 事项所属人 -->
        <c:if test="${managerType!='formAdmin' && !isAdmin}">
            <div class="record_item" id="currentNodesInfoDiv">
                <c:if test="${managerType=='deptAdmin' }">
                    <div class="label">${ctp:i18n("supervise.affair.belong.member")}:</div>
                </c:if>
                <c:if test="${managerType!='deptAdmin' }">
                    <div class="label">${ctp:i18n("collaboration.list.currentNodesInfo.label")}:</div>
                </c:if>
                <div class="content">
                    <input type="text" id="currentNodesInfo" placeholder="${ctp:i18n('org.index.select.people.label.js')}" readonly="readonly" />
                    <input type="hidden" id="currentNodesInfoStr" />
                    <input type="hidden" id="isAvailablePeople" />
                    <span id="selectAvailablePeople" class="ico24 enableNode_24" title="${ctp:i18n('workflow.replaceNode.04')}"></span>
                    <span id="selectUnavailablePeople" class="ico24 disableNode_24" title="${ctp:i18n('workflow.replaceNode.05')}"></span>
                </div>
            </div>
        </c:if>
        <!-- 新增查询字段start -->
        <c:if test="${managerType=='formAdmin' || isAdmin  }">
            <!-- 流水号 -->
            <div class="record_item">
                <div class="label">流水号:</div>
                <div class="content">
                    <input 
                        style="width: 250px;height: 30px;background: #fff;padding-left: 4px;border-radius: 4px;border: 1px solid #D4D4D4;box-sizing: border-box;"
                        id="serialNumber" 
                        name="serialNumber" 
                        type="text" 
                        onkeyup="value=value.replace(/[^\d]/g,'');"
                        />
                </div>
            </div>
            <!-- 经办人 -->
            <div class="record_item">
                <div class="label">经办人:</div>
                <div class="content">
                    <input type="text" id="operator" readonly="readonly" />
                    <input type="hidden" id="operatorStr" />

                </div>
            </div>
            <!-- 发起时间 -->
            <div class="record_item">
                <div class="label">经办时间:</div>
                <div class="content">
                    <div class="input_group">
                        <input id="operateBeginDate" class="comp sub_input" type="text" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly">
                        <span class="tiem_icon"></span>
                    </div>
                    <span class="middle_line"></span>
                    <div class="input_group">
                        <input id="operateEndDate" type="text" class="comp sub_input" comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false" readonly="readonly"/>
                        <span class="tiem_icon"></span>
                    </div>
                </div>
            </div>
            <!-- 发起部门 -->
            <div class="record_item">
                <div class="label">发起部门:</div>
                <div class="content">
                    <input type="text" id="sendDepartment" readonly="readonly" />
                    <input type="hidden" id="sendDepartmentStr" />

                </div>
            </div>
             <!-- 紧急程度 -->
            <div class="record_item">
                <div class="label">紧急程度:</div>
                <div class="content">
                    <select id="emergLevel" name="emergLevel">
                        <option value="0" title="无">无</option> 
                        <option value="1" title="平急">平急</option>
                        <option value="2" title="加急">加急</option>
                        <option value="3" title="特急">特急</option>
                        <option value="3" title="特提">特提</option>
                    </select>
                </div>
            </div>
            <!-- 办理状态 -->
            <div class="record_item">
                <div class="label">${ctp:i18n('collaboration.statisticalChart.handlingState.label')}:</div>
                <div class="content" style="width:250px">
                    <input type="text" id="name_text4" name="name_text" value="">
                </div>
            </div>
        </c:if>
        <!-- 新增查询字段end -->
        

        <div class="query_area_footer clearfix">
            <div class="query_btns clearfix">
                <div class="query_btn left blue" id="queryBtn">
                    <span class="label">${ctp:i18n("common.button.condition.search.label")}</span>
                </div><!-- 查询 -->
                <div class="query_btn left gray" id="resetBtn" onclick="resetBtnClickFunc(_dataType)">
                    <span class="label">${ctp:i18n("common.button.reset.label")}</span><!-- 重置 -->
                </div>
                <c:if test="${ctp:hasPlugin('barCode') && managerType == 'mySupervise'}"> 
                    <div class="left" onclick="barCodeOpen()" value="barcode" id="superviseBarCode">
                        <div class="label query_btn_barcode" >[${ctp:i18n("common.barcode.search.saoyisao") }]</div>
                    </div>
                </c:if>
            </div>
        </div>
    </div>

    <div class="clearfix managerSupervise" style="width:100%;background-color: #EEEEEE" >
        <div class="left" style="<c:if test='${isAdmin}'>width:100%</c:if><c:if test='${!isAdmin}'>width:60%</c:if>" id="toolbar"></div>
        <div class="right" >
	        <div style="padding-top: 8px; padding-right: 85px;" id="simpleQuery"> </div>
	        <c:if test="${!isAdmin}">
	            <div class="right" >
	                <a id="combinedQuery" class="font_size12 common_button combinedQuery" onclick="showQueryViews();">${ctp:i18n("common.advance.label") }</a>
	            </div>
	        </c:if>
        </div>
    </div>
    <div id="mydata">
        <table id="mytable" class="flexme3"></table>
    </div>
    </div>
    
    <div class="layout_center over_hidden" id="processException" layout="border:false" style="display: none; top:83px;border: none;">
        <iframe id="processExceptionIframe" frameborder="0" allowtransparency="true" height="100%" width="100%" src=""></iframe>
    </div>
    <script type="text/javascript">
        if(!isAdmin){
            //560是右侧搜索按钮区域的最大宽度
            $("#toolbar").width(document.body.clientWidth - 560);
            if(document.getElementById("simpleQuery") && document.getElementById("combinedQuery")){
                document.getElementById("simpleQuery").style.paddingRight = document.getElementById("combinedQuery").offsetWidth + 20 + "px";
            }
        }
    </script>
    <script type="text/javascript" charset="UTF-8" src="${path}/apps_res/supervise/js/myManagerSupervise.js${ctp:resSuffix()}"></script>
    <script type="text/javascript" charset="UTF-8" src="${path}/apps_res/supervise/js/wf_supervise_admin.js${ctp:resSuffix()}"></script>
    <ctp:webBarCode readerId="PDF417Reader" readerCallBack="codeCallback" decodeParamFunction="precodeCallback" decodeType="codeflowurl"/>
</body>

</html>