// authActions.js
import supabase from "@/lib/supabase/supabase";
import useUserStore from "@/store/userStore";

// Get Zustand store actions
const { login, logout, setUser, setRole, setPremium, setEnrolledCourses } = useUserStore.getState();

/**
 * Check which table the user belongs to and determine redirect path
 */
const determineUserTypeAndRedirect = async (email) => {
  try {
    // Check if email exists in sellers table
    const { data: sellerData, error: sellerError } = await supabase
      .from("sellers")
      .select("email")
      .eq("email", email)
      .single();

    // Check if email exists in users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    const isInSellers = sellerData && !sellerError;
    const isInUsers = userData && !userError;

    // Determine redirect path based on your requirements
    if (isInUsers && isInSellers) {
      // If exists in both, redirect to "/"
      return { redirectPath: "/", userType: "user" };
    } else if (isInSellers) {
      // If only in sellers, redirect to instructor dashboard
      return { redirectPath: "/instructor/dashboard", userType: "instructor" };
    } else if (isInUsers) {
      // If only in users, redirect to "/"
      return { redirectPath: "/", userType: "user" };
    } else {
      // If not in either table, default to user
      return { redirectPath: "/", userType: "user" };
    }
  } catch (error) {
    console.error("Error checking user type:", error);
    // Default fallback
    return { redirectPath: "/", userType: "user" };
  }
};

/**
 * Email/Password Login
 */
export const loginWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    const meta = user.user_metadata;

    // Determine user type and redirect path
    const { redirectPath, userType } = await determineUserTypeAndRedirect(email);

    // Format user data
    const userData = {
      id: user.id || user.user_id,
      name: meta.name,
      email: user.email,
      initials: (meta.name || user.email || "U")?.slice(0, 2).toUpperCase(),
      avatar: meta.photo_url || null,
      provider: "email",
      isPremium: meta.subscription_tier === "premium",
    };

    // Update Zustand store
    login(userData);
    setRole(userType); // Set role based on table membership
    setPremium(meta.subscription_tier === "premium");

    // Optional: fetch additional user info (e.g., enrolled courses)
    await fetchUserProfile(user.id || user.user_id);

    return {
      success: true,
      user: data.user,
      redirectPath: redirectPath, // Return the redirect path
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to check if user exists in auth
const checkUserExists = async (email) => {
  try {
    // Try to get user by email from auth.users (admin access needed)
    // Alternative: Check both users and sellers tables
    const { data: userData } = await supabase.from("users").select("id, email").eq("email", email).single();

    const { data: sellerData } = await supabase.from("sellers").select("user_id, email").eq("email", email).single();

    return {
      existsInUsers: !!userData,
      existsInSellers: !!sellerData,
      userId: userData?.id || sellerData?.user_id,
    };
  } catch (error) {
    return {
      existsInUsers: false,
      existsInSellers: false,
      userId: null,
    };
  }
};

export const signUpUserWithEmail = async (email, password, userData = {}) => {
  try {
    // Check if user already exists
    const existingUser = await checkUserExists(email);

    if (existingUser.existsInUsers) {
      // User already exists in users table
      return {
        success: false,
        error: "An account with this email already exists. Please try logging in instead.",
      };
    }

    if (existingUser.existsInSellers) {
      // User exists as instructor, now wants to be a regular user too
      // Insert into users table directly (no new auth signup needed)
      const { error: insertError } = await supabase.from("users").insert({
        id: existingUser.userId,
        name: userData.name || "",
        email: email,
        subscription_tier: userData.subscription_tier || "free",
        promo_code: userData.promoCode || "",
      });

      if (insertError) {
        throw new Error(`Failed to create user profile: ${insertError.message}`);
      }

      return {
        success: true,
        user: { id: existingUser.userId, email: email },
        requiresConfirmation: false,
        message: "Account created successfully! You can now access both instructor and user features.",
        isExistingAuth: true,
      };
    }

    // New user signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name || "",
          role: "user",
          subscription_tier: userData.subscription_tier || "free",
          promo_code: userData.promoCode || "",
        },
      },
    });

    if (error) throw new Error(error.message);
    const user = data.user;
    if (!user) throw new Error("No user returned from signup");

    console.log("User created in auth, awaiting email confirmation:", user.id);

    return {
      success: true,
      user,
      requiresConfirmation: !user.email_confirmed_at,
      message: !user.email_confirmed_at
        ? "Please check your email to confirm your account"
        : "Account created successfully",
      isExistingAuth: false,
    };
  } catch (error) {
    console.error("User signup error:", error);
    return { success: false, error: error.message };
  }
};

