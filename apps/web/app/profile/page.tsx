"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { userApi, profileApi } from "@/lib/api";
import { User, Profile } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getMe();
        setUser(userData);
        const profileData = await profileApi.getMyProfile();
        setProfile(profileData);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    console.log({ user, profile });

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile?.avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
          <CardDescription>{profile?.bio}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <span>{user?.email}</span>
          </div>
          {profile?.phoneNumber && (
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{profile.phoneNumber}</span>
            </div>
          )}
          {profile?.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>{profile.address}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>
              Joined {new Date(user?.createdAt || "").toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/settings">
            <Button>Edit Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
