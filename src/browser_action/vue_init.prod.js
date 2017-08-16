(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


var accounts = [{
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}, {
    site: "Google",
    username: "user1",
    password: "password1"
}, {
    site: "Yahoo",
    username: "user2",
    password: "password2"
}];

var mainlist = new Vue({
    el: '#app',
    data: {
        accounts: accounts,
        showAccount: false,
        searchString: "",
        canEdit: true,
        site: "",
        url: "",
        username: "",
        password: ""
    },
    methods: {
        showNewAccountPage: function () {
            clearInput();
            this.showAccount = true;
            this.canEdit = true;
        },
        showAccountDetailsPage: function (event, account) {
            fillInput(account);
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
            var usernameToCopy = this.username;
            if (account) {
                usernameToCopy = account.username;
            }
            event.stopPropagation();
            copyToClipboard(usernameToCopy);
            if (account) {
                var copyText = element.$els.copyuser;
                copyText.innerText = 'Copied!';
                setTimeout(() => {
                    copyText.innerText = 'Username';
                }, 2000);
            } else {
                event.target.innerText = 'check';
                setTimeout(() => {
                    event.target.innerText = 'content_copy';
                }, 2000);
            }
        },
        copyPassword(element, event, account) {
            var passwordToCopy = this.password;
            if (account) {
                passwordToCopy = account.password;
            }
            event.stopPropagation();
            copyToClipboard(passwordToCopy);
            console.log(element);
            if (account) {
                var copyText = element.$els.copypass;
                copyText.innerText = 'Copied!';
                setTimeout(() => {
                    copyText.innerText = 'Password';
                }, 2000);
            } else {
                event.target.innerText = 'check';
                setTimeout(() => {
                    event.target.innerText = 'content_copy';
                }, 2000);
            }
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

// https://github.com/mat/besticon#self-hosting
function clearInput() {
    mainlist.site = "";
    mainlist.url = "";
    mainlist.username = "";
    mainlist.password = "";
}

function fillInput(account) {
    mainlist.site = account.site;
    mainlist.url = account.url;
    mainlist.username = account.username;
    mainlist.password = account.password;
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
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    } finally {
        document.body.removeChild(textArea);
    }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGJyb3dzZXJfYWN0aW9uXFx2dWVfaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUEsSUFBSSxXQUFXLENBQ1g7QUFDSSxVQUFNLFFBRFY7QUFFSSxjQUFVLE9BRmQ7QUFHSSxjQUFVO0FBSGQsQ0FEVyxFQU1YO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBTlcsRUFXWDtBQUNJLFVBQU0sUUFEVjtBQUVJLGNBQVUsT0FGZDtBQUdJLGNBQVU7QUFIZCxDQVhXLEVBZ0JYO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBaEJXLEVBb0JSO0FBQ0MsVUFBTSxRQURQO0FBRUMsY0FBVSxPQUZYO0FBR0MsY0FBVTtBQUhYLENBcEJRLEVBeUJYO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBekJXLEVBNkJSO0FBQ0MsVUFBTSxRQURQO0FBRUMsY0FBVSxPQUZYO0FBR0MsY0FBVTtBQUhYLENBN0JRLEVBa0NYO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBbENXLEVBc0NSO0FBQ0MsVUFBTSxRQURQO0FBRUMsY0FBVSxPQUZYO0FBR0MsY0FBVTtBQUhYLENBdENRLEVBMkNYO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBM0NXLEVBK0NSO0FBQ0MsVUFBTSxRQURQO0FBRUMsY0FBVSxPQUZYO0FBR0MsY0FBVTtBQUhYLENBL0NRLEVBb0RYO0FBQ0ksVUFBTSxPQURWO0FBRUksY0FBVSxPQUZkO0FBR0ksY0FBVTtBQUhkLENBcERXLEVBd0RSO0FBQ0MsVUFBTSxRQURQO0FBRUMsY0FBVSxPQUZYO0FBR0MsY0FBVTtBQUhYLENBeERRLEVBNkRYO0FBQ0ksVUFBTSxPQURW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QUNBLGFBQVMsS0FBVCxDQUFlLE9BQWYsR0FBeUIsTUFBekI7QUFDQSxhQUFTLEtBQVQsQ0FBZSxTQUFmLEdBQTJCLE1BQTNCO0FBQ0EsYUFBUyxLQUFULENBQWUsVUFBZixHQUE0QixhQUE1QjtBQUNBLGFBQVMsS0FBVCxHQUFpQixJQUFqQjtBQUNBLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDQSxhQUFTLE1BQVQ7QUFDQSxRQUFJO0FBQ0EsWUFBSSxhQUFhLFNBQVMsV0FBVCxDQUFxQixNQUFyQixDQUFqQjtBQUNBLFlBQUksTUFBTSxhQUFhLFlBQWIsR0FBNEIsY0FBdEM7QUFDQSxnQkFBUSxHQUFSLENBQVksOEJBQThCLEdBQTFDO0FBQ0gsS0FKRCxDQUlFLE9BQU8sR0FBUCxFQUFZO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLHNCQUFaO0FBQ0gsS0FORCxTQU1VO0FBQ04saUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDSDtBQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG5cclxudmFyIGFjY291bnRzID0gW1xyXG4gICAge1xyXG4gICAgICAgIHNpdGU6IFwiR29vZ2xlXCIsXHJcbiAgICAgICAgdXNlcm5hbWU6IFwidXNlcjFcIixcclxuICAgICAgICBwYXNzd29yZDogXCJwYXNzd29yZDFcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBzaXRlOiBcIllhaG9vXCIsXHJcbiAgICAgICAgdXNlcm5hbWU6IFwidXNlcjJcIixcclxuICAgICAgICBwYXNzd29yZDogXCJwYXNzd29yZDJcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH0sIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH0sIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH0sIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH0sIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH0sIHtcclxuICAgICAgICBzaXRlOiBcIkdvb2dsZVwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIxXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQxXCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgc2l0ZTogXCJZYWhvb1wiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcInVzZXIyXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwicGFzc3dvcmQyXCJcclxuICAgIH1cclxuXTtcclxuXHJcbnZhciBtYWlubGlzdCA9IG5ldyBWdWUoe1xyXG4gICAgZWw6ICcjYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBhY2NvdW50czogYWNjb3VudHMsXHJcbiAgICAgICAgc2hvd0FjY291bnQ6IGZhbHNlLFxyXG4gICAgICAgIHNlYXJjaFN0cmluZzogXCJcIixcclxuICAgICAgICBjYW5FZGl0OiB0cnVlLFxyXG4gICAgICAgIHNpdGU6IFwiXCIsXHJcbiAgICAgICAgdXJsOiBcIlwiLFxyXG4gICAgICAgIHVzZXJuYW1lOiBcIlwiLFxyXG4gICAgICAgIHBhc3N3b3JkOiBcIlwiXHJcbiAgICB9LFxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIHNob3dOZXdBY2NvdW50UGFnZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbGVhcklucHV0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0FjY291bnQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNhbkVkaXQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvd0FjY291bnREZXRhaWxzUGFnZTogZnVuY3Rpb24gKGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgIGZpbGxJbnB1dChhY2NvdW50KTtcclxuICAgICAgICAgICAgdGhpcy5zaG93QWNjb3VudCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuRWRpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhY2NvdW50KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hdmlnYXRlQmFjazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dBY2NvdW50ID0gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRJY29uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlVVJMKHVybCkpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWRpdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbkVkaXQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlQmFjaygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29weVVzZXJuYW1lKGVsZW1lbnQsIGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VybmFtZVRvQ29weSA9IHRoaXMudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZVRvQ29weSA9IGFjY291bnQudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZCh1c2VybmFtZVRvQ29weSk7XHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29weVRleHQgPSBlbGVtZW50LiRlbHMuY29weXVzZXI7XHJcbiAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnQ29waWVkISc7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnVXNlcm5hbWUnXHJcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSAnY2hlY2snO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVyVGV4dCA9ICdjb250ZW50X2NvcHknXHJcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29weVBhc3N3b3JkKGVsZW1lbnQsIGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgIHZhciBwYXNzd29yZFRvQ29weSA9IHRoaXMucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZFRvQ29weSA9IGFjY291bnQucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZChwYXNzd29yZFRvQ29weSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29weVRleHQgPSBlbGVtZW50LiRlbHMuY29weXBhc3M7XHJcbiAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnQ29waWVkISc7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnUGFzc3dvcmQnXHJcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSAnY2hlY2snO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVyVGV4dCA9ICdjb250ZW50X2NvcHknXHJcbiAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICAgIGZpbHRlcmVkQWNjb3VudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuZmlsdGVyKChhY2MpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoYWNjLnNpdGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkpICE9PSAtMSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXQvYmVzdGljb24jc2VsZi1ob3N0aW5nXHJcbmZ1bmN0aW9uIGNsZWFySW5wdXQoKSB7XHJcbiAgICBtYWlubGlzdC5zaXRlID0gXCJcIjtcclxuICAgIG1haW5saXN0LnVybCA9IFwiXCI7XHJcbiAgICBtYWlubGlzdC51c2VybmFtZSA9IFwiXCI7XHJcbiAgICBtYWlubGlzdC5wYXNzd29yZCA9IFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbGxJbnB1dChhY2NvdW50KSB7XHJcbiAgICBtYWlubGlzdC5zaXRlID0gYWNjb3VudC5zaXRlO1xyXG4gICAgbWFpbmxpc3QudXJsID0gYWNjb3VudC51cmw7XHJcbiAgICBtYWlubGlzdC51c2VybmFtZSA9IGFjY291bnQudXNlcm5hbWU7XHJcbiAgICBtYWlubGlzdC5wYXNzd29yZCA9IGFjY291bnQucGFzc3dvcmQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlVVJMKHRleHR2YWwpIHtcclxuICAgIHZhciB1cmxyZWdleCA9IC8oKChbQS1aYS16XXszLDl9Oig/OlxcL1xcLyk/KSg/OlstOzomPVxcK1xcJCxcXHddK0ApP1tBLVphLXowLTkuLV0rfCg/Ond3dy58Wy07OiY9XFwrXFwkLFxcd10rQClbQS1aYS16MC05Li1dKykoKD86XFwvW1xcK34lXFwvLlxcdy1fXSopP1xcPz8oPzpbLVxcKz0mOyVALlxcd19dKikjPyg/OltcXHddKikpPykvO1xyXG4gICAgcmV0dXJuIHVybHJlZ2V4LnRlc3QodGV4dHZhbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvcHlUb0NsaXBib2FyZCh0ZXh0KSB7XHJcbiAgICBpZiAoIXRleHQgfHwgdGV4dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgdGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS50b3AgPSAwO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUubGVmdCA9IDA7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS53aWR0aCA9ICcyZW0nO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gJzJlbSc7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5wYWRkaW5nID0gMDtcclxuICAgIHRleHRBcmVhLnN0eWxlLmJvcmRlciA9ICdub25lJztcclxuICAgIHRleHRBcmVhLnN0eWxlLm91dGxpbmUgPSAnbm9uZSc7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5ib3hTaGFkb3cgPSAnbm9uZSc7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3RyYW5zcGFyZW50JztcclxuICAgIHRleHRBcmVhLnZhbHVlID0gdGV4dDtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dEFyZWEpO1xyXG4gICAgdGV4dEFyZWEuc2VsZWN0KCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciBzdWNjZXNzZnVsID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcclxuICAgICAgICB2YXIgbXNnID0gc3VjY2Vzc2Z1bCA/ICdzdWNjZXNzZnVsJyA6ICd1bnN1Y2Nlc3NmdWwnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3B5aW5nIHRleHQgY29tbWFuZCB3YXMgJyArIG1zZyk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnT29wcywgdW5hYmxlIHRvIGNvcHknKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0ZXh0QXJlYSk7XHJcbiAgICB9XHJcbn0iXX0=