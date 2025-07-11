import yup from "yup";

export const rewardSchema = yup.object().shape({
    username: yup.string().required(),
    amount: yup.number().positive("Must be positive value").required()
});
