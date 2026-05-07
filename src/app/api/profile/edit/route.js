import { ApiResponse } from "@/lib/response";
import { getAuthUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { logError, withApiLogging } from "@/lib/logger";

async function handlePATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: "Unauthorized", status: 401 });
    }

    const body = await req.json();
    const { 
      fullName, 
      phoneNumber, 
      bio, 
      fitnessGoals, 
      coachingPhilosophy, 
      adminNotes,
      password 
    } = body;

    // Find the user to update
    const user = await User.findById(authUser.id);
    if (!user) {
      return ApiResponse({ success: false, message: "User not found", status: 404 });
    }

    // Role-based field restrictions
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;

    // Athlete specific
    if (user.role === 'athlete') {
      if (fitnessGoals) user.fitnessGoals = fitnessGoals;
    }

    // Coach specific
    if (user.role === 'coach') {
      if (coachingPhilosophy) user.coachingPhilosophy = coachingPhilosophy;
    }

    // Admin specific
    if (user.role === 'admin') {
      if (adminNotes) user.adminNotes = adminNotes;
    }

    // Password update with hashing
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Remove password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return ApiResponse({ 
      success: true, 
      message: "Profile synchronized successfully", 
      data: updatedUser 
    });

  } catch (error) {
    logError("profile.update.failure", error);
    
    // Handle duplicate key errors (e.g., email if allowed to change, but here we don't)
    if (error.code === 11000) {
      return ApiResponse({ success: false, message: "Duplicate field value detected", status: 400 });
    }

    return ApiResponse({ success: false, message: "System synchronization failure", status: 500 });
  }
}

export const PATCH = withApiLogging(handlePATCH, "/api/profile/edit");
