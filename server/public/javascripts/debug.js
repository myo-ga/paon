
var gEvent = {};

var gEventTableMap = {};
var gEventSendButtonMap = {};
var gEventReloadButtonMap = {};
var gEventEventIdSelectMap = {};
var gEventRequestJsonViewMap = {};
var gEventResponseJsonViewMap = {};

var gMemberTableMap = {};
var gMemberSendButtonMap = {};
var gMemberReloadButtonMap = {};
var gMemberEventIdSelectMap = {};
var gMemberMemberIdSelectMap = {};
var gMemberRequestJsonViewMap = {};
var gMemberResponseJsonViewMap = {};

var kDeleteMemberAPI = "#delete-member-api";


// ツリー表示
class JsonView {
    constructor(api_id, view_id, depth) {
        this.api_id_ = api_id;
        this.view_id_ = view_id;
        this.depth_ = depth;
        this.add({});
    }
    // ツリー削除
    remove() {
        $(this.view_id_).children().remove();
    }
    // ツリー追加
    add(json) {
        let formatter = new JSONFormatter.default(json, 1, {theme: 'dark'});
        let json_element = formatter.render();
        formatter.openAtDepth(this.depth_);
        $(this.view_id_).append($(json_element));
    }
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
}


// メンバーの表示フィールド
class MemberTable {
    constructor(api_id) {
        this.api_id_ = api_id;
    }
    // 候補日項目削除
    removeDayN() {
        let trList = $(this.api_id_ + " tr");
        for (let tr of trList) {
            let text = $(tr).find("td:first").html();
            if (text.startsWith("day")) {
                tr.remove();
            }
        }
    }
    // 候補日項目追加
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
    // 候補日項目更新
    updateDayN(event) {
        this.removeDayN();
        this.addDayN(event.eventDays);
    }
    // メンバーのフィールド入力
    updateMemberField(event) {
        $(this.api_id_).find("input[type=text]").val("");

        let memberMemberIdSelect = gMemberMemberIdSelectMap[this.api_id_];
        let memberId = memberMemberIdSelect.val();
        if (memberId === null) return;  

        let member = event.eventMembers[memberId];
        let memberDays = member.memberDays;
        $(this.api_id_).find("input[name=memberName]").val(member.memberName);
        $(this.api_id_).find("input[name=memberComment]").val(member.memberComment);
        for (let dayN in memberDays) {
            $(this.api_id_).find("input[name=" + dayN + "]").val(memberDays[dayN]);
        }
    }
    
}


// 送信ボタン
class SendButton {
    constructor(api_id, button_id, url, type) {
        this.api_id_ = api_id;
        this.button_id_ = button_id;
        this.url_ = url;
        this.type_ = type;
        $(this.button_id_).click(()=>{
            this.requestAPI();
        });
    }
    // 抽象メソッド、項目の値取得
    getField() {
        throw new Error("Not Implemented.");
    }
    // リクエストを発行する
    requestAPI() {
        this.inactive();
        $.ajax({
            url: this.url_,
            type: this.type_,
            context: this,
            data: this.getField(),
            beforeSend: (xhr, settings) => {
                this.beforeProcess(settings);
            }

        })
        .done((data, textStatus, jqXHR) => {
            this.doneProcess(data)
            this.active();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            this.errorProcess(JSON.parse(jqXHR.responseText));
            this.active();
        });
    }
    // 抽象メソッド、リクエスト前処理
    beforeProcess() {
        throw new Error("Not Implemented.");
    }
    // 抽象メソッド、リクエスト成功
    doneProcess(json) {
        throw new Error("Not Implemented.");
    }
    // 抽象メソッド、リクエスト失敗
    errorProcess(json) {
        throw new Error("Not Implemented.");
    }
    // ボタン有効化
    active() {
        $(this.button_id_).prop("disabled", false);
    }
    // ボタン無効化
    inactive() {
        $(this.button_id_).prop("disabled", true);
    }
}


