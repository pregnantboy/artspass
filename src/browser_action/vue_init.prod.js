(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var mainlist = vueInit([]);

function vueInit(accounts) {
    return new Vue({
        el: "#app",
        data: {
            accounts: accounts,
            showAccount: false,
            searchString: "",
            canEdit: true,
            currAccount: {},
            isSyncing: false
        },
        methods: {
            showNewAccountPage: function () {
                populateAccount();
                this.showAccount = true;
                this.canEdit = true;
            },
            showAccountDetailsPage: function (event, account) {
                populateAccount(account);
                this.showAccount = true;
                this.canEdit = false;
                console.log(account);
            },
            navigateBack: function () {
                this.showAccount = false;
            },
            getIcon: function (event) {
                let url = event.target.value;
                if (validateURL(url)) {}
            },
            edit: function () {
                this.canEdit = true;
            },
            save: function () {
                this.navigateBack();
            },
            copyUsername(element, event, account) {
                var usernameToCopy = this.currAccount.username; // account view
                if (account) {
                    // list view
                    usernameToCopy = account.username;
                }
                event.stopPropagation();
                copyToClipboard(usernameToCopy);
                if (account) {
                    // list view
                    var copyText = element.$els.copyuser;
                    copyText.innerText = "Copied!";
                    setTimeout(() => {
                        copyText.innerText = "Username";
                    }, 2000);
                } else {
                    event.target.innerText = "check";
                    setTimeout(() => {
                        event.target.innerText = "content_copy";
                    }, 2000);
                }
            },
            copyPassword(element, event, account) {
                var passwordToCopy = this.currAccount.password;
                if (account) {
                    passwordToCopy = account.password;
                }
                event.stopPropagation();
                copyToClipboard(passwordToCopy);
                if (account) {
                    var copyText = element.$els.copypass;
                    copyText.innerText = "Copied!";
                    setTimeout(() => {
                        copyText.innerText = "Password";
                    }, 2000);
                } else {
                    event.target.innerText = "check";
                    setTimeout(() => {
                        event.target.innerText = "content_copy";
                    }, 2000);
                }
            },
            reload() {
                reload();
            }
        },
        computed: {
            filteredAccounts: function () {
                return this.accounts.filter(acc => {
                    return acc.site.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1;
                });
            }
        }
    });
}

function reload() {
    mainlist.isSyncing = true;
    chrome.runtime.sendMessage({
        event: "reload"
    }, accountsArray => {
        console.log(accountsArray);
        mainlist.accounts = accountsArray;
        setTimeout(() => {
            mainlist.isSyncing = false;
        }, 1000);
    });
}

function addOrEditAccount(account) {}

chrome.runtime.sendMessage({
    event: "onload"
}, function (accountsArray) {
    mainlist.accounts = accountsArray;
    reload();
});

// https://github.com/mat/besticon#self-hosting

function populateAccount(account) {
    if (!account) {
        account = {};
    }
    mainlist.currAccount = new Account(account.site, account.url, account.username, account.password, account.key);
}

function validateURL(textval) {
    var urlregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return urlregex.test(textval);
}

function copyToClipboard(text) {
    if (!text || text.length === 0) {
        return;
    }
    var textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
    } catch (err) {
        console.log("Oops, unable to copy");
    } finally {
        document.body.removeChild(textArea);
    }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGJyb3dzZXJfYWN0aW9uXFx2dWVfaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksV0FBVyxRQUFRLEVBQVIsQ0FBZjs7QUFFQSxTQUFTLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkI7QUFDdkIsV0FBTyxJQUFJLEdBQUosQ0FBUTtBQUNYLFlBQUksTUFETztBQUVYLGNBQU07QUFDRixzQkFBVSxRQURSO0FBRUYseUJBQWEsS0FGWDtBQUdGLDBCQUFjLEVBSFo7QUFJRixxQkFBUyxJQUpQO0FBS0YseUJBQWEsRUFMWDtBQU1GLHVCQUFXO0FBTlQsU0FGSztBQVVYLGlCQUFTO0FBQ0wsZ0NBQW9CLFlBQVk7QUFDNUI7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EscUJBQUssT0FBTCxHQUFlLElBQWY7QUFDSCxhQUxJO0FBTUwsb0NBQXdCLFVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQjtBQUM5QyxnQ0FBZ0IsT0FBaEI7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EscUJBQUssT0FBTCxHQUFlLEtBQWY7QUFDQSx3QkFBUSxHQUFSLENBQVksT0FBWjtBQUNILGFBWEk7QUFZTCwwQkFBYyxZQUFZO0FBQ3RCLHFCQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDSCxhQWRJO0FBZUwscUJBQVMsVUFBVSxLQUFWLEVBQWlCO0FBQ3RCLG9CQUFJLE1BQU0sTUFBTSxNQUFOLENBQWEsS0FBdkI7QUFDQSxvQkFBSSxZQUFZLEdBQVosQ0FBSixFQUFzQixDQUFFO0FBQzNCLGFBbEJJO0FBbUJMLGtCQUFNLFlBQVk7QUFDZCxxQkFBSyxPQUFMLEdBQWUsSUFBZjtBQUNILGFBckJJO0FBc0JMLGtCQUFNLFlBQVk7QUFDZCxxQkFBSyxZQUFMO0FBQ0gsYUF4Qkk7QUF5QkwseUJBQWEsT0FBYixFQUFzQixLQUF0QixFQUE2QixPQUE3QixF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LENBQTBCLFFBQTFCO0FBQ0g7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbWFpbmxpc3QgPSB2dWVJbml0KFtdKTtcclxuXHJcbmZ1bmN0aW9uIHZ1ZUluaXQoYWNjb3VudHMpIHtcclxuICAgIHJldHVybiBuZXcgVnVlKHtcclxuICAgICAgICBlbDogXCIjYXBwXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBhY2NvdW50czogYWNjb3VudHMsXHJcbiAgICAgICAgICAgIHNob3dBY2NvdW50OiBmYWxzZSxcclxuICAgICAgICAgICAgc2VhcmNoU3RyaW5nOiBcIlwiLFxyXG4gICAgICAgICAgICBjYW5FZGl0OiB0cnVlLFxyXG4gICAgICAgICAgICBjdXJyQWNjb3VudDoge30sXHJcbiAgICAgICAgICAgIGlzU3luY2luZzogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZHM6IHtcclxuICAgICAgICAgICAgc2hvd05ld0FjY291bnRQYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZUFjY291bnQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0FjY291bnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5FZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hvd0FjY291bnREZXRhaWxzUGFnZTogZnVuY3Rpb24gKGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBwb3B1bGF0ZUFjY291bnQoYWNjb3VudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dBY2NvdW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuRWRpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWNjb3VudCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hdmlnYXRlQmFjazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93QWNjb3VudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRJY29uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdGVVUkwodXJsKSkge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWRpdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5FZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZUJhY2soKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29weVVzZXJuYW1lKGVsZW1lbnQsIGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlcm5hbWVUb0NvcHkgPSB0aGlzLmN1cnJBY2NvdW50LnVzZXJuYW1lOyAvLyBhY2NvdW50IHZpZXdcclxuICAgICAgICAgICAgICAgIGlmIChhY2NvdW50KSB7IC8vIGxpc3Qgdmlld1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lVG9Db3B5ID0gYWNjb3VudC51c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgY29weVRvQ2xpcGJvYXJkKHVzZXJuYW1lVG9Db3B5KTtcclxuICAgICAgICAgICAgICAgIGlmIChhY2NvdW50KSB7IC8vIGxpc3Qgdmlld1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3B5VGV4dCA9IGVsZW1lbnQuJGVscy5jb3B5dXNlcjtcclxuICAgICAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSBcIkNvcGllZCFcIjtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29weVRleHQuaW5uZXJUZXh0ID0gXCJVc2VybmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSBcImNoZWNrXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSBcImNvbnRlbnRfY29weVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvcHlQYXNzd29yZChlbGVtZW50LCBldmVudCwgYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhc3N3b3JkVG9Db3B5ID0gdGhpcy5jdXJyQWNjb3VudC5wYXNzd29yZDtcclxuICAgICAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmRUb0NvcHkgPSBhY2NvdW50LnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQocGFzc3dvcmRUb0NvcHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29weVRleHQgPSBlbGVtZW50LiRlbHMuY29weXBhc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgY29weVRleHQuaW5uZXJUZXh0ID0gXCJDb3BpZWQhXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlUZXh0LmlubmVyVGV4dCA9IFwiUGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gXCJjaGVja1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gXCJjb250ZW50X2NvcHlcIjtcclxuICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVsb2FkKCkge1xyXG4gICAgICAgICAgICAgICAgcmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkQWNjb3VudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjY291bnRzLmZpbHRlcigoYWNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhY2Muc2l0ZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5zZWFyY2hTdHJpbmcudG9Mb3dlckNhc2UoKSkgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbG9hZCgpIHtcclxuICAgIG1haW5saXN0LmlzU3luY2luZyA9IHRydWU7XHJcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XHJcbiAgICAgICAgZXZlbnQ6IFwicmVsb2FkXCJcclxuICAgIH0sIChhY2NvdW50c0FycmF5KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYWNjb3VudHNBcnJheSk7XHJcbiAgICAgICAgbWFpbmxpc3QuYWNjb3VudHMgPSBhY2NvdW50c0FycmF5O1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBtYWlubGlzdC5pc1N5bmNpbmcgPSBmYWxzZTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRPckVkaXRBY2NvdW50KGFjY291bnQpIHtcclxuXHJcbn1cclxuXHJcbmNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcclxuICAgIGV2ZW50OiBcIm9ubG9hZFwiXHJcbn0sIGZ1bmN0aW9uIChhY2NvdW50c0FycmF5KSB7XHJcbiAgICBtYWlubGlzdC5hY2NvdW50cyA9IGFjY291bnRzQXJyYXk7XHJcbiAgICByZWxvYWQoKTtcclxufSk7XHJcblxyXG5cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdC9iZXN0aWNvbiNzZWxmLWhvc3RpbmdcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQWNjb3VudChhY2NvdW50KSB7XHJcbiAgICBpZiAoIWFjY291bnQpIHtcclxuICAgICAgICBhY2NvdW50ID0ge307XHJcbiAgICB9XHJcbiAgICBtYWlubGlzdC5jdXJyQWNjb3VudCA9IG5ldyBBY2NvdW50KGFjY291bnQuc2l0ZSwgYWNjb3VudC51cmwsIGFjY291bnQudXNlcm5hbWUsIGFjY291bnQucGFzc3dvcmQsIGFjY291bnQua2V5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVVUkwodGV4dHZhbCkge1xyXG4gICAgdmFyIHVybHJlZ2V4ID0gLygoKFtBLVphLXpdezMsOX06KD86XFwvXFwvKT8pKD86Wy07OiY9XFwrXFwkLFxcd10rQCk/W0EtWmEtejAtOS4tXSt8KD86d3d3LnxbLTs6Jj1cXCtcXCQsXFx3XStAKVtBLVphLXowLTkuLV0rKSgoPzpcXC9bXFwrfiVcXC8uXFx3LV9dKik/XFw/Pyg/OlstXFwrPSY7JUAuXFx3X10qKSM/KD86W1xcd10qKSk/KS87XHJcbiAgICByZXR1cm4gdXJscmVnZXgudGVzdCh0ZXh0dmFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQpIHtcclxuICAgIGlmICghdGV4dCB8fCB0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciB0ZXh0QXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuICAgIHRleHRBcmVhLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUudG9wID0gMDtcclxuICAgIHRleHRBcmVhLnN0eWxlLmxlZnQgPSAwO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUud2lkdGggPSBcIjJlbVwiO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gXCIyZW1cIjtcclxuICAgIHRleHRBcmVhLnN0eWxlLnBhZGRpbmcgPSAwO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUuYm9yZGVyID0gXCJub25lXCI7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5ib3hTaGFkb3cgPSBcIm5vbmVcIjtcclxuICAgIHRleHRBcmVhLnN0eWxlLmJhY2tncm91bmQgPSBcInRyYW5zcGFyZW50XCI7XHJcbiAgICB0ZXh0QXJlYS52YWx1ZSA9IHRleHQ7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRBcmVhKTtcclxuICAgIHRleHRBcmVhLnNlbGVjdCgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgc3VjY2Vzc2Z1bCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcclxuICAgICAgICB2YXIgbXNnID0gc3VjY2Vzc2Z1bCA/IFwic3VjY2Vzc2Z1bFwiIDogXCJ1bnN1Y2Nlc3NmdWxcIjtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvcHlpbmcgdGV4dCBjb21tYW5kIHdhcyBcIiArIG1zZyk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk9vcHMsIHVuYWJsZSB0byBjb3B5XCIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHRBcmVhKTtcclxuICAgIH1cclxufSJdfQ==
