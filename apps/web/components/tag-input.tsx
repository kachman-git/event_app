import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() !== '' && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
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
        />
        <Button type="button" onClick={() => addTag(inputValue)}>Add Tag</Button>
      </div>
    </div>
  )
}

