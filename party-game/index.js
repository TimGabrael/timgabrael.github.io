let DPR = window.devicePixelRatio || 1;
let users = [];
let pending_users = [];
let local_client = {
    "conn": null,
    "name": "",
    "secret": "",
    "color": "#000000",
    "id": "",
    "is_host": false,
    "team_id": -1,
};
let available_percentages = []


let game_data = {};
let team_index_info = [];
let host_typer_idx = [];
let used_song_list = [];
let cur_team_index = -1;
let is_hitster = false;
let hitster_idx = 0;

let peer = null;
let card_list = null;
let team_list = null;
let canvas_class = null;

let is_connected = false;


let main_area = document.getElementById('main');


const user_style_elem = document.createElement('style');
document.head.appendChild(user_style_elem);

function resetLocalClient() {
    local_client = {
        "conn": null,
        "name": "",
        "secret": "",
        "color": "#000000",
        "id": "",
        "is_host": false,
        "team_id": -1,
    };
    users = [];
    pending_users = [];
    loadLocallyRelevant();
}
function randomString(len) {
    // some letters are intentionally missing like I,l,0,O,1 cause they are easy to confuse
    let _c = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let output = "";
    for(let i = 0; i < len; i++) {
        let idx = Math.floor(Math.random() * _c.length);
        output += _c[idx];
    }
    return output;
}
function resetAvailablePercentages() {
    available_percentages = []
    for(let i = 0; i < 101; i++) {
        available_percentages.push(i);
    }
}
function resetSongList() {
    used_song_list = [];
}
function getRandomHitsterSong() {
    let is_unique = false;
    let idx = -1;
    let SONG_DATA = HITSTER_GERMANY;
    if(hitster_idx == 1) {
        SONG_DATA = HITSTER_GERMANY_ROCK;
    }
    else if(hitster_idx == 2) {
        SONG_DATA = HITSTER_GERMANY_CHRISTMAS;
    }
    else if(hitster_idx == 3) {
        SONG_DATA = HITSTER_GERMANY_GUILTY_PLEASURE;
    }

    while(!is_unique && used_song_list.length < SONG_DATA.length) {
        is_unique = true;
        idx = Math.floor(Math.random() * SONG_DATA.length);
        for(let i = 0; i < used_song_list.length; i++) {
            if(idx == used_song_list[i]) {
                is_unique = false;
                break;
            }
        }
        if(is_unique) {
            break;
        }
    }
    if(idx >= 0) {
        used_song_list.push(idx);
        return SONG_DATA[idx];
    }
    return {'title': 'invalid', 'year': '0', 'artist': "invalid", 'url': ""};
}
function getRandomPercentage() {
    if(available_percentages.length == 0) {
        return -1;
    }
    let idx = Math.floor(Math.random() * available_percentages.length);
    let av = available_percentages[idx];
    available_percentages.splice(idx, 1);
    return av;
}


function isValidClient() {
    if(local_client.is_host || !is_connected || !local_client.conn) {
        return false;
    }
    return true;
}
function isInTurn(team_id) {
    if(game_data.cur_team_id == team_id) {
        return true;
    }
    return false;
}

function clientCanInsert(client) {
    let type_state = (isInTurn(client.team_id) && game_data.state === 'type' && ((game_data.cur_id == client.id) || !game_data.typing));
    let insert_state = (isInTurn(client.team_id) && game_data.state === 'insert' && game_data.cur_id != client.id && game_data.typing);
    if(type_state || insert_state) {
        return true;
    }
    return false;
}
function clientCanAddPoint(client) {
    if(game_data.type === 'grid') {
        if(cur_team_index >= 0 && cur_team_index < team_index_info.length &&
            client.id == game_data.cur_id) {
            return true;
        }
    }
    return false;
}
function clientCanMoveCards(client) {
    if(!isInTurn(client.team_id) || (game_data.cur_id == client.id && game_data.state == 'insert')) {
        return false;
    }
    return true;
}
function localCanInsert() {
    return clientCanInsert(local_client);
}
function localIsTyper() {
    if(game_data.cur_id == local_client.id && game_data.state == 'type' && game_data.typing) {
        return true;
    }
    return false;
}
function clientCanGoNext(client) {
    let is_typer = (game_data.cur_id == client.id && game_data.state == 'type');
    if((game_data.typing && is_typer) || (!game_data.typing && isInTurn(client.team_id))) {
        return true;
    }
    return false;
}
function clientSendInfo() {
    if(!isValidClient()) {
       return;
    }
    let info = {
        'name': local_client.name,
        'team_id': local_client.team_id,
        'color': local_client.color,
    };
    local_client.conn.send({'type': 'info', 'data': info});
}
function clientSendMove(idx1, idx2) {
    if(!isValidClient()) {
        return;
    }
    let info = {
        'i1': idx1,
        'i2': idx2,
    };
    local_client.conn.send({'type': 'move', 'data': info});
}
function clientSendAddEdit(text, idx) {
    if(!isValidClient()) {
        return;
    }
    let info = {
        'text': text,
        'i': idx,
    };
    local_client.conn.send({'type': 'add', 'data': info});
}
function clientSendRemove(idx) {
    if(!isValidClient()) {
        return;
    }
    let info = {
        'i': idx,
    };
    local_client.conn.send({'type': 'remove', 'data': info});
}
function clientSendNext() {
    if(!isValidClient()) {
        return;
    }
    local_client.conn.send({'type': 'next'});
}
function clientSendReveal(idx) {
    if(!isValidClient()) {
        return;
    }
    let info = {
        'i': idx,
    };
    local_client.conn.send({'type': 'reveal', 'data': info});
}
function clientSendPlay(bHitster, hitster_idx) {
    if(!isValidClient()) {
        return;
    }
    let info = {
        'is_hitster': bHitster,
        'idx': hitster_idx
    };
    local_client.conn.send({'type': 'play', 'data': info});
}
function clientSendGridAddPoint(x, y, txt) {
    if(!isValidClient()) {
        return;
    }
    if(!txt || txt.length == 0 || x < 0.0 || x > 1.0 || y < 0.0 || y > 1.0) {
        return;
    }
    let point = {
        'x': x,
        'y': y,
        'txt': txt,
    };
    local_client.conn.send({'type': 'add_point', 'data': point});

}
function clientSendGridAnswer(txt, is_x) {
    if(!isValidClient()) {
        return;
    }
    if(!txt || txt.length == 0) {
        return;
    }
    let answer = {
        "txt": txt,
        "is_x": is_x,
    };
    local_client.conn.send({'type': 'xylabel', 'data': answer});
}

function updateUserStyles() {
    while(user_style_elem.sheet.cssRules.length > 0) {
        user_style_elem.sheet.deleteRule(0);
    }
    for(let i = 0; i < users.length; i++) {
        let user = users[i];
        const outline_name = `.outline-${user.id}`;
        const background_name = `.background-${user.id}`;
        const color_name = `.color-${user.id}`;
        const outline_rule = `${outline_name} { border-color: ${user.color}; }`;
        const background_rule = `${background_name} { background-color: ${user.color}; }`;
        const color_rule = `${color_name} { color: ${user.color}; }`;
        user_style_elem.sheet.insertRule(outline_rule);
        user_style_elem.sheet.insertRule(background_rule);
        user_style_elem.sheet.insertRule(color_rule);
    }
    const outline_name = `.outline-invalid`;
    const background_name = `.background-invalid`;
    const color_name = `.color-invalid`;
    const outline_rule = `${outline_name} { border-color: #000000; }`;
    const background_rule = `${background_name} { background-color: #000000; }`;
    const color_rule = `${color_name} { color: #000000; }`;
    user_style_elem.sheet.insertRule(outline_rule);
    user_style_elem.sheet.insertRule(background_rule);
    user_style_elem.sheet.insertRule(color_rule);
}



