import yup from "yup";

export const userSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});