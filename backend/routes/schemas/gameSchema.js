import yup from "yup";

export const rewardSchema = yup.object().shape({
    amount: yup.number().positive("Must be positive value").required()
});

export const withdrawSchema = yup.object().shape({
    address: yup.string().required(),
    amount: yup.number().positive("Must be positive value").required(),
});
