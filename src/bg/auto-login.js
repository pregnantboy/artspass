// module.exports = function (url, username, password) {
//     chrome.tabs.create({
//         "url": url
//     }, function (tab) {
//         chrome.tabs.executeScript({
//             code: 'document.body.style.backgroundColor="red"'
//         }); .
//     });
// };

// var actualCode = '(' + function(param1, param2) {
//     // All code is executed in a local scope.
//     // For example, the following does NOT overwrite the global `alert` method
//     var alert = null;
//     // To overwrite a global variable, prefix `window`:
//     window.alert = null;
// } + ')(param1, param2);';
module.exports = function (username, password) {
    var fillUsername = function (el) {
        el.value = username;
    };
    var usernameElements = document.querySelectorAll("input:not([type]), input[type='text'], input[type='email']");
    if (!usernameElements || usernameElements.length === 0) {
        alert("No username field found");
        return;
    } else {
        let maxPoints = 0;
        let maxUserEl = null;
        usernameElements.forEach(userEl => {
            let points = 0;
            if (userEl.input && userEl.input === "email") {
                points++;
            }
            [userEl.name, userEl.placeholder, userEl.className, userEl["aria-label"], userEl.id].forEach(attr => {
                if (attr) {
                    let matches = attr.toLowerCase().match(/(user|email|e-mail|login)/g);
                    if (matches) {
                        points += matches.length;
                    }
                }
            });
            if (userEl.autocomplete) {
                points++;
            }
            if (maxPoints < points) {
                maxPoints = points;
                maxUserEl = userEl;
            }
        });
        if (maxPoints > 0) {
            fillUsername(maxUserEl);
        }
    }

    var fillPassword = function (el) {
        el.value = password;
    };
    var passwordElements = document.querySelectorAll("input[type='password']");
    if (passwordElements.length === 0) {
        alert("No password field found");
        return;
    }
    if (passwordElements.length === 1) {
        fillPassword(passwordElements[0]);
    } else {
        let maxPoints = 0;
        let maxPwEl = passwordElements[0];
        passwordElements.forEach(pwEl => {
            let points = 0;
            [pwEl.name, pwEl.placeholder, pwEl.className].forEach(attr => {
                if (attr) {
                    let matches = attr.toLowerCase().match(/(password|pw|pass)/g);
                    if (matches) {
                        points += matches.length;
                    }
                }
            });
            if (pwEl.placeholder) {
                if (pwEl.placeholder.toLowerCase().match(/(new|retype|confirm)/)) {
                    points -= 9999;
                }
            }
            if (maxPoints < points) {
                maxPoints = points;
                maxPwEl = pwEl;
            }
        });
        fillPassword(maxPwEl);
    }

};