let cur_left = 0;
const item_padding = 10;
function getChildrenWidth() {
    let total_item_width = 0;
    for(let i = 0; i < card_list.children.length; i++) {
        total_item_width += card_list.children[i].clientWidth + item_padding;
    }
    return total_item_width;
}
function update_list_children() {
    if(!card_list) {
        return;
    }
    if(card_list.children.length == 0) {
        return;
    }
    let element_sz = card_list.children[0].clientWidth + item_padding;

    let min_left = card_list.clientWidth / 2 - element_sz * (card_list.children.length);
    let max_left = card_list.clientWidth / 2;

    let height = card_list.clientHeight;

    cur_left = Math.min(Math.max(cur_left, min_left), max_left);
    let left = cur_left;
    for(let i = 0; i < card_list.children.length; i++) {
        let card = card_list.children[i];
        let style = card.style;
        let child_left = left;
        style.left = child_left + "px";
        left += card.clientWidth + item_padding;
        style.height = height + "px";
        let number_elem = card.getElementsByClassName('number')[0];
        number_elem.textContent = i + 1;
    }
}
function center_list_children() {
    let total_list_width = card_list.clientWidth;
    let total_item_width = getChildrenWidth();
    cur_left = (total_list_width - total_item_width) / 2;
}
let dragging_card_list = false;
let moving_card = false;
function createCardList() {
    if(card_list) {
        dragging_card_list = false;
        moving_card = false;
        main_area.innerHTML = "";
    }
    card_list = document.createElement('div')
    card_list.draggable = false;
    let cur_x = 0;
    card_list.onmouseleave = (e) => {
        dragging_card_list = false;
    }
    card_list.onmousedown = (e) => {
        dragging_card_list = true;
        cur_x = e.screenX;
    }
    card_list.onmouseup = (e) => {
        dragging_card_list = false;
    }
    card_list.onpointerdown  = (e) => {
        dragging_card_list = true;
        cur_x = e.screenX;
    }
    card_list.onpointerup  = (e) => {
        dragging_card_list = false;
    }
    card_list.onmousemove = (e) => {
        if(dragging_card_list && !moving_card) {
            let dx = e.screenX - cur_x;
            cur_x = e.screenX;
            if(dx != 0) {
                cur_left += dx;
                update_list_children();
            }
        }
    }
    card_list.ontouchmove = (e) => {
        if(dragging_card_list && !moving_card) {
            let dx = e.touches[0].screenX - cur_x;
            cur_x = e.touches[0].screenX;
            if(dx != 0) {
                cur_left += dx;
                update_list_children();
            }
        }
    }

    card_list.classList.add('items');
    main_area.appendChild(card_list);
}
function getInbetweenPos(x) {
    if(card_list.children.length == 0) {
        return [0, card_list.clientWidth / 2];
    }
    let item_width = card_list.children[0].clientWidth;
    x -= item_width / 2;
    let left = cur_left;
    let output = cur_left - item_padding / 2;
    if(x < left) {
        return [0, output];
    }
    for(let i = 0; i < card_list.children.length; i++) {
        let new_left = left + card_list.children[i].clientWidth + item_padding;
        output = new_left - item_padding / 2;
        if(left <= x && x < new_left) {
            return [i + 1, output];
        }
        left = new_left;
    }
    return [card_list.children.length, output];
}
function swapCards(idx1, idx2) {
    let e1 = card_list.children[idx1];
    let e2 = card_list.children[idx2];
    const temp = document.createElement('div');
    card_list.replaceChild(temp, e1);
    card_list.replaceChild(e1, e2);
    card_list.replaceChild(e2, temp);

    update_list_children();
}
function addCard(insert_idx=-1, top_content_text="****", bottom_content_text, typed_by_id="invalid", revealed_for_everyone=false) {
    let card = document.createElement('div');
    let top_content = document.createElement('div');
    let top_content_area = document.createElement('div');
    let index_data = document.createElement('div');
    let number_data = document.createElement('div');
    let creator_data = document.createElement('div');
    let move_handle = document.createElement('div');
    let overlay = document.createElement('div');
    let reveal_button = document.createElement('button');
    let move_handle_name = document.createElement('div');

    for(let i = 0; i < users.length; i++) {
        if(users[i].id == typed_by_id) {
            move_handle_name.textContent = users[i].name;
            break;
        }
    }

    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    overlay.style.pointerEvents = "none";
    overlay.style.display = "none";

    reveal_button.textContent = "reveal";

    top_content.textContent = top_content_text;
    let bottom_content = document.createElement('div');
    bottom_content.textContent = bottom_content_text;
    number_data.textContent = card_list.children.length + 1;


    overlay.classList.add('card-overlay');
    top_content_area.classList.add('top-content-area');
    if(revealed_for_everyone) {
        top_content_area.classList.add('revealed');
    }
    top_content.classList.add('top-content');
    bottom_content.classList.add('bottom-content');
    move_handle.classList.add('move-handle');
    number_data.classList.add('number');
    creator_data.classList.add('creator');
    creator_data.classList.add("background-" + typed_by_id);
    move_handle_name.classList.add("move-handle-name");
    index_data.classList.add('index');
    card.classList.add('card');


    top_content_area.appendChild(top_content);
    top_content_area.appendChild(reveal_button);

    //move_handle.appendChild(number);
    move_handle.appendChild(move_handle_name);
    //move_handle.appendChild(creator_data);
    //index_data.appendChild(move_handle);
    index_data.appendChild(number_data);
    index_data.appendChild(move_handle);
    index_data.appendChild(creator_data);


    let delete_moving = false;
    let move_illusion_card = null;
    let start_x = 0;
    let start_y = 0;
    let start_left = 0;
    let start_top = 0;
    let end_fn = (e) => {
        moving_card = false;
        if(delete_moving) {
            let cur_idx = parseInt(number_data.textContent) - 1;
            if(local_client.is_host) {
                hostRemoveCardFromGameState(local_client.team_id, cur_idx);
                hostSendStateInfoToEveryone();
                updateUiFromGameState();
            }
            else {
                clientSendRemove(cur_idx);
            }
            delete_moving = false;
        }
        if(card.classList.contains('invisible')) {
            card.classList.remove('invisible');
        }
        if(move_illusion_card) {
            main_area.removeChild(move_illusion_card);
            move_illusion_card = null;
        }
    };
    let move_fn = (e) => {
        if(!moving_card || !clientCanMoveCards(local_client)) {
            return;
        }
        if(e.clientX == undefined) {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
        if(move_illusion_card) {
            let dx = e.clientX - start_x;
            let dy = e.clientY - start_y;
            move_illusion_card.style.left = (start_left + dx) + "px";
            move_illusion_card.style.top = (start_top + dy) + "px";
        }

        let bound = card_list.getBoundingClientRect();
        let delete_cutoff = bound.top + (bound.bottom - bound.top) * 0.25 + 50;
        delete_moving = delete_cutoff < e.clientY;
        if(delete_moving) {
            if(move_illusion_card) {
                move_illusion_card.getElementsByClassName('card-overlay')[0].style.display = 'block';
            }
        }
        else {
            if(move_illusion_card) {
                move_illusion_card.getElementsByClassName('card-overlay')[0].style.display = 'none';
            }
        }

        let cur_idx = parseInt(number_data.textContent) - 1;
        let inbetween_pos = getInbetweenPos(e.clientX);
        let inbetween_val = inbetween_pos[0];
        if(inbetween_val > cur_idx) {
            inbetween_val = inbetween_val - 1;
        }
        if(inbetween_val == cur_idx ||
            inbetween_val < 0 ||
            inbetween_val >= card_list.children.length) {
            return;
        }

        hostMoveCardInGameState(local_client.team_id, inbetween_val, cur_idx);
        swapCards(inbetween_val, cur_idx);
        if(move_illusion_card) {
            move_illusion_card.getElementsByClassName('number')[0].textContent = inbetween_val + 1;
        }

        if(local_client.is_host) {
            hostSendStateInfoToEveryone();
        }
        else {
            clientSendMove(inbetween_val, cur_idx);
        }
        update_list_children();
    };
    move_handle.onpointerdown = (e) => {
        if(!clientCanMoveCards(local_client)) {
            return;
        }
        moving_card = true;
        if(!move_illusion_card) {
            move_illusion_card = card.cloneNode(true);
            main_area.appendChild(move_illusion_card);
            start_x = e.clientX;
            start_y = e.clientY;
            let client_rect = card.getBoundingClientRect();
            start_left = client_rect.left;
            start_top = client_rect.top;

            move_illusion_card.style.left = start_left + "px";
            move_illusion_card.style.top = start_top + "px";
        }

        card.classList.add('invisible');
        main_area.setPointerCapture(e.pointerId);
        if(e.pointerType == "touch") {
            main_area.ontouchcancel = end_fn;
            main_area.ontouchend = end_fn;
            main_area.ontouchmove = move_fn;
        }
        else {
            main_area.onpointercancel = end_fn;
            main_area.onpointerup = end_fn;
            main_area.onpointermove = move_fn;
        }
    };
    reveal_button.onclick = (e) => {
        if(moving_card || !isInTurn(local_client.team_id)) {
            return;
        }
        let card_idx = parseInt(number_data.textContent) - 1;
        if(local_client.is_host) {
            hostToggleRevealCard(game_data.cur_team_id, card_idx);
            updateUiFromGameState();
            hostSendStateInfoToEveryone();
        }
        else {
            clientSendReveal(card_idx);
        }
    };

   
    card.appendChild(index_data);
    card.appendChild(top_content_area);
    card.appendChild(bottom_content);
    card.appendChild(overlay);
    if(insert_idx < 0 || insert_idx >= card_list.children.length) {
        card_list.appendChild(card)
    }
    else {
        card_list.insertBefore(card, card_list.children[insert_idx])
    }
}
function addEditCard(left_txt, right_txt, card_info_text = "", input_text="", input_disabled=false, team_idx_val) {
    let edit_area = document.createElement('div');
    let card = document.createElement('div');
    let card_info = document.createElement('div');
    let input = document.createElement('input');
    let left_sort_limit = document.createElement('div');
    let right_sort_limit = document.createElement('div');
    let right_space = document.createElement('div');
    let next_button = document.createElement('button');
    let team_text = document.createElement('div');
    let dragging_area = document.createElement('div');

    let player_layout = document.createElement('div');
    player_layout.classList.add('player-layout');
    player_layout.classList.add('invisible');
    player_layout.innerHTML = ` 
        <audio id="player" src=""></audio>
        <button onclick="player.play()">Play</button>
        <button onclick="player.pause()">Pause</button>
        <input type="range" min="0" max="1" step="0.01" value="1" oninput="player.volume = Math.pow(this.value, 2)">
        <input id="timeline" type="range" min="0" max="100" value="0" step="0.1" oninput="player.currentTime = (this.value / 100) * player.duration">
    `;
    const player = player_layout.querySelector("#player");
    const timeline = player_layout.querySelector("#timeline");
    player.addEventListener("timeupdate", () => {
        if(player.duration) {
            timeline.value = (player.currentTime / player.duration) * 100;
        }
    });


    team_text.textContent = "Team #" + team_idx_val;

    next_button.textContent = "next";
    card_info.textContent = card_info_text;
    left_sort_limit.textContent = left_txt;
    right_sort_limit.textContent = right_txt;


    let start_x = 0;
    let start_y = 0;
    let arrow = null;
    let insert_elem = null;
    let insert_idx = -1;
    let move_fn = (e) => {
        if(!localCanInsert()) {
            if(arrow) {
                document.body.removeChild(arrow);
                arrow = null;
            }
            if(insert_elem) {
                document.body.removeChild(insert_elem);
                insert_elem = null;
            }
            insert_idx = -1;
            return;
        }
        if(arrow != null) {
            if(e.clientX == undefined) {
                e.clientX = e.touches[0].clientX;
                e.clientY = e.touches[0].clientY;
            }
            let dx = e.clientX - start_x;
            let dy = e.clientY - start_y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let angle = -Math.atan2(dx, dy) * (180 / Math.PI);
            arrow.style.height = len + "px";
            arrow.style.transform = `rotate(${angle}deg)`;
            let list_t = card_list.getBoundingClientRect().top;
            let list_b = card_list.getBoundingClientRect().bottom;
            if(list_b > e.clientY && list_t < e.clientY) {
                let inbetween_point = getInbetweenPos(e.clientX);
                let inbetween_x = inbetween_point[1];
                insert_idx = inbetween_point[0];
                if(insert_elem) {
                    insert_elem.style.left = (inbetween_x - 2) + "px";
                    insert_elem.style.top = (list_b - 300) + "px";
                }
                else {
                    insert_elem = document.createElement('div');
                    insert_elem.id = "arrow";
                    insert_elem.style.position = "fixed";
                    insert_elem.style.left = (inbetween_x - 2) + "px";
                    insert_elem.style.top = (list_b - 300) + "px";
                    insert_elem.style.width = "4px";
                    insert_elem.style.height = "300px";
                    insert_elem.style.backgroundColor = "red";
                    insert_elem.style.zIndex = "auto";
                    insert_elem.style.pointerEvents = "none";
                    insert_elem.style.transformOrigin = "50% 0%";
                    document.body.appendChild(insert_elem);
                }
            }
            else {
                if(insert_elem) {
                    document.body.removeChild(insert_elem);
                    insert_elem = null;
                }
                insert_idx = -1;
            }
        }
    };
    let end_fn = (e) => {
        main_area.onpointermove = null;
        main_area.onpointerup = null;
        main_area.onpointercancel = null;
        main_area.ontouchmove = null;
        main_area.ontouchend = null;
        main_area.ontouchcancel = null;
        if(arrow) {
            document.body.removeChild(arrow);
            arrow = null;
        }
        if(insert_elem) {
            document.body.removeChild(insert_elem);
            insert_elem = null;
        }
        if(insert_idx != -1 && localCanInsert()) {
            if(local_client.is_host) {
                let cur = game_data.cur_card;
                cur.bottom_text = input.value;
                if(game_data.state == 'insert') {
                    hostAddCardToGameState(cur, local_client.team_id, insert_idx);
                    cur.bottom_text = "";
                    cur.typed_by = "";
                    game_data.state = "type";
                }
                else {
                    if(is_hitster) {
                        hostAddCardToGameState(cur, local_client.team_id, insert_idx);
                        cur.bottom_text = "";
                        cur.typed_by = "";
                    }
                    else {
                        cur.typed_by = local_client.id;
                    }
                    game_data.state = 'insert';
                }
                hostSendStateInfoToEveryone();
                updateUiFromGameState();
            }
            else {
                clientSendAddEdit(input.value, insert_idx);
            }
        }
        insert_idx = -1;
    };
    let start_fn = (e) => {
        if(arrow || !localCanInsert()) {
            return;
        }
        arrow = document.createElement('div');
        arrow.id = "arrow";
        arrow.style.position = "fixed";
        arrow.style.left = e.clientX + "px";
        arrow.style.top = e.clientY + "px";
        arrow.style.width = "4px";
        arrow.style.height = "4px";
        start_x = e.clientX;
        start_y = e.clientY;
        arrow.style.backgroundColor = "black";
        arrow.style.zIndex = "auto";
        arrow.style.pointerEvents = "none";
        arrow.style.transformOrigin = "50% 0%";
        if(e.pointerType != "touch") {
            main_area.setPointerCapture(e.pointerId);
            main_area.onpointermove = move_fn;
            main_area.onpointerup = end_fn;
            main_area.onpointercancel = end_fn;
        }
        else {
            main_area.ontouchmove = move_fn;
            main_area.ontouchend = end_fn;
            main_area.ontouchcancel = end_fn;
        }
        document.body.appendChild(arrow);
    };

    next_button.onclick = (e) => {
        if(clientCanGoNext(local_client)) {
            if(local_client.is_host) {
                hostSetNextTeamAndCard();
            }
            else {
                clientSendNext();
            }
        }
    }

    //card.onpointerdown = start_fn;
    dragging_area.onpointerdown = start_fn;

    input.type = "text";
    input.placeholder = "input";
    input.onkeydown = (e) => {
        if(e.key === 'Enter') {
            input.blur();
        }
    }
    input.value = input_text;
    input.disabled = input_disabled;

    dragging_area.classList.add('edit-card-drag');
    team_text.classList.add('edit-card-team');
    card.classList.add('input-card');
    card_info.classList.add('input-card-info');
    input.classList.add('edit-card-input');
    right_space.classList.add('right-edit-card-space');
    left_sort_limit.classList.add("sort-limit-text");
    right_sort_limit.classList.add("sort-limit-text");
    edit_area.classList.add('edit');


    card.appendChild(team_text);
    card.appendChild(input);
    card.appendChild(card_info);
    card.appendChild(player_layout);
    card.appendChild(dragging_area);

    right_space.appendChild(next_button);
    right_space.appendChild(right_sort_limit);

    edit_area.appendChild(left_sort_limit);
    edit_area.appendChild(card);
    edit_area.appendChild(right_space);
    main_area.appendChild(edit_area);
}



function ensureGameDataHasCards() {
    if(game_data.cards.length < team_index_info.length) {
        game_data.cards = [];
        for(let i = 0; i < team_index_info.length; i++) {
            game_data.cards.push([]);
        }
    }
}
function hostAddCardToGameState(card, team_id, insert_idx) {
    ensureGameDataHasCards();
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == team_id) {
            let top_text = card.top_text;
            let bottom_text = card.bottom_text;
            if(is_hitster) {
                let text_arr = top_text.split('\n')
                top_text = text_arr[2];
                bottom_text = text_arr[0] + ", von " + text_arr[1];
            }
            game_data.cards[i].splice(insert_idx, 0, {
                "top_text": top_text,
                "bottom_text": bottom_text,
                "reveal_top": false,
                "reveal_top_laying": card.reveal_top_laying,
                "laying": card.laying,
                "typed_by": card.typed_by
            });
            break;
        }
    }
}
function hostRemoveCardFromGameState(team_id, remove_idx) {
    ensureGameDataHasCards();
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == team_id) {
            game_data.cards[i].splice(remove_idx, 1);
            break;
        }
    }
}
function hostMoveCardInGameState(team_id, idx1, idx2) {
    ensureGameDataHasCards();
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == team_id) {
            if(idx1 >= game_data.cards[i].length || idx2 >= game_data.cards[i].length) {
                return;
            }
            let temp = game_data.cards[i][idx1];
            game_data.cards[i][idx1] = game_data.cards[i][idx2];
            game_data.cards[i][idx2] = temp;
            break;
        }
    }
}
function hostToggleRevealCard(team_id, idx) {
    if(idx < 0) {
        return;
    }
    ensureGameDataHasCards();
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == team_id) {
            if(idx < game_data.cards[i].length) {
                game_data.cards[i][idx].reveal_top = !game_data.cards[i][idx].reveal_top;
            }
            break;
        }
    }
}












