const escapeCharacter = '/'
const specialCharacters = [
    '/', '\"'
]
/**
 * 
 * @param {String} str 
 */
module.exports = (str) => {
    const args = []
    const len = str.length
    for(let i=0; i<len; ++i){
        if(str[i] === ' ') continue
        let j=i
        let ignoreSpace = false
        let word = ''
        while(j<len && (ignoreSpace || str[j] !== ' ')){
            if(str[j]===escapeCharacter && j+1 < len && specialCharacters.includes(str[j+1])){
                word += str[j++]
            }else if(str[j] === '\"'){
                ignoreSpace = !ignoreSpace
            }else{
                word += str[j]
            }
            ++j
        }
        args.push(word)
        i = j-1
    }
    return args
}