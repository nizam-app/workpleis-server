


export const generateVerificationCodeAndExpires =()=>{
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


    return {code, expiresAt}
} 