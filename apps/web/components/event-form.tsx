import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateEventDto, UpdateEventDto, Event, Tag } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { TagInput } from './tag-input'
import { eventApi, tagApi } from '@/lib/api'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/, 'Invalid datetime format'),
})

interface EventFormProps {
  event?: Event
  onSubmit: (data: CreateEventDto | UpdateEventDto) => void
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(event?.tags.map(tag => tag.name) || [])
  const { toast } = useToast()

  const ensureFullISOString = (dateString: string): string => {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(dateString)) {
      return dateString;
    }
    
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return `${dateString}:00.000Z`;
    }
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
  };

  const createTag = async (tagName: string) => {
    try {
      await tagApi.create({ name: tagName, eventId: event?.id || 'temp' })
      return true
    } catch (error) {
      console.error('Failed to create tag:', error)
      return false
    }
  }

  const deleteTag = async (tagName: string) => {
    if (event?.id) {
      const tagToDelete = event.tags.find(tag => tag.name === tagName)
      if (tagToDelete) {
        try {
          await tagApi.delete(tagToDelete.id)
          return true
        } catch (error) {
          console.error('Failed to delete tag:', error)
          return false
        }
      }
    }
    return false
  }

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      location: event.location,
      date: ensureFullISOString(event.date),
    } : {
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString(),
    },
  })

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true)
    try {
      const formattedData = {
        ...data,
        date: ensureFullISOString(data.date),
        tags: tags,
      }
      
      if (event?.id) {
        // Handle tag updates for existing events
        const existingTags = event.tags.map(tag => tag.name)
        const tagsToAdd = tags.filter(tag => !existingTags.includes(tag))
        const tagsToRemove = existingTags.filter(tag => !tags.includes(tag))

        for (const tagName of tagsToAdd) {
          await createTag(tagName)
        }

        for (const tagName of tagsToRemove) {
          await deleteTag(tagName)
        }
      }

      await onSubmit(formattedData)
      toast({
        title: "Success",
        description: event ? "Event updated successfully" : "Event created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: event ? "Failed to update event" : "Failed to create event",
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
              <FormLabel>Date and Time</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value.slice(0, 16)}
                  onChange={(e) => {
                    const fullISOString = ensureFullISOString(e.target.value);
                    field.onChange(fullISOString);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <TagInput 
            tags={tags}
            setTags={setTags}
            isEditing={!!event}
          />
        </FormItem>
        <Button type="submit" loading={isSubmitting}>
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  )
}

