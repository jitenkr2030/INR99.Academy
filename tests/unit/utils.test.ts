/**
 * Unit Tests for Utility Functions
 *
 * Tests core utility functions including class name merging,
 * validation helpers, and formatters.
 */

import { describe, it, expect, vi } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn() - Class Name Merging', () => {
    it('should merge simple class names', () => {
      const result = cn('p-4', 'm-2');
      expect(result).toBe('p-4 m-2');
    });

    it('should handle tailwind merge conflicts - later class wins', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });

    it('should handle margin/padding conflicts correctly', () => {
      const result = cn('p-4 p-2', 'm-2 m-4');
      expect(result).toContain('p-2');
      expect(result).toContain('m-4');
    });

    it('should handle conditional classes (clsx behavior)', () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );

      expect(result).toBe('base-class active-class');
    });

    it('should handle empty inputs gracefully', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null inputs', () => {
      const result = cn('first', undefined, null, 'last');
      expect(result).toBe('first last');
    });

    it('should handle array inputs', () => {
      const result = cn(['p-4', 'm-2'], ['bg-blue-500']);
      expect(result).toContain('p-4');
      expect(result).toContain('m-2');
      expect(result).toContain('bg-blue-500');
    });

    it('should handle mixed object and array inputs', () => {
      const result = cn(
        'base',
        ['array-class'],
        { 'conditional-true': true, 'conditional-false': false }
      );
      expect(result).toContain('base');
      expect(result).toContain('array-class');
      expect(result).toContain('conditional-true');
      expect(result).not.toContain('conditional-false');
    });

    it('should handle complex tailwind conflict scenarios', () => {
      const result = cn(
        'text-lg font-bold text-red-500',
        'text-sm font-medium'
      );

      expect(result).toContain('text-sm');
      expect(result).toContain('font-medium');
      expect(result).toContain('text-red-500');
    });

    it('should preserve non-conflicting classes', () => {
      const result = cn(
        'flex items-center p-4',
        'justify-between p-2'
      );

      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('justify-between');
      expect(result).toContain('p-2');
    });

    it('should handle responsive prefixes', () => {
      const result = cn(
        'text-sm md:text-base lg:text-lg',
        'text-xl md:text-2xl'
      );

      expect(result).toContain('text-xl');
      expect(result).toContain('md:text-2xl');
      expect(result).toContain('lg:text-lg');
    });

    it('should handle hover and focus states', () => {
      const result = cn(
        'bg-blue-500 hover:bg-blue-600',
        'focus:ring-2'
      );

      expect(result).toContain('bg-blue-500');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('focus:ring-2');
    });
  });

  describe('Class Value Handling', () => {
    it('should handle nested arrays', () => {
      const result = cn([['a', 'b'], ['c', 'd']]);
      expect(result).toBe('a b c d');
    });

    it('should handle deeply nested conditional logic', () => {
      const condition1 = true;
      const condition2 = false;
      const condition3 = true;

      const result = cn(
        'base',
        condition1 && ['cond1-a', 'cond1-b'],
        condition2 && { 'cond2': true },
        [
          condition3 && 'cond3-a',
          !condition3 && 'cond3-b'
        ]
      );

      expect(result).toBe('base cond1-a cond1-b cond3-a');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long class strings', () => {
      const longClass = 'p-4 m-2 flex items-center justify-between bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2';
      const result = cn(longClass);
      expect(result).toBe(longClass);
    });

    it('should handle duplicate classes without issues', () => {
      const result = cn('p-4', 'p-4', 'p-4');
      expect(result).toBe('p-4');
    });

    it('should handle special characters in class names', () => {
      const result = cn('[&_span]:text-red-500', 'dark:[&_button]:bg-gray-800');
      expect(result).toContain('[&_span]:text-red-500');
      expect(result).toContain('dark:[&_button]:bg-gray-800');
    });

    it('should handle Tailwind arbitrary values', () => {
      const result = cn('w-[calc(100%-2rem)]', 'h-[200px]');
      expect(result).toBe('w-[calc(100%-2rem)] h-[200px]');
    });
  });
});

describe('Validation Helpers', () => {
  // Helper function to test validation patterns
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.in')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user name@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Phone Number Validation (India)', () => {
    it('should validate correct Indian phone numbers', () => {
      expect(isValidPhoneNumber('9876543210')).toBe(true);
      expect(isValidPhoneNumber('9123456789')).toBe(true);
      expect(isValidPhoneNumber('9988776655')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('1234567890')).toBe(false); // Starts with 1
      expect(isValidPhoneNumber('987654321')).toBe(false); // Only 9 digits
      expect(isValidPhoneNumber('98765432100')).toBe(false); // 11 digits
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('abcdefghij')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
      expect(isValidUrl('https://example.com?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });
});

describe('Currency Formatting (INR)', () => {
  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  it('should format positive amounts correctly', () => {
    expect(formatINR(100)).toBe('₹100');
    expect(formatINR(1000)).toBe('₹1,000');
    expect(formatINR(100000)).toBe('₹1,00,000');
    expect(formatINR(99.99)).toBe('₹99.99');
    expect(formatINR(99.999)).toBe('₹100'); // Rounds to 100
  });

  it('should format zero correctly', () => {
    expect(formatINR(0)).toBe('₹0');
  });

  it('should handle decimal amounts', () => {
    // Note: minimumFractionDigits is 0, so decimals may not be padded
    expect(formatINR(99.5)).toBe('₹99.5');
    expect(formatINR(99.99)).toBe('₹99.99');
  });
});

describe('Date Formatting', () => {
  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  it('should format date objects correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15 January 2024');
  });

  it('should format date strings correctly', () => {
    expect(formatDate('2024-01-15')).toBe('15 January 2024');
    expect(formatDate('2024-12-25')).toBe('25 December 2024');
  });

  it('should handle invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('Invalid Date');
  });
});

describe('Slug Generation', () => {
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  it('should convert text to valid slugs', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
    expect(generateSlug('Course Title Here')).toBe('course-title-here');
    expect(generateSlug('Test   Multiple   Spaces')).toBe('test-multiple-spaces');
  });

  it('should remove special characters', () => {
    expect(generateSlug('Test@#$%Special')).toBe('testspecial');
    expect(generateSlug('Hello, World!')).toBe('hello-world');
  });

  it('should handle empty strings', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should handle unicode characters', () => {
    // Note: [^\w\s-] regex removes accented characters
    expect(generateSlug('Héllo Wörld')).toBe('hllo-wrld');
    expect(generateSlug('Kursus Title')).toBe('kursus-title');
  });
});
