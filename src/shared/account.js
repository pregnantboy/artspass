class Account {

    static decrypt(salt, account, id) {
        let decodedPermissions = _.mapKeys(account.permissions, (value, key) => {
            return this.keyDecode(key);
        });
        return new Account(account.site, account.url, Account.decryptText(salt, account.username), Account.decryptText(salt, account.password), decodedPermissions, id);
    }

    static encrypt(salt, account) {
        let encodedPermissions = _.mapKeys(account.permissions, (value, key) => {
            return this.keyEncode(key);
        });
        return new Account(account.site, account.url, Account.encryptText(salt, account.username), Account.encryptText(salt, account.password), encodedPermissions);
    }

    static decryptText(salt, ciphertext) {
        if (!salt) {
            return ciphertext;
        }
        var bytes = CryptoJS.AES.decrypt(ciphertext, salt);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    static encryptText(salt, text) {
        if (!salt) {
            return text;
        }
        return CryptoJS.AES.encrypt(text, salt).toString();
    }

    static keyEncode(decoded) {
        return encodeURIComponent(decoded).replace(/\./g, "%2E");
    }

    static keyDecode(encoded) {
        return decodeURIComponent(encoded.replace("%2E", "."));
    }

    constructor(site, url, username, password, permissions, id) {
        this.site = site;
        this.url = url ? url : "";
        this.username = username;
        this.password = password;
        this.permissions = permissions;
        if (id) {
            this.id = id;
        }
    }
}
