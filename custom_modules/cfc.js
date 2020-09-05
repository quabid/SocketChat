module.exports = {
	cap: function(arg) {
		let word_split = null,
			line = "",
			word = arg.toString();
		if (null !== word && undefined !== word) {
			if (word.trim().toLowerCase() === 'id' ||
				word.trim().toLowerCase() === 'ssn' ||
				word.trim().toLowerCase() === 'sku' ||
				word.trim().toLowerCase() === 'vm' ||
				word.trim().toLowerCase() === 'mac' ||
				word.trim().toLowerCase() === 'imei' ||
				word.trim().toLowerCase() === 'os' ||
				word.trim().toLowerCase() === 'atm' ||
				word.trim().toLowerCase() === 'pa' ||
				word.trim().toLowerCase() === 'rjw') {
				return word.toUpperCase();
			} 
			else if (word.match(/[-]/)) {
				if (null !== (word_split = word.split(['-'])).length > 0) {
					for (let i = 0; i<word_split.length; i++) {
						if (i < (word_split.length - 1)) {
							line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1) + '-';
						} else {
							line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1);
						}
					}
					return line;
				}
			}
			else if (word.match(/[ ]/)) {
				if (null !== (word_split = word.split([' '])).length > 0) {
					for (let i = 0; i<word_split.length; i++) {
						if (i < (word_split.length - 1)) {
							line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1) + ' ';
						} else {
							line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1);
						}
					}
					return line;
				}
			} 
			else {
				return word.substring(0,1).toUpperCase() + word.substring(1);
			}
		}
	}
}