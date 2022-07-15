export const ok = (data: any,msg?:string) => {
    return {
        ok: true,
        message: msg,
        ...data
    }
}
export const error = (msg?:string) => {
    return {
        ok: false,
        message: msg,
    }
}