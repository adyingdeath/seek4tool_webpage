let $ = (tar) => document.querySelector(tar);
document.addEventListener('DOMContentLoaded', () => {
    const action = () => {
        if($('#main').getAttribute('data-state') === "beforequery"){
            $('#main').setAttribute('data-state', "whilequery");
        }else{
            $('#resultItem').innerHTML = '';
        }
        $('#waitTip').setAttribute('data-state', "wait");
        const query = $('#query').value;

        const lang = localStorage.getItem("lang");

        const raw = JSON.stringify({
            "query": query,
            "lang": lang ? lang : en
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: "follow"
        };

        fetch("https://server.zeabur.internal:3000/api/tools/query", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if(result.error === undefined) {
                    $('#waitTip').setAttribute('data-state', "none");
                    animatedAdd(result);
                }else{
                    console.log("ERROR: " + result.error);
                }
                
            })
            .catch((error) => console.error(error));
    }
    $('#queryBtn').addEventListener('click', action);
    $('#query').addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            action();
        }
    });
    $('#langSelect').addEventListener('click', () => {
        $('#langZone').style.display = 'flex';
    });
    $('#langZone').addEventListener('click', (e) => {
        if(e.target.getAttribute('id') === "langZone")
            $('#langZone').style.display = 'none';
    });
    // 设置语言
    const setLang = (e) => {
        localStorage.setItem('lang', e.target.getAttribute('data-lang'));
        $('#langZone').style.display = 'none';
    };
    $('#langZone').querySelectorAll("div[data-lang]").forEach((e) => {
        e.addEventListener('click', setLang);
    });
});
async function sleep(time) {
    return new Promise((r) => setTimeout(r, time));
}
async function animatedAdd(list) {
    for(let i of list) {
        addResult(i);
        await sleep(100);
    }
}
function addResult(info) {
    const tpl = $('#resultTpl').content;
    tpl.querySelector('img').src = info.icon;
    tpl.querySelector('a').href = info.link;
    tpl.querySelector('.st-title').textContent = info.name;
    tpl.querySelector('.st-desc').textContent = info.description;
    const newborn = document.importNode(tpl, true);
    $('#resultItem').appendChild(newborn);
}