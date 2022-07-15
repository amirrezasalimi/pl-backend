export const wsData = (name: string, data?: any) => {
    return JSON.stringify({
            name,
            data
        }
    )
}