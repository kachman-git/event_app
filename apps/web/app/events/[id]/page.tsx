'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { eventApi, rsvpApi } from '@/lib/api'
import { Event, RSVP } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, MapPin, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { Countdown } from '@/components/countdown'

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvp, setRSVP] = useState<RSVP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await eventApi.getById(id as string)
        setEvent(eventData)
        const rsvpData = await rsvpApi.getByEvent(id as string)
        setRSVP(rsvpData)
      } catch (err) {
        setError('Failed to fetch event data')
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [id])

  const handleRSVP = async (status: 'GOING' | 'MAYBE' | 'NOT_GOING') => {
    try {
      const updatedRSVP = await rsvpApi.createOrUpdate({ eventId: id as string, status })
      setRSVP(updatedRSVP)
    } catch (err) {
      setError('Failed to update RSVP')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Event not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Countdown targetDate={new Date(event.date)} />
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{event.location}</span>
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <span>{event.tags.map(tag => tag.name).join(', ')}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            onClick={() => handleRSVP('GOING')} 
            variant={rsvp?.status === 'GOING' ? 'default' : 'outline'}
          >
            Going
          </Button>
          <Button 
            onClick={() => handleRSVP('MAYBE')} 
            variant={rsvp?.status === 'MAYBE' ? 'default' : 'outline'}
          >
            Maybe
          </Button>
          <Button 
            onClick={() => handleRSVP('NOT_GOING')} 
            variant={rsvp?.status === 'NOT_GOING' ? 'default' : 'outline'}
          >
            Not Going
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

