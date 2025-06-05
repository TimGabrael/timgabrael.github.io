
function randomName() {
    const adjectives = ['Cool', 'Smart', 'Fast', 'Happy', 'Crazy', 'Bright', 'Sharp', 'Brave', 'Quiet', 'Loud'];
    const animals = ['Panda', 'Tiger', 'Eagle', 'Shark', 'Wolf', 'Falcon', 'Lion', 'Fox', 'Otter', 'Bear'];
    return adjectives[Math.floor(Math.random() * adjectives.length)] +
        animals[Math.floor(Math.random() * animals.length)] +
        Math.floor(Math.random() * 100);
}
function randomId(length = 16) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
function getDate() {
    let date = new Date();
    return date.toISOString().split('T')[0];
}

// example one not used anymore
//const crosswordData = {
//  id: 19199,
//  crosswords: {
//    no: "019199",
//    difficulty: 3,
//    created: "2025-04-02",
//    start: "2025-05-31",
//    partner: "spiegel.de",
//    cols: 9,
//    rows: 9,
//    clues: [
//      { id: 1, col: 0, row: 0, s: [0, 1], e: [8, 1], t: "Kräftigung" },
//      { id: 2, col: 0, row: 2, s: [1, 2], e: [4, 2], t: "dt. TV-\nKomiker\n(... \nDittrich)" },
//      { id: 3, col: 0, row: 3, s: [1, 3], e: [8, 3], t: "Anhänger\nder\nwestlichen\nStaatsform" },
//      { id: 4, col: 0, row: 4, s: [0, 5], e: [3, 5], t: "Schiffs-\nbesat-\nzung" },
//      { id: 5, col: 0, row: 7, s: [0, 6], e: [3, 6], t: "mexik.\nÖlsamen" },
//      { id: 6, col: 0, row: 8, s: [1, 8], e: [3, 8], t: "Ab-\nschieds-\ngruß" },
//      { id: 7, col: 1, row: 0, s: [1, 1], e: [1, 3], t: "letzte\nRuhe" },
//      { id: 8, col: 1, row: 4, s: [1, 5], e: [1, 8], t: "Mutter\ndes Zeus\n(griech.\nMytholog.)" },
//      { id: 9, col: 2, row: 0, s: [2, 1], e: [2, 6], t: "russ. Zar\n(1645/76)" },
//      { id: 10, col: 2, row: 7, s: [3, 7], e: [8, 7], t: "fahl,\nblass" },
//      { id: 11, col: 3, row: 0, s: [3, 1], e: [3, 3], t: "Höhen-\nzug bei\nBraun-\nschweig" },
//      { id: 12, col: 3, row: 4, s: [4, 4], e: [8, 4], t: "hühner-\ngroßer\nSumpf-\nvogel" },
//      { id: 13, col: 4, row: 5, s: [3, 5], e: [3, 8], t: "Wachs-\nzellen-\nbau der\nBienen" },
//      { id: 14, col: 4, row: 6, s: [5, 6], e: [8, 6], t: "ruhig,\nstill,\nmatt" },
//      { id: 15, col: 4, row: 8, s: [5, 8], e: [8, 8], t: "hoch-\nherzig,\nmenschl.\nvornehm" },
//      { id: 16, col: 5, row: 0, s: [4, 0], e: [4, 4], t: "Stellver-\ntreter\neines\nAbtes" },
//      { id: 17, col: 5, row: 2, s: [5, 3], e: [5, 8], t: "Aufguss-\ngetränk" },
//      { id: 18, col: 6, row: 5, s: [6, 6], e: [6, 8], t: "''Augen-\n deckel''" },
//      { id: 19, col: 7, row: 0, s: [6, 0], e: [6, 4], t: "Küchen-\ngerät\nzum\nVerrühren" },
//      { id: 20, col: 7, row: 2, s: [7, 3], e: [7, 8], t: "frz. Name\nfür das\nElsass" },
//      { id: 21, col: 8, row: 0, s: [8, 1], e: [8, 4], t: "Germane" },
//      { id: 22, col: 8, row: 5, s: [8, 6], e: [8, 8], t: "dt. Schau-\nspielerin\n(Nadja)" }
//    ],
//    solutions: [
//      { id: 1, col: 7, row: 7 },
//      { id: 2, col: 1, row: 6 },
//      { id: 3, col: 6, row: 2 },
//      { id: 4, col: 3, row: 3 },
//      { id: 5, col: 2, row: 1 },
//      { id: 6, col: 3, row: 8 },
//      { id: 7, col: 4, row: 4 },
//      { id: 8, col: 5, row: 8 }
//    ],
//    solved: [
//      ["", "", "", "", "P", "", "Q", "", ""],
//      ["S", "T", "A", "E", "R", "K", "U", "N", "G"],
//      ["", "O", "L", "L", "I", "", "I", "", "O"],
//      ["", "D", "E", "M", "O", "K", "R", "A", "T"],
//      ["", "", "X", "", "R", "A", "L", "L", "E"],
//      ["C", "R", "E", "W", "", "F", "", "S", ""],
//      ["C", "H", "I", "A", "", "F", "L", "A", "U"],
//      ["", "E", "", "B", "L", "E", "I", "C", "H"],
//      ["", "A", "D", "E", "", "E", "D", "E", "L"]
//    ],
//    letters: [],
//    import_file_date: "2025-03-18",
//    import_file_time: "11:58:42:0",
//    import_file_name: "fcs/spiegel/2025-03-31/11903_11933_spiegel_9x9_d4_DE/crossword_11933_raetsel4u_kr3m_spiegel_9x9_d4_DE.fcs",
//    converted_file_date: "2025-04-02",
//    converted_file_time: "09:16:16:6",
//    licensed_for: "spiegel.de",
//    words: 22,
//    solution_word: "CHIMAERE",
//    empty_fields: 0,
//    double_challenges: 0,
//    converter_version: "0.0.11",
//    supplier: "raetsel4u"
//  }
//};

