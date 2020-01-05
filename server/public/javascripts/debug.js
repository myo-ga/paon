var create_event_view = null;
var create_event_button = null;

var update_event_view = null;
var update_event_button = null;

var refer_event_view = null;
var refer_event_button = null;

var delete_event_view = null;
var delete_event_button = null;

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
        .fail((data) => {
            this.update_response_node(data);
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


function get_form_data(id) {
    let input_tag_list = $(id).find("input[type=text]");
    let ret = {};
    for (let input_tag of input_tag_list) {
        ret[input_tag.name] = input_tag.value;
    }
    return ret;
}


function register_create_event() {
    create_event_view = new TreeView(
        document.getElementById("create-event-request-view"),
        document.getElementById("create-event-response-view")
    );
    create_event_view.append_request_node({});
    create_event_view.append_response_node({});

    create_event_button = new EventButton(
        "#create-event-send",
        create_event_view,
        "/event/create",
        "POST",
        ()=>{return get_form_data("#create-event-api");},
    );
}


function register_update_event() {
    update_event_view = new TreeView(
        document.getElementById("update-event-request-view"),
        document.getElementById("update-event-response-view")
    );
    update_event_view.append_request_node({});
    update_event_view.append_response_node({});

    update_event_button = new EventButton(
        "#update-event-send",
        update_event_view,
        "/event/update",
        "POST",
        ()=>{return get_form_data("#update-event-api");},
    );
}

function register_refer_event() {
    refer_event_view = new TreeView(
        document.getElementById("refer-event-request-view"),
        document.getElementById("refer-event-response-view")
    );
    refer_event_view.append_request_node({});
    refer_event_view.append_response_node({});

    refer_event_button = new EventButton(
        "#refer-event-send",
        refer_event_view,
        "/event/get",
        "GET",
        ()=>{return get_form_data("#refer-event-api");},
    );
}

function register_delete_event() {
    delete_event_view = new TreeView(
        document.getElementById("delete-event-request-view"),
        document.getElementById("delete-event-response-view")
    );
    delete_event_view.append_request_node({});
    delete_event_view.append_response_node({});

    delete_event_button = new EventButton(
        "#delete-event-send",
        delete_event_view,
        "/event/delete",
        "POST",
        ()=>{return get_form_data("#delete-event-api");},
    );
}


$(()=>{
    register_create_event();
    register_update_event();
    register_refer_event();
    register_delete_event();
});
