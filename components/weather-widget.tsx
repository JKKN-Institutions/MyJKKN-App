'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CloudRain, Droplet, Wind, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Weather API Types
interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user's current location
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsLoading(false);
        return;
      }

      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error.message);
          setError('Unable to get your location. Using default location.');
          setLocation('Erode'); // Fallback to default location
          setLocationLoading(false);
        },
        { timeout: 10000 } // 10 seconds timeout
      );
    };

    getLocation();
  }, []);

  // Fetch weather data when location is available
  useEffect(() => {
    if (!location) return;

    let isMounted = true;

    const fetchWeatherData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

      if (!apiKey) {
        if (isMounted) {
          setError('Weather API key missing. Configure .env.local.');
          setIsLoading(false);
          console.error(
            'Weather API key is missing. Set NEXT_PUBLIC_WEATHER_API_KEY in .env.local'
          );
        }
        return;
      }

      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: 'Failed to parse error response' }));
          console.error('Weather API Error Response:', {
            status: response.status,
            errorData
          });
          throw new Error(
            `HTTP error ${response.status}: ${
              errorData?.error?.message ||
              response.statusText ||
              'Unknown API Error'
            }`
          );
        }

        const data: WeatherData = await response.json();
        if (isMounted) {
          setWeatherData(data);
        }
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        if (isMounted) {
          if (err instanceof Error) {
            setError(`${err.message}`);
          } else {
            setError('An unknown error occurred.');
          }
          setWeatherData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-xl p-5 border border-border/40 shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[180px]',
        className
      )}
    >
      <div>
        {isLoading || locationLoading ? (
          // Loading State
          <div className='animate-pulse'>
            <div className='flex items-center justify-between mb-3'>
              <div className='h-5 w-2/3 bg-muted/50 rounded'></div>
              <div className='h-8 w-8 bg-muted/50 rounded-full'></div>
            </div>
            <div className='flex items-center'>
              <div className='h-10 w-16 bg-muted/50 rounded mr-3'></div>
              <div className='space-y-2'>
                <div className='h-4 w-24 bg-muted/50 rounded'></div>
                <div className='h-4 w-20 bg-muted/50 rounded'></div>
              </div>
            </div>
            {locationLoading && (
              <div className='flex items-center justify-center mt-2 text-xs text-muted-foreground'>
                <Loader2 className='h-3 w-3 mr-1 animate-spin' />
                Getting your location...
              </div>
            )}
          </div>
        ) : error ? (
          // Error State
          <div className='text-center text-destructive flex flex-col items-center justify-center h-full p-4'>
            <AlertTriangle className='h-7 w-7 mb-2 text-destructive/80' />
            <p className='text-sm font-semibold mb-1'>Weather Unavailable</p>
            <p className='text-xs text-muted-foreground'>{error}</p>
          </div>
        ) : weatherData ? (
          // Successfully Loaded State
          <>
            <div className='flex items-center justify-between mb-3'>
              <h3
                className='text-base font-semibold truncate pr-2'
                title={`${weatherData.location.name}, ${weatherData.location.region}`}
              >
                {weatherData.location.name}, {weatherData.location.region}
              </h3>
              {/* Weather Icon from API */}
              <Image
                src={
                  weatherData.current.condition.icon.startsWith('//')
                    ? `https:${weatherData.current.condition.icon}`
                    : weatherData.current.condition.icon ||
                      '/placeholder-icon.png'
                }
                alt={weatherData.current.condition.text}
                width={32}
                height={32}
                className='h-8 w-8 flex-shrink-0'
                unoptimized // Necessary for external URLs
              />
            </div>
            <div className='flex items-center'>
              <div className='text-4xl font-bold mr-3'>
                {Math.round(weatherData.current.temp_c)}°C
              </div>
              <div className='text-sm min-w-0'>
                <p className='text-muted-foreground truncate'>
                  Feels like {Math.round(weatherData.current.feelslike_c)}°C
                </p>
                <p className='font-medium capitalize truncate'>
                  {weatherData.current.condition.text}
                </p>
              </div>
            </div>
          </>
        ) : (
          // Fallback if data is somehow null after loading without error
          <div className='text-center text-muted-foreground p-4'>
            No weather data available.
          </div>
        )}
      </div>

      {/* Weather Details Section */}
      <div className='flex mt-auto pt-4 border-t border-border/40 text-center'>
        {isLoading || locationLoading ? (
          // Loading state skeleton for details
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'flex-1 animate-pulse px-1',
                i === 2 || i === 1 ? 'border-x border-border/40' : ''
              )}
            >
              <div className='h-4 w-4 bg-muted/50 rounded-full mx-auto mb-1.5'></div>
              <div className='h-3 w-10 bg-muted/50 rounded mx-auto mb-1'></div>
              <div className='h-4 w-8 bg-muted/50 rounded mx-auto'></div>
            </div>
          ))
        ) : weatherData && !error ? (
          // Loaded state for details
          <>
            <div className='flex-1 px-1'>
              <Droplet className='h-4 w-4 mx-auto mb-1 text-blue-400' />
              <p className='text-xs text-muted-foreground'>Humidity</p>
              <p className='text-sm font-medium'>
                {weatherData.current.humidity}%
              </p>
            </div>
            <div className='flex-1 border-x border-border/40 px-1'>
              <Wind className='h-4 w-4 mx-auto mb-1 text-gray-400' />
              <p className='text-xs text-muted-foreground'>Wind</p>
              <p className='text-sm font-medium'>
                {Math.round(weatherData.current.wind_kph)} km/h
              </p>
            </div>
            <div className='flex-1 px-1'>
              <CloudRain className='h-4 w-4 mx-auto mb-1 text-cyan-400' />
              <p className='text-xs text-muted-foreground'>Precip.</p>
              <p className='text-sm font-medium'>
                {weatherData.current.precip_mm} mm
              </p>
            </div>
          </>
        ) : (
          // Show placeholder if error or no data in the details section
          <div className='flex-1 text-xs text-muted-foreground text-center py-4 col-span-3'>
            Details unavailable
          </div>
        )}
      </div>
    </div>
  );
}