function createTeamFieldList() {
    if(team_list) {
        main_area.innerHTML = "";
        team_list = null;
    }
    let main_list_element = document.createElement('div');
    let top_bar = document.createElement('div');
    team_list = document.createElement('div');
    let top_bar_btn = document.createElement('button');

    top_bar_btn.onclick = (e) => {
        let game_select_overlay = document.getElementById('game_select_overlay');
        game_select_overlay.classList.remove('invisible');
        let random_btn = document.getElementById('random');
        let random_grid_btn = document.getElementById('random-grid');
        let hitster_btn = document.getElementById('hitster');
        let hitster_rock_btn = document.getElementById('hitster-rock');
        let hitster_christmas_btn = document.getElementById('hitster-christmas');
        let hitster_guilty_pleasure_btn = document.getElementById('hitster-guilty-pleasure');
        
        random_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            if(local_client.is_host) {
                hostBeginRandomGame();
            }
            else {
                clientSendPlay(false, 0);
            }
        };
        random_grid_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            if(local_client.is_host) {
                hostBeginRandomGridGame();
            }
            else {
                clientSendPlay(false, 1);
            }
        };
        hitster_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            hitster_idx = 0;
            if(local_client.is_host) {
                hostBeginHitster();
            }
            else {
                clientSendPlay(true, hitster_idx);
            }
        };
        hitster_rock_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            hitster_idx = 1;
            if(local_client.is_host) {
                hostBeginHitster();
            }
            else {
                clientSendPlay(true, hitster_idx);
            }
        };
        hitster_christmas_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            hitster_idx = 2;
            if(local_client.is_host) {
                hostBeginHitster();
            }
            else {
                clientSendPlay(true, hitster_idx);
            }
        };
        hitster_guilty_pleasure_btn.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
            hitster_idx = 3;
            if(local_client.is_host) {
                hostBeginHitster();
            }
            else {
                clientSendPlay(true, hitster_idx);
            }
        };
        game_select_overlay.onclick = (e) => {
            game_select_overlay.classList.add('invisible');
        };
    };

    top_bar.classList.add('top-bar');
    main_list_element.classList.add('main-list');
    team_list.classList.add('team-list');
    
    top_bar.appendChild(top_bar_btn);
    main_list_element.appendChild(top_bar);
    main_list_element.appendChild(team_list);
    main_area.appendChild(main_list_element);
}
function addTeamField() {
    let team = document.createElement('div');
    let team_text = document.createElement('div');

    let team_idx = team_list.children.length;
    team.onclick = (e) => {
        if(local_client.team_id != team_idx) {
            if(local_client.is_host) {
                local_client.team_id = team_idx;
                for(let i = 0; i < users.length; i++) {
                    if(local_client.id == users[i].id) {
                        users[i].team_id = local_client.team_id;
                        break;
                    }
                }
                updateTeamUi();
                hostSendAllUsersToAllConnections();
            }
            else {
                local_client.team_id = team_idx;
                clientSendInfo();
            }
        }
    }
    team_text.textContent = "Team #" + (team_idx + 1);

    team_text.classList.add('team-text');
    team.classList.add('team');
    team.appendChild(team_text);
    team_list.appendChild(team);
}
function addUserToTeamUi(user, team_idx) {
    if(team_idx < 0 || team_idx >= team_list.children.length) {
        return;
    }
    let user_card = document.createElement('div');
    let user_name = document.createElement('div');
    user_name.textContent = user.name;



    user_card.appendChild(user_name);
    user_card.classList.add('user-card');
    user_card.classList.add("outline-" + user.id);

    team_list.children[team_idx].appendChild(user_card);
}
function removeAllUsersfromTeamsUi() {
    for(let i = 0; i < team_list.children.length; i++) {
        team_list.children[i].innerHTML = "";
        let team_text = document.createElement('div');
        team_text.textContent = "Team #" + (i + 1);
        team_text.classList.add('team-text');
        team_list.children[i].appendChild(team_text);
    }
}
function updateTeamUi() {
    removeAllUsersfromTeamsUi();
    for(let i = 0; i < users.length; i++) {
        addUserToTeamUi(users[i], users[i].team_id);
    }
}

function createTeamField() {
    updateUserStyles();

    createTeamFieldList();
    addTeamField();
    addTeamField();
    addTeamField();
    addTeamField();

    updateTeamUi();
}














function checkCardIntegrity(card_info, card) {
    let top_text = "****";
    if(card_info.reveal_top || (card_info.reveal_top_laying && card_info.laying == local_client.team_id && card_info.typed_by == local_client.id)) {
        top_text = card_info.top_text;
    }
    let creator_id = "invalid";
    if(card_info.typed_by.length > 0) {
        creator_id = card_info.typed_by;
    }
    
    let top_content = card.getElementsByClassName('top-content')[0];
    let top_content_area = card.getElementsByClassName('top-content-area')[0];
    let bottom_content = card.getElementsByClassName('bottom-content')[0];
    let creator_data = card.getElementsByClassName('creator')[0];
    let move_handle_name = card.getElementsByClassName('move-handle-name')[0];
    if(top_content.textContent != top_text) {
        top_content.textContent = top_text;
    }
    if(top_content_area.classList.contains('revealed') != card_info.reveal_top) {
        if(card_info.reveal_top) {
            top_content_area.classList.add('revealed');
        }
        else {
            top_content_area.classList.remove('revealed');
        }
    }
    if(bottom_content.textContent != card_info.bottom_text) {
        bottom_content.textContent = card_info.bottom_text;
    }
    if(!creator_data.classList.contains("background-" + creator_id)) {
        creator_data.className = "creator" + " background-" + creator_id;
    }
    let handle_name = "";
    for(let i = 0; i < users.length; i++) {
        if(users[i].id == creator_id) {
            handle_name = users[i].name;
            break;
        }
    }
    if(move_handle_name.textContent != handle_name) {
        move_handle_name.textContent = handle_name;
    }
}

