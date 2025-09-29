function maskEmail(email) {
    const atIndex = email.indexOf("@");
    const username = email.slice(0, atIndex);
    const domain = email.slice(atIndex);

    if (username.length <= 2) {
        return username + domain; // No masking needed
    }

    const masked = username[0] + "*".repeat(username.length - 2) + username[username.length - 1];
    return masked + domain;
}

let email = "apple.pie@example.com";
console.log(maskEmail(email)); // Output: a*******e@example.com

email = "freecodecamp@example.com";
console.log(maskEmail(email)); // Output: f**********p@example.com

email = "info@test.dev";
console.log(maskEmail(email)); // Output: i**o@test.dev

email = "user@domain.org";
console.log(maskEmail(email)); // Output: u**r@domain.org