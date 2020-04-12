
var gEvent = {};
var gEventTableMap = {};
var gReloadButtonMap = {};
var gMemberTableMap = {};


class TreeView {
    constructor(request_node, response_node) {
        this.request_node = request_node;
        this.response_node = response_node;
        this.request_child_node = null
        this.response_child_node = null;
    }
    fetch_json(url, type, data, success, fail) {
        $.ajax({
            url: url,
            type: type,
            data: data,
            beforeSend: (xhr, settings) => {
                this.update_request_node(settings);
            }
        })
        .done((data) => {
            this.update_response_node(data);
            success();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            this.update_response_node(JSON.parse(jqXHR.responseText));
            fail();
        });
    }
    append_request_node(json) {
        let formatter = new JSONFormatter.default(json, 1, {theme:'dark'});
        this.request_child_node = formatter.render();
        formatter.openAtDepth(0);
        this.request_node.appendChild(this.request_child_node);
        
    }
    append_response_node(json) {
        let formatter = new JSONFormatter.default(json, 1, {theme:'dark'});
        this.response_child_node = formatter.render();
        formatter.openAtDepth(Infinity);
        this.response_node.appendChild(this.response_child_node);
    }
    remove_request_node() {
        this.request_node.removeChild(this.request_child_node);
        this.request_child_node = null;
    }
    remove_response_node() {
        this.response_node.removeChild(this.response_child_node);
        this.response_child_node = null;
    }
    update_request_node(json) {
        this.remove_request_node();
        this.append_request_node(json);
    }
    update_response_node(json) {
        this.remove_response_node();
        this.append_response_node(json);
    }
}


class EventButton {
    constructor(id, tree_view, url, type, cb_func) {
        this.id = id;
        $(id).on("click", () => {
            this.inactive();
            let ins = this;
            tree_view.fetch_json(url, type, cb_func(), 
                ((x)=>{return ()=>{x.active();}})(this),
                ((x)=>{return ()=>{x.active();}})(this)
            );
        });
    }
    active() {
        $(this.id).prop("disabled", false);
    }
    inactive() {
        $(this.id).prop("disabled", true);
    }
}

function __get_form_data(id, search_str) {
    let tag_list = $(id).find(search_str);
    let ret = {};
    for (let tag of tag_list) {
        ret[tag.name] = tag.value;
    }
    return ret;
}


function get_form_data(id) {
    let input_data =  __get_form_data(id, "input[type=text]");
    let select_data = __get_form_data(id, "select[name=id]");
    let ret = Object.assign(input_data, select_data);
    return ret;
}


function register_operation(
    request_view_id,
    response_view_id,
    button_id,
    request_uri,
    request_method,
    form_id,
) {
    let view = new TreeView(
        document.getElementById(request_view_id),
        document.getElementById(response_view_id)
    );
    view.append_request_node({});
    view.append_response_node({});

    let button = new EventButton(
        button_id,
        view,
        request_uri,
        request_method,
        ()=>{return get_form_data(form_id);},
    );
}

function set_event_fields(id, event) {
    for (let key in event) {
        let jqElement = $(id).find("*[name=" + key+ "]");
        jqElement.val(event[key]);
    }
}

function set_memberId(id, event) {
    let jqMemberId = $(id).find("*[name=memberId]");
    jqMemberId.children().remove();
    for (let memberN in event["eventMembers"]) {
        let jqOption = $("<option>").html(memberN).val(memberN);
        jqMemberId.append(jqOption);
    }
}

function set_member_fields(id, event) {
    let jqMemberId = $(id).find("select[name=memberId]");
    let memberId = jqMemberId.val();
    for (let key in event["eventMembers"][memberId]) {
        if (key != "memberDays") {
            let jqElement = $(id).find("*[name=" + key + "]");
            jqElement.val(event["eventMembers"][memberId][key]);
        } else {
            for (let dayN in event["eventMembers"][memberId][key]) {
                let jqElement = $(id).find("*[name=" + dayN + "]");
                jqElement.val(event["eventMembers"][memberId][key][dayN]);
            }
        }

    }
}

function register_select_operation(id) {
    let jqSelect = $(id).find("select[name=id]");
    jqSelect.change(()=>{
        //TODO: ()=>{}はエラーのajax failの場合
        load_fields(id, set_event_fields, ()=>{});
    });
}

function register_select_operation2(id) {
    let jqSelect = $(id).find("select[name=id]");
    // メンバー更新のイベントIDの選択
    jqSelect.change(()=>{
        load_fields(id, set_memberId);
    });
    // メンバー更新のメンバーIDの選択
    jqSelect = $(id).find("select[name=memberId]");
    jqSelect.change(()=>{
        set_member_fields(id, gEvent);
    });
}

// function register_eventId_select(eventId, success, fail) {
//     let jqSelect =$(eventId).find("select[name=id]")
//     jqSelect.change(()=>{
//         get_fields(eventId, success, fail);
//     });
// }