export const signUpInstructorWithEmail = async (email, password, instructorData = {}) => {
  try {
    // Check if user already exists
    const existingUser = await checkUserExists(email);

    if (existingUser.existsInSellers) {
      // Instructor already exists
      return {
        success: false,
        error: "An instructor account with this email already exists. Please try logging in instead.",
      };
    }

    if (existingUser.existsInUsers) {
      // User exists as regular user, now wants to be an instructor too
      // Insert into sellers table directly (no new auth signup needed)
      const { error: insertError } = await supabase.from("sellers").insert({
        user_id: existingUser.userId,
        name: instructorData.name || "",
        email: email,
      });

      if (insertError) {
        throw new Error(`Failed to create instructor profile: ${insertError.message}`);
      }

      return {
        success: true,
        user: { id: existingUser.userId, email: email },
        requiresConfirmation: false,
        message: "Instructor account created successfully! You can now access both user and instructor features.",
        isExistingAuth: true,
      };
    }

    // New instructor signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: instructorData.name || "",
          role: "instructor",
        },
      },
    });

    if (error) throw new Error(error.message);
    const user = data.user;
    if (!user) throw new Error("No user returned from signup");

    // Insert into "sellers" table
    const { error: insertError } = await supabase.from("sellers").insert({
      user_id: user.id,
      name: instructorData.name || "",
      email: user.email,
    });

    if (insertError) throw new Error("Failed to create instructor profile");

    return {
      success: true,
      user,
      requiresConfirmation: !user.email_confirmed_at,
      message: !user.email_confirmed_at
        ? "Please check your email to confirm your account"
        : "Account created successfully",
      isExistingAuth: false,
    };
  } catch (error) {
    console.error("Instructor signup error:", error);
    return { success: false, error: error.message };
  }
};

// Updated function to handle existing auth users
export const loginExistingAuthUser = async (email, userType) => {
  try {
    // For existing auth users, we need to create a session
    // This is a bit tricky - you might need to ask user to sign in normally
    // Or implement a different flow

    // Option 1: Redirect to login
    return {
      success: true,
      requiresLogin: true,
      message: `Account found! Please log in with your existing credentials to access ${userType} features.`,
    };

    // Option 2: If you have a way to get the user object, you can complete login
    // This would require the user to be authenticated already
    // await completeUserLogin(user, userType);
  } catch (error) {
    console.error("Login existing user error:", error);
    return { success: false, error: error.message };
  }
};

// New OTP confirmation function
export const confirmEmailOTP = async (email, otp) => {
  try {
    console.log("Attempting to verify OTP for:", email);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      console.error("OTP verification error:", error);
      throw new Error(error.message);
    }

    const user = data.user;
    const session = data.session;

    if (!user) {
      throw new Error("No user returned from OTP verification");
    }

    console.log("OTP verified successfully for user:", user.id);
    console.log("User metadata:", user.user_metadata);

    // Check if user record already exists in our users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      console.error("Error checking existing user:", checkError);
      throw new Error("Failed to check existing user");
    }

    // Only insert if user doesn't exist in our users table
    if (!existingUser) {
      console.log("Creating user profile in users table");
      const userMetadata = user.user_metadata || {};

      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        name: userMetadata.name || "",
        email: user.email,
        subscription_tier: userMetadata.subscription_tier || "free",
        promo_code: userMetadata.promo_code || "",
      });

      if (insertError) {
        console.error("Insert error after OTP confirmation:", insertError);
        throw new Error(`Failed to create user profile: ${insertError.message}`);
      }

      console.log("User profile created successfully");
    } else {
      console.log("User profile already exists, skipping insert");
    }

    return {
      success: true,
      user: user,
      session: session,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, error: error.message };
  }
};

