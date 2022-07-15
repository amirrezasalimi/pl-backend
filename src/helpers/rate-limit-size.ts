// ex: use it for bandwitch limiting for speficic ip
// rateLimitSize('ip', [user.ip], "10/minute",100);
const rateLimitSize = (name: string, deps: string[] = [], rate: "10/m", size: number) => {
    return true // false
}
export default rateLimitSize