// イベントの送信ボタン
class EventSendButton extends SendButton {
    constructor(api_id, button_id, url, type) {
        super(api_id, button_id, url, type);
    }
    // 項目の値取得
    getField() {
        let ret = {};
        let inputList = $(this.api_id_).find("input[type=text]");
        for (let input of inputList) {
            ret[input.name] = input.value;
        }
        let event_id =  $(this.api_id_).find("select[name=id]").val();
        if (event_id !== void 0) {
            ret["id"] = event_id;
        }
        return ret;
    }
    // リクエスト前処理
    beforeProcess(event_request) {
        let event_request_json_view = gEventRequestJsonViewMap[this.api_id_];
        event_request_json_view.remove();
        event_request_json_view.add(event_request);
    }
    // リクエスト成功
    doneProcess(event) {
        let event_response_json_view = gEventResponseJsonViewMap[this.api_id_];
        event_response_json_view.remove();
        event_response_json_view.add(event);
    }
    // リクエスト失敗
    errorProcess(event) {
        this.doneProcess(event);
    }
}


// メンバーの送信ボタン
class MemberSendButton extends SendButton {
    constructor(api_id, button_id, url, type) {
        super(api_id, button_id, url, type);
    }
    // 項目の取得
    getField() {
        let ret = {};
        let inputList = $(this.api_id_).find("input[type=text]");
        for (let input of inputList) {
            ret[input.name] = input.value;
        }
        let event_id =  $(this.api_id_).find("select[name=id]").val();
        ret["id"] = event_id;
        let member_id = $(this.api_id_).find("select[name=memberId]").val();
        if (member_id !== void 0) {
            ret["memberId"] = member_id;
        }
        return ret;
    }
    // 送信前処理
    beforeProcess(member_request) {
        let member_request_json_view = gMemberRequestJsonViewMap[this.api_id_];
        member_request_json_view.remove();
        member_request_json_view.add(member_request);
    }
    // リクエスト成功
    doneProcess(event) {
        let member_response_json_view = gMemberResponseJsonViewMap[this.api_id_];
        member_response_json_view.remove();
        member_response_json_view.add(event);
    }
    // リクエスト失敗
    errorProcess(event) {
        this.doneProcess(event);
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
            this.doneProcess(data);
            this.active();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            this.errorProcess(JSON.parse(jqXHR.responseText));
            this.active();
        });
    }
    // 抽象メソッド、リクエスト成功
    doneProcess(json) {
        throw new Error("Not Implemented.");
    }
    // 抽象メソッド、リクエスト失敗
    errorProcess(json) {
        throw new Error("Not Implemented.");
    }
    // 有効化
    active() {
        $(this.button_id_).prop("disabled", false);
    }
    // 無効化
    inactive() {
        $(this.button_id_).prop("disabled", true);
    }
}


// イベントの更新ボタン
class EventReloadButton extends ReloadButton {
    constructor(api_id, button_id) {
        super(api_id, button_id);
    }
    // リクエスト成功、イベントの項目更新
    doneProcess(json) {
        gEventTableMap[this.api_id_].fillField(json);
    }
    // リクエスト失敗、ポップアップ
    errorProcess(json) {
        alert("Request Fail.");
    }
}


// メンバーの更新ボタン
class MemberReloadButton extends ReloadButton {
    constructor(api_id, button_id) {
        super(api_id, button_id);
    }
    // リクエスト成功、メンバー項目の更新
    doneProcess(json) {
        gEvent[this.api_id_] = json;
        // dayNの更新
        let member_table = gMemberTableMap[this.api_id_];
        if (this.api_id_ !== kDeleteMemberAPI) {
            member_table.updateDayN(json);
        }
        // memberIdの選択リスト更新
        let memberMemberIdSelect = gMemberMemberIdSelectMap[this.api_id_];
        if (memberMemberIdSelect !== void 0) {
            memberMemberIdSelect.updateMemberId(json);
            member_table.updateMemberField(json);
        }
    }
    // リクエスト失敗、ポップアップ
    errorProcess(json) {
        alert("Request Fail.");
    }
}


