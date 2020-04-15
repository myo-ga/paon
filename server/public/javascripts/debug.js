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


var kCreateEventAPI = "#create-event-api";
var kUpdateEventAPI = "#update-event-api";
var kDeleteEventAPI = "#delete-event-api";
var kReferEventAPI  = "#refer-event-api";

var kCreateMemberAPI = "#create-member-api";
var kUpdateMemberAPI = "#update-member-api";
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
            let jq_element = $(this.api_id_).find("*[name=" + key + "]");
            jq_element.val(event[key]);
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
        let tr_list = $(this.api_id_ + " tr");
        for (let tr of tr_list) {
            let text = $(tr).find("td:first").html();
            if (text.startsWith("day")) {
                tr.remove();
            }
        }
    }
    // 候補日項目追加
    addDayN(eventDays) {
        for (let day_n in eventDays) {
            let jq_tr = $("<tr>");
            jq_tr.append($("<td>").html(day_n));
            jq_tr.append($("<td>").html("候補日"));
            jq_tr.append($("<td>").html("OK|UnKnown|NG|None"));
            let jq_input = $("<input>").prop("name", day_n).prop("type", "text");
            jq_tr.append($("<td>").append(jq_input));
            $(this.api_id_ + " table").append(jq_tr);
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

        let member_memberId_select = gMemberMemberIdSelectMap[this.api_id_];
        let memberId = member_memberId_select.val();
        if (memberId === null) return;  

        let member = event.eventMembers[memberId];
        let memberDays = member.memberDays;
        $(this.api_id_).find("input[name=memberName]").val(member.memberName);
        $(this.api_id_).find("input[name=memberComment]").val(member.memberComment);
        for (let day_n in memberDays) {
            $(this.api_id_).find("input[name=" + day_n + "]").val(memberDays[day_n]);
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
        let input_list = $(this.api_id_).find("input[type=text]");
        for (let input of input_list) {
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
    doneProcess(json) {
        let event_response_json_view = gEventResponseJsonViewMap[this.api_id_];
        event_response_json_view.remove();
        event_response_json_view.add(json);
        
        switch (this.api_id_) {
            case kCreateEventAPI:
                gEventEventIdSelectMap[kUpdateEventAPI].addOption(json.id);
                gEventEventIdSelectMap[kDeleteEventAPI].addOption(json.id);
                gEventEventIdSelectMap[kReferEventAPI].addOption(json.id);
                gMemberEventIdSelectMap[kCreateMemberAPI].addOption(json.id);
                gMemberEventIdSelectMap[kUpdateMemberAPI].addOption(json.id);
                gMemberEventIdSelectMap[kDeleteMemberAPI].addOption(json.id);
                break;

            case kDeleteEventAPI:
                gEventEventIdSelectMap[kUpdateEventAPI].removeOption(json.id);
                gEventEventIdSelectMap[kDeleteEventAPI].removeOption(json.id);
                gEventEventIdSelectMap[kReferEventAPI].removeOption(json.id);
                gMemberEventIdSelectMap[kCreateMemberAPI].removeOption(json.id);
                gMemberEventIdSelectMap[kUpdateMemberAPI].removeOption(json.id);
                gMemberEventIdSelectMap[kDeleteMemberAPI].removeOption(json.id);
                break;
        }


    }
    // リクエスト失敗
    errorProcess(json) {
        this.doneProcess(json);
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
        let input_list = $(this.api_id_).find("input[type=text]");
        for (let input of input_list) {
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
        let member_memberId_select = gMemberMemberIdSelectMap[this.api_id_];
        if (member_memberId_select !== void 0) {
            member_memberId_select.updateMemberId(json);
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
    constructor(api_id, change_opt=true) {
        this.api_id_ = api_id;
        this.jq_select_ = $(this.api_id_).find("select[name=id]");
        if (change_opt === true) {
            this.jq_select_.change(()=>{
                this.fetchEvent();
            });
        }
    }
    // リクエスト発行
    fetchEvent() {
        this.inactive();
        let event_id = this.jq_select_.val();
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
        this.jq_select_.prop("disabled", false);
    }
    // 無効化
    inactive() {
        this.jq_select_.prop("disabled", true);
    }
    // オプション追加
    addOption(value) {
        let jq_option = $("<option>").val(value).html(value);
        this.jq_select_.append(jq_option);
    }
    // オプション削除
    removeOption(value) {
        for (let option of this.jq_select_.children()) {
            if (option.value === value) {
                option.remove();
                break;
            }
        }
    }
}


// イベントのイベントIDセレクト
class EventEventIdSelect extends EventIdSelect {
    constructor(api_id, change_opt=true) {
        super(api_id, change_opt);
    }
    // リクエスト成功、イベントの項目の更新
    doneProcess(event) {
        for (let key in event) {
            let jq_element = $(this.api_id_).find("*[name=" + key+ "]");
            jq_element.val(event[key]);
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
        this.jq_select_ = $(this.api_id_).find("select[name=memberId]");
        this.jq_select_.change(()=>{
            if (this.api_id_ === kDeleteMemberAPI) return;
            gMemberTableMap[this.api_id_].updateMemberField(gEvent[this.api_id_]); // TODO: gEventの代入を精査
        });
    }
    // メンバーIDの更新
    updateMemberId(event) {
        this.jq_select_.children().remove();
        for (let member_n in event["eventMembers"]) {
            let jqOption = $("<option>").html(member_n).val(member_n);
            this.jq_select_.append(jqOption);
        }
    }
    // メンバーIDの取得
    val() {
        return this.jq_select_.val();
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
        let member_table = gMemberTableMap[this.api_id_];
        if (this.api_id_ !== kDeleteMemberAPI) {
            member_table.updateDayN(json);
        }
        let member_memberId_select = gMemberMemberIdSelectMap[this.api_id_];
        if (member_memberId_select !== void 0) {
            // memberIdの選択リスト更新
            member_memberId_select.updateMemberId(json);
            // メンバーの表示項目の更新
            member_table.updateMemberField(json);
        }
    }
}


$(()=>{
 
    // イベント参照
    gEventRequestJsonViewMap[kReferEventAPI] = 
        new JsonView(kReferEventAPI, "#refer-event-request-view", 0);
    gEventResponseJsonViewMap[kReferEventAPI] =
        new JsonView(kReferEventAPI, "#refer-event-response-view", Infinity);
    gEventSendButtonMap[kReferEventAPI] = 
        new EventSendButton(kReferEventAPI, "#refer-event-send", "/event/get", "GET");
    gEventEventIdSelectMap[kReferEventAPI] = new EventEventIdSelect(kReferEventAPI, false);

    // イベント作成
    gEventRequestJsonViewMap[kCreateEventAPI] = 
        new JsonView(kCreateEventAPI, "#create-event-request-view", 0);
    gEventResponseJsonViewMap[kCreateEventAPI] =
        new JsonView(kCreateEventAPI, "#create-event-response-view", Infinity);
    gEventSendButtonMap[kCreateEventAPI] = 
        new EventSendButton(kCreateEventAPI, "#create-event-send", "/event/create", "POST");

    // イベント更新
    gEventRequestJsonViewMap[kUpdateEventAPI] = 
        new JsonView(kUpdateEventAPI, "#update-event-request-view", 0);
    gEventResponseJsonViewMap[kUpdateEventAPI] =
        new JsonView(kUpdateEventAPI, "#update-event-response-view", Infinity);
    gEventSendButtonMap[kUpdateEventAPI] = 
        new EventSendButton(kUpdateEventAPI, "#update-event-send", "/event/update", "POST");
    gEventReloadButtonMap[kUpdateEventAPI] = 
        new EventReloadButton(kUpdateEventAPI, "#update-event-reload");
    gEventTableMap[kUpdateEventAPI] = new EventTable(kUpdateEventAPI)
    gEventEventIdSelectMap[kUpdateEventAPI] = new EventEventIdSelect(kUpdateEventAPI);

    // イベント削除
    gEventRequestJsonViewMap[kDeleteEventAPI] = 
        new JsonView(kDeleteEventAPI, "#delete-event-request-view", 0);
    gEventResponseJsonViewMap[kDeleteEventAPI] =
        new JsonView(kDeleteEventAPI, "#delete-event-response-view", Infinity);
    gEventSendButtonMap[kDeleteEventAPI] = 
        new EventSendButton(kDeleteEventAPI, "#delete-event-send", "/event/delete", "POST");
    gEventReloadButtonMap[kDeleteEventAPI] = new EventReloadButton(kDeleteEventAPI, "#delete-event-reload");
    gEventTableMap[kDeleteEventAPI] = new EventTable(kDeleteEventAPI);
    gEventEventIdSelectMap[kDeleteEventAPI] = new EventEventIdSelect(kDeleteEventAPI);

    // メンバー作成
    gMemberRequestJsonViewMap[kCreateMemberAPI] = 
        new JsonView(kCreateMemberAPI, "#create-member-request-view", 0);
    gMemberResponseJsonViewMap[kCreateMemberAPI] =
        new JsonView(kCreateMemberAPI, "#create-member-response-view", Infinity);
    gMemberSendButtonMap[kCreateMemberAPI] = 
        new MemberSendButton(kCreateMemberAPI, "#create-member-send", "/member/create", "POST");
    gMemberReloadButtonMap[kCreateMemberAPI] = new MemberReloadButton(kCreateMemberAPI, "#create-member-reload");
    gMemberTableMap[kCreateMemberAPI] = new MemberTable(kCreateMemberAPI);
    gMemberEventIdSelectMap[kCreateMemberAPI] = new MemberEventIdSelect(kCreateMemberAPI);

    // メンバー更新
    gMemberRequestJsonViewMap[kUpdateMemberAPI] = 
        new JsonView(kUpdateMemberAPI, "#update-member-request-view", 0);
    gMemberResponseJsonViewMap[kUpdateMemberAPI] =
        new JsonView(kUpdateMemberAPI, "#update-member-response-view", Infinity);
    gMemberSendButtonMap[kUpdateMemberAPI] = 
        new MemberSendButton(kUpdateMemberAPI, "#update-member-send", "/member/update", "POST");
    gMemberEventIdSelectMap[kUpdateMemberAPI] = new MemberEventIdSelect(kUpdateMemberAPI);
    gMemberMemberIdSelectMap[kUpdateMemberAPI] = new MemberMemberIdSelect(kUpdateMemberAPI);
    gMemberReloadButtonMap[kUpdateMemberAPI] = new MemberReloadButton(kUpdateMemberAPI, "#update-member-reload");
    gMemberTableMap[kUpdateMemberAPI] = new MemberTable(kUpdateMemberAPI);

    // メンバー削除
    gMemberRequestJsonViewMap[kDeleteMemberAPI] = 
        new JsonView(kDeleteMemberAPI, "#delete-member-request-view", 0);
    gMemberResponseJsonViewMap[kDeleteMemberAPI] =
        new JsonView(kDeleteMemberAPI, "#delete-member-response-view", Infinity);
    gMemberSendButtonMap[kDeleteMemberAPI] = 
        new MemberSendButton(kDeleteMemberAPI, "#delete-member-send", "/member/delete", "POST");
    gMemberEventIdSelectMap[kDeleteMemberAPI] = new MemberEventIdSelect(kDeleteMemberAPI);
    gMemberReloadButtonMap[kDeleteMemberAPI] = new MemberReloadButton(kDeleteMemberAPI, "#delete-member-reload");
    gMemberMemberIdSelectMap[kDeleteMemberAPI] = new MemberMemberIdSelect(kDeleteMemberAPI);    
    gMemberTableMap[kDeleteMemberAPI] = new MemberTable(kDeleteMemberAPI);   

});
