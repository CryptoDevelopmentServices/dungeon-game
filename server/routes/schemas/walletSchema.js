import yup from "yup";

export const withdrawSchema = yup.object().shape({
    username: yup.string().required(),
    address: yup.string().required(),
    amount: yup.number().positive("Must be positive value").required(),
});