// イベントIDのセレクト
class EventIdSelect {
    constructor(api_id) {
        this.api_id_ = api_id;
        this.jqSelect_ = $(this.api_id_).find("select[name=id]");
        this.jqSelect_.change(()=>{
            this.fetchEvent();
        });
    }
    // リクエスト発行
    fetchEvent() {
        this.inactive();
        let event_id = this.jqSelect_.val();
        $.ajax({
            url: "/event/get",
            type: "GET",
            context: this,
            data: {id: event_id}
        })
        .done((data, textStatus, jqXHR) => {
            this.doneProcess(data)
            this.active();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            this.errorProcess(JSON.parse(jqXHR.responseText));
            this.active();
        });
    }
    // 抽象メソッド、リクエスト成功
    doneProcess(json) {
        throw new Error("Not Implemented.");
    }
    // 抽象メソッド、リクエスト失敗
    errorProcess(json) {
        throw new Error("Not Implemented.");
    }
    // 有効化
    active() {
        this.jqSelect_.prop("disabled", false);
    }
    // 無効化
    inactive() {
        this.jqSelect_.prop("disabled", true);
    }
}


// イベントのイベントIDセレクト
class EventEventIdSelect extends EventIdSelect {
    constructor(api_id) {
        super(api_id);
    }
    // リクエスト成功、イベントの項目の更新
    doneProcess(event) {
        for (let key in event) {
            let jqElement = $(this.api_id_).find("*[name=" + key+ "]");
            jqElement.val(event[key]);
        }
    }
    // リクエスト失敗、アラートの表示
    errorProcess(json) {
        alert("Request Fail.");
    }
}


// メンバーIDセレクト
class MemberMemberIdSelect {
    constructor(api_id) {
        // メンバー更新のメンバーIDの選択
        this.api_id_ = api_id;
        this.jqSelect_ = $(this.api_id_).find("select[name=memberId]");
        this.jqSelect_.change(()=>{
            if (this.api_id_ === kDeleteMemberAPI) return;
            gMemberTableMap[this.api_id_].updateMemberField(gEvent[this.api_id_]); // TODO: gEventの代入を精査
        });
    }
    // メンバーIDの更新
    updateMemberId(event) {
        this.jqSelect_.children().remove();
        for (let memberN in event["eventMembers"]) {
            let jqOption = $("<option>").html(memberN).val(memberN);
            this.jqSelect_.append(jqOption);
        }
    }
    // メンバーIDの取得
    val() {
        return this.jqSelect_.val();
    }
}


// メンバーのイベントIDセレクト
class MemberEventIdSelect extends EventIdSelect {
    constructor(api_id) {
        super(api_id);
    }
    // リクエスト成功、メンバーの表示項目の更新
    doneProcess(json) {
        gEvent[this.api_id_] = json;
        // メンバーの表示のdayNの項目数更新
        let memberTable = gMemberTableMap[this.api_id_];
        if (this.api_id_ !== kDeleteMemberAPI) {
            memberTable.updateDayN(json);
        }
        let memberMemberIdSelect = gMemberMemberIdSelectMap[this.api_id_];
        if (memberMemberIdSelect !== void 0) {
            // memberIdの選択リスト更新
            memberMemberIdSelect.updateMemberId(json);
            // メンバーの表示項目の更新
            memberTable.updateMemberField(json);
        }
    }
}


