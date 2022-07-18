const removeComments = (text: string) => {
    //Takes a string of code, not an actual function.
    return text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();//Strip comments
}
export default removeComments;