const usernameInput = document.getElementById('username');
const hostIdInputClient = document.getElementById('hostIdInputClient');
const startHostBtn = document.getElementById('startHostBtn');
const connectHostBtn = document.getElementById('connectHostBtn');
const chat = document.getElementById('chat');
const loadSpiegelBtn = document.getElementById('loadSpiegelBtn');
const loadSueddeutscheBtn = document.getElementById('loadSueddeutscheBtn');
const loadNytBtn = document.getElementById('loadNytBtn');
const dateInput = document.getElementById('dateInput');
const crosswordContainer = document.getElementById('crosswordContainer');
const crosswordHintsContainer = document.getElementById('crosswordHintsContainer');
const hostControls = document.getElementById('hostControls');
const clientControls = document.getElementById('clientControls');

dateInput.value = getDate();

class CrosswordMovement {
    constructor() {
        this.curClueIdx = -1;
        this.stepIdx = -1;
    }
};
localMovement = new CrosswordMovement();


usernameInput.value = randomName();
loadSpiegelBtn.addEventListener('click', (event) => {
    fetch(`https://raw.githubusercontent.com/TimGabrael/fetch_ci/refs/heads/master/spiegel/${dateInput.value}.json`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        crosswordGame = new Crossword("spiegel", data);
    });
});
loadSueddeutscheBtn.addEventListener('click', (event) => {
    fetch(`https://raw.githubusercontent.com/TimGabrael/fetch_ci/refs/heads/master/sueddeutsche/${dateInput.value}.html`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    }).then(htmlString => {

        function decodeSueddeutscheString(keyVal, inputText) {
            var a138 = 256;
            var a159 = keyVal.length;
            var a164 = [];
            for (var i = 0; i < a138; i++)
            {
                a164[i] = i;
            }
            var a163 = 0;
            var a144 = '';
            for (i = 0; i < a138; i++)
            {
                a163 = (a163 + a164[i] + keyVal.charCodeAt(i % a159)) % a138;
                a144 = a164[a163];
                a164[a163] = a164[i];
                a164[i] = a144;
            }

            var a160 = inputText.length;
            var a137 = '';
            i = 0;
            a163 = 0;

            for (var n = 0; n <= a160 - 1; n++)
            {
                i = (i + 1) % a138;
                a163 = (a163 + a164[i]) % a138;
                a144 = a164[a163];
                a164[a163] = a164[i];
                a164[i] = a144;
                var a76 = a164[(a164[i] + a164[a163]) % a138];
                a137 += String.fromCharCode(((inputText.charCodeAt(n)-65)^a76));
            }
            return a137;
        }

        // these are all internal variables that may get used in the matchArray eval step
        let a147 = 0;
        let a150 = 1;
        let a151 = 2;
        let a157 = 3;
        let a83 = {x: -1, y: -1};
        let a37 = true;
        let a41 = 0;
        let a64 = 1;
        let a66 = 2;
        let a31 = 3;
        let a154 = 0;
        let a156 = 1;
        let a155 = 2;
        let a149 = 3;
        let a148 = 4;
        let a152 = 5;
        let a158 = 6;

        const variableName = 'a116';
        const keyName = 'a169';
        const arrayRegex = new RegExp(
            `(?:var|let|const)\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*;`,
            'm'
        );
        const keyRegex = new RegExp(
            `(?:var|let|const)\\s+${keyName}\\s*=\\s*(['"])(.*?)\\1\\s*;?`,
            'm'
        );

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const script = doc.querySelectorAll('script')[1]
        const code = script.textContent;

        const matchArray = code.match(arrayRegex)[1];
        const keyStr = code.match(keyRegex)[2];
        let variable = eval(matchArray);
        for(let y = 0; y < variable.length; y++) {
            for(let x = 0; x < variable[y].length; x++) {
                if(variable[y][x].questions != null) {
                    for(let i = 0; i < variable[y][x].questions.length; i++) {
                        variable[y][x].questions[i].question = decodeSueddeutscheString(keyStr, variable[y][x].questions[i].question);
                        variable[y][x].questions[i].question = variable[y][x].questions[i].question.replaceAll('|', '\n');
                    }
                }
                if(variable[y][x].solution != null) {
                    variable[y][x].solution = decodeSueddeutscheString(keyStr, variable[y][x].solution);
                }
            }
        }

        crosswordGame = new Crossword("sueddeutsche", variable);
    });
});
loadNytBtn.addEventListener('click', (event) => {
    fetch(`https://raw.githubusercontent.com/TimGabrael/fetch_ci/refs/heads/master/nyt/${dateInput.value}.json`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        crosswordGame = new Crossword("nyt", data.body[0]);
    });
});


