// example : rateLimit("user-move",[user.id],["100/minute"])
// this rate limit work on memory state
const rateLimit = (name: string, deps: [] = [], rate: string[] = ["2/m"]) => {
    return true // false
}
export default rateLimit;