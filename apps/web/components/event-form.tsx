import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateEventDto, UpdateEventDto } from '@/types'
import { useToast } from "@/hooks/use-toast"

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/, 'Invalid ISO-8601 datetime format'),
})

interface EventFormProps {
  event?: CreateEventDto & { id?: string }
  onSubmit: (data: CreateEventDto | UpdateEventDto) => void
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      ...event,
      date: event.date.endsWith('Z') ? event.date : new Date(event.date).toISOString(),
    } : {
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().slice(0, -8), // Remove milliseconds and 'Z'
    },
  })

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true)
    try {
      // Ensure the date is in full ISO-8601 format
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString(),
      }
      await onSubmit(formattedData)
      toast({
        title: "Success",
        description: event?.id ? "Event updated successfully" : "Event created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: event?.id ? "Failed to update event" : "Failed to create event",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time (ISO-8601)</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value.slice(0, -8)} // Remove milliseconds and 'Z' for input
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(date.toISOString());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={isSubmitting}>
          {event?.id ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  )
}

