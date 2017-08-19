window.onload = function () {
    window.mdc.autoInit();
    mdc.textfield.MDCTextfield.attachTo(document.querySelector('#site-input'));
    mdc.textfield.MDCTextfield.attachTo(document.querySelector('#url-input'));
    mdc.textfield.MDCTextfield.attachTo(document.querySelector('#username-input'));
    mdc.textfield.MDCTextfield.attachTo(document.querySelector('#password-input'));
    mdc.iconToggle.MDCIconToggle.attachTo(document.querySelector('#username-toggle-button'));
    mdc.iconToggle.MDCIconToggle.attachTo(document.querySelector('#password-toggle-button'));
    mdc.dialog.MDCDialog.attachTo(document.querySelector('#dialog'));
};