let peer;
let isHost = false;
let connections = {};
let hostConn = null;

class Crossword {
    constructor(origin, data) {
        crosswordContainer.innerHTML = '';
        crosswordHintsContainer.innerHTML = '';
        localMovement.curClueIdx = -1;
        localMovement.stepIdx = -1;
        
        this.cols = 0;
        this.rows = 0;
        this.clues = [];
        this.solution_word = "";
        this.difficulty = 0;
        this.created = "";
        this.solved = [];
        if(origin == "spiegel") {
            this.initialize_from_spiegel(data);
        }
        else if(origin == "sueddeutsche") {
            this.initialize_from_sueddeutsche(data);
        }
        else if(origin == "nyt") {
            this.initialize_from_nyt(data);
        }
        else {
            return;
        }
        this.generate();
        sendInfoRequest();
    }
    initialize_from_spiegel(data) {
        this.difficulty = data.crosswords.difficulty;
        this.created = data.crosswords.created;
        this.cols = data.crosswords.cols;
        this.rows = data.crosswords.rows;
        this.clues = [];
        this.solved = [];
        let id_counter = 0;
        for(const clue of data.crosswords.clues) {
            const myClue = {
                id: id_counter,
                col: clue.col,
                row: clue.row,
                start: clue.s,
                end: clue.e,
                text: clue.t,
            };
            this.clues.push(myClue);
            id_counter += 1;
        }
        for(const solve of data.crosswords.solved) {
            for(const elem of solve) {
                this.solved.push(elem);
            }
        }
    }
    initialize_from_sueddeutsche(data) {
        this.difficulty = 0;
        this.created = 0;
        this.cols = data.length;
        this.rows = data[0].length;
        this.solved = Array(this.rows * this.cols).fill('');
        let cy = 0;
        let cx = 0;
        for(const subArr of data) {
            cy = 0;
            for(const elem of subArr) {
                if(elem.solution != null) {
                    const curId = cy * this.cols + cx;
                    this.solved[curId] = elem.solution;
                }
                cy += 1;
            }
            cx += 1;
        }

        cx = 0;
        cy = 0;
        let id_counter = 0;
        for(const subArr of data) {
            cy = 0;
            for(const elem of subArr) {
                if(elem.questions != null) {
                    for(const question of elem.questions) {
                        const text = question.question;
                        const offset = question.startOffest;

                        let start = [cx, cy];
                        let end = [cx, cy];
                        let delta = [0, 0];
                        if(offset == 0) {
                            // invalid
                            continue;
                        }
                        else if(offset == 1) {
                            // right in dir right
                            start = [cx + 1, cy];
                            delta = [1, 0];
                        }
                        else if(offset == 2) {
                            // right in dir down
                            start = [cx + 1, cy];
                            delta = [0, 1];
                        }
                        else if(offset == 3) {
                            // down in dir right
                            start = [cx, cy + 1];
                            delta = [1, 0];
                        }
                        else if(offset == 4) {
                            // down in dir down
                            start = [cx, cy + 1];
                            delta = [0, 1];
                        }
                        else if(offset == 5) {
                            // left in dir down
                            start = [cx - 1, cy];
                            delta = [0, 1];
                        }
                        else if(offset == 6) {
                            // up in dir right
                            start = [cx, cy - 1];
                            delta = [1, 0];
                        }
                        else {
                            continue;
                        }
                        end = [start[0], start[1]];
                        while((end[0] + delta[0]) < this.cols && (end[1] + delta[1]) < this.rows) {
                            const nextId = (end[1] + delta[1]) * this.cols + (end[0] + delta[0]);
                            if(this.solved[nextId] == '') {
                                break;
                            }
                            end[0] += delta[0];
                            end[1] += delta[1];
                        }

                        const myClue = {
                            id: id_counter,
                            col: 0, // unused
                            row: 0, // unused
                            start: start,
                            end: end,
                            text: text,
                        };
                        this.clues.push(myClue);

                        id_counter += 1;
                    }
                }
                cy += 1;
            }
            cx += 1;
        }
    }
    initialize_from_nyt(data) {
        this.difficulty = 0;
        this.created = 0;
        this.cols = data.dimensions.width;
        this.rows = data.dimensions.height;
        this.solved = Array(this.rows * this.cols).fill('');
        let cx = 0;
        let cy = 0;
        for(const elem of data.cells) {
            if(elem.answer != null) {
                let elemId = cy * this.cols + cx;
                this.solved[elemId] = elem.answer;
            }
            cx += 1;
            if(cx >= this.cols) {
                cx = 0;
                cy += 1;
            }
        }
        let id_counter = 0;
        for(const clue of data.clues) {
            let startId = clue.cells[0];
            let endId = clue.cells[clue.cells.length - 1];
            let sx = startId % this.cols;
            let sy = Math.floor(startId / this.cols);
            let ex = endId % this.cols;
            let ey = Math.floor(endId / this.cols);

            const myClue = {
                id: id_counter,
                col: 0, // unused
                row: 0, // unused
                start: [sx, sy],
                end: [ex, ey],
                text: clue.text[0].plain,
            };
            this.clues.push(myClue);
            
            id_counter += 1;
        }

    }
    generate() {
        crosswordContainer.innerHTML = '';
        const squareSize = 80;
        crosswordContainer.style.width = `${this.cols * squareSize}`;
        crosswordContainer.style.height = `${this.rows * squareSize}`;
        crosswordContainer.style.display = 'grid';
        crosswordContainer.style.gridTemplateColumns = `repeat(${this.cols}, ${squareSize}px)`;
        crosswordContainer.style.gridTemplateRows = `repeat(${this.rows}, ${squareSize}px)`;

        crosswordHintsContainer.style.width = '200px';
        crosswordHintsContainer.style.display = 'grid';
        crosswordHintsContainer.style.gridTemplateColumns = `repeat(4, 200px)`;
        crosswordHintsContainer.style.gridTemplateRows = `repeat(${this.rows}, 100px)`;

        for(let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.cols; x++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.classList.add('crosswordSquare');
                input.dataset.index = y * this.cols + x;
                input.addEventListener('touchstart', (event) => {
                    event.preventDefault();
                });
                input.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                });
                input.addEventListener('mouseup', (event) => { event.preventDefault(); event.target.focus(); });
                input.addEventListener('touchend', (event) => { event.preventDefault(); event.target.focus(); });

