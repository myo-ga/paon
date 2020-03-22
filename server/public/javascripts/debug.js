
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

});