function updateAudioPlayerFromGameState() {
    let player = document.getElementById('player');
    let player_layout = document.getElementsByClassName('player-layout')[0];
    if(game_data.cur_card.media != "") {
        if(player_layout.classList.contains("invisible")) {
            player_layout.classList.remove("invisible");
        }
    }
    else {
        if(!player_layout.classList.contains("invisible")) {
            player_layout.classList.add("invisible");
        }
    }
    if(player.src != game_data.cur_card.media) {
        player.src = game_data.cur_card.media;
    }
}
function updateEditCardUiFromGameState() {
    let card_input = "";
    let disable_input = false;
    if(!localIsTyper()) {
        disable_input = true;
        if(game_data.state == 'insert') {
            card_input = game_data.cur_card.bottom_text;
        }
    }

    let edit_input = document.getElementsByClassName("edit-card-input")[0];
    let team_text = document.getElementsByClassName("edit-card-team")[0];
    let sort_limits = document.getElementsByClassName("sort-limit-text");
    let top_card_info = document.getElementsByClassName("input-card-info")[0];
    let left_sort_limit = sort_limits[0];
    let right_sort_limit = sort_limits[1];

    let team_idx_txt_val = "Team #0";
    if(cur_team_index != -1) {
        team_idx_txt_val = "Team #" + (team_index_info[cur_team_index][0] + 1);
    }
    if(team_text.textContent != team_idx_txt_val) {
        team_text.textContent = team_idx_txt_val;
    }

    if(edit_input.disabled != disable_input) {
        edit_input.disabled = disable_input;
    }
    if(disable_input) {
        if(edit_input.value != card_input) {
            edit_input.value = card_input;
        }
    }

    let card_top_text = "****";
    let card_info = game_data.cur_card;
    if(card_info.reveal_top ||
        (card_info.reveal_top_laying && card_info.laying == local_client.team_id && game_data.cur_id == local_client.id)) {
        card_top_text = card_info.top_text;
    }
    if(top_card_info.textContent != card_top_text) {
        top_card_info.textContent = card_top_text;
    }
    let left_txt = "";
    let right_txt = "";
    if(cur_team_index != -1) {
        left_txt = game_data.left[cur_team_index];
        right_txt = game_data.right[cur_team_index];
    }
    if(left_sort_limit.textContent != left_txt) {
        left_sort_limit.textContent = left_txt;
    }
    if(right_sort_limit.textContent != right_txt) {
        right_sort_limit.textContent = right_txt;
    }
}
function updateCardListUiFromGameState() {
    let cards_list_data = [];

    ensureGameDataHasCards();
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == game_data.cur_team_id) {
            if(game_data.cards && i < game_data.cards.length) {
                cards_list_data = game_data.cards[i];
            }
            break;
        }
    }
    while(card_list.children.length > cards_list_data.length) {
        card_list.removeChild(card_list.children[card_list.children.length - 1]);
    }
    for(let i = 0; i < card_list.children.length; i++) {
        checkCardIntegrity(cards_list_data[i], card_list.children[i]);
    }
    for(let i = card_list.children.length; i < cards_list_data.length; i++) {
        let top_text = "****";
        let card_info = cards_list_data[i];
        if(card_info.reveal_top ||
            (card_info.reveal_top_laying && card_info.laying == local_client.team_id && card_info.typed_by == local_client.id)) {
            top_text = card_info.top_text;
        }
        let creator_id = "invalid";
        if(card_info.typed_by.length > 0) {
            creator_id = card_info.typed_by;
        }
        addCard(-1, top_text, card_info.bottom_text, creator_id, card_info.reveal_top);
    }
    update_list_children();
}


function updateUiFromGameState() {
    updateTeamData();
    if(game_data.type == 'team_selection') {
        if(card_list || canvas_class) {
            dragging_card_list = false;
            moving_card = false;
            main_area.innerHTML = "";
            card_list = null;
            team_list = null;
            canvas_class = null;
        }
        if(team_list) {
            updateTeamUi();
        }
        else {
            createTeamField();
        }
    }
    else if(game_data.type == 'sort') {
        if(team_list || canvas_class) {
            dragging_card_list = false;
            moving_card = false;
            main_area.innerHTML = "";
            card_list = null;
            team_list = null;
            canvas_class = null;
        }
        if(card_list) {
            updateEditCardUiFromGameState();
            updateCardListUiFromGameState();
        }
        else {
            let card_top_text = "****";
            let card_info = game_data.cur_card;
            if(card_info.reveal_top ||
                (card_info.reveal_top_laying && card_info.laying == local_client.team_id && game_data.cur_id == local_client.id)) {
                card_top_text = card_info.top_text;
            }
            let card_input = "";
            let disable_input = false;
            if(!localIsTyper()) {
                disable_input = true;
                if(game_data.state == 'insert') {
                    card_input = game_data.cur_card.bottom_text;
                }
            }

            let left_txt = "";
            let right_txt = "";
            if(cur_team_index != -1) {
                left_txt = game_data.left[cur_team_index];
                right_txt = game_data.right[cur_team_index];
            }
            let team_idx_val = 0;
            if(cur_team_index != -1) {
                team_idx_val = team_index_info[cur_team_index][0] + 1;
            }
            addEditCard(left_txt, right_txt, card_top_text, card_input, disable_input, team_idx_val);
            createCardList();
            ensureGameDataHasCards();
            for(let i = 0; i < game_data.cards.length; i++) {
                if(team_index_info[i][0] != game_data.cur_team_id) {
                    continue;
                }
                for(let j = 0; j < game_data.cards[i].length; j++) {
                    let c = game_data.cards[i][j]
                    let top_text = "****";
                    if(c.reveal_top || (c.reveal_top_laying && c.laying == local_client.team_id)) {
                        top_text = c.top_text;
                    }
                    let typed_by = "invalid";
                    if(c.typed_by != "") {
                        typed_by = c.typed_by;
                    }
                    addCard(-1, top_text, c.bottom_text, typed_by, c.reveal_top);
                }
            }
            center_list_children();
            update_list_children();
        }
        updateAudioPlayerFromGameState();
    }
    else if(game_data.type == 'grid') {
        if(!canvas_class || card_list || team_list) {
            dragging_card_list = false;
            moving_card = false;
            main_area.innerHTML = "";
            card_list = null;
            team_list = null;
            canvas_class = null;
            createGridGame();
        }
        canvas_class.updateFromGameState();
    }
}

















let host_btn = document.getElementById("host");
let host_and_join_btn = document.getElementById("host-and-join");
let connect_btn = document.getElementById("connect");
let connection_items = document.getElementById("connection-items");
let overlay_submit_btn = document.getElementById("submit");


function loadLocallyRelevant() {
    local_client.secret = localStorage.getItem("client_secret");
}
loadLocallyRelevant();

function createNewUniqueId() {
    let new_id = "";
    let is_unique = false;
    while(!is_unique) {
        new_id = randomString(4);
        is_unique = true;
        for(let i = 0; i < users.length; i++) {
            if(users[i].id == new_id) {
                is_unique = false;
                break;
            }
        }
        for(let i = 0; i < pending_users.length; i++) {
            if(pending_users[i].id == new_id) {
                is_unique = false;
                break;
            }
        }
        if(local_client.id == new_id) {
            is_unique = false;
            break;
        }
    }
    return new_id;
}
function updateTeamData() {
    let cur_team_idx_list = [];
    for(let i = 0; i < users.length; i++) {
        if(users[i].team_id < 0) {
            continue;
        }
        let found_idx = -1;
        for(let j = 0; j < cur_team_idx_list.length; j++) {
            if(cur_team_idx_list[j][0] == users[i].team_id) {
                found_idx = j;
                break;
            }
        }
        if(found_idx == -1) {
            cur_team_idx_list.push([users[i].team_id, 1, [users[i].id]]);
        }
        else {
            cur_team_idx_list[found_idx][1] += 1;
            cur_team_idx_list[found_idx][2].push(users[i].id);
        }
    }
    cur_team_idx_list.sort((a, b) => a[0] - b[0]);

    team_index_info = cur_team_idx_list;
    if(team_index_info.length != host_typer_idx.length) {
        host_typer_idx = [];
        for(let i = 0; i < team_index_info.length; i++) {
            host_typer_idx.push(0);
        }
    }

    cur_team_index = -1;
    for(let i = 0; i < cur_team_idx_list.length; i++) {
        if(cur_team_idx_list[i][0] == game_data.cur_team_id) {
            cur_team_index = i;
            break;
        }
    }
}

