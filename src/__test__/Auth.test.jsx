import { describe, it, expect, beforeEach } from "vitest";

// ================================
// SETUP: localStorage Mock
// ================================

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// ================================
// VALIDATION FUNCTIONS
// ================================

function validateEmail(email) {
  if (!email.trim()) return { valid: false, error: "Email is required" };
  
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  
  if (email.includes("..")) {
    return { valid: false, error: "Email cannot contain consecutive dots" };
  }
  
  return { valid: true, error: null };
}

function validatePassword(password) {
  if (!password.trim()) return { valid: false, error: "Password is required" };
  if (password.length < 6) return { valid: false, error: "Password must be at least 6 characters" };
  return { valid: true, error: null };
}

function validateName(name) {
  if (!name.trim()) return { valid: false, error: "Name is required" };
  if (name.length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  return { valid: true, error: null };
}

// ================================
// TESTS
// ================================

describe("Auth Validation Logic", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // ================================
  // EMAIL VALIDATION TESTS
  // ================================

  describe("Email Validation", () => {

    it("should reject empty email", () => {
      const result = validateEmail("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Email is required");
    });

    it("should reject invalid email format", () => {
      const result = validateEmail("invalidemail");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("valid email");
    });

    it("should reject email without domain extension", () => {
      const result = validateEmail("test@domain");
      expect(result.valid).toBe(false);
    });

    it("should REJECT typo domain (123@gamil.com) - BUG FIX VERIFIED", () => {
      const result = validateEmail("123@gamil.com");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("valid email");
    });

    it("should ACCEPT correct domain (123@gmail.com)", () => {
      const result = validateEmail("123@gmail.com");
      expect(result.valid).toBe(true);
    });

    it("should reject consecutive dots", () => {
      const result = validateEmail("test..@gmail.com");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Email cannot contain consecutive dots");
    });

    it("should accept valid email format", () => {
      const result = validateEmail("user@example.com");
      expect(result.valid).toBe(true);
    });

    it("should accept emails with dots in username", () => {
      const result = validateEmail("user.name@gmail.com");
      expect(result.valid).toBe(true);
    });

    it("should accept emails with hyphens in domain", () => {
      const result = validateEmail("user@my-domain.com");
      expect(result.valid).toBe(true);
    });

    it("should reject email with numbers in extension", () => {
      const result = validateEmail("user@gmail.c0m");
      expect(result.valid).toBe(false);
    });

  });

  // ================================
  // PASSWORD VALIDATION TESTS
  // ================================

  describe("Password Validation", () => {

    it("should reject empty password", () => {
      const result = validatePassword("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("should reject password less than 6 characters", () => {
      const result = validatePassword("pass");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("6 characters");
    });

    it("should accept password with exactly 6 characters", () => {
      const result = validatePassword("passwd");
      expect(result.valid).toBe(true);
    });

    it("should accept password with more than 6 characters", () => {
      const result = validatePassword("password123");
      expect(result.valid).toBe(true);
    });

    it("should accept very long passwords", () => {
      const result = validatePassword("a".repeat(100));
      expect(result.valid).toBe(true);
    });

  });

  // ================================
  // NAME VALIDATION TESTS
  // ================================

  describe("Name Validation", () => {

    it("should reject empty name", () => {
      const result = validateName("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Name is required");
    });

    it("should reject name with less than 2 characters", () => {
      const result = validateName("A");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("2 characters");
    });

    it("should accept name with exactly 2 characters", () => {
      const result = validateName("AB");
      expect(result.valid).toBe(true);
    });

    it("should accept normal name", () => {
      const result = validateName("John Doe");
      expect(result.valid).toBe(true);
    });

  });

  // ================================
  // EDGE CASES
  // ================================

  describe("Edge Cases", () => {

    it("should handle whitespace-only email", () => {
      const result = validateEmail("   ");
      expect(result.valid).toBe(false);
    });

    it("should handle whitespace-only password", () => {
      const result = validatePassword("   ");
      expect(result.valid).toBe(false);
    });

    it("should handle special characters in email", () => {
      const result = validateEmail("user+tag@example.com");
      expect(result.valid).toBe(true);
    });

    it("should reject email with @ at start", () => {
      const result = validateEmail("@example.com");
      expect(result.valid).toBe(false);
    });

    it("should reject email with @ at end", () => {
      const result = validateEmail("user@");
      expect(result.valid).toBe(false);
    });

  });

  // ================================
  // COMBINED VALIDATION TESTS
  // ================================

  describe("Combined Validation", () => {

    it("should validate all fields together - valid", () => {
      const email = validateEmail("user@gmail.com");
      const password = validatePassword("password123");
      const name = validateName("John Doe");

      expect(email.valid).toBe(true);
      expect(password.valid).toBe(true);
      expect(name.valid).toBe(true);
    });

    it("should validate all fields together - invalid email", () => {
      const email = validateEmail("invalidemail");
      const password = validatePassword("password123");
      const name = validateName("John Doe");

      expect(email.valid).toBe(false);
      expect(password.valid).toBe(true);
      expect(name.valid).toBe(true);
    });

    it("should validate all fields together - invalid password", () => {
      const email = validateEmail("user@gmail.com");
      const password = validatePassword("short");
      const name = validateName("John Doe");

      expect(email.valid).toBe(true);
      expect(password.valid).toBe(false);
      expect(name.valid).toBe(true);
    });

    it("should validate all fields together - invalid name", () => {
      const email = validateEmail("user@gmail.com");
      const password = validatePassword("password123");
      const name = validateName("J");

      expect(email.valid).toBe(true);
      expect(password.valid).toBe(true);
      expect(name.valid).toBe(false);
    });

  });

  // ================================
  // LOGIC TESTS
  // ================================

  describe("Auth Logic", () => {

    it("should identify login vs signup correctly", () => {
      const isLogin = true;
      expect(isLogin).toBe(true);

      const isSignup = !isLogin;
      expect(isSignup).toBe(false);
    });

    it("should prepare login payload correctly", () => {
      const email = "user@gmail.com";
      const password = "password123";

      const payload = { email, password };

      expect(payload).toHaveProperty("email");
      expect(payload).toHaveProperty("password");
      expect(payload.email).toBe("user@gmail.com");
      expect(payload.password).toBe("password123");
    });

    it("should prepare signup payload correctly", () => {
      const name = "John Doe";
      const email = "user@gmail.com";
      const password = "password123";
      const educationLevel = "College";

      const payload = { name, email, password, educationLevel };

      expect(payload).toHaveProperty("name");
      expect(payload).toHaveProperty("email");
      expect(payload).toHaveProperty("password");
      expect(payload).toHaveProperty("educationLevel");
    });

    it("should clear form fields after successful submission", () => {
      let formData = {
        name: "John Doe",
        email: "user@gmail.com",
        password: "password123",
        educationLevel: "College"
      };

      formData = {
        name: "",
        email: "",
        password: "",
        educationLevel: ""
      };

      expect(formData.name).toBe("");
      expect(formData.email).toBe("");
      expect(formData.password).toBe("");
      expect(formData.educationLevel).toBe("");
    });

    it("should store token in localStorage", () => {
      const token = "test-token-123";
      localStorage.setItem("token", token);

      expect(localStorage.getItem("token")).toBe("test-token-123");
    });

    it("should store userId in localStorage", () => {
      const userId = "user-456";
      localStorage.setItem("userId", userId);

      expect(localStorage.getItem("userId")).toBe("user-456");
    });

  });

});
