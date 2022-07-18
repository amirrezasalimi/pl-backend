const loadCss = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    return () => {
        document.head.removeChild(link);
    }
}
export default loadCss;