function hostSetNextTeam() {
    updateTeamData();

    if(team_index_info.length == 0) {
        game_data.cur_team_id = -1;
        return false;
    }
    if(game_data.cur_team_id == undefined || game_data.cur_team_id < 0) {
        game_data.cur_team_id = team_index_info[0][0];
        let typer = team_index_info[0][2][host_typer_idx[0]];
        if(typer != undefined && !is_hitster) {
            game_data.cur_id = typer;
        }
        else {
            game_data.cur_id = "";
        }
        return false;
    }
    let cur_idx = -1;
    for(let i = 0; i < team_index_info.length; i++) {
        if(team_index_info[i][0] == game_data.cur_team_id) {
            cur_idx = i;
            break;
        }
    }
    let every_team_played = false;
    cur_idx = (cur_idx + 1);
    if(cur_idx >= team_index_info.length) {
        every_team_played = true;
        cur_idx = 0;
        for(let i = 0; i < team_index_info.length; i++) {
            host_typer_idx[i] = (host_typer_idx[i] + 1) % team_index_info[i][1];
        }
    }
    else {
        for(let i = 0; i < team_index_info.length; i++) {
            host_typer_idx[i] = host_typer_idx[i] % team_index_info[i][1];
        }
    }
    game_data.cur_team_id = team_index_info[cur_idx][0];
    let typer = team_index_info[cur_idx][2][host_typer_idx[cur_idx]];
    if(typer != undefined && !is_hitster) {
        game_data.cur_id = typer;
    }
    else {
        game_data.cur_id = "";
    }
    return every_team_played;
}
function hostSetNextTeamAndCard() {
    hostSetNextTeam();
    if(game_data.typing) {
        game_data.cur_card = {
            "media": "",
            "top_text": getRandomPercentage() + "%",
            "bottom_text": "",
            "reveal_top": false,
            "reveal_top_laying": true,
            "laying": game_data.cur_team_id,
            "typed_by": "",
        };
        game_data.state = "type";
    }
    else {
        let cur_song = getRandomHitsterSong();
        game_data.cur_card = {
            "media": cur_song.url,
            "top_text": cur_song['title'] + "\n" + cur_song['artist'] + "\n" + cur_song['year'],
            "bottom_text": "",
            "reveal_top": false,
            "reveal_top_laying": false,
            "laying": game_data.cur_team_id,
            "typed_by": "",
        };
        game_data.state = "type";
    }
    hostSendStateInfoToEveryone();
    updateUiFromGameState();
}
function hostSetNextTeamGrid() {
    let reroll = hostSetNextTeam();
    game_data.points = [];
    game_data.solver_x = "";
    game_data.solver_y = "";
    game_data.solved_x = false;
    game_data.solved_y = false;
    if(reroll) {
        game_data.x = [];
        game_data.y = [];
        for(let i = 0; i < team_index_info.length; i++) {
            let rd_x = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
            let rd_y = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
            while(rd_y == rd_x) {
                rd_y = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
            }
            game_data.x.push(RANGE_DEFINITIONS[rd_x]);
            game_data.y.push(RANGE_DEFINITIONS[rd_y]);
        }
    }
}
function hostSetStateTeamSelection() {
    game_data['type'] = "team_selection";
    game_data.cur_team_id = -1;
    createTeamField();
}
function hostBeginRandomGame() {
    main_area.innerHTML = "";
    card_list = null;
    team_list = null;
    canvas_class = null;

    host_typer_idx = [];
    resetAvailablePercentages();

    is_hitster = false;
    game_data.type = 'sort';
    game_data.cards = [];
    game_data.cur_team_id = -1;
    game_data.cur_id = "";
    game_data.state = "type";
    game_data.typing = true; // typing state exists
    updateTeamData();

    game_data.left = [];
    game_data.right = [];
    for(let i = 0; i < team_index_info.length; i++) {
        let category_idx = Math.floor(Math.random() * CATEGORIES.length);
        game_data.left.push("0 (" + CATEGORIES[category_idx][0] + ")");
        game_data.right.push("100 (" + CATEGORIES[category_idx][1] + ")");
    }

    hostSetNextTeam();
    game_data.cur_card = {
        "media": "",
        "top_text": getRandomPercentage() + "%",
        "bottom_text": "",
        "reveal_top": false,
        "reveal_top_laying": true,
        "laying": game_data.cur_team_id,
        "typed_by": "",
    };
    updateUiFromGameState();

    hostSendStateInfoToEveryone();
}
function hostBeginHitster() {
    main_area.innerHTML = "";
    card_list = null;
    team_list = null;
    canvas_class = null;

    host_typer_idx = [];
    resetAvailablePercentages();
    resetSongList();

    is_hitster = true;
    game_data.type = 'sort';
    game_data.cards = [];
    game_data.cur_team_id = -1;
    game_data.cur_id = "";
    game_data.state = "type";
    game_data.typing = false;
    updateTeamData();

    game_data.left = [];
    game_data.right = [];
    for(let i = 0; i < team_index_info.length; i++) {
        game_data.left.push("Früh");
        game_data.right.push("Spät");
    }

    hostSetNextTeam();
    let cur_song = getRandomHitsterSong();
    game_data.cur_card = {
        "media": cur_song.url,
        "top_text": cur_song['title'] + "\n" + cur_song['artist'] + "\n" + cur_song['year'],
        "bottom_text": "",
        "reveal_top": false,
        "reveal_top_laying": false,
        "laying": game_data.cur_team_id,
        "typed_by": "",
    };
    updateUiFromGameState();

    hostSendStateInfoToEveryone();
}
function hostBeginRandomGridGame() {
    main_area.innerHTML = "";
    card_list = null;
    team_list = null;
    canvas_class = null;

    host_typer_idx = [];
    game_data = {
        "type": "grid",
        "cur_team_id": -1,
        "cur_id": "",
        "x": [],
        "y": [],
        "points": [],
        "solver_x": "",
        "solver_y": "",
        "solved_x": false,
        "solved_y": false,
    };
    hostSetNextTeam();
    for(let i = 0; i < team_index_info.length; i++) {
        let rd_x = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
        let rd_y = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
        while(rd_y == rd_x) {
            rd_y = Math.floor(Math.random() * RANGE_DEFINITIONS.length);
        }
        game_data.x.push(RANGE_DEFINITIONS[rd_x]);
        game_data.y.push(RANGE_DEFINITIONS[rd_y]);
    }
    console.log(game_data);

    updateUiFromGameState();
    hostSendStateInfoToEveryone();
}

function hostSendStateInfo(conn) {
    conn.send({'type': 'state', 'data': game_data});
}
function hostSendStateInfoToEveryone() {
    let info = {'type': 'state', 'data': game_data};

    for(let i = 0; i < users.length; i++) {
        if(users[i].conn) {
            users[i].conn.send(info);
        }
    }
}

function hostSendAllUsersToAllConnections() {
    if(!local_client.is_host) {
        return;
    }
    let user_list = [];
    for(let i = 0; i < users.length; i++) {
        user_list.push({'name': users[i].name, 'is_host': users[i].is_host, 'id': users[i].id, 'team_id': users[i].team_id, 'color': users[i].color});
    }
    for(let i = 0; i < users.length; i++) {
        if(users[i].conn) {
            users[i].conn.send({'type': 'users', 'data': user_list});
        }
    }
}


function hostHandleMessage(conn, data) {
    console.log("received: ", data);
    if(data['type'] == "secret") {
        let user_idx = -1;
        for(let i = 0; i < users.length; i++) {
            if(users[i].secret == data['secret']) {
                if(users[i].conn && conn != users[i].conn) {
                    users[i].conn.close();
                }
                users[i].conn = conn;
                user_idx = i;
                break;
            }
        }
        for(let i = 0; i < pending_users.length; i++) {
            if(pending_users[i].conn == conn) {
                if(user_idx == -1) {
                    pending_users[i].secret = randomString(10);
                    let new_secret = {
                        "type": "secret",
                        "secret": pending_users[i].secret,
                        "id": pending_users[i].id,
                    };
                    users.push({...pending_users[i]});
                    conn.send(new_secret);
                }
                else {
                    let old_secret = {
                        "type": "secret",
                        "secret": users[user_idx].secret,
                        "id": users[user_idx].id,
                    };
                    conn.send(old_secret);
                }
                updateUserStyles();
                hostSendAllUsersToAllConnections();
                pending_users.splice(i, 1);
                found = true;
                break;
            }
        }
        if(!found) {
            conn.close();
        }
        else {
            hostSendStateInfo(conn);
        }
    }
    else if(data['type'] == 'info') {
        let found = false;
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                found = true;
                users[i].name = data['data'].name;
                users[i].color = data['data'].color;
                users[i].team_id = data['data'].team_id;
                if(game_data.type == 'team_selection') {
                    updateTeamUi();
                }
                updateUserStyles();
                break;
            }
        }
        if(found) {
            hostSendAllUsersToAllConnections();
        }
    }
    else if(data['type'] == 'add') {
        let text = data['data']['text'];
        let idx = data['data']['i'];
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(clientCanInsert(users[i])) {
                    let cur = game_data.cur_card;
                    cur.bottom_text = text;
                    if(game_data.state == 'insert') {
                        hostAddCardToGameState(cur, users[i].team_id, idx);
                        cur.bottom_text = "";
                        cur.typed_by = "";
                        game_data.state = "type";
                    }
                    else {
                        if(is_hitster) {
                            hostAddCardToGameState(cur, users[i].team_id, idx);
                            cur.bottom_text = "";
                            cur.typed_by = "";
                        }
                        else {
                            cur.typed_by = users[i].id;
                        }
                        game_data.state = 'insert';
                    }
                    hostSendStateInfoToEveryone();
                    updateUiFromGameState();
                }
                break;
            }
        }
    }
    else if(data['type'] == 'remove') {
        let idx = data['data']['i'];
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(clientCanMoveCards(users[i])) {
                    hostRemoveCardFromGameState(users[i].team_id, idx);
                    hostSendStateInfoToEveryone();
                    updateUiFromGameState();
                }
                break;
            }
        }
    }
    else if(data['type'] == 'move') {
        let i1 = data['data']['i1'];
        let i2 = data['data']['i2'];
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(clientCanMoveCards(users[i])) {
                    hostMoveCardInGameState(users[i].team_id, i1, i2);
                    hostSendStateInfoToEveryone();
                    updateUiFromGameState();
                }
                break;
            }
        }
    }
    else if(data['type'] == 'reveal') {
        let idx = data['data']['i'];
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(isInTurn(users[i].team_id)) {
                    hostToggleRevealCard(users[i].team_id, idx);
                    updateUiFromGameState();
                    hostSendStateInfoToEveryone();
                }
                break;
            }
        }
    }
    else if(data['type'] == 'next') {
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(game_data.type == 'sort') {
                    if(clientCanGoNext(users[i])) {
                        hostSetNextTeamAndCard();
                        hostSendStateInfoToEveryone();
                        updateUiFromGameState();
                    }
                }
                else if(game_data.type == 'grid') {
                    if(clientCanAddPoint(users[i])) {
                        hostSetNextTeamGrid();
                        hostSendStateInfoToEveryone();
                        updateUiFromGameState();
                    }
                }
                break;
            }
        }
    }
    else if(data['type'] == 'play') {
        let want_hitster = data['data']['is_hitster'];
        let hit_idx = data['data']['idx'];
        if(game_data.type == 'team_selection') {
            if(want_hitster) {
                hitster_idx = hit_idx;
                hostBeginHitster();
            }
            else {
                if(hit_idx == 0) {
                    hostBeginRandomGame();
                }
                else {
                    hostBeginRandomGridGame();
                }
            }
        }
    }
    else if(data['type'] == 'add_point') {
        let point = data['data'];
        if(point.x < 0.0 || point.x > 1.0 || point.y < 0.0 || point.y > 1.0 || !point.txt || point.txt.length == 0) {
            return;
        }
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(clientCanAddPoint(users[i])) {
                    if(game_data.points === undefined) {
                        game_data.points = [];
                    }
                    game_data.points.push({...point});
                    hostSendStateInfoToEveryone();
                    updateUiFromGameState();
                }
                break;
            }
        }
    }
    else if(data['type'] == 'xylabel') {
        let answer = data['data'];
        if(!answer.txt || answer.txt.length == 0 || answer.is_x === undefined) {
            return;
        }
        let val = answer.txt;
        let is_x = answer.is_x;
        for(let i = 0; i < users.length; i++) {
            if(users[i].conn == conn) {
                if(!clientCanAddPoint(users[i])) {
                    if(cur_team_index >= 0 &&
                        game_data.x && game_data.y && 
                        cur_team_index < game_data.x.length && cur_team_index < game_data.y.length) {
                        let is_correct = false;
                        if(is_x) {
                            if(game_data.x[cur_team_index] === val) {
                                is_correct = true;
                            }
                        }
                        else {
                            if(game_data.y[cur_team_index] === val) {
                                is_correct = true;
                            }
                        }
                        if(is_correct) {
                            if(is_x) {
                                if(!game_data.solved_x) {
                                    game_data.solver_x = users[i].id;
                                }
                                game_data.solved_x = true;
                            }
                            else {
                                if(!game_data.solved_y) {
                                    game_data.solver_y = users[i].id;
                                }
                                game_data.solved_y = true;
                            }
                            hostSendStateInfoToEveryone();
                            updateUiFromGameState();
                        }
                    }
                }
                break;
            }
        }
    }
}
function clientHandleMessage(data) {
    //console.log("received: ", data);
    if(data['type'] == 'secret') {
        local_client.secret = data['secret'];
        local_client.id = data['id'];
        localStorage.setItem("client_secret", local_client.secret);
    }
    else if(data['type'] == 'users') {
        let user_list = data['data'];
        users = [];
        for(let i = 0; i < user_list.length; i++) {
            if(user_list[i].id == local_client.id) {
                local_client.name = user_list[i].name;
                local_client.team_id = user_list[i].team_id;
                local_client.color = user_list[i].color;
                users.push({...local_client});
            }
            else {
                users.push({
                    'conn': null,
                    'name': user_list[i].name,
                    'secret': "",
                    'color': user_list[i].color,
                    'id': user_list[i].id,
                    'is_host': user_list[i].is_host,
                    'team_id': user_list[i].team_id
                });
            }
        }
        if(local_client.name == "") {
            let overlay_element = document.getElementById('user_select_overlay');
            overlay_element.classList.remove('invisible');
        }
        updateUserStyles();
        if(game_data.type == 'team_selection') {
            updateTeamUi();
        }
    }
    else if(data['type'] == 'state') {
        game_data = data['data'];
        updateUiFromGameState();
    }
}