                input.addEventListener('keydown', (event) => {
                    event.preventDefault();
                    let xVal = event.target.dataset.index % this.cols;
                    let yVal = Math.floor(event.target.dataset.index / this.cols);
                    if(event.key == 'Backspace') {
                        event.target.value = '';
                        sendChangeElement(peer.id, event.target.dataset.index, '');
                        event.target.classList.remove("wrong-info");
                        if(event.target.value == '') {
                            const prevInput = this.getNextElemement(localMovement, false);
                            if(prevInput) {
                                prevInput.focus();
                            }
                            return;
                        }
                    }
                    else if(event.key == ' ') {
                        const nextInput = this.getNextElemement(localMovement, true);
                        if(nextInput) {
                            nextInput.focus();
                        }
                        return;
                    }
                    else if(event.key == 'ArrowRight') {
                        const oldxVal = xVal;
                        if(xVal < (this.cols - 1)) {
                            xVal += 1;
                        }
                        const newId = yVal * this.cols + xVal;
                        const inputText = crosswordContainer.querySelector(`input[data-index="${newId}"]`);
                        if(!inputText || inputText.disabled) {
                            xVal = oldxVal;
                        }
                        const validNewId = yVal * this.cols + xVal;
                        this.setMovementWithDirection(validNewId, true);
                        return;
                    }
                    else if(event.key == 'ArrowLeft') {
                        const oldxVal = xVal;
                        if(xVal > 0) {
                            xVal -= 1;
                        }
                        const newId = yVal * this.cols + xVal;
                        const inputText = crosswordContainer.querySelector(`input[data-index="${newId}"]`);
                        if(!inputText || inputText.disabled) {
                            xVal = oldxVal;
                        }
                        const validNewId = yVal * this.cols + xVal;
                        this.setMovementWithDirection(validNewId, true);
                        return;
                    }
                    else if(event.key == 'ArrowUp') {
                        const oldyVal = yVal;
                        if(yVal > 0) {
                            yVal -= 1;
                        }
                        const newId = yVal * this.cols + xVal;
                        const inputText = crosswordContainer.querySelector(`input[data-index="${newId}"]`);
                        if(!inputText || inputText.disabled) {
                            yVal = oldyVal;
                        }
                        const validNewId = yVal * this.cols + xVal;
                        this.setMovementWithDirection(validNewId, false);
                        return;
                    }
                    else if(event.key == 'ArrowDown') {
                        const oldyVal = yVal;
                        if(yVal < (this.rows - 1)) {
                            yVal += 1;
                        }
                        const newId = yVal * this.cols + xVal;
                        const inputText = crosswordContainer.querySelector(`input[data-index="${newId}"]`);
                        if(!inputText || inputText.disabled) {
                            yVal = oldyVal;
                        }
                        const validNewId = yVal * this.cols + xVal;
                        this.setMovementWithDirection(validNewId, false);
                        return;
                    }
                    else if(event.key == 'Tab') {
                        let nextIdx = (localMovement.curClueIdx + 1);
                        let newClueIdx = nextIdx % this.clues.length;
                        if(event.shiftKey) {
                            newClueIdx = (localMovement.curClueIdx - 1);
                            if(newClueIdx < 0) {
                                newClueIdx = this.clues.length - 1;
                            }
                        }
                        this.setMovementFromClue(newClueIdx);
                        return;
                    }

                    const char = event.key;
                    if(char.length != 1) {
                        return;
                    }
                    const code = char[0].toUpperCase();
                    if(event.target.value != code) {
                        sendChangeElement(peer.id, event.target.dataset.index, code);
                        event.target.classList.remove("wrong-info");
                    }
                    event.target.value = code;
                    if(this.filledInEverything()) {
                        if(this.everythingIsCorrect()) {
                            alert("CORRECT!!!");
                        }
                        else {
                            alert("WRONG");
                            this.markAllWrong();
                        }
                    }
                    const nextInput = this.getNextElemement(localMovement, true);
                    if(nextInput) {
                        nextInput.focus();
                    }
                });
                input.addEventListener('click', (event) => {
                    const square = event.target;
                    this.updateMovementInformationFromCurrent(square.dataset.index);
                });
                input.addEventListener('touchend', (event) => {
                    const square = event.target;
                    this.updateMovementInformationFromCurrent(square.dataset.index);
                });
                let is_input_box = false;
                for(const clue of this.clues) {
                    if(this.isIdInClue(clue, input.dataset.index) > -1) {
                        is_input_box = true;
                        break;
                    }
                }
                if(!is_input_box) {
                    input.disabled = true;
                }
                crosswordContainer.appendChild(input);
            }
        }

        // instantly solve the crossword
        //for(const elem of crosswordContainer.children) {
        //    elem.value = this.solved[elem.dataset.index];
        //}
        for(const clue of this.clues) {
            const text = document.createElement('div');
            text.innerText = clue.id + ". " + clue.text;
            text.className = '';
            text.dataset.index = clue.id;
            text.addEventListener('click', (event) => {
                this.setMovementFromClue(event.target.dataset.index);
                this.updateHighlightingFromMovement();
            });
            crosswordHintsContainer.appendChild(text);
        }
    }

    filledInEverything() {
        let filledIn = true;
        for(const elem of crosswordContainer.children) {
            if(this.solved[elem.dataset.index] != '' && elem.value == '') {
                filledIn = false;
                break;
            }
            for(const classElem of elem.classList) {
                if(classElem == 'wrong-info') {
                    filledIn = false;
                    break;
                }
            }
        }
        return filledIn;
    }
    everythingIsCorrect() {
        let correct = true;
        for(const elem of crosswordContainer.children) {
            if(this.solved[elem.dataset.index] != '' && this.solved[elem.dataset.index] != elem.value) {
                correct = false;
                break;
            }
        }
        return correct;
    }
    markAllWrong() {
        for(const elem of crosswordContainer.children) {
            if(this.solved[elem.dataset.index] != "" && this.solved[elem.dataset.index] != elem.value) {
                elem.classList.add("wrong-info");
            }
        }
    }
    setMovementFromClue(clueId) {
        for(const clue of this.clues) {
            if(clue.id == clueId) {
                const deltaX = clue.end[0] - clue.start[0];
                const deltaY = clue.end[1] - clue.start[1];
                const dx = Math.min(deltaX, 1);
                const dy = Math.min(deltaY, 1);
                const steps = Math.max(deltaX, deltaY) + 1;
                for(let i = 0; i < steps; i++) {
                    const elemId = (clue.start[1] + dy * i) * this.cols + clue.start[0] + dx * i;
                    const inputText = crosswordContainer.querySelector(`input[data-index="${elemId}"]`);
                    if(inputText && (inputText.value == '' || i == (steps - 1))) {
                        localMovement.curClueIdx = clueId;
                        localMovement.stepIdx = i;
                        
                        if(inputText) {
                            inputText.focus();
                        }
                        this.updateHighlightingFromMovement();
                        return true;
                    }
                }
                break;
            }
        }
        return false;
    }
    setMovementWithDirection(elemId, horizontal) {
        for(const clue of this.clues) {
            const stepIdx = this.isIdInClue(clue, elemId);
            if(stepIdx > -1) {
                const isHorizontal = (clue.end[0] - clue.start[0]) > 0;
                if(isHorizontal == horizontal) {
                    localMovement.curClueIdx = clue.id;
                    localMovement.stepIdx = stepIdx;
                    const inputText = crosswordContainer.querySelector(`input[data-index="${elemId}"]`);
                    if(inputText) {
                        inputText.focus();
                    }
                    this.updateHighlightingFromMovement();
                    return true;
                }
            }
        }
        return false;
    }
    updateHighlightingFromMovement() {
        for(const child of crosswordContainer.children) {
            child.classList.remove('green-border');
        }
        for(const child of crosswordHintsContainer.children) {
            child.className = '';
        }
        for(const clue of this.clues) {
            if(localMovement.curClueIdx == clue.id) {
                const clueText = crosswordHintsContainer.querySelector(`div[data-index="${clue.id}"]`);
                if(clueText) {
                    clueText.classList.add('highlight-text');
                }

                const deltaX = clue.end[0] - clue.start[0];
                const deltaY = clue.end[1] - clue.start[1];
                const dx = Math.min(deltaX, 1);
                const dy = Math.min(deltaY, 1);
                const steps = Math.max(deltaX, deltaY) + 1;
                for(let i = 0; i < steps; i++) {
                    let curId = (clue.start[1] + dy * i) * this.cols + (clue.start[0] + dx * i);
                    const inputText = crosswordContainer.querySelector(`input[data-index="${curId}"]`);
                    inputText.classList.add('green-border');
                }
                break;
            }
        }
    }
    updateMovementInformationFromCurrent(curId) {
        let cur_is_hor = true;
        if(localMovement.curClueIdx > -1 && localMovement.curClueIdx < this.clues.length) {
            const clue = this.clues[localMovement.curClueIdx];
            cur_is_hor = clue.start[0] != clue.end[0];
            const stepIdx = this.isIdInClue(clue, curId);
            if(stepIdx > -1) {
                if(stepIdx != localMovement.stepIdx) {
                    localMovement.stepIdx = stepIdx;
                    this.updateHighlightingFromMovement();
                    return;
                }
            }
        }
        for(let clueIdx = 0; clueIdx < this.clues.length; clueIdx++) {
            if(clueIdx == localMovement.curClueIdx) {
                continue;
            }
            const clue = this.clues[clueIdx];
            const clue_is_hor = clue.start[0] != clue.end[0];
            if(clue_is_hor != cur_is_hor) {
                continue;
            }
            const stepIdx = this.isIdInClue(clue, curId);
            if(stepIdx > -1) {
                localMovement.curClueIdx = clueIdx;
                localMovement.stepIdx = stepIdx;
                this.updateHighlightingFromMovement();
                return;
            }
        }
        for(let clueIdx = 0; clueIdx < this.clues.length; clueIdx++) {
            if(clueIdx == localMovement.curClueIdx) {
                continue;
            }
            const clue = this.clues[clueIdx];
            const stepIdx = this.isIdInClue(clue, curId);
            if(stepIdx > -1) {
                localMovement.curClueIdx = clueIdx;
                localMovement.stepIdx = stepIdx;
                this.updateHighlightingFromMovement();
                break;
            }
        }

    }
    isIdInClue(clue, id) {
        const deltaX = clue.end[0] - clue.start[0];
        const deltaY = clue.end[1] - clue.start[1];
        const dx = Math.min(deltaX, 1);
        const dy = Math.min(deltaY, 1);
        const steps = Math.max(deltaX, deltaY) + 1;
        for(let i = 0; i < steps; i++) {
            let curId = (clue.start[1] + dy * i) * this.cols + (clue.start[0] + dx * i);
            if(curId == id) {
                return i;
            }
        }
        return -1;
    }
    getNextElemement(movement, forward) {
        for(let clue of this.clues) {
            if(clue.id != movement.curClueIdx) {
                continue;
            }
            const deltaX = clue.end[0] - clue.start[0];
            const deltaY = clue.end[1] - clue.start[1];
            const dx = Math.min(deltaX, 1);
            const dy = Math.min(deltaY, 1);
            const steps = Math.max(deltaX, deltaY) + 1;
            for(let i = 0; i < steps; i++) {
                let curId = (clue.start[1] + dy * i) * this.cols + (clue.start[0] + dx * i);
                if((i == movement.stepIdx - 1 && !forward) || (i == movement.stepIdx + 1 && forward)) {
                    movement.stepIdx = i;
                    return crosswordContainer.querySelector(`input[data-index="${curId}"]`);
                }
            }
        }
        return null;
    }
};
crosswordGame = {};//new Crossword("spiegel", crosswordData);





