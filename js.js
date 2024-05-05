const synth = window.speechSynthesis;
let voices = []
const SE = document.querySelector("#SE")
const SC = document.querySelector("#SC")
let count = 0
let OPTs = {}

const initdata = {
    "time1": 1000,
    "time2": 2000,
    "time3": 3000,
    "speed": 1,
    "repeat": 3,
    "letter": true,
    "chinese": true,
    "text_E": [
        "apple"
    ],
    "text_C": [
        "蘋果"
    ]
}
function UpData(data) {
    jsonData = encodeURIComponent(JSON.stringify(data));
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    document.cookie = `jxECtts=${jsonData}; expires=${expires.toUTCString()}`;
    console.log(jsonData)
    // alert(jsonData.length)
    // alert(document.cookie)
}

// UpData(null)
// alert("ddd")

const cookie = document.cookie;
const cookies = cookie.split(';');
let jxdata;
for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'jxECtts') {
        jxdata = decodeURIComponent(value);
        break;
    }
}

if (!jxdata || jxdata == "null") {
    OPTs = initdata
    UpData(OPTs)
} else {
    OPTs = JSON.parse(jxdata);
}
// alert(JSON.stringify(OPTs))
// -----------------------------------------------------
setTimeout(() => {
    voices = synth.getVoices();
    console.log(voices)
    // console.log(voices.filter(e => e.name == "Google 國語（臺灣）"))

    for (let i = 0; i < voices.length; i++) {
        let aopt = document.createElement("option")
        aopt.text = voices[i].name
        SE.appendChild(aopt)

        let aopt2 = document.createElement("option")
        aopt2.text = voices[i].name
        SC.appendChild(aopt2)
    }
}, 1000);

// ----------------------------------------------------------------------
const opts = document.querySelector("#opt").querySelectorAll("input")
const opts2 = document.querySelector("#opt2").querySelectorAll("input")
opts.forEach(e => {
    e.addEventListener("input", () => {
        inputt(e)
    })
    set(e)
})
opts2.forEach(e => {
    e.addEventListener("input", () => {
        inputt(e)
    })
    set(e)
})

function set(e) {
    const id = e.id
    let value = OPTs[id]
    if (/time|repeat|speed+/.test(id)) {
        const text = e.nextSibling.nextSibling
        text.textContent = value
        value = value * 1
    } else {
        value = value ? 1 : 0
    }
    if (/time+/.test(id)) {
        value = value / 50
    }
    if (id == "speed") {
        value = value * 10
    }
    e.value = value
}

function inputt(e) {
    const id = e.id
    let value = e.value
    if (/time+/.test(id)) {
        value = value * 50
    }
    if (id == "speed") {
        value = value / 10
    }
    if (/time|repeat|speed+/.test(id)) {
        value = value * 1
        const text = e.nextSibling.nextSibling
        text.textContent = value
    } else {
        value = value == 1
    }
    console.log(id, value)
    OPTs[id] = value
    UpData(OPTs)
}

console.log(OPTs)
const textD = document.querySelector("#text").querySelectorAll("textarea")
textD.forEach(e => {
    e.addEventListener("input", () => {
        OPTs[e.id] = e.value.split("\n")
        console.log(OPTs)
        UpData(OPTs)
    })
    // console.log(e.id,OPTs)
    e.value = OPTs[e.id].join("\n")
    e.textContent = OPTs[e.id].join("\n")
})
// -----------------------------------------------------
function playSpeech(utterances, index) {
    if (index < utterances.length) {
        let step = utterances[index]
        if (typeof step == "number") {
            setTimeout(function () {
                playSpeech(utterances, index + 1);
            }, step);
            return
        }
        if (utterances[index].count != count) {
            return
        }
        console.log(utterances[index].count, count)
        window.speechSynthesis.speak(utterances[index]);
        setTimeout(function () {
            playSpeech(utterances, index + 1);
        }, 10);
    }
}
document.querySelector("#play").addEventListener("click", () => {
    count++
    let utterances = [];
    for (let i = 0; i < OPTs.text_E.length; i++) {
        let tE = new SpeechSynthesisUtterance(OPTs.text_E[i]);
        // tE.lang = "en-US";
        tE.rate = OPTs.speed
        tE.count = count
        tE.voice = voices.filter(e => e.name == SE.options[SE.selectedIndex].value)[0];
        for (let j = 0; j < OPTs.repeat; j++) {
            utterances.push(tE);
            utterances.push(OPTs.time1);
        }

        if (OPTs.letter) {
            let tEL = new SpeechSynthesisUtterance(OPTs.text_E[i].split("").join(" "));
            // tEL.lang = "en-US";
            tEL.rate = OPTs.speed
            tEL.count = count
            tEL.voice = voices.filter(e => e.name == SE.options[SE.selectedIndex].value)[0];
            utterances.push(tEL);
        }

        if (OPTs.chinese) {
            utterances.push(OPTs.time2);
            let tC = new SpeechSynthesisUtterance(OPTs.text_C[i]);
            // tC.lang = "zh-TW";
            tC.rate = OPTs.speed
            tC.count = count
            tC.voice = voices.filter(e => e.name == SC.options[SC.selectedIndex].value)[0];
            utterances.push(tC);
        }
        utterances.push(OPTs.time3);

        console.log(utterances)
    }
    playSpeech(utterances, 0);
})
