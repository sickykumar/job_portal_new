// Indian Format Utility Helpers for Currency, Phone Number, and Government IDs

/**
 * Format compensation/salary in Indian Rupee format (₹ and LPA)
 * @param {string|number} value 
 * @returns {string} e.g. "₹12 LPA" or "₹12,00,000"
 */
export const formatIndianSalary = (value) => {
  if (!value && value !== 0) return "₹ Negotiable";
  const str = String(value).trim();

  // Support range like "150,000 - 180,000" or "$150,000 - $180,000"
  if (str.includes(" - ")) {
    return str
      .split(" - ")
      .map((part) => formatIndianSalary(part.trim()))
      .join(" - ");
  }

  // If already formatted with rupee or LPA
  if (str.startsWith("₹") || str.toLowerCase().includes("lpa") || str.toLowerCase().includes("inr")) {
    return str.replace(/^\$/, "₹");
  }

  // If starts with dollar, convert symbol to rupee
  if (str.startsWith("$")) {
    return "₹" + str.slice(1);
  }

  // Extract pure numbers
  const numericOnly = str.replace(/[^0-9.]/g, "");
  const num = parseFloat(numericOnly);

  if (!isNaN(num) && num > 0) {
    // If entered as standard annual package in lakhs (e.g. 1200000 -> ₹12 LPA)
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(1).replace(/\.0$/, "");
      const formattedNumber = new Intl.NumberFormat("en-IN").format(num);
      return `₹${formattedNumber} (${lpa} LPA)`;
    }
    // If entered directly as LPA number (e.g. 12 -> ₹12 LPA)
    if (num <= 100) {
      return `₹${num} LPA`;
    }
    return `₹${new Intl.NumberFormat("en-IN").format(num)}`;
  }

  return str.startsWith("₹") ? str : `₹${str}`;
};

/**
 * Format phone number to standard Indian format: +91 98765 43210
 * @param {string} phone 
 * @returns {string}
 */
export const formatIndianPhone = (phone) => {
  if (!phone) return "";
  const cleaned = String(phone).replace(/[^0-9]/g, "");

  // If already starts with 91 and has 12 digits total
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    const num = cleaned.slice(2);
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }

  // If 10-digit Indian mobile number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  // Fallback
  return phone.startsWith("+91") ? phone : `+91 ${phone}`;
};

/**
 * Format Aadhaar number to standard Indian format: XXXX XXXX XXXX
 * @param {string} aadhaar 
 * @returns {string}
 */
export const formatIndianAadhaar = (aadhaar) => {
  if (!aadhaar) return "";
  const digits = String(aadhaar).replace(/[^0-9]/g, "").slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(" ");
};

/**
 * Format PAN to standard Indian format: ABCDE1234F
 * @param {string} pan 
 * @returns {string}
 */
export const formatIndianPAN = (pan) => {
  if (!pan) return "";
  return String(pan).toUpperCase().trim().slice(0, 10);
};
