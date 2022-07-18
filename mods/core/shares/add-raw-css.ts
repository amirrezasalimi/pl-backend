const addRawCss = (css: string) => {
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    return () => {
        document.head.removeChild(style);
    }
}
export default addRawCss;