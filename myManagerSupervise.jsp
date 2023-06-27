<%-- $Author: zhangxw $ $Rev: 2034 $ $Date:: #$: Copyright (C) 2012 Seeyon, Inc. All rights reserved. This software is
    the proprietary information of Seeyon, Inc. Use is subject to license terms. --%>
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

        <%@ include file="/WEB-INF/jsp/common/common.jsp" %>
            <%@ include file="/WEB-INF/jsp/ctp/workflow/workflowDesigner_js_api.jsp" %>
                <%@ include file="/WEB-INF/jsp/common/template/template.js.jsp" %>
                    <!DOCTYPE html
                        PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

                    <head style="overflow: hidden;">
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <title></title>
                        <link rel="stylesheet" type="text/css"
                            href="${path}/apps_res/bpm/portal/css/bpmPortalIndex.css${ctp:resSuffix()}" />
                        <link rel="stylesheet" type="text/css"
                            href="${path}/common/js/ui/seeEditorTable/css/seeEditorTable.css${ctp:resSuffix()}" />
                        <link rel="stylesheet" type="text/css"
                            href="${path}/apps_res/supervise/css/myManagerSupervise.css${ctp:resSuffix()}" />
                        <link rel="stylesheet"
                            href="${path}/apps_res/collaboration/css/importantLevel.css${ctp:resSuffix()}" />
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
                            var haveOverdue = ${ haveOverdue };
                            var haveNoOverdue = ${ haveNoOverdue };
                            var haveProcessException = ${ haveProcessException };
                            var templeteIds = "${ctp:escapeJavascript(templeteIds)}";
                            var srcFrom = "${ctp:escapeJavascript(srcFrom)}";
                        </script>

                        <script type="text/javascript" charset="UTF-8"
                            src="${path}/apps_res/collaboration/js/collaboration.js${ctp:resSuffix()}"></script>
                        <script
                            src="${path}/common/js/ui/seeEditorTable/js/seeyon.ui.editorTable.js${ctp:resSuffix()}"></script>
                        <script type="text/javascript" charset="UTF-8"
                            src="${path}/apps_res/collaboration/js/CollaborationApi.js${ctp:resSuffix()}"></script>
                        <script type="text/javascript" src="${path}/ajax.do?managerName=workflowManageManager"></script>

                        <c:set var="isAdmin"
                            value='${ctp:escapeJavascript(isGroupAdmin) == "true" || ctp:escapeJavascript(isAdministrator) == "true"}'>
                        </c:set>
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
                                <input type="hidden" id="workflow_node_peoples_input" name="workflow_node_peoples_input"
                                    value="">
                                <input type="hidden" id="workflow_node_condition_input"
                                    name="workflow_node_condition_input" value="">
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

                            <div class="more_query_area clearfix" id="gridBodyDiv">
                                <div style="padding:8px 15px 0 15px;background-color:#fff;">
                                    <div class="query_area_body clearfix" id="processShowTypeBody"
                                        style="border:0;display: none; overflow: auto;">


                                    </div>
                                </div>
                                <div class="query_area_body clearfix" id="queryBody">

                                    <!-- 模板流程 流程名称-->
                                    <div class="record_item" id="processOperationTypeDiv">
                                        <div class="label">流程名称:</div>
                                        <div class="content">
                                            <input type="text" style="padding: 0;margin:0;" name="processTemplateName"
                                                id="processTemplateName" class="margin_r_10"
                                                value="${ctp:i18n('collaboration.common.workflow.clickSelect')}">
                                            <input type="hidden" name="processOperationTypeIds"
                                                id="processOperationTypeIds" value="" />
                                        </div>
                                    </div>
                                    <!-- 标题 -->
                                    <div class="record_item">
                                        <div class="label">${ctp:i18n('common.subject.label')}:</div>
                                        <div class="content">
                                            <input id="subject" name="subject" type="text" maxLength="80" />
                                        </div>
                                    </div>

                                    <!-- 发起时间 -->
                                    <div class="record_item">
                                        <div class="label">${ctp:i18n("common.date.sendtime.label")}:</div>
                                        <div class="content">
                                            <div class="input_group">
                                                <input id="beginDate" class="comp sub_input" type="text"
                                                    comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false"
                                                    readonly="readonly">
                                                <span class="tiem_icon"></span>
                                            </div>
                                            <span class="middle_line"></span>
                                            <div class="input_group">
                                                <input id="endDate" type="text" class="comp sub_input"
                                                    comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false"
                                                    readonly="readonly" />
                                                <span class="tiem_icon"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 流水号 -->
                                    <div class="record_item">
                                        <div class="label">流水号:</div>
                                        <div class="content">
                                            <input
                                                style="width: 250px;height: 30px;background: #fff;padding-left: 4px;border-radius: 4px;border: 1px solid #D4D4D4;box-sizing: border-box;"
                                                id="serialNumber" name="serialNumber" type="text"
                                                onkeyup="value=value.replace(/[^\d]/g,'');" />
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
                                    <!-- 经办时间 -->
                                    <div class="record_item">
                                        <div class="label">经办时间:</div>
                                        <div class="content">
                                            <div class="input_group">
                                                <input id="operateBeginDate" class="comp sub_input" type="text"
                                                    comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false"
                                                    readonly="readonly">
                                                <span class="tiem_icon"></span>
                                            </div>
                                            <span class="middle_line"></span>
                                            <div class="input_group">
                                                <input id="operateEndDate" type="text" class="comp sub_input"
                                                    comp="type:'calendar',ifFormat:'%Y-%m-%d',cache:false,hideOkClearButton:false"
                                                    readonly="readonly" />
                                                <span class="tiem_icon"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="query_area_footer clearfix">
                                        <div class="query_btns clearfix">
                                            <div class="query_btn left blue" id="queryBtn">
                                                <span
                                                    class="label">${ctp:i18n("common.button.condition.search.label")}</span>
                                            </div><!-- 查询 -->
                                            <div class="query_btn left gray" id="resetBtn"
                                                onclick="resetBtnClickFunc(_dataType)">
                                                <span
                                                    class="label">${ctp:i18n("common.button.reset.label")}</span><!-- 重置 -->
                                            </div>
                                            <c:if test="${ctp:hasPlugin('barCode') && managerType == 'mySupervise'}">
                                                <div class="left" onclick="barCodeOpen()" value="barcode"
                                                    id="superviseBarCode">
                                                    <div class="label query_btn_barcode">
                                                        [${ctp:i18n("common.barcode.search.saoyisao") }]</div>
                                                </div>
                                            </c:if>
                                        </div>
                                    </div>
                                </div>

                                <div class="clearfix managerSupervise" style="width:100%;background-color: #EEEEEE">
                                    <div class="left"
                                        style="<c:if test='${isAdmin}'>width:100%</c:if><c:if test='${!isAdmin}'>width:60%</c:if>"
                                        id="toolbar"></div>
                                    <div class="right">
                                        <div style="padding-top: 8px; padding-right: 85px;" id="simpleQuery"> </div>
                                        <c:if test="${!isAdmin}">
                                            <div class="right">
                                                <a id="combinedQuery" class="font_size12 common_button combinedQuery"
                                                    onclick="showQueryViews();">${ctp:i18n("common.advance.label") }</a>
                                            </div>
                                        </c:if>
                                    </div>
                                </div>
                                <div id="mydata">
                                    <table id="mytable" class="flexme3"></table>
                                </div>
                            </div>

                            <div class="layout_center over_hidden" id="processException" layout="border:false"
                                style="display: none; top:83px;border: none;">
                                <iframe id="processExceptionIframe" frameborder="0" allowtransparency="true"
                                    height="100%" width="100%" src=""></iframe>
                            </div>
                            <script type="text/javascript">
                                if (!isAdmin) {
                                    //560是右侧搜索按钮区域的最大宽度
                                    $("#toolbar").width(document.body.clientWidth - 560);
                                    if (document.getElementById("simpleQuery") && document.getElementById("combinedQuery")) {
                                        document.getElementById("simpleQuery").style.paddingRight = document.getElementById("combinedQuery").offsetWidth + 20 + "px";
                                    }
                                }
                            </script>
                            <script type="text/javascript" charset="UTF-8"
                                src="${path}/apps_res/supervise/js/myManagerSupervise.js${ctp:resSuffix()}"></script>
                            <script type="text/javascript" charset="UTF-8"
                                src="${path}/apps_res/supervise/js/wf_supervise_admin.js${ctp:resSuffix()}"></script>
                            <ctp:webBarCode readerId="PDF417Reader" readerCallBack="codeCallback"
                                decodeParamFunction="precodeCallback" decodeType="codeflowurl" />
                    </body>

                    </html>