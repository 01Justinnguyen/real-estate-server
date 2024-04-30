//Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long, UNICODE, no vietnamese

export const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/u

// Phone must be full 10 character start with 0
export const phoneRegex = /^0\d{9}$/
