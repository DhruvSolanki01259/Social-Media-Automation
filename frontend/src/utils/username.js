export function generateUserFromEmail(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Valid email is required");
  }

  // Step 1: Extract local part (before @)
  const localPart = email.split("@")[0];

  // Step 2: Remove numbers & special characters except separators
  const cleaned = localPart
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Step 3: Split into words
  const nameParts = cleaned.split(" ").filter(Boolean);

  if (nameParts.length === 0) {
    throw new Error("Unable to extract name from email");
  }

  // Step 4: Create full name with capitalized first letters
  const fullName = nameParts
    .map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  // Step 5: Create base username
  const baseUsername = nameParts.join("");

  // Step 6: Add uniqueness
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(1000 + Math.random() * 9000);

  const username = `${baseUsername}${timestamp}${random}`;

  return {
    username,
    fullName,
  };
}