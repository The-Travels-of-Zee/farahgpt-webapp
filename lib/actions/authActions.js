// authActions.js
import supabase from "@/lib/supabase/supabase";
import useUserStore from "@/store/userStore";

// Get Zustand store actions
const { login, logout, setUser, setRole, setPremium, setEnrolledCourses } = useUserStore.getState();
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
    // console.log(data);

    const user = data.user;
    const meta = user.user_metadata;

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
    setRole(meta.role || "user");
    setPremium(meta.subscription_tier === "premium");

    // Optional: fetch additional user info (e.g., enrolled courses)
    await fetchUserProfile(user.id || user.user_id);

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Email/Password Signup
 */
// export const signUpUserWithEmail = async (email, password, userData = {}) => {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name: userData.name || "",
//           role: "user",
//           subscription_tier: userData.subscription_tier || "free",
//           promo_code: userData.promoCode || null,
//         },
//       },
//     });

//     if (error) throw new Error(error.message);
//     const user = data.user;
//     if (!user) throw new Error("No user returned from signup");

//     // Insert into "users" table
//     const { error: insertError } = await supabase.from("users").insert({
//       id: user.id,
//       name: userData.name || "",
//       email: user.email,
//       subscription_tier: userData.subscription_tier || "free",
//       promo_code: userData.promoCode || null,
//     });

//     if (insertError) throw new Error("Failed to create user profile");

//     if (!user.email_confirmed_at) {
//       return {
//         success: true,
//         user,
//         message: "Please check your email to confirm your account",
//       };
//     }

//     const meta = user.user_metadata;

//     login({
//       id: user.id,
//       name: meta.name || user.email,
//       email: user.email,
//       initials: (meta.name || user.email || "U")?.slice(0, 2).toUpperCase(),
//       avatar: meta.photo_url || null,
//       provider: "email",
//     });

//     setRole("user");
//     setPremium(meta.subscription_tier === "premium");

//     await fetchUserProfile(user.id, "user");

//     return { success: true, user };
//   } catch (error) {
//     console.error("User signup error:", error);
//     return { success: false, error: error.message };
//   }
// };

export const signUpUserWithEmail = async (email, password, userData = {}) => {
  try {
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

    // DON'T insert into users table yet - wait for email confirmation
    console.log("User created in auth, awaiting email confirmation:", user.id);

    return {
      success: true,
      user,
      requiresConfirmation: !user.email_confirmed_at,
      message: !user.email_confirmed_at
        ? "Please check your email to confirm your account"
        : "Account created successfully",
    };
  } catch (error) {
    console.error("User signup error:", error);
    return { success: false, error: error.message };
  }
};

// export const signUpSellerWithEmail = async (email, password, sellerData = {}) => {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name: sellerData.name || "",
//           role: "seller",
//         },
//       },
//     });

//     if (error) throw new Error(error.message);
//     const user = data.user;
//     if (!user) throw new Error("No user returned from signup");

//     // Insert into "sellers" table
//     const { error: insertError } = await supabase.from("sellers").insert({
//       user_id: user.id,
//       name: sellerData.name || "",
//       email: user.email,
//       // any other seller-specific fields
//     });

//     if (insertError) throw new Error("Failed to create seller profile");

//     if (!user.email_confirmed_at) {
//       return {
//         success: true,
//         user,
//         message: "Please check your email to confirm your account",
//       };
//     }

//     const meta = user.user_metadata;

//     login({
//       id: user.id,
//       name: meta.name || user.email,
//       email: user.email,
//       initials: (meta.name || user.email || "S")?.slice(0, 2).toUpperCase(),
//       avatar: meta.photo_url || null,
//       provider: "email",
//     });

//     setRole("seller");

//     await fetchUserProfile(user.id, "seller");

//     return { success: true, user };
//   } catch (error) {
//     console.error("Seller signup error:", error);
//     return { success: false, error: error.message };
//   }
// };

export const signUpInstructorWithEmail = async (email, password, instructorData = {}) => {
  try {
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

    // Insert into "sellers" table which is "instructors" table
    const { error: insertError } = await supabase.from("sellers").insert({
      user_id: user.id,
      name: instructorData.name || "",
      email: user.email,
      // any other instructor-specific fields
    });

    if (insertError) throw new Error("Failed to create instructor profile");

    return {
      success: true,
      user,
      requiresConfirmation: !user.email_confirmed_at,
      message: !user.email_confirmed_at
        ? "Please check your email to confirm your account"
        : "Account created successfully",
    };
  } catch (error) {
    console.error("Instructor signup error:", error);
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
        subscription_tier: user.user_metadata.subscription_tier || "premium",
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
      // Update existing profile
      const { data, error } = await supabase
        .from(tableName)
        .update({
          ...profileData,
          // updated_at: new Date().toISOString(),
        })
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

      // Login user with basic info
      login({
        id: user.id || user.user_id,
        name: meta.name || meta.full_name || user.email,
        email: user.email,
        initials: (meta.name || meta.full_name || user.email || "U")?.slice(0, 2).toUpperCase(),
        avatar: meta.photo_url || meta.picture || null,
        provider: user.app_metadata?.provider || "google",
        isPremium: meta.subscription_tier === "premium",
      });

      // Set role
      setRole(role);
      setPremium(meta.subscription_tier === "premium");

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
      // 🔁 Sync with app state
      setRole(data.role || role); // fallback to passed role
      setPremium(data.subscription_tier === "premium");

      if (data.enrolled_courses) {
        setEnrolledCourses(data.enrolled_courses);
      }
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
