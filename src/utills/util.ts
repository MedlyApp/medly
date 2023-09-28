import Joi from 'joi';

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.date().iso(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match.',
    }),
    gender: Joi.string().valid('male', 'female', 'null').default('null'),
    bio: Joi.string().allow('').default(''),
    location: Joi.string().allow('').default(''),
    socialLinks: Joi.object({
        facebook: Joi.string().allow('').default(''),
        instagram: Joi.string().allow('').default(''),
        twitter: Joi.string().allow('').default(''),
        linkedin: Joi.string().allow('').default(''),
    }),
    otp: Joi.number(),
    otp_expiry: Joi.date().iso(),
    profilePicture: Joi.string().allow('').default(''),
    // userType: Joi.string().valid('doctor', 'regular', 'admin').default('regular'),
    isVerified: Joi.boolean().default(false),
    isLocked: Joi.boolean().default(false),
    role: Joi.string().valid('user', 'admin'),
});

export const otpSchema = Joi.object({
    otp: Joi.number().required(),
    otp_expiry: Joi.date().required(),
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});

export const forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
});

export const changePasswordSchema = Joi.object()
    .keys({
        password: Joi.string().required(),
        otp: Joi.number().required(),
        confirmPassword: Joi.any()
            .equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
    })
    .with('password', 'confirmPassword');


const commentSchema = Joi.object({
    userId: Joi.string().required(), // Assuming userId is a string
    text: Joi.string().required(),
});

export const postSchema = Joi.object({
    userId: Joi.string().required(),
    content: Joi.string().required(),
    mediaUrls: Joi.array().items(Joi.string()),
    likes: Joi.array().items(Joi.string()),
    comments: Joi.array().items(commentSchema),
    reposts: Joi.array().items(Joi.string()),
    createdAt: Joi.date().iso(),
});






export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};