function broadcastFromHost(senderId, data) {
    for (const id in connections) {
        if (id !== senderId) {
            connections[id].send(data);
        }
    }
}

function enableChat() {
    loadSpiegelBtn.hidden = false;
    loadSueddeutscheBtn.hidden = false;
    loadNytBtn.hidden = false;
    dateInput.hidden = false;
    hostControls.style.display = 'none';
    clientControls.style.display = 'none';
}


usernameInput.onchange = () => {
    if (!isHost && hostConn && hostConn.open) {
        hostConn.send({
            type: 'namechange',
            user: usernameInput.value.trim() || randomName(),
            from: peer.id
        });
    }
};
function sendChangeElement(senderId, elemId, newVal) {
    data = {
        type: 'change',
        changes: [{
            id: elemId,
            val: newVal,
        }],
        from: senderId,
    };
    if (!isHost && hostConn && hostConn.open) {
        hostConn.send(data);
    }
    else if(isHost) {
        broadcastFromHost(senderId, data);
    }
}
function sendInfoRequest() {
    data = {
        type: 'info_req',
        from: peer.id,
    };
    if (!isHost && hostConn && hostConn.open) {
        hostConn.send(data);
    }

}

function receiveChange(data) {
    if(isHost) {
        broadcastFromHost(data.from, data);
    }

    for(const change of data.changes) {
        for(const elem of crosswordContainer.children) {
            if(change.id == elem.dataset.index && change.val != elem.value) {
                elem.value = change.val;
                elem.classList.remove("wrong-info");
            }
        }
    }
    if(crosswordGame.filledInEverything()) {
        if(crosswordGame.everythingIsCorrect()) {
            alert("CORRECT!!!");
        }
        else {
            alert("WRONG");
            crosswordGame.markAllWrong();
        }
    }
}
function hostSendProgress(reqId) {
    let elemValues = [];
    for(const elem of crosswordContainer.children) {
        elemValues.push({id: elem.dataset.index, val: elem.value});
    }
    const data = {
        type: 'progress',
        data: elemValues,
        from: peer.id,
    };
    connections[reqId].send(data);

}
function clientReceiveProgress(data) {
    for(const elem of crosswordContainer.children) {
        for(const d of data.data) {
            if(elem.dataset.index == d.id) {
                elem.value = d.val;
                elem.classList.remove("wrong-info");
                break;
            }
        }
    }
    if(crosswordGame.filledInEverything()) {
        if(crosswordGame.everythingIsCorrect()) {
            alert("CORRECT!!!");
        }
        else {
            alert("WRONG");
            crosswordGame.markAllWrong();
        }
    }
}

