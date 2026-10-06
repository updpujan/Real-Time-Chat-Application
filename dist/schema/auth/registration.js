import { z } from 'zod';
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Name is only alphabet and space'),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must not exceed 20 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
});
//# sourceMappingURL=registration.js.map