$(()=>{
 
    // イベント参照
    gEventRequestJsonViewMap["#refer-event-api"] = 
        new JsonView("#refer-event-api", "#refer-event-request-view", 0);
    gEventResponseJsonViewMap["#refer-event-api"] =
        new JsonView("#refer-event-api", "#refer-event-response-view", Infinity);
    gEventSendButtonMap["#refer-event-api"] = 
        new EventSendButton("#refer-event-api", "#refer-event-send", "/event/get", "GET");

    // イベント作成
    gEventRequestJsonViewMap["#create-event-api"] = 
        new JsonView("#create-event-api", "#create-event-request-view", 0);
    gEventResponseJsonViewMap["#create-event-api"] =
        new JsonView("#create-event-api", "#create-event-response-view", Infinity);
    gEventSendButtonMap["#create-event-api"] = 
        new EventSendButton("#create-event-api", "#create-event-send", "/event/create", "POST");

    // イベント更新
    gEventRequestJsonViewMap["#update-event-api"] = 
        new JsonView("#update-event-api", "#update-event-request-view", 0);
    gEventResponseJsonViewMap["#update-event-api"] =
        new JsonView("#update-event-api", "#update-event-response-view", Infinity);
    gEventSendButtonMap["#update-event-api"] = 
        new EventSendButton("#update-event-api", "#update-event-send", "/event/update", "POST");
    gEventReloadButtonMap["#update-event-api"] = 
        new EventReloadButton("#update-event-api", "#update-event-reload");
    gEventTableMap["#update-event-api"] = new EventTable("#update-event-api")
    gEventEventIdSelectMap["#update-event-api"] = new EventEventIdSelect("#update-event-api");

    // イベント削除
    gEventRequestJsonViewMap["#delete-event-api"] = 
        new JsonView("#delete-event-api", "#delete-event-request-view", 0);
    gEventResponseJsonViewMap["#delete-event-api"] =
        new JsonView("#delete-event-api", "#delete-event-response-view", Infinity);
    gEventSendButtonMap["#delete-event-api"] = 
        new EventSendButton("#delete-event-api", "#delete-event-send", "/event/delete", "POST");
    gEventReloadButtonMap["#delete-event-api"] = new EventReloadButton("#delete-event-api", "#delete-event-reload");
    gEventTableMap["#delete-event-api"] = new EventTable("#delete-event-api");
    gEventEventIdSelectMap["#delete-event-api"] = new EventEventIdSelect("#delete-event-api");

    // メンバー作成
    gMemberRequestJsonViewMap["#create-member-api"] = 
        new JsonView("#create-member-api", "#create-member-request-view", 0);
    gMemberResponseJsonViewMap["#create-member-api"] =
        new JsonView("#create-member-api", "#create-member-response-view", Infinity);
    gMemberSendButtonMap["#create-member-api"] = 
        new MemberSendButton("#create-member-api", "#create-member-send", "/member/create", "POST");
    gMemberReloadButtonMap["#create-member-api"] = new MemberReloadButton("#create-member-api", "#create-member-reload");
    gMemberTableMap["#create-member-api"] = new MemberTable("#create-member-api");
    gMemberEventIdSelectMap["#create-member-api"] = new MemberEventIdSelect("#create-member-api");

    // メンバー更新
    gMemberRequestJsonViewMap["#update-member-api"] = 
        new JsonView("#update-member-api", "#update-member-request-view", 0);
    gMemberResponseJsonViewMap["#update-member-api"] =
        new JsonView("#update-member-api", "#update-member-response-view", Infinity);
    gMemberSendButtonMap["#update-member-api"] = 
        new MemberSendButton("#update-member-api", "#update-member-send", "/member/update", "POST");
    gMemberEventIdSelectMap["#update-member-api"] = new MemberEventIdSelect("#update-member-api");
    gMemberMemberIdSelectMap["#update-member-api"] = new MemberMemberIdSelect("#update-member-api");
    gMemberReloadButtonMap["#update-member-api"] = new MemberReloadButton("#update-member-api", "#update-member-reload");
    gMemberTableMap["#update-member-api"] = new MemberTable("#update-member-api");

    // メンバー削除
    gMemberRequestJsonViewMap["#delete-member-api"] = 
        new JsonView("#delete-member-api", "#delete-member-request-view", 0);
    gMemberResponseJsonViewMap["#delete-member-api"] =
        new JsonView("#delete-member-api", "#delete-member-response-view", Infinity);
    gMemberSendButtonMap["#delete-member-api"] = 
        new MemberSendButton("#delete-member-api", "#delete-member-send", "/member/delete", "POST");
    gMemberEventIdSelectMap["#delete-member-api"] = new MemberEventIdSelect("#delete-member-api");
    gMemberReloadButtonMap["#delete-member-api"] = new MemberReloadButton("#delete-member-api", "#delete-member-reload");
    gMemberMemberIdSelectMap["#delete-member-api"] = new MemberMemberIdSelect("#delete-member-api");    
    gMemberTableMap["#delete-member-api"] = new MemberTable("#delete-member-api");   

});