startHostBtn.onclick = () => {
    const desiredId = randomId();
    isHost = true;
    peer = new Peer(desiredId);

    const url = new URL(window.location);
    url.searchParams.set('host_id', desiredId);
    window.history.replaceState(null, '', url.toString());

    peer.on('open', id => {
        enableChat();
        console.log('Host started with ID:', id);
    });

    peer.on('connection', conn => {
        connections[conn.peer] = conn;
        console.log('New connection from', conn.peer);

        conn.on('data', data => {
            if (data.type === 'join') {
            } else if (data.type === 'chat') {
                broadcastFromHost(conn.peer, data);
            } else if (data.type === 'namechange') {
            }
            else if(data.type === 'change') {
                receiveChange(data);
            }
            else if(data.type === 'info_req') {
                hostSendProgress(data.from);
            }
        });

        conn.on('close', () => {
            console.log('Connection closed:', conn.peer);
            delete connections[conn.peer];
        });
    });


    startHostBtn.disabled = true;
    connectHostBtn.disabled = true;
    hostIdInputClient.disabled = true;
};

connectHostBtn.onclick = () => {
    const hostId = hostIdInputClient.value.trim();
    if (!hostId) {
        alert("Please enter Host ID to connect");
        return;
    }

    isHost = false;
    peer = new Peer();

    peer.on('open', id => {
        console.log('Client peer ID:', id);
        hostConn = peer.connect(hostId);

        hostConn.on('open', () => {
            console.log('Connected to host');
            enableChat();

            hostConn.send({
                type: 'join',
                user: usernameInput.value.trim() || randomName(),
                from: id
            });
        });

        hostConn.on('data', data => {
            if (data.type === 'chat' && data.from !== peer.id) {
            }
            else if(data.type === 'change' && data.from !==  peer.id) {
                receiveChange(data);
            }
            else if(data.type === 'progress' && data.from !==  peer.id) {
                clientReceiveProgress(data);
            }
        });

        hostConn.on('close', () => {
            messageInput.disabled = true;
            loadSpiegelBtn.hidden = true;
            loadSueddeutscheBtn.hidden = true;
            loadNytBtn.hidden = true;
            dateInput.hidden = true;
        });
    });
    peer.on('error', (_) => {
        if (window.location.search.includes('host_id=')) {
            const cleanURL = window.location.origin + window.location.pathname;
            window.location.replace(cleanURL);
        }
    });

    startHostBtn.disabled = true;
    connectHostBtn.disabled = true;
    hostIdInputClient.disabled = true;
};

function ConnectOnUrlState() {
    const url = new URL(window.location);
    const desired_id = url.searchParams.get('host_id');
    if(desired_id != null) {
        hostIdInputClient.value = desired_id;
        connectHostBtn.onclick();
    }
    else {
    }
}

ConnectOnUrlState();




