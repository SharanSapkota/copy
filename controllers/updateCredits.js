

const updateCredit = (a, b, c) => {
    switch(c) {
    case "+": 
    return a + b;
    case "-": 
    return a - b;
    default:
        return ("invalid")
    }}

module.exports = updateCredit