function createTestScene() {
    local_client.name = "test";
    local_client.secret = "asdfjklghf";
    local_client.color = "#00FF00";
    local_client.id = "xreR";
    local_client.is_host = true; 
    local_client.team_id = 0; 
    users.push({...local_client});

    updateUserStyles();
    hostBeginRandomGame();
    game_data = {
        "type": "sort",
        "cur_team_id": 0,
        "left": ["0 (Schwacher Magnet)", ""],
        "right": ["100 (Starker Magnet)", ""],
        "cards": [ ],
        "cur_id": "xreR",
        "state": "type",
        "typing": true,
        "cur_card": {
            "media": "",
            "top_text": "81%",
            "bottom_text": "",
            "reveal_top": false,
            "reveal_top_laying": true,
            "laying": 0,
            "typed_by": ""
        }
    };
    game_data.cards = [];
    game_data.cards.push([]);
    game_data.cards[0].push({
                    "media": "",
                    "top_text": "81%",
                    "bottom_text": "hi",
                    "reveal_top": false,
                    "reveal_top_laying": true,
                    "laying": 0,
                    "typed_by": "xreR"
                });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "supi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hi", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });
    game_data.cards[0].push({ "media": "", "top_text": "81%", "bottom_text": "hhhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihhihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihii", "reveal_top": false, "reveal_top_laying": true, "laying": 0, "typed_by": "xreR" });

    updateUiFromGameState();
    center_list_children();
    update_list_children();
    connection_items.style.display = 'none';
}
function createTeamUiTestScene() {
    local_client.name = "test";
    local_client.secret = "asdfjklghf";
    local_client.color = "#00FF00";
    local_client.id = "xreR";
    local_client.is_host = true; 
    local_client.team_id = 0; 
    users.push({...local_client});

    updateUserStyles();
    hostBeginRandomGame();
    game_data = {
        "type": "team_selection",
        "cur_team_id": -1,
        "left": [""],
        "right": [""],
        "cards": [],
        "cur_id": "",
        "state": "type",
        "typing": true,
        "cur_card": {}
    };
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rera",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerb",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerc",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerd",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rere",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerf",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerf",
        "is_host": false,
        "team_id": 0,
    });
    users.push({
        "name": "fredericksonostwie",
        "secret": "testsetest",
        "color": "#0000FF",
        "id": "Rerf",
        "is_host": false,
        "team_id": 0,
    });

    updateUiFromGameState();
    connection_items.style.display = 'none';
}













host_btn.onclick = () => {
    resetLocalClient();
    local_client.id = createNewUniqueId();
    local_client.is_host = true;
    is_connected = true;

    main_area.innerHTML = "";
    card_list = null;
    team_list = null;

    hostSetStateTeamSelection();

    peer = new Peer(randomString(5));
    peer.on('open', function(id) {
        console.log('local peer ID is: ' + id);

        let data = "?id=" + id;
        window.history.replaceState(null, null, data);
    });
    peer.on('connection', function(conn) {
        pending_users.push({"conn": conn, "name": "", "secret": "", "color": "#000000", "id": createNewUniqueId(), "is_host": false, "team_id": -1});
        conn.on('data', function(data) {
            hostHandleMessage(conn, data);
        });
        conn.on('close', function() {
            for(let i = 0; i < pending_users.length; i++) {
                if(pending_users[i].conn == conn) {
                    pending_users.splice(i, 1);
                    break;
                }
            }
            for(let i = 0; i < users.length; i++) {
                if(users[i].conn == conn) {
                    users[i].conn = null;
                    break;
                }
            }
        });
    });
    connection_items.style.display = 'none';
}
host_and_join_btn.onclick = () => {
    resetLocalClient();
    local_client.id = createNewUniqueId();
    local_client.is_host = true;
    users.push({...local_client});
    is_connected = true;
    let overlay_element = document.getElementById('user_select_overlay');
    overlay_element.classList.remove('invisible');


    main_area.innerHTML = "";
    card_list = null;
    team_list = null;
    hostSetStateTeamSelection();

    peer = new Peer(randomString(5));
    peer.on('open', function(id) {
        console.log('local peer ID is: ' + id);
        let data = "?id=" + id;
        window.history.replaceState(null, null, data);
    });
    peer.on('connection', function(conn) {
        pending_users.push({"conn": conn, "name": "", "secret": "", "color": "#000000", "id": createNewUniqueId(), "is_host": false, "team_id": -1});
        conn.on('data', function(data) {
            hostHandleMessage(conn, data);
        });
        conn.on('close', function() {
            for(let i = 0; i < pending_users.length; i++) {
                if(pending_users[i].conn == conn) {
                    pending_users.splice(i, 1);
                    break;
                }
            }
            for(let i = 0; i < users.length; i++) {
                if(users[i].conn == conn) {
                    users[i].conn = null;
                    break;
                }
            }
        });
    });
    connection_items.style.display = 'none';
}
function clientOnDisconnect() {
    main_area.innerHTML = '';
    connection_items.style.display = 'block';
    is_connected = false;
    local_client.conn = null;
}
function clientConnectTo(target_id) {
    resetLocalClient();
    local_client.is_host = false;
    peer = new Peer();
    peer.on('open', function(id) {
        console.log('local peer ID is: ' + id);
        let conn = peer.connect(target_id);
        conn.on('open', function() {
            is_connected = true;
            local_client.conn = conn;
            connection_items.style.display = 'none';
            console.log("opening");
            {
                let client_data = {
                    "type": "secret",
                    "secret": local_client.secret,
                };
                conn.send(client_data);
            }
            conn.on('data', function(data) {
                clientHandleMessage(data);
            });
        });
        conn.on('close', function() {
            console.log("disconnecting");
            clientOnDisconnect();
        });
        conn.on('error', (err) => {
            console.log("error");
            clientOnDisconnect();
        });
    });
}
connect_btn.onclick = () => {
    let id_input = document.getElementById('id-input');
    clientConnectTo(id_input.value);
}
function hslToRgb(h, s, l) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function hueToRgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    let r, g, b;
    if(s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }
    let col = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    return "#" + componentToHex(col[0]) + componentToHex(col[1]) + componentToHex(col[2]);
}
overlay_submit_btn.onclick = (e) => {
    let name_input = document.getElementById('name_input');
    let color_input = document.getElementById('hue_input');
    let name_str = name_input.value;
    let color_str = hslToRgb(color_input.value / 360.0, 1.0, 0.5);
    if(name_str == "" || color_str == "") {
        name_input.value = "";
        return;
    }
    local_client.color = color_str;
    local_client.name = name_str;

    if(local_client.is_host) {
        let in_users = false;
        for(let i = 0; i < users.length; i++) {
            if(users[i].id == local_client.id) {
                users[i].name = name_str;
                users[i].color = color_str;
                in_users = true;
                break;
            }
        }
        if(in_users) {
            updateUserStyles();
            hostSendAllUsersToAllConnections();
        }
    }
    else {
        clientSendInfo();
    }

    let overlay_element = document.getElementById('user_select_overlay');
    overlay_element.classList.add('invisible');
};

