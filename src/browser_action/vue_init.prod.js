(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var mainlist = vueInit([]);

function vueInit(accounts) {

    return new Vue({
        el: '#app',
        data: {
            accounts: accounts,
            showAccount: false,
            searchString: "",
            canEdit: true,
            site: "",
            url: "",
            username: "",
            password: "",
            isSyncing: false
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
            },
            reload() {
                this.isSyncing = true;
                chrome.runtime.sendMessage({ event: "reload " }, accountsObj => {
                    console.log(accountsObj);
                    this.accounts = _.values(accountsObj);
                    this.isSyncing = false;
                });
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

console.log('document onload');
chrome.runtime.sendMessage({ event: "onload" }, function (accountsObj) {
    console.log(accountsObj);
    mainlist.accounts = _.values(accountsObj);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGJyb3dzZXJfYWN0aW9uXFx2dWVfaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNDQSxJQUFJLFdBQVcsUUFBUSxFQUFSLENBQWY7O0FBRUEsU0FBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCOztBQUV2QixXQUFPLElBQUksR0FBSixDQUFRO0FBQ1gsWUFBSSxNQURPO0FBRVgsY0FBTTtBQUNGLHNCQUFVLFFBRFI7QUFFRix5QkFBYSxLQUZYO0FBR0YsMEJBQWMsRUFIWjtBQUlGLHFCQUFTLElBSlA7QUFLRixrQkFBTSxFQUxKO0FBTUYsaUJBQUssRUFOSDtBQU9GLHNCQUFVLEVBUFI7QUFRRixzQkFBVSxFQVJSO0FBU0YsdUJBQVc7QUFUVCxTQUZLO0FBYVgsaUJBQVM7QUFDTCxnQ0FBb0IsWUFBWTtBQUM1QjtBQUNBLHFCQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxxQkFBSyxPQUFMLEdBQWUsSUFBZjtBQUNILGFBTEk7QUFNTCxvQ0FBd0IsVUFBVSxLQUFWLEVBQWlCLE9BQWpCLEVBQTBCO0FBQzlDLDBCQUFVLE9BQVY7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EscUJBQUssT0FBTCxHQUFlLEtBQWY7QUFDQSx3QkFBUSxHQUFSLENBQVksT0FBWjtBQUNILGFBWEk7QUFZTCwwQkFBYyxZQUFZO0FBQ3RCLHFCQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDSCxhQWRJO0FBZUwscUJBQVMsVUFBVSxLQUFWLEVBQWlCO0FBQ3RCLG9CQUFJLE1BQU0sTUFBTSxNQUFOLENBQWEsS0FBdkI7QUFDQSxvQkFBSSxZQUFZLEdBQVosQ0FBSixFQUFzQixDQUNyQjtBQUNKLGFBbkJJO0FBb0JMLGtCQUFNLFlBQVk7QUFDZCxxQkFBSyxPQUFMLEdBQWUsSUFBZjtBQUNILGFBdEJJO0FBdUJMLGtCQUFNLFlBQVk7QUFDZCxxQkFBSyxZQUFMO0FBQ0gsYUF6Qkk7QUEwQkwseUJBQWEsT0FBYixFQUFzQixLQUF0QixFQUE2QixPQUE3QixFQUFzQztBQUNsQyxvQkFBSSxpQkFBaUIsS0FBSyxRQUExQjtBQUNBLG9CQUFJLE9BQUosRUFBYTtBQUNULHFDQUFpQixRQUFRLFFBQXpCO0FBQ0g7QUFDRCxzQkFBTSxlQUFOO0FBQ0EsZ0NBQWdCLGNBQWhCO0FBQ0Esb0JBQUksT0FBSixFQUFhO0FBQ1Qsd0JBQUksV0FBVyxRQUFRLElBQVIsQ0FBYSxRQUE1QjtBQUNBLDZCQUFTLFNBQVQsR0FBcUIsU0FBckI7QUFDQSwrQkFBVyxNQUFNO0FBQ2IsaUNBQVMsU0FBVCxHQUFxQixVQUFyQjtBQUNILHFCQUZELEVBRUcsSUFGSDtBQUdILGlCQU5ELE1BTU87QUFDSCwwQkFBTSxNQUFOLENBQWEsU0FBYixHQUF5QixPQUF6QjtBQUNBLCtCQUFXLE1BQU07QUFDYiw4QkFBTSxNQUFOLENBQWEsU0FBYixHQUF5QixjQUF6QjtBQUNILHFCQUZELEVBRUcsSUFGSDtBQUdIO0FBQ0osYUE3Q0k7QUE4Q0wseUJBQWEsT0FBYixFQUFzQixLQUF0QixFQUE2QixPQUE3QixFQUFzQztBQUNsQyxvQkFBSSxpQkFBaUIsS0FBSyxRQUExQjtBQUNBLG9CQUFJLE9BQUosRUFBYTtBQUNULHFDQUFpQixRQUFRLFFBQXpCO0FBQ0g7QUFDRCxzQkFBTSxlQUFOO0FBQ0EsZ0NBQWdCLGNBQWhCO0FBQ0Esd0JBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxvQkFBSSxPQUFKLEVBQWE7QUFDVCx3QkFBSSxXQUFXLFFBQVEsSUFBUixDQUFhLFFBQTVCO0FBQ0EsNkJBQVMsU0FBVCxHQUFxQixTQUFyQjtBQUNBLCtCQUFXLE1BQU07QUFDYixpQ0FBUyxTQUFULEdBQXFCLFVBQXJCO0FBQ0gscUJBRkQsRUFFRyxJQUZIO0FBR0gsaUJBTkQsTUFNTztBQUNILDBCQUFNLE1BQU4sQ0FBYSxTQUFiLEdBQXlCLE9BQXpCO0FBQ0EsK0JBQVcsTUFBTTtBQUNiLDhCQUFNLE1BQU4sQ0FBYSxTQUFiLEdBQXlCLGNBQXpCO0FBQ0gscUJBRkQsRUFFRyxJQUZIO0FBR0g7QUFDSixhQWxFSTtBQW1FTCxxQkFBUztBQUNMLHFCQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSx1QkFBTyxPQUFQLENBQWUsV0FBZixDQUEyQixFQUFFLE9BQU8sU0FBVCxFQUEzQixFQUFrRCxXQUFELElBQWlCO0FBQzlELDRCQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EseUJBQUssUUFBTCxHQUFnQixFQUFFLE1BQUYsQ0FBUyxXQUFULENBQWhCO0FBQ0EseUJBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNILGlCQUpEO0FBS0g7QUExRUksU0FiRTtBQXlGWCxrQkFBVTtBQUNOLDhCQUFrQixZQUFZO0FBQzFCLHVCQUFPLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBc0IsR0FBRCxJQUFTO0FBQ2pDLDJCQUFRLElBQUksSUFBSixDQUFTLFdBQVQsR0FBdUIsT0FBdkIsQ0FBK0IsS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQS9CLE1BQW9FLENBQUMsQ0FBN0U7QUFDSCxpQkFGTSxDQUFQO0FBR0g7QUFMSztBQXpGQyxLQUFSLENBQVA7QUFrR0g7O0FBRUQsUUFBUSxHQUFSLENBQVksaUJBQVo7QUFDQSxPQUFPLE9BQVAsQ0FBZSxXQUFmLENBQTJCLEVBQUUsT0FBTyxRQUFULEVBQTNCLEVBQWdELFVBQVUsV0FBVixFQUF1QjtBQUNuRSxZQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsYUFBUyxRQUFULEdBQW9CLEVBQUUsTUFBRixDQUFTLFdBQVQsQ0FBcEI7QUFDSCxDQUhEOztBQU1BO0FBQ0EsU0FBUyxVQUFULEdBQXNCO0FBQ2xCLGFBQVMsSUFBVCxHQUFnQixFQUFoQjtBQUNBLGFBQVMsR0FBVCxHQUFlLEVBQWY7QUFDQSxhQUFTLFFBQVQsR0FBb0IsRUFBcEI7QUFDQSxhQUFTLFFBQVQsR0FBb0IsRUFBcEI7QUFDSDs7QUFFRCxTQUFTLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEI7QUFDeEIsYUFBUyxJQUFULEdBQWdCLFFBQVEsSUFBeEI7QUFDQSxhQUFTLEdBQVQsR0FBZSxRQUFRLEdBQXZCO0FBQ0EsYUFBUyxRQUFULEdBQW9CLFFBQVEsUUFBNUI7QUFDQSxhQUFTLFFBQVQsR0FBb0IsUUFBUSxRQUE1QjtBQUNIOztBQUVELFNBQVMsV0FBVCxDQUFxQixPQUFyQixFQUE4QjtBQUMxQixRQUFJLFdBQVcsbUtBQWY7QUFDQSxXQUFPLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBUDtBQUNIOztBQUVELFNBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQjtBQUMzQixRQUFJLENBQUMsSUFBRCxJQUFTLEtBQUssTUFBTCxLQUFnQixDQUE3QixFQUFnQztBQUM1QjtBQUNIO0FBQ0QsUUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFmO0FBQ0EsYUFBUyxLQUFULENBQWUsUUFBZixHQUEwQixPQUExQjtBQUNBLGFBQVMsS0FBVCxDQUFlLEdBQWYsR0FBcUIsQ0FBckI7QUFDQSxhQUFTLEtBQVQsQ0FBZSxJQUFmLEdBQXNCLENBQXRCO0FBQ0EsYUFBUyxLQUFULENBQWUsS0FBZixHQUF1QixLQUF2QjtBQUNBLGFBQVMsS0FBVCxDQUFlLE1BQWYsR0FBd0IsS0FBeEI7QUFDQSxhQUFTLEtBQVQsQ0FBZSxPQUFmLEdBQXlCLENBQXpCO0FBQ0EsYUFBUyxLQUFULENBQWUsTUFBZixHQUF3QixNQUF4QjtBQUNBLGFBQVMsS0FBVCxDQUFlLE9BQWYsR0FBeUIsTUFBekI7QUFDQSxhQUFTLEtBQVQsQ0FBZSxTQUFmLEdBQTJCLE1BQTNCO0FBQ0EsYUFBUyxLQUFULENBQWUsVUFBZixHQUE0QixhQUE1QjtBQUNBLGFBQVMsS0FBVCxHQUFpQixJQUFqQjtBQUNBLGFBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDQSxhQUFTLE1BQVQ7QUFDQSxRQUFJO0FBQ0EsWUFBSSxhQUFhLFNBQVMsV0FBVCxDQUFxQixNQUFyQixDQUFqQjtBQUNBLFlBQUksTUFBTSxhQUFhLFlBQWIsR0FBNEIsY0FBdEM7QUFDQSxnQkFBUSxHQUFSLENBQVksOEJBQThCLEdBQTFDO0FBQ0gsS0FKRCxDQUlFLE9BQU8sR0FBUCxFQUFZO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLHNCQUFaO0FBQ0gsS0FORCxTQU1VO0FBQ04saUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsUUFBMUI7QUFDSDtBQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG52YXIgbWFpbmxpc3QgPSB2dWVJbml0KFtdKTtcclxuXHJcbmZ1bmN0aW9uIHZ1ZUluaXQoYWNjb3VudHMpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IFZ1ZSh7XHJcbiAgICAgICAgZWw6ICcjYXBwJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGFjY291bnRzOiBhY2NvdW50cyxcclxuICAgICAgICAgICAgc2hvd0FjY291bnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBzZWFyY2hTdHJpbmc6IFwiXCIsXHJcbiAgICAgICAgICAgIGNhbkVkaXQ6IHRydWUsXHJcbiAgICAgICAgICAgIHNpdGU6IFwiXCIsXHJcbiAgICAgICAgICAgIHVybDogXCJcIixcclxuICAgICAgICAgICAgdXNlcm5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBcIlwiLFxyXG4gICAgICAgICAgICBpc1N5bmNpbmc6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIHNob3dOZXdBY2NvdW50UGFnZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93QWNjb3VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbkVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaG93QWNjb3VudERldGFpbHNQYWdlOiBmdW5jdGlvbiAoZXZlbnQsIGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgIGZpbGxJbnB1dChhY2NvdW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0FjY291bnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5FZGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhY2NvdW50KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmF2aWdhdGVCYWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dBY2NvdW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEljb246IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZVVSTCh1cmwpKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuRWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVCYWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvcHlVc2VybmFtZShlbGVtZW50LCBldmVudCwgYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJuYW1lVG9Db3B5ID0gdGhpcy51c2VybmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWVUb0NvcHkgPSBhY2NvdW50LnVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBjb3B5VG9DbGlwYm9hcmQodXNlcm5hbWVUb0NvcHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29weVRleHQgPSBlbGVtZW50LiRlbHMuY29weXVzZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29weVRleHQuaW5uZXJUZXh0ID0gJ0NvcGllZCEnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnVXNlcm5hbWUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSAnY2hlY2snO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gJ2NvbnRlbnRfY29weSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29weVBhc3N3b3JkKGVsZW1lbnQsIGV2ZW50LCBhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFzc3dvcmRUb0NvcHkgPSB0aGlzLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZFRvQ29weSA9IGFjY291bnQucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGNvcHlUb0NsaXBib2FyZChwYXNzd29yZFRvQ29weSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29weVRleHQgPSBlbGVtZW50LiRlbHMuY29weXBhc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgY29weVRleHQuaW5uZXJUZXh0ID0gJ0NvcGllZCEnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5VGV4dC5pbm5lclRleHQgPSAnUGFzc3dvcmQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5pbm5lclRleHQgPSAnY2hlY2snO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gJ2NvbnRlbnRfY29weSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVsb2FkKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1N5bmNpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBldmVudDogXCJyZWxvYWQgXCIgfSwgKGFjY291bnRzT2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWNjb3VudHNPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjb3VudHMgPSBfLnZhbHVlcyhhY2NvdW50c09iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1N5bmNpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wdXRlZDoge1xyXG4gICAgICAgICAgICBmaWx0ZXJlZEFjY291bnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5maWx0ZXIoKGFjYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYWNjLnNpdGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkpICE9PSAtMSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG5jb25zb2xlLmxvZygnZG9jdW1lbnQgb25sb2FkJyk7XHJcbmNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgZXZlbnQ6IFwib25sb2FkXCIgfSwgZnVuY3Rpb24gKGFjY291bnRzT2JqKSB7XHJcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50c09iaik7XHJcbiAgICBtYWlubGlzdC5hY2NvdW50cyA9IF8udmFsdWVzKGFjY291bnRzT2JqKTtcclxufSk7XHJcblxyXG5cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdC9iZXN0aWNvbiNzZWxmLWhvc3RpbmdcclxuZnVuY3Rpb24gY2xlYXJJbnB1dCgpIHtcclxuICAgIG1haW5saXN0LnNpdGUgPSBcIlwiO1xyXG4gICAgbWFpbmxpc3QudXJsID0gXCJcIjtcclxuICAgIG1haW5saXN0LnVzZXJuYW1lID0gXCJcIjtcclxuICAgIG1haW5saXN0LnBhc3N3b3JkID0gXCJcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbElucHV0KGFjY291bnQpIHtcclxuICAgIG1haW5saXN0LnNpdGUgPSBhY2NvdW50LnNpdGU7XHJcbiAgICBtYWlubGlzdC51cmwgPSBhY2NvdW50LnVybDtcclxuICAgIG1haW5saXN0LnVzZXJuYW1lID0gYWNjb3VudC51c2VybmFtZTtcclxuICAgIG1haW5saXN0LnBhc3N3b3JkID0gYWNjb3VudC5wYXNzd29yZDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVVUkwodGV4dHZhbCkge1xyXG4gICAgdmFyIHVybHJlZ2V4ID0gLygoKFtBLVphLXpdezMsOX06KD86XFwvXFwvKT8pKD86Wy07OiY9XFwrXFwkLFxcd10rQCk/W0EtWmEtejAtOS4tXSt8KD86d3d3LnxbLTs6Jj1cXCtcXCQsXFx3XStAKVtBLVphLXowLTkuLV0rKSgoPzpcXC9bXFwrfiVcXC8uXFx3LV9dKik/XFw/Pyg/OlstXFwrPSY7JUAuXFx3X10qKSM/KD86W1xcd10qKSk/KS87XHJcbiAgICByZXR1cm4gdXJscmVnZXgudGVzdCh0ZXh0dmFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29weVRvQ2xpcGJvYXJkKHRleHQpIHtcclxuICAgIGlmICghdGV4dCB8fCB0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciB0ZXh0QXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuICAgIHRleHRBcmVhLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgIHRleHRBcmVhLnN0eWxlLnRvcCA9IDA7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5sZWZ0ID0gMDtcclxuICAgIHRleHRBcmVhLnN0eWxlLndpZHRoID0gJzJlbSc7XHJcbiAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSAnMmVtJztcclxuICAgIHRleHRBcmVhLnN0eWxlLnBhZGRpbmcgPSAwO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xyXG4gICAgdGV4dEFyZWEuc3R5bGUub3V0bGluZSA9ICdub25lJztcclxuICAgIHRleHRBcmVhLnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuICAgIHRleHRBcmVhLnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnO1xyXG4gICAgdGV4dEFyZWEudmFsdWUgPSB0ZXh0O1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0QXJlYSk7XHJcbiAgICB0ZXh0QXJlYS5zZWxlY3QoKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIHN1Y2Nlc3NmdWwgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyXG4gICAgICAgIHZhciBtc2cgPSBzdWNjZXNzZnVsID8gJ3N1Y2Nlc3NmdWwnIDogJ3Vuc3VjY2Vzc2Z1bCc7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvcHlpbmcgdGV4dCBjb21tYW5kIHdhcyAnICsgbXNnKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdPb3BzLCB1bmFibGUgdG8gY29weScpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHRBcmVhKTtcclxuICAgIH1cclxufSJdfQ==
