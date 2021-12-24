const escapeCharacter = '\\'
const specialCharacters = [
    '\\', '\"'
]
const breakCharacters = [
    ' ', '\n'
]
/**
 * 
 * @param {String} str 
 */
module.exports = (str) => {
    const args = []
    const len = str.length
    for(let i=0; i<len; ++i){
        if(breakCharacters.includes(str[i])) continue
        let j=i
        let ignoreBreak = false
        let ignoreSpecial = false
        let word = ''
        while(j<len && (ignoreBreak || ignoreSpecial || !breakCharacters.includes(str[j]))){
            if(str[j]===escapeCharacter && j+1 < len && specialCharacters.includes(str[j+1])){
                word += str[++j]
            }else if(!ignoreSpecial && str[j] === '\"'){
                ignoreBreak = !ignoreBreak
            }else if(j+2 < len && str[j] === '`' && str[j+1] === '`' && str[j+2] === '`'){
                ignoreSpecial = !ignoreSpecial;
                j += 2;
            }else{
                word += str[j]
            }
            ++j
        }
        console.log(word)
        args.push(word)
        i = j-1
    }
    return args
}