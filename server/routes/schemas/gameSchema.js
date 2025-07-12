import yup from "yup";

export const rewardSchema = yup.object().shape({
    amount: yup.number().positive("Must be positive value").required()
});
