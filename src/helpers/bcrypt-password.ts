import bcrypt from "bcrypt";

export const bcryptPassword = (password: string, salt_len: number = 8) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_len));
}
export const bcryptCheckPassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
}
