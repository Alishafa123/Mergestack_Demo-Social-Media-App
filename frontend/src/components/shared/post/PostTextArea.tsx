import { useState, useRef, useEffect } from 'react';

interface PostTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function PostTextArea({
  value,
  onChange,
  placeholder = "What's on your mind?",
  maxLength = 2000,
  disabled = false,
  autoFocus = false
}: PostTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars <= 100;

  return (
    <div className="space-y-2">
      <div className={`relative border rounded-lg transition-colors ${
        isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
      } ${disabled ? 'bg-gray-50' : 'bg-white'}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className="w-full p-4 border-none outline-none resize-none bg-transparent text-gray-900 placeholder-gray-500 min-h-[120px] max-h-[300px] overflow-y-auto"
          style={{ fontSize: '16px', lineHeight: '1.5' }}
        />
      </div>
      
      {/* Character count */}
      <div className="flex justify-between items-center text-sm">
        <div></div>
        <div className={`${
          isNearLimit ? 'text-orange-500' : 'text-gray-400'
        } ${remainingChars < 0 ? 'text-red-500' : ''}`}>
          {remainingChars} characters remaining
        </div>
      </div>
    </div>
  );
}