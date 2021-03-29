/**
 * 
 * @param {String} str 
 * @returns string with all words begining with capital letters
 */
module.exports = (str) => {
    const words = str.toLowerCase().trim().split(/\s+/)
    let capStr = ''
    const ignoredWords = [
        'of', 'the'
    ]
    for (const word of words) {
        if (capStr.length > 0) capStr += ' '
        if (ignoredWords.includes(word)) {
            capStr += word
        } else {
            capStr += word.charAt(0).toUpperCase()+word.slice(1)
        }
    }
    return capStr
}