// Separate function to handle post-confirmation login
export const completeUserLogin = async (user, userType = "user") => {
  try {
    console.log("Completing login for user:", user.id, "type:", userType);

    const meta = user.user_metadata || {};

    login({
      id: user.id,
      name: meta.name || user.email,
      email: user.email,
      initials: (meta.name || user.email || (userType === "instructor" ? "I" : "U"))?.slice(0, 2).toUpperCase(),
      avatar: meta.photo_url || null,
      provider: "email",
    });

    setRole(userType);

    // Only set premium for users, not sellers
    if (userType === "user") {
      setPremium(meta.subscription_tier === "premium");
    }

    // Fetch user profile to ensure everything is in sync
    await fetchUserProfile(user.id, userType);

    console.log("Login completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Login completion error:", error);
    return { success: false, error: error.message };
  }
};

// Resend OTP function
export const resendEmailOTP = async (email) => {
  try {
    console.log("Resending OTP for:", email);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) throw new Error(error.message);

    console.log("OTP resent successfully");
    return {
      success: true,
      message: "Verification code sent to your email",
    };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Google Sign In/Sign Up - Updated with proper redirect handling and role support
 */
export const signInWithGoogle = async (role = "user") => {
  try {
    // Store role in sessionStorage for callback
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_role", role);
    }

    // Get the current origin dynamically
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?role=${role}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Supabase OAuth error:", error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Google sign in error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Create user profile in appropriate table based on role
 */
const createUserProfile = async (user, role) => {
  try {
    let tableName;
    let profileData = {};
    let userIdColumn;

    // Shared base data
    const baseData = {
      email: user.email,
      name: user.user_metadata.name || user.user_metadata.full_name || user.email,
      created_at: new Date().toISOString(),
    };

    // Role-specific setup
    if (role === "instructor") {
      tableName = "sellers";
      userIdColumn = "user_id";

      profileData = {
        ...baseData,
        user_id: user.id,
        // 🚫 No photo_url or avatar here
      };
    } else {
      tableName = "users";
      userIdColumn = "id";

      profileData = {
        ...baseData,
        id: user.id,
        photo_url: user.user_metadata.photo_url || null,
        subscription_tier: user.user_metadata.subscription_tier || "free",
      };
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from(tableName)
      .select("*")
      .eq(userIdColumn, user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingProfile) {
      // Update existing profile - preserve existing subscription_tier
      const updateData = {
        email: user.email,
        name: user.user_metadata.name || user.user_metadata.full_name || user.email,
      };

      // Only add role-specific fields for users table
      if (role === "user") {
        updateData.photo_url = user.user_metadata.photo_url || null;
        // 🔥 Don't overwrite subscription_tier - preserve existing value
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq(userIdColumn, user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, profile: data, isNewUser: false };
    } else {
      // Create new profile
      const { data, error } = await supabase.from(tableName).insert(profileData).select().single();

      if (error) throw error;
      return { success: true, profile: data, isNewUser: true };
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle OAuth callback - Updated to handle role-based user creation
 */
export const handleOAuthCallback = async () => {
  try {
    // Handle the session from URL hash/fragment
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      const user = data.session.user;
      const meta = user.user_metadata;

      // Get role from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get("role") || "user";

      // Create or update user profile in appropriate table
      const profileResult = await createUserProfile(user, role);

      if (!profileResult.success) {
        throw new Error(profileResult.error);
      }

      // Use subscription_tier from database profile, not user metadata
      const subscriptionTier = profileResult.profile.subscription_tier || "free";

      // Login user with basic info
      login({
        id: user.id || user.user_id,
        name: meta.name || meta.full_name || user.email,
        email: user.email,
        initials: (meta.name || meta.full_name || user.email || "U")?.slice(0, 2).toUpperCase(),
        avatar: meta.photo_url || meta.picture || null,
        provider: user.app_metadata?.provider || "google",
        isPremium: subscriptionTier === "premium",
      });

      // Set role
      setRole(role);
      setPremium(subscriptionTier === "premium");

      return {
        success: true,
        user,
        role,
        profile: profileResult.profile,
        isNewUser: profileResult.isNewUser,
      };
    }

    return { success: false, error: "No session found" };
  } catch (error) {
    console.error("OAuth callback error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Alternative callback handler that processes URL fragments
 */
export const handleOAuthCallbackFromUrl = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log("🔍 Starting callback...");
    console.log("👉 sessionData:", sessionData);
    console.log("👉 sessionError:", sessionError);

    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error(sessionError.message);
    }

    let user = sessionData.session?.user;

    if (!user) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      user = userData.user;

      if (!user) {
        throw new Error("No user found");
      }
    }

    const meta = user.user_metadata || {};

    // Get role from URL or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const role =
      urlParams.get("role") || (typeof window !== "undefined" && sessionStorage.getItem("auth_role")) || "user";

    // Clear sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_role");
    }

    // Create/fetch user profile from the DB (e.g. users or sellers table)
    const profileResult = await createUserProfile(user, role);

    if (!profileResult.success) {
      throw new Error(profileResult.error);
    }

    const userProfile = profileResult.profile;
    // Use subscription_tier from database profile, not user metadata
    const subscriptionTier = userProfile.subscription_tier || "free";

    // ✅ Update Zustand store
    login({
      id: user.id,
      name: meta.name || meta.full_name || user.email,
      email: user.email,
      initials: (meta.name || meta.full_name || user.email || "U").slice(0, 2).toUpperCase(),
      avatar: meta.avatar_url || meta.picture || null,
      provider: user.app_metadata?.provider || "google",
      isPremium: subscriptionTier === "premium",
    });

    setRole(role);
    setPremium(subscriptionTier === "premium");

    return {
      success: true,
      user,
      role,
      profile: userProfile,
      isNewUser: profileResult.isNewUser,
    };
  } catch (error) {
    console.error("OAuth callback error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    // Clear Zustand store
    logout();

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, session: data.session };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Update Zustand store
    const currentUser = useUserStore.getState().user;
    setUser({
      ...currentUser,
      ...updates,
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Change password
 */
export const changePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email) => {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user role (for admin use)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    // This would typically require admin privileges
    // You might need to create a server-side API endpoint for this
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Update user role error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch user profile from database (if you have additional user data)
 */
export const fetchUserProfile = async (userId, role = "user") => {
  try {
    // Determine which table and key to query
    const table = role === "instructor" ? "instructors" : "users";
    const key = role === "instructor" ? "user_id" : "id";

    const { data, error } = await supabase.from(table).select("*").eq(key, userId).single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    if (data) {
      setRole(role);
      setPremium(data.subscription_tier === "premium");
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error("Fetch profile error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuth = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (session) {
      const user = session.user;
      const meta = user.user_metadata;

      // Update Zustand store
      login({
        id: user.id || user.user_id,
        name: meta.name || meta.full_name || user.email,
        email: user.email,
        initials: (meta.name || meta.full_name || user.email || "U")?.slice(0, 2).toUpperCase(),
        avatar: meta.photo_url || meta.picture || null,
        provider: user.app_metadata.provider || "email",
      });

      setRole(meta.role || "user");
      if (meta.subscription_tier !== undefined) {
        setPremium(meta.subscription_tier);
      }

      await fetchUserProfile(user.id || user.user_id);

      return { success: true, authenticated: true, user };
    }

    return { success: true, authenticated: false };
  } catch (error) {
    console.error("Check auth error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 */
export const setupAuthListener = () => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event, session);

    if (event === "SIGNED_IN" && session) {
      const user = session.user;
      const meta = user.user_metadata;

      login({
        id: user.id || user.user_id,
        name: meta.name || meta.full_name || user.email,
        email: user.email,
        initials: (meta.name || meta.full_name || user.email || "U")?.slice(0, 2).toUpperCase(),
        avatar: meta.photo_url || meta.picture || null,
        provider: user.app_metadata.provider || "email",
      });

      setRole(meta.role || "user");
      if (meta.subscription_tier !== undefined) {
        setPremium(meta.subscription_tier);
        // ✅ Refresh the page after successful login
        window.location.reload();
      }

      await fetchUserProfile(user.id || user.user_id);
    }

    if (event === "SIGNED_OUT") {
      logout();
      // ✅ Refresh the page after logout
      window.location.reload();
    }
  });

  return subscription;
};

// Export all functions as default
export default {
  loginWithEmail,
  signUpUserWithEmail,
  signUpInstructorWithEmail,
  signInWithGoogle,
  handleOAuthCallback,
  handleOAuthCallbackFromUrl,
  logoutUser,
  getCurrentSession,
  updateUserProfile,
  changePassword,
  resetPassword,
  updateUserRole,
  fetchUserProfile,
  checkAuth,
  setupAuthListener,
};
