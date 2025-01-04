'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/types'
import { eventApi } from '@/lib/api'
import { EventsTable } from '@/components/events-table'
import { UserNav } from '@/components/user-nav'
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventApi.getAll()
        setEvents(fetchedEvents)
      } catch (err) {
        setError('Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const sortEvents = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    setEvents(sortedEvents)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Events</h1>
              <UserNav />
            </header>
            <div className="mb-6">
              <Button onClick={sortEvents} variant="outline" className="flex items-center">
                Sort by Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                        <EventsTable events={events} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

