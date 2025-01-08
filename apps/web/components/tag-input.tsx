import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { tagApi } from '@/lib/api'
import { Tag, CreateTagDto, UpdateTagDto } from '@/types'
import { useToast } from "@/hooks/use-toast"

interface TagInputProps {
  eventId: string
  initialTags?: Tag[]
  onTagsChange?: (tags: Tag[]) => void
}

export function TagInput({ eventId, initialTags = [], onTagsChange }: TagInputProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      try {
        const fetchedTags = await tagApi.getByEvent(eventId)
        setTags(fetchedTags)
        onTagsChange?.(fetchedTags)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tags",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [eventId, onTagsChange, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const addTag = async (name: string) => {
    if (name.trim() !== '' && !tags.some(tag => tag.name === name.trim())) {
      setIsLoading(true)
      try {
        const newTag = await tagApi.create({ name: name.trim(), eventId } as CreateTagDto)
        const updatedTags = [...tags, newTag]
        setTags(updatedTags)
        onTagsChange?.(updatedTags)
        setInputValue('')
        toast({
          title: "Success",
          description: "Tag added successfully",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add tag",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeTag = async (tagToRemove: Tag) => {
    setIsLoading(true)
    try {
      await tagApi.delete(tagToRemove.id)
      const updatedTags = tags.filter(tag => tag.id !== tagToRemove.id)
      setTags(updatedTags)
      onTagsChange?.(updatedTags)
      toast({
        title: "Success",
        description: "Tag removed successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove tag",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag.id} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
            {tag.name}
            <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" disabled={isLoading}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a tag..."
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="button" onClick={() => addTag(inputValue)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Tag'}
        </Button>
      </div>
    </div>
  )
}

