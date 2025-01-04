"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileApi, userApi } from "@/lib/api";
import { Profile, User } from "@/types";
import { FileUpload } from "@/components/file-upload";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getMe();
        setUser(userData);
        const profileData = await profileApi.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push("/signin");
      }
    };

    fetchData();
  }, [router]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    try {
      setIsUploading(true);
      const updatedProfile = await profileApi.updateAvatar(user.id, file);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <FileUpload
              onUpload={handleAvatarUpload}
              isUploading={isUploading}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
