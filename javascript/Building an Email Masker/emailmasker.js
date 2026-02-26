function maskEmail(email) {

    const atIndex = email.indexOf("@");


    const firstChar = email[0];


    const lastChar = email[atIndex - 1];


    const domain = email.slice(atIndex);


    const asteriskCount = atIndex - 2;


    const maskedEmail = firstChar + "*".repeat(asteriskCount) + lastChar + domain;

    return maskedEmail;
}


const email = "apple.pie@example.com";


console.log(maskEmail(email));