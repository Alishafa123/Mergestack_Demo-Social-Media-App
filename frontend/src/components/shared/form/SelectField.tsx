import { useState, useRef, useEffect } from 'react';
import type { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  options: SelectOption[];
  placeholder?: string;
  validation?: RegisterOptions;
  className?: string;
  defaultValue?: string;
}

export default function CustomSelectField({
  name,
  label,
  register,
  errors,
  options,
  placeholder = 'Select an option',
  validation,
  className = '',
  defaultValue = ''
}: CustomSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [selectedLabel, setSelectedLabel] = useState(() => {
    const option = options.find(opt => opt.value === defaultValue);
    return option ? option.label : placeholder;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const error = errors[name];

  const { onChange, ref, ...registerProps } = register(name, validation);

  useEffect(() => {
    setSelectedValue(defaultValue);
    const option = options.find(opt => opt.value === defaultValue);
    setSelectedLabel(option ? option.label : placeholder);
  }, [defaultValue, options, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setIsOpen(false);
    onChange({ target: { name, value: option.value } });
  };

  const handleClear = () => {
    setSelectedValue('');
    setSelectedLabel(placeholder);
    setIsOpen(false);
    onChange({ target: { name, value: '' } });
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <input
          ref={ref}
          type="hidden"
          value={selectedValue}
          {...registerProps}
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
          }`}
        >
          <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLabel}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-50 border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
            <button
              type="button"
              onClick={handleClear}
              className="w-full px-4 py-3 text-left text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
            >
              {placeholder}
            </button>
            
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                  selectedValue === option.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-900 hover:bg-gray-100 focus:bg-gray-100'
                } focus:outline-none`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}