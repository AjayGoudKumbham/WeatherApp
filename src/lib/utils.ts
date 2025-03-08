import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32);
}

export function mpsToKmh(mps: number): number {
  return Math.round(mps * 3.6);
}

export function mpsToMph(mps: number): number {
  return Math.round(mps * 2.237);
}