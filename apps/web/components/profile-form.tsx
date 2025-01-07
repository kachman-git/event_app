import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { profileApi } from '@/lib/api'
import { CreateProfileDto, UpdateProfileDto, Profile } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileSchema = z.object({
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
})

interface ProfileFormProps {
  profile: Profile | null
  onSubmit: (data: UpdateProfileDto) => Promise<void>
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [avatarFile, setAvatarFile] = useState<File | null>(null) //Removed
  const { toast } = useToast()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || {
      bio: '',
      phoneNumber: '',
      address: '',
      avatarUrl: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: profile ? "Profile updated successfully" : "Profile created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: profile ? "Failed to update profile" : "Failed to create profile",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => { //Removed
  //   if (event.target.files && event.target.files[0]) {
  //     setAvatarFile(event.target.files[0])
  //   }
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={isSubmitting}>
          {profile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </form>
    </Form>
  )
}

