'use client'

import { useRouter } from 'next/navigation'
import { EventForm } from '@/components/event-form'
import { eventApi } from '@/lib/api'
import { CreateEventDto } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateEventPage() {
  const router = useRouter()

  const handleSubmit = async (data: CreateEventDto) => {
    try {
      await eventApi.create(data)
      router.push('/my-events')
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Fill in the details to create a new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}

