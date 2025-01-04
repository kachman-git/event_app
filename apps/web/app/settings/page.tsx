'use client'

import { useState, useEffect } from 'react'
import { UserForm } from '@/components/user-form'
import { ProfileForm } from '@/components/profile-form'
import { userApi, profileApi } from '@/lib/api'
import { User, Profile, EditUserDto, UpdateProfileDto } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getMe()
        setUser(userData)
        const profileData = await profileApi.getMyProfile()
        setProfile(profileData)
      } catch (err) {
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleUserUpdate = async (data: EditUserDto) => {
    try {
      const updatedUser = await userApi.edit(data)
      setUser(updatedUser)
      setSuccessMessage('User information updated successfully')
    } catch (err) {
      setError('Failed to update user information')
    }
  }

  const handleProfileUpdate = async (data: UpdateProfileDto) => {
    try {
      if (profile?.id) {
        const updatedProfile = await profileApi.update(profile.id, data)
        setProfile(updatedProfile)
        setSuccessMessage('Profile updated successfully')
      } else {
        const newProfile = await profileApi.create(data)
        setProfile(newProfile)
        setSuccessMessage('Profile created successfully')
      }
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      {successMessage && (
        <Alert className="mb-8">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="user">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Information</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update your account details here.</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <UserForm user={user} onSubmit={handleUserUpdate} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your public profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} onSubmit={handleProfileUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

