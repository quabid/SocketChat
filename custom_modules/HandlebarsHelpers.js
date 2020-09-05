const moment = require("moment");
const log = (arg = "") => console.log(arg);
const cls = () => console.clear();

module.exports = {
    truncate: function(str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = new_str.length > 0 ? new_str : str.substr(0, len);
            return new_str + " ...";
        }
        return str;
    },
    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, "");
    },
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    select: function(selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp(">" + selected + "</option>"),
                ' selected="selected"$&'
            );
    },
    editIcon: function(storyUser, loggedUser, storyId, floating = true) {
        if (storyUser == loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyId} class="btn btn-warning halfway-fab ><i class="fas fa-pencil-alt"></i>`;
            } else {
            }
        } else {
        }
    },
    cfc: function(arg) {
        if (null !== arg && undefined != arg) {
            let word_split = null,
                line = "",
                word = arg.toString();

            if (
                word.trim().toLowerCase() === "id" ||
                word.trim().toLowerCase() === "ssn" ||
                word.trim().toLowerCase() === "sku" ||
                word.trim().toLowerCase() === "vm" ||
                word.trim().toLowerCase() === "mac" ||
                word.trim().toLowerCase() === "imei" ||
                word.trim().toLowerCase() === "os" ||
                word.trim().toLowerCase() === "atm" ||
                word.trim().toLowerCase() === "pa"
            ) {
                word = word.toUpperCase();
            } else if (word.match(/[-]/)) {
                if (null !== (word_split = word.split(["-"])).length > 0) {
                    for (let i = 0; i < word_split.length; i++) {
                        if (i < word_split.length - 1) {
                            line +=
                                word_split[i].substring(0, 1).toUpperCase() +
                                word_split[i].substring(1) +
                                "-";
                        } else {
                            line +=
                                word_split[i].substring(0, 1).toUpperCase() +
                                word_split[i].substring(1);
                        }
                    }
                    return line;
                }
            } else if (word.match(/[ ]/)) {
                if (null !== (word_split = word.split([" "])).length > 0) {
                    for (let i = 0; i < word_split.length; i++) {
                        if (i < word_split.length - 1) {
                            line +=
                                word_split[i].substring(0, 1).toUpperCase() +
                                word_split[i].substring(1) +
                                " ";
                        } else {
                            line +=
                                word_split[i].substring(0, 1).toUpperCase() +
                                word_split[i].substring(1);
                        }
                    }
                    return line;
                }
            } else {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
        }
    },
};