function createGridGame() {
    connection_items.style.display = 'none';

    const min_view_size = 1/4;
    const max_view_size = 1.2;
    let view = {
        x: (1.0-max_view_size)*0.5,
        y: (1.0-max_view_size)*0.5,
        w: max_view_size,
        h: max_view_size,
    };


    let dragging = false;
    let last = null;
    let last_mouse = null;
    let touch_mode = false;
    let last_touches = [];
    let allow_temp_input = false;
    let temp_pos_x = 0.0;
    let temp_pos_y = 0.0;
    let temp_input = null;
    function getTouchInfo(ev){
        const rect = canvas.getBoundingClientRect();
        const pts = [];
        for(let t of ev.touches){
            const sx = (t.clientX - rect.left) * DPR;
            const sy = (t.clientY - rect.top) * DPR;
            pts.push({ sx, sy });
        }
        return pts;
    }



    let canvas_wrapper = document.createElement('div');
    let canvas = document.createElement('canvas');
    let input_x = document.createElement('input');
    let input_y = document.createElement('input');
    let next_button = document.createElement('button');
    input_x.placeholder = "X";
    input_y.placeholder = "Y";
    if(cur_team_index >= 0 &&
        cur_team_index < game_data.x.length && 
        cur_team_index < game_data.y.length) {
        if(local_client.team_id == team_index_info[cur_team_index][0] && 
            local_client.id == game_data.cur_id) {
            input_x.value = game_data.x[cur_team_index];
            input_y.value = game_data.y[cur_team_index];
            input_x.disabled = true;
            input_y.disabled = true;
        }
    }
    next_button.textContent = "next";
    next_button.onclick = () => {
        if(!clientCanAddPoint(local_client)) {
            return;
        }
        if(local_client.is_host) {
            hostSetNextTeamGrid();
            hostSendStateInfoToEveryone();
            updateUiFromGameState();
        }
        else {
            clientSendNext();
        }
    };


    canvas_wrapper.classList.add('canvas-wrap');
    input_x.classList.add('canvas-xlabel-input');
    input_y.classList.add('canvas-ylabel-input');

    // canvas stuff
    const height = window.innerHeight * 0.8;
    const width = Math.min(height, window.innerWidth);
    canvas.w = width;
    canvas.h = height;
    canvas.style = `width: ${width}px;height: ${width}px;`;

    function removeTempInput() {
        if(temp_input) {
            canvas_wrapper.removeChild(temp_input);
            temp_input = null;
            allow_temp_input = false;
        }
    }

    canvas.addEventListener('touchstart', ev => {
        touch_mode = true;
        last_touches = getTouchInfo(ev);
    }, { passive:false });
    canvas.addEventListener('touchmove', ev => {
        ev.preventDefault();
        allow_temp_input = false;
        const pts = getTouchInfo(ev);

        if(pts.length === 1 && last_touches.length === 1) {
            const dx = (pts[0].sx - last_touches[0].sx) / DPR;
            const dy = (pts[0].sy - last_touches[0].sy) / DPR;

            const world_dx = -dx / canvas.width * view.w * DPR;
            const world_dy = dy / canvas.height * view.h * DPR;
            view.x += world_dx;
            view.y += world_dy;
            clampView();
        }

        if(pts.length === 2 && last_touches.length === 2) {
            const dist = Math.hypot(pts[0].sx - pts[1].sx, pts[0].sy - pts[1].sy);
            const last_dist = Math.hypot(last_touches[0].sx - last_touches[1].sx, last_touches[0].sy - last_touches[1].sy);

            if(last_dist > 0) {
                const factor = dist / last_dist;

                // center world point between fingers
                const cx = (pts[0].sx + pts[1].sx) / 2;
                const cy = (pts[0].sy + pts[1].sy) / 2;
                const [wx, wy] = s2w(cx, cy);

                let new_w = view.w / factor;
                let new_h = view.h / factor;
                new_w = Math.min(Math.max(new_w, min_view_size), max_view_size);
                new_h = Math.min(Math.max(new_h, min_view_size), max_view_size);

                const sx_norm = cx / canvas.width;
                const sy_norm = (canvas.height - cy) / canvas.height;
                view.w = new_w;
                view.h = new_h;
                view.x = wx - sx_norm * new_w;
                view.y = wy - sy_norm * new_h;
                clampView();
            }
        }

        last_touches = pts;
    }, { passive:false });
    canvas.addEventListener('touchend', (e) => {
        last_touches = [];
    });
    function handleInput(val, is_x) {
        if(val.length == 0) {
            return;
        }
        val = val.trim().toLowerCase();
        let is_correct = false;
        if(cur_team_index < game_data.x.length && cur_team_index < game_data.y.length) {
            if(is_x) {
                if(game_data.x[cur_team_index] === val) {
                    is_correct = true;
                }
            }
            else {
                if(game_data.y[cur_team_index] === val) {
                    is_correct = true;
                }
            }
        }

        if(local_client.is_host) {
            if(is_correct) {
                if(is_x) {
                    if(!game_data.solved_x) {
                        game_data.solver_x = local_client.id;
                    }
                    game_data.solved_x = true;
                }
                else {
                    if(!game_data.solved_y) {
                        game_data.solver_y = local_client.id;
                    }
                    game_data.solved_y = true;
                }
                hostSendStateInfoToEveryone();
                updateUiFromGameState();
            }
        }
        else {
            clientSendGridAnswer(val, is_x);
        }
    }
    input_x.onkeyup = (e) => {
        if(e.key === 'Enter') {
            let val = input_x.value;
            input_x.value = "";
            handleInput(val, true);
        }
        else if(e.key === 'Escape') {
            input_x.value = "";
        }
    };
    input_x.oncancel = (e) => { input_x.value = ""; };
    input_y.onkeyup = (e) => {
        if(e.key === 'Enter') {
            let val = input_y.value;
            input_y.value = "";
            handleInput(val, false);
        }
        else if(e.key === 'Escape') {
            input_y.value = "";
        }
    };
    input_y.oncancel = (e) => { input_y.value = ""; };

    canvas.addEventListener('pointerdown', e => {
        touch_mode = false;
        allow_temp_input = clientCanAddPoint(local_client);
        removeTempInput();
        canvas.setPointerCapture(e.pointerId);
        dragging = true; last = {x: e.clientX, y: e.clientY};
    });
    canvas.addEventListener('pointerup', e => {
        dragging=false; 
        last=null;
    });
    canvas.addEventListener('click', (e) => {
        if(allow_temp_input) {
            const rect = canvas.getBoundingClientRect();
            const px = (e.clientX - rect.left) * DPR;
            const py = (e.clientY - rect.top) * DPR;
            let [wx, wy] = s2w(px, py);
            removeTempInput();
            if(wx >= 0.0 && wx <= 1.0 && wy >= 0.0 && wy <= 1.0) {
                temp_pos_x = wx;
                temp_pos_y = wy;

                temp_input = document.createElement('input');
                temp_input.type = "text";
                temp_input.classList.add('canvas-ylabel-input');

                temp_input.style.position = 'absolute';
                temp_input.style.left = (e.clientX - 70) + 'px';
                temp_input.style.top = e.clientY + 'px';
                temp_input.onkeyup = e => {
                    if(e.key === 'Enter') {
                        let temp_val = temp_input.value;
                        removeTempInput();
                        if(temp_val.length > 0) {
                            if(local_client.is_host) {
                                if(game_data.points === undefined) {
                                    game_data.points = [];
                                }
                                game_data.points.push({"x": wx, "y": wy, "txt": temp_val});
                                hostSendStateInfoToEveryone();
                            }
                            else {
                                console.log("hier", wx, wy, temp_val);
                                clientSendGridAddPoint(wx, wy, temp_val);
                            }
                        }
                    }
                    else if(e.key === 'Escape') {
                        removeTempInput();
                    }
                };

                canvas_wrapper.appendChild(temp_input);
                temp_input.focus();
            }
        }
    });
    canvas_wrapper.addEventListener('pointerup', e => { 
        dragging=false;
        last=null;
    });
    canvas_wrapper.addEventListener('pointercancel', e => { dragging=false; last=null; });
    canvas_wrapper.addEventListener('pointermove', e => {
        if(touch_mode) {
            return;
        }
        allow_temp_input = false;
        const rect = canvas.getBoundingClientRect();
        const sx = (e.clientX - rect.left) * DPR;
        const sy = (e.clientY - rect.top) * DPR;
        last_mouse = [sx, sy];
        if(!dragging) { return; }
        if(last) {
            const dx = (e.clientX - last.x);
            const dy = (e.clientY - last.y);
            const world_dx = -dx / canvas.width * view.w;
            const world_dy = dy / canvas.height * view.h;
            view.x += world_dx; view.y += world_dy;
            clampView();
            last = {x: e.clientX, y: e.clientY};
        }
    });
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const sx = (e.clientX - rect.left) * DPR;
        const sy = (e.clientY - rect.top) * DPR;
        const [wx, wy] = s2w(sx, sy);

        const delta = Math.sign(e.deltaY) * 1;
        const factor = Math.pow(1.18, delta);

        let new_w = view.w * factor;
        let new_h = view.h * factor;

        new_w = Math.min(Math.max(new_w, min_view_size), max_view_size);
        new_h = Math.min(Math.max(new_h, min_view_size), max_view_size);

        const sx_norm = (sx / canvas.width);
        const sy_norm = (canvas.height - sy) / canvas.height;
        const new_x = wx - sx_norm * new_w;
        const new_y = wy - sy_norm * new_h;
        view.w = new_w; view.h = new_h; view.x = new_x; view.y = new_y;
        clampView();
    }, { passive:false });

    const ctx = canvas.getContext('2d');
    function w2s(px, py) {
        const X = ((px - view.x) / view.w) * canvas.width;
        const Y = canvas.height - ((py - view.y) / view.h) * canvas.height;
        return [X, Y];
    }
    function s2w(sx, sy) {
        const wx = view.x + (sx / canvas.width) * view.w;
        const wy = view.y + ((canvas.height - sy) / canvas.height) * view.h;
        return [wx, wy];
    }
    function clampView() {
        view.w = Math.max(Math.min(view.w, max_view_size), min_view_size);
        view.h = Math.max(Math.min(view.h, max_view_size), min_view_size);
        view.x = Math.min(Math.max(view.x, (1.0-max_view_size)*0.5), (1.0+max_view_size)*0.5 - view.w);
        view.y = Math.min(Math.max(view.y, (1.0-max_view_size)*0.5), (1.0+max_view_size)*0.5 - view.h);
    }

    let scroll_offsets = [];
    function draw() {
        resizeGridGame();
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle = '#071015';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        const approx_pixels_per_unit_x = canvas.width / view.w;
        const approx_pixels_per_unit_y = canvas.height / view.h;
        const approx_ppu = Math.min(approx_pixels_per_unit_x, approx_pixels_per_unit_y);

        const ideal_px = 100;
        const raw_step = ideal_px / approx_ppu; // in world units
        const pow10 = Math.pow(10, Math.floor(Math.log10(raw_step || 1)));
        const candidates = [1,2,5,10];
        let step = pow10;
        for(let c of candidates) {
            if(c * pow10 >= raw_step) { step = c * pow10; break; }
        }

        // draw grid
        ctx.lineWidth = 1 * DPR;
        ctx.strokeStyle = '#0f2a33';
        ctx.beginPath();
        for(let gx = Math.ceil(view.x / step) * step; gx <= view.x + view.w + 1e-12; gx += step) {
            const [sx] = w2s(gx, 0);
            ctx.moveTo(Math.round(sx) + 0.5, 0);
            ctx.lineTo(Math.round(sx) + 0.5, canvas.height);
        }
        for(let gy = Math.ceil(view.y / step) * step; gy <= view.y + view.h + 1e-12; gy += step) {
            const [, sy] = w2s(0, gy);
            ctx.moveTo(0, Math.round(sy) + 0.5);
            ctx.lineTo(canvas.width, Math.round(sy) + 0.5);
        }
        ctx.stroke();
        // draw finer subdivs if step >= 0.1
        if(step >= 0.1) {
            ctx.beginPath(); ctx.strokeStyle = '#092225';
            const sub = step/5;
            for(let gx = Math.ceil(view.x / sub) * sub; gx <= view.x + view.w + 1e-12; gx += sub) {
                const [sx] = w2s(gx, 0);
                ctx.moveTo(Math.round(sx)+0.5, 0);
                ctx.lineTo(Math.round(sx)+0.5, canvas.height);
            }
            for(let gy = Math.ceil(view.y / sub) * sub; gy <= view.y + view.h + 1e-12; gy += sub) {
                const [, sy] = w2s(0, gy);
                ctx.moveTo(0, Math.round(sy)+0.5);
                ctx.lineTo(canvas.width, Math.round(sy)+0.5);
            }
            ctx.stroke();
        }


        // bounding box 
        ctx.beginPath();
        const [sx0, sy0] = w2s(0,0);
        const [sx1, sy1] = w2s(1,1);
        ctx.rect(Math.min(sx0, sx1), Math.min(sy0, sy1), Math.abs(sx1-sx0), Math.abs(sy1-sy0));
        ctx.strokeStyle = '#18333b';
        ctx.lineWidth = 2*DPR; ctx.stroke();

        // draw axis text-content
        ctx.fillStyle = '#9fb9c6';
        ctx.font = `${14*DPR}px ui-sans-serif, system-ui, Arial`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        const labelStep = step;
        for(let gx = Math.ceil(view.x / labelStep) * labelStep; gx <= view.x + view.w + 1e-12; gx += labelStep) {
            if(gx < -1e-9 || gx > 1 + 1e-9) continue;
            const [sx, sy] = w2s(gx, 0);
            const posY = Math.round(sy) - 2 * DPR;
            let scrollPosY = canvas.height - 2 * DPR;
            if(posY < scrollPosY) {
                scrollPosY = posY;
            }
            const xAxisLabel = (gx.toFixed(2)).replace(/\.0+$/,'');
            ctx.fillText(xAxisLabel, Math.round(sx), scrollPosY);
        }
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        for(let gy = Math.ceil(view.y / labelStep) * labelStep; gy <= view.y + view.h + 1e-12; gy += labelStep) {
            if(gy < -1e-9 || gy > 1 + 1e-9) continue;
            const y_axis_label = (gy.toFixed(2)).replace(/\.0+$/,'');
            if(y_axis_label == '0') {
                continue;
            }

            const [sx, sy] = w2s(0, gy);
            let scroll_pos_x = 2 * DPR;
            const pos_x = Math.round(sx);
            if(pos_x > scroll_pos_x) {
                ctx.textAlign = 'center';
                scroll_pos_x = pos_x;
            }
            ctx.fillText(y_axis_label, scroll_pos_x, Math.round(sy));
        }

        const [oX, oY] = w2s(0,0);
        ctx.fillStyle = '#2aa7e0'; ctx.beginPath(); ctx.arc(oX, oY, 4*DPR, 0, Math.PI*2); ctx.fill();
        if(last_mouse) {
            const [mx,my] = last_mouse;
            ctx.strokeStyle = 'rgba(55,182,255,0.08)'; ctx.lineWidth = 1*DPR;
            ctx.beginPath(); ctx.moveTo(mx,0); ctx.lineTo(mx,canvas.height); ctx.moveTo(0,my); ctx.lineTo(canvas.width,my); ctx.stroke();
        }


        // draw elements
        if(cur_team_index >= 0) {
            ctx.fillStyle = '#9fb9c6';
            ctx.font = `${16*DPR}px ui-sans-serif, system-ui, Arial`;
            ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
            for(let i = scroll_offsets.length; i < game_data.points.length; i++) {
                scroll_offsets.push(0.0);
            }
            for(let i = 0; i < game_data.points.length; i++) {
                const p = game_data.points[i];

                const x_label = ((p.x).toFixed(2)).replace(/\.0+$/,'');
                const y_label = ((p.y).toFixed(2)).replace(/\.0+$/,'');
                const pos_text = `(${x_label},${y_label})`;
                let [sx, sy] = w2s(p.x, p.y);
                let pos_txt_info = ctx.measureText(pos_text);
                let p_txt_info = ctx.measureText(p.txt);

                let tl = [sx-pos_txt_info.width*0.5-8*DPR, sy-50*DPR];
                let br = [sx+pos_txt_info.width*0.5+30*DPR, sy+10*DPR];
                let width = br[0]-tl[0];

                let p_txt_wrap_width = p_txt_info.width + 40.0*DPR;
                let scroll = false;
                if(p_txt_info.width > width) {
                    scroll = true;
                    scroll_offsets[i] += 0.2*DPR;
                    while(p_txt_wrap_width < scroll_offsets[i]) {
                        scroll_offsets[i] -= p_txt_wrap_width;
                    }
                }
                else {
                    scroll_offsets[i] = 0.0;
                }

                ctx.save();
                ctx.beginPath();
                ctx.rect(tl[0], tl[1], br[0]-tl[0],br[1]-tl[1]);
                ctx.clip();

                ctx.fillText(pos_text, sx-pos_txt_info.width*0.5, sy-24*DPR);
                if(scroll) {
                    let scroll_offset = scroll_offsets[i];
                    ctx.fillText(p.txt, sx-pos_txt_info.width*0.5-scroll_offset, sy-8*DPR);
                    ctx.fillText(p.txt, sx-pos_txt_info.width*0.5-scroll_offset+p_txt_wrap_width, sy-8*DPR);
                }
                else {
                    ctx.fillText(p.txt, sx-pos_txt_info.width*0.5, sy-8*DPR);
                }


                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 0, 0, 1.0)'; ctx.lineWidth = 2*DPR;
                ctx.moveTo(sx-4*DPR, sy-4*DPR);
                ctx.lineTo(sx+4*DPR, sy+4*DPR);
                ctx.moveTo(sx-4*DPR, sy+4*DPR);
                ctx.lineTo(sx+4*DPR, sy-4*DPR);
                ctx.stroke();

                ctx.restore();
            }
        }
        if(temp_input) {
            let [sx, sy] = w2s(temp_pos_x, temp_pos_y);

            const x_label = ((temp_pos_x).toFixed(2)).replace(/\.0+$/,'');
            const y_label = ((temp_pos_y).toFixed(2)).replace(/\.0+$/,'');
            const pos_text = `(${x_label},${y_label})`;
            let pos_txt_info = ctx.measureText(pos_text);

            ctx.fillText(pos_text, sx-pos_txt_info.width*0.5, sy-8*DPR);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 255, 0, 1.0)'; ctx.lineWidth = 2*DPR;
            ctx.moveTo(sx-4*DPR, sy-4*DPR);
            ctx.lineTo(sx+4*DPR, sy+4*DPR);
            ctx.moveTo(sx-4*DPR, sy+4*DPR);
            ctx.lineTo(sx+4*DPR, sy-4*DPR);
            ctx.stroke();
        }


        const r = canvas.getBoundingClientRect();
        input_x.style.position = 'absolute';
        input_x.style.left = (r.right - 154) + 'px';
        input_x.style.top = (r.bottom - 40) + 'px';

        input_y.style.position = 'absolute';
        input_y.style.left = (r.left + 4) + 'px';
        input_y.style.top = (r.top) + 'px';
    }

    function resizeGridGame() {
        let canvas = canvas_wrapper.querySelector('canvas');
        const rect = canvas.getBoundingClientRect();
        const w = Math.round(rect.width * DPR);
        const h = Math.round(rect.height * DPR);
        if(canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
    }
    function updateFromGameState() {
        let show_x = false;
        let show_y = false;
        let show_x_class = false;
        let show_y_class = false;
        if(!clientCanAddPoint(local_client)) {
            removeTempInput();
            show_x = game_data.solved_x;
            show_y = game_data.solved_y;
            show_x_class = game_data.solved_x;
            show_y_class = game_data.solved_y;
        }
        else {
            show_x = true;
            show_y = true;
            show_x_class = game_data.solved_x;
            show_y_class = game_data.solved_y;
        }
        if(show_x) {
            input_x.disabled = true;
            if(show_x_class) {
                if(!input_x.classList.contains('solved')) {
                    input_x.classList.add('solved');
                }
            }
            else {
                if(input_x.classList.contains('solved')) {
                    input_x.classList.remove('solved');
                }
            }
            input_x.value = (game_data.x.length >= cur_team_index) ? game_data.x[cur_team_index] : "";
        }
        else {
            if(input_x.disabled) {
                input_x.value = "";
            }
            input_x.disabled = false;
            if(input_x.classList.contains('solved')) {
                input_x.classList.remove('solved');
            }
        }
        if(show_y) {
            input_y.disabled = true;
            if(show_y_class) {
                if(!input_y.classList.contains('solved')) {
                    input_y.classList.add('solved');
                }
            }
            else {
                if(input_y.classList.contains('solved')) {
                    input_y.classList.remove('solved');
                }
            }
            input_y.value = (game_data.y.length >= cur_team_index) ? game_data.y[cur_team_index] : "";
        }
        else {
            if(input_y.disabled) {
                input_y.value = "";
            }
            if(input_y.classList.contains('solved')) {
                input_y.classList.remove('solved');
            }
            input_y.disabled = false;
        }
    }
    function frame(){ draw(); requestAnimationFrame(frame); }


    canvas_wrapper.appendChild(canvas);
    canvas_wrapper.appendChild(input_x);
    canvas_wrapper.appendChild(input_y);
    canvas_wrapper.appendChild(next_button);

    main_area.appendChild(canvas_wrapper);

    frame();

    // encapsulates the state
    canvas_class = {
        "resize": resizeGridGame,
        "updateFromGameState": updateFromGameState,
    };
}
function createTestGridState() {
    local_client.id = "TestIDTest";
    local_client.team_id = 0;
    local_client.name = "test";
    local_client.color = "#0000FF";
    local_client.is_host = true;
    users.push({...local_client});

    game_data = {
        "type": "grid",
        "cur_team_id": 0,
        "cur_id": local_client.id,
        "x": ["distance", ""],
        "y": ["speed", ""],
        "points": [
            {
                "x": 0.12,
                "y": 0.32,
                "txt": "textSuperdupertollemolleundnochfielmehrtextwarumi stder so gequetscht?",
            },
            {
                "x": 0.22,
                "y": 0.32,
                "txt": "textSuperdupertollemolleundnochfielmehrtextwarumi stder so gequetscht?",
            },
            {
                "x": 0.32,
                "y": 0.32,
                "txt": "textSuperdupertollemolleundnochfielmehrtextwarumi stder so gequetscht?",
            },
            {
                "x": 0.42,
                "y": 0.32,
                "txt": "textSuperdupertollemolleundnochfielmehrtextwarumi stder so gequetscht?",
            },
        ],
        "solved_x": false,
        "solved_y": false,
    };

    updateUserStyles();
    updateTeamData();
    updateUiFromGameState();
}





function checkUrlForConnect() {
    let params = new URLSearchParams(document.location.search);
    let connect_id = params.get('id');
    if(connect_id && connect_id.length > 0) {
        clientConnectTo(connect_id);
    }
}
checkUrlForConnect();

window.onresize = () => {
    update_list_children();
    DPR = window.devicePixelRatio || 1;
    if(canvas_class) {
        canvas_class.resize();
    }
}