function load_ids(id_list) {
    $.ajax({
        url: "/debug/getall",
        type: "GET",
    })
    .done((data) => {
        for (let id of id_list) {
            for (let record of data) {
                let jqOption = $("<option>").html(record.id).val(record.id);
                $(id).append(jqOption);
            }           
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        //TODO: エラー処理
        console.log(jqXHR.responseText)
    });
}

function load_fields(id, success, fail) {
    let query_id = $(id).find("select[name=id]").val();
    
    $.ajax({
        url: "/event/get",
        type: "GET",
        data: {id:query_id}
    })
    .done((data, textStatus, jqXHR) => {
        gEvent = data;
        success(id, data);
    })
    //TODO: failを使って処理
    .fail((jqXHR, textStatus, errorThrown) => {
        //TODO: エラー処理
        console.log(jqXHR.responseText)
    });
}


function register_reload_event(button_id, id) {
    // TODO: failの場合を作成
    $(button_id).click(()=>{
        load_fields(id, set_event_fields, ()=>{})
    });
}


// イベントの表示フィールド
class EventTable {
    constructor(api_id) {
        this.api_id_ = api_id;
    }
    // イベント項目を表示する
    fillField(event) {
        for (let key in event) {
            let jqElement = $(this.api_id_).find("*[name=" + key+ "]");
            jqElement.val(event[key]);
        }
    }
    // TODO: エラー時の処理
    errorField() {

    }
}

class MemberTable {
    constructor(api_id) {
        this.api_id_ = api_id;
    }
    removeDayN() {
        let trList = $(this.api_id_ + " tr");
        for (let tr of trList) {
            let text = $(tr).find("td:first").html();
            if (text.startsWith("day")) {
                tr.remove();
            }
        }
    }
    addDayN(eventDays) {
        for (let dayN in eventDays) {
            let jqTr = $("<tr>");
            jqTr.append($("<td>").html(dayN));
            jqTr.append($("<td>").html("候補日"));
            jqTr.append($("<td>").html("OK|UnKnown|NG|None"));
            let jqInput = $("<input>").prop("name", dayN);
            jqTr.append($("<td>").append(jqInput));
            $(this.api_id_ + " table").append(jqTr);
        }
    }
    changeDayN(event) {
        this.removeDayN();
        this.addDayN(event.eventDays);
    }
}

// イベントIDより再読み込みボタン
class ReloadButton {
    constructor(api_id, button_id, fill_type) {
        this.api_id_ = api_id;
        this.button_id_ = button_id;
        this.fill_type_ = fill_type;
        $(button_id).click(()=>this.fetchEvent());
 
    }
    // イベントを取得して、テーブルに反映する
    fetchEvent() {
        this.inactive();
        let event_id = $(this.api_id_).find("select[name=id]").val();
        $.ajax({
            url: "/event/get",
            type: "GET",
            context: this,
            data: {id: event_id}
        })
        .done((data, textStatus, jqXHR) => {
            gEvent = data;
            if (this.fill_type_ === "event") {
                this.doneEvent(data);
            } else {
                this.doneMember(data);
            }
            this.active();
        })
        //TODO: failを使って処理
        .fail((jqXHR, textStatus, errorThrown) => {
            //TODO: エラー処理
            console.log(jqXHR.responseText)
            this.active();
        });
    }
    // イベントのテーブルの項目を入力
    doneEvent(json) {
        gEventTableMap[this.api_id_].fillField(json);
    }
    // メンバーのテーブルの項目を変更する
    doneMember(json) {
        gMemberTableMap[this.api_id_].changeDayN(json);
    }
    // 更新ボタン有効化
    active() {
        $(this.button_id_).prop("disabled", false);
    }
    // 更新ボタン無効化
    inactive() {
        $(this.button_id_).prop("disabled", true);
    }
}


$(()=>{
    register_operation(
        "create-event-request-view",
        "create-event-response-view",
        "#create-event-send",
        "/event/create",
        "POST",
        "#create-event-api"
    );
    register_operation(
        "update-event-request-view",
        "update-event-response-view",
        "#update-event-send",
        "/event/update",
        "POST",
        "#update-event-api"
    );
    register_operation(
        "refer-event-request-view",
        "refer-event-response-view",
        "#refer-event-send",
        "/event/get",
        "GET",
        "#refer-event-api"
    );    
    register_operation(
        "delete-event-request-view",
        "delete-event-response-view",
        "#delete-event-send",
        "/event/delete",
        "POST",
        "#delete-event-api"
    );


    register_operation(
        "create-member-request-view",
        "create-member-response-view",
        "#create-member-send",
        "/member/create",
        "POST",
        "#create-member-api"
    );
    register_operation(
        "update-member-request-view",
        "update-member-response-view",
        "#update-member-send",
        "/member/update",
        "POST",
        "#update-member-api"
    );
    register_operation(
        "delete-member-request-view",
        "delete-member-response-view",
        "#delete-member-send",
        "/member/delete",
        "POST",
        "#delete-member-api"
    );
    load_ids([
        "#update-event-api select[name=id]",
        "#delete-event-api select[name=id]",
        "#refer-event-api select[name=id]",
        "#create-member-api select[name=id]",
        "#update-member-api select[name=id]",
        "#delete-member-api select[name=id]"
    ]);
    register_select_operation("#update-event-api");
    register_select_operation("#delete-event-api");
    //register_reload_event("#update-event-reload", "#update-event-api");

    gReloadButtonMap["#update-event-api"] = new ReloadButton("#update-event-api", "#update-event-reload", "event");
    gEventTableMap["#update-event-api"] = new EventTable("#update-event-api")

    gReloadButtonMap["#delete-event-api"] = new ReloadButton("#delete-event-api", "#delete-event-reload", "event");
    gEventTableMap["#delete-event-api"] = new EventTable("#delete-event-api");

    gReloadButtonMap["create-member-api"] = new ReloadButton("#create-member-api", "#create-member-reload", "member");
    gMemberTableMap["#create-member-api"] = new MemberTable("#create-member-api");
    register_select_operation2("#update-member-api");

});
