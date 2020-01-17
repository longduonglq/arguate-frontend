import {HOST_URL} from "./wsConfig";

const sendHttp = (dir, json) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(json);
        //console.log(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = err => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //console.log(xhr.responseText);
            } else if (xhr.status > 400) {
                console.log('error');
            }
        };
        xhr.open('POST', `${HOST_URL}/${dir}/`);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function (e) {
            resolve(xhr.responseText);
        };
        xhr.onerror = function(e) {
            reject('could not complete xhr request');
        };
        xhr.send(data);
    });
};

export default sendHttp;
