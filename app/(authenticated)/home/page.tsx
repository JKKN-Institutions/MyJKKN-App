'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BookOpen,
  DollarSign,
  Library,
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';
import { createClientSupabaseClient } from '@/lib/supabase/client';

// Helper function to get time of day greeting
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

// Define the easing function
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

// Image slider component
const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/images/slide1.png',
      title: 'Welcome to MyJKKN',
      description: 'Your complete learning platform'
    },
    {
      id: 2,
      image: '/images/slide2.jpg',
      title: 'New Courses Available',
      description: 'Explore our latest offerings'
    },
    {
      id: 3,
      image: '/images/slide3.png',
      title: 'Learn Anywhere',
      description: 'Access your courses on any device'
    },
    {
      id: 4,
      image: '/images/slide4.png',
      title: 'Learn Anywhere',
      description: 'Access your courses on any device'
    }
  ];

  const totalSlides = slides.length;
  const maxDesktopIndex = Math.max(0, totalSlides - 3);
  const maxMobileIndex = totalSlides - 1;

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        // Check if we need to reset based on viewport
        const isDesktop = window.innerWidth >= 1024;
        const maxIndex = isDesktop ? maxDesktopIndex : maxMobileIndex;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [maxDesktopIndex, maxMobileIndex]);

  // Handle touch events for swipe on mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      setCurrentSlide((prev) => (prev >= maxMobileIndex ? 0 : prev + 1));
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      setCurrentSlide((prev) => (prev <= 0 ? maxMobileIndex : prev - 1));
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxMobileIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= maxMobileIndex ? 0 : prev + 1));
  };

  return (
    <div className='mb-8'>
      <div className='relative overflow-hidden rounded-2xl'>
        {/* Mobile slider (1 slide at a time) */}
        <div
          className='lg:hidden relative w-full h-48 overflow-hidden'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className='flex transition-transform duration-500 ease-in-out h-full'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className='min-w-full h-full relative flex-shrink-0'
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className='absolute inset-0 w-full h-full object-cover'
                  width={1000}
                  height={1000}
                  priority
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                <div className='absolute inset-0 flex flex-col justify-end px-6 pb-6 z-20 text-white'>
                  <h2 className='text-xl font-bold mb-1'>{slide.title}</h2>
                  <p className='opacity-90 text-sm'>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile navigation dots */}
          <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop slider (3 slides at a time) */}
        <div className='hidden lg:block'>
          <div className='relative'>
            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className='absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background hover:bg-accent text-foreground p-2 rounded-full shadow-md transition-colors'
              aria-label='Previous slide'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className='absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background hover:bg-accent text-foreground p-2 rounded-full shadow-md transition-colors'
              aria-label='Next slide'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>

            <div className='grid grid-cols-3 gap-4'>
              {[0, 1, 2].map((offset) => {
                const slideIndex = (currentSlide + offset) % totalSlides;
                const slide = slides[slideIndex];
                return (
                  <div
                    key={`desktop-${slide.id}`}
                    className='h-72 relative rounded-xl overflow-hidden shadow-md transform transition-transform hover:scale-[1.02] duration-300'
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      className='absolute inset-0 w-full h-full object-cover'
                      width={1000}
                      height={1000}
                      priority={offset === 0}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    <div className='absolute inset-0 flex flex-col justify-end p-5 z-20 text-white'>
                      <h2 className='text-xl font-bold mb-1'>{slide.title}</h2>
                      <p className='opacity-90 text-sm'>{slide.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop navigation dots */}
          <div className='flex justify-center gap-2 mt-4'>
            {slides.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index >= currentSlide && index < currentSlide + 3
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Category component
const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Academic',
      icon: <BookOpen className='h-6 w-6' />,
      gradient: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      shadow: 'shadow-blue-500/20'
    },
    {
      id: 2,
      name: 'Finance',
      icon: <DollarSign className='h-6 w-6' />,
      gradient: 'from-emerald-500/20 to-emerald-600/20',
      border: 'border-emerald-500/30',
      shadow: 'shadow-emerald-500/20'
    },
    {
      id: 3,
      name: 'Library',
      icon: <Library className='h-6 w-6' />,
      gradient: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
      shadow: 'shadow-purple-500/20'
    },
    {
      id: 4,
      name: 'Calendar',
      icon: <Calendar className='h-6 w-6' />,
      gradient: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-500/30',
      shadow: 'shadow-orange-500/20'
    }
  ];

  return (
    <div className='mb-8'>
      <h2 className='text-xl md:text-2xl font-bold mb-6 text-foreground'>
        Categories
      </h2>
      <div className='grid grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
        {categories.map((category) => (
          <Link
            href={`/category/${category.id}`}
            key={category.id}
            className='group relative'
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${category.gradient} backdrop-blur-xl -z-10 rounded-xl`}
            />
            <div
              className={`
                flex flex-col items-center justify-center p-4 md:p-6 lg:p-8
                transition-all duration-300
                hover:scale-105 hover:shadow-xl
              `}
            >
              <div
                className={`text-foreground transition-colors ${category.border} bg-background/30 backdrop-blur-sm
                shadow-lg ${category.shadow} duration-300 group-hover:text-foreground p-3 md:p-4 rounded-full bg-background/50 ${category.border}`}
              >
                {category.icon}
              </div>
              <span className='mt-3 text-sm md:text-base font-medium text-foreground group-hover:text-foreground'>
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Application type definition
type Application = {
  id: number;
  name: string;
  category: string;
  rating: number;
  icon: string; // Path to icon image
  url: string;
};

// Application List component with View All option
const ApplicationList = ({
  applications,
  limit = 4
}: {
  applications: Application[];
  limit?: number;
}) => {
  const displayedApps = applications.slice(0, limit);

  return (
    <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm'>
      {displayedApps.map((app, index) => (
        <Link
          href={`/applications/${app.id}`}
          key={app.id}
          className='flex items-center p-4 md:p-5 border-b border-border hover:bg-accent/10 transition-colors'
        >
          <div className='flex-shrink-0 w-8 md:w-10 text-muted-foreground font-medium text-center'>
            {index + 1}
          </div>
          <div className='flex-shrink-0 h-14 w-14 md:h-16 md:w-16 shadow-md bg-background rounded-xl overflow-hidden mr-4'>
            <Image
              src={app.icon}
              alt={app.name}
              width={100}
              height={100}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex-grow'>
            <h3 className='text-base md:text-lg font-medium text-foreground'>
              {app.name}
            </h3>
            <p className='text-xs md:text-sm text-muted-foreground'>
              {app.category}
            </p>
          </div>
          <div className='flex items-center ml-2'>
            <Star className='h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current' />
            <span className='text-sm md:text-base font-medium ml-1'>
              {app.rating.toFixed(1)}
            </span>
          </div>
        </Link>
      ))}

      {/* View All Link */}
      <Link
        href='/applications'
        className='flex items-center justify-center p-4 md:p-5 text-primary font-medium hover:bg-accent/10 transition-colors'
      >
        View All Applications
        <ChevronRight className='h-5 w-5 ml-1' />
      </Link>
    </div>
  );
};

export default function HomePage() {
  // Add state for user name
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const supabase = createClientSupabaseClient();
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        if (authError) {
          console.error('Error fetching auth user:', authError);
          setIsLoading(false);
          return;
        }

        if (user) {
          // Check if profiles table exists by handling potential errors
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (error) {
            // If the error is 'not found', it means the profile doesn't exist yet
            if (error.code === 'PGRST116') {
              console.log('User profile not found, using default name');
              // You could create a profile here if needed
            } else {
              console.error('Error fetching user profile:', error.message);
            }
          } else if (data && data.full_name) {
            setUserName(data.full_name);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Available applications data
  const applications = [
    {
      id: 1,
      name: 'Instasolver',
      category: 'Management',
      rating: 4.1,
      icon: '/app/app1.png',
      url: 'https://www.instasolver.com'
    },
    {
      id: 2,
      name: 'OnBoarding',
      category: 'Management',
      rating: 4.5,
      icon: '/app/app2.png',
      url: 'https://www.onboarding.com'
    },
    {
      id: 3,
      name: 'Venu Booking',
      category: 'Management',
      rating: 4.4,
      icon: '/app/app3.jpg',
      url: 'https://www.kukutv.com'
    },
    {
      id: 4,
      name: 'GPT Manager',
      category: 'Management',
      rating: 4.7,
      icon: '/app/app4.png',
      url: 'https://gptmanager.com'
    }
  ];

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground'>
      {/* Main Content */}
      <main className='flex-1 px-5 py-6 md:px-8 lg:px-12 md:py-8 max-w-7xl mx-auto w-full'>
        {/* Welcome Message */}
        <div className='mb-8 overflow-hidden'>
          <div className='relative rounded-xl p-5 md:p-6 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border border-border/40 shadow-sm'>
            {/* Background decorative elements */}
            <div className='absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-xl'></div>
            <div className='absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-primary/5 blur-lg'></div>

            <div className='relative z-10'>
              {/* User greeting section */}
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 md:mb-8'>
                <div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground mb-1.5'>
                    <svg
                      className='h-3.5 w-3.5'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <span>
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </span>
                  </div>

                  <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-foreground'>
                    {isLoading ? (
                      <div className='h-8 w-40 md:h-10 md:w-64 bg-muted/40 rounded-lg animate-pulse'></div>
                    ) : (
                      <div className='flex flex-col gap-1 md:flex-row md:items-end md:gap-2'>
                        <span>Good {getTimeOfDay()},</span>
                        <span className='text-primary font-semibold'>
                          {userName || 'User'}
                        </span>
                      </div>
                    )}
                  </h1>

                  <p className='text-muted-foreground text-xs md:text-sm mt-1.5'>
                    Welcome to your personalized dashboard
                  </p>
                </div>

                {/* Weather Widget & Quick Navigation */}
                <div className='flex flex-col md:flex-row gap-3 mt-4'>
                  {/* Weather Widget */}
                  <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-border/40 shadow-sm flex-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='text-sm font-medium'>Kuala Lumpur</h3>
                        <div className='flex items-center mt-1'>
                          <div className='text-3xl font-bold'>29°</div>
                          <div className='ml-2'>
                            <p className='text-xs text-muted-foreground'>
                              Feels like 32°
                            </p>
                            <p className='text-xs'>Partly Cloudy</p>
                          </div>
                        </div>
                      </div>
                      <div className='h-12 w-12 text-primary'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M17 18a5 5 0 0 0-10 0' />
                          <line x1='12' y1='9' x2='12' y2='2' />
                          <line x1='4.22' y1='10.22' x2='5.64' y2='11.64' />
                          <line x1='1' y1='18' x2='3' y2='18' />
                          <line x1='21' y1='18' x2='23' y2='18' />
                          <line x1='18.36' y1='11.64' x2='19.78' y2='10.22' />
                          <line x1='23' y1='22' x2='1' y2='22' />
                          <polyline points='8 6 12 2 16 6' />
                        </svg>
                      </div>
                    </div>
                    <div className='flex mt-3 pt-3 border-t border-border/40'>
                      <div className='flex-1 text-center'>
                        <p className='text-xs text-muted-foreground'>
                          Humidity
                        </p>
                        <p className='text-sm font-medium'>68%</p>
                      </div>
                      <div className='flex-1 text-center border-x border-border/40'>
                        <p className='text-xs text-muted-foreground'>Wind</p>
                        <p className='text-sm font-medium'>8 km/h</p>
                      </div>
                      <div className='flex-1 text-center'>
                        <p className='text-xs text-muted-foreground'>
                          Precipitation
                        </p>
                        <p className='text-sm font-medium'>12%</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Navigation */}
                  <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-border/40 shadow-sm flex-1'>
                    <h3 className='text-sm font-medium mb-3'>Quick Access</h3>
                    <div className='grid grid-cols-3 gap-2'>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Calendar</span>
                      </button>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Payments</span>
                      </button>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Members</span>
                      </button>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Documents</span>
                      </button>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Reports</span>
                      </button>
                      <button className='flex flex-col items-center justify-center p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-primary'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                        </svg>
                        <span className='text-xs mt-1'>Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widgets for stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 md:mt-0'>
                {/* Courses Widget */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border/40 hover:border-primary/30 transition-all group'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-xs font-medium text-muted-foreground mb-1'>
                        My Courses
                      </h3>
                      <div className='flex items-baseline'>
                        <span className='text-2xl font-bold mr-1'>3</span>
                        <span className='text-xs text-muted-foreground'>
                          courses
                        </span>
                      </div>
                      <p className='text-xs text-green-500 mt-1.5'>
                        1 new this week
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tasks Widget */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border/40 hover:border-primary/30 transition-all group'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-xs font-medium text-muted-foreground mb-1'>
                        Tasks
                      </h3>
                      <div className='flex items-baseline'>
                        <span className='text-2xl font-bold mr-1'>7</span>
                        <span className='text-xs text-muted-foreground'>
                          total
                        </span>
                      </div>
                      <p className='text-xs text-amber-500 mt-1.5'>
                        2 due today
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Progress Widget */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border/40 hover:border-primary/30 transition-all group'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-xs font-medium text-muted-foreground mb-1'>
                        Progress
                      </h3>
                      <div className='flex items-baseline'>
                        <span className='text-2xl font-bold mr-1'>68</span>
                        <span className='text-xs text-muted-foreground'>%</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1.5 mt-2'>
                        <div
                          className='bg-green-600 h-1.5 rounded-full'
                          style={{ width: '68%' }}
                        ></div>
                      </div>
                    </div>
                    <div className='p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Alerts Widget */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border/40 hover:border-primary/30 transition-all group'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-xs font-medium text-muted-foreground mb-1'>
                        Alerts
                      </h3>
                      <div className='flex items-baseline'>
                        <span className='text-2xl font-bold mr-1'>2</span>
                        <span className='text-xs text-muted-foreground'>
                          alerts
                        </span>
                      </div>
                      <p className='text-xs text-rose-500 mt-1.5'>
                        1 new notification
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider */}
        <ImageSlider />

        {/* Two-column layout for desktop */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* Main content column */}
          <div className='lg:col-span-2'>
            {/* Category Grid */}
            <CategoryGrid />

            {/* Announcements Section */}
            <section className='mb-8'>
              <h2 className='text-xl md:text-2xl font-bold mb-6 text-foreground'>
                Announcements
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Announcement Card */}
                <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
                  <div className='relative h-48 md:h-56'>
                    <Image
                      src='/images/bg11.png'
                      alt='New Semester Guidelines'
                      className='w-full h-full object-cover'
                      width={1000}
                      height={1000}
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                  </div>
                  <div className='p-5'>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      New Semester Guidelines
                    </h3>
                    <p className='text-sm text-muted-foreground mb-4 line-clamp-3'>
                      Important updates regarding the upcoming semester
                      schedule, course registration, and academic policies...
                    </p>
                    <Link
                      href='#'
                      className='inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors'
                    >
                      Read More
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </Link>
                  </div>
                </div>

                <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'>
                  <div className='relative h-48 md:h-56'>
                    <Image
                      src='/images/bg12.jpg'
                      alt='New Semester Guidelines'
                      className='w-full h-full object-cover'
                      width={1000}
                      height={1000}
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                  </div>
                  <div className='p-5'>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      New Semester Guidelines
                    </h3>
                    <p className='text-sm text-muted-foreground mb-4 line-clamp-3'>
                      Important updates regarding the upcoming semester
                      schedule, course registration, and academic policies...
                    </p>
                    <Link
                      href='#'
                      className='inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors'
                    >
                      Read More
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar column */}
          <div className='lg:col-span-1'>
            {/* Available Applications Section */}
            <section className='mb-8'>
              <h2 className='text-xl md:text-2xl font-bold mb-6 text-foreground'>
                Available Applications
              </h2>
              <ApplicationList applications={applications} limit={5} />
            </section>

            {/* Quick Links Card */}
            <section className='mb-8'>
              <h2 className='text-xl md:text-2xl font-bold mb-6 text-foreground'>
                Quick Links
              </h2>
              <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm'>
                <ul className='divide-y divide-border'>
                  <li>
                    <Link
                      href='/profile'
                      className='flex items-center p-4 hover:bg-accent/10 transition-colors'
                    >
                      <span className='w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                          />
                        </svg>
                      </span>
                      <span className='text-foreground'>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/courses'
                      className='flex items-center p-4 hover:bg-accent/10 transition-colors'
                    >
                      <span className='w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                          />
                        </svg>
                      </span>
                      <span className='text-foreground'>My Courses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/notifications'
                      className='flex items-center p-4 hover:bg-accent/10 transition-colors'
                    >
                      <span className='w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                          />
                        </svg>
                      </span>
                      <span className='text-foreground'>Notifications</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/help'
                      className='flex items-center p-4 hover:bg-accent/10 transition-colors'
                    >
                      <span className='w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </span>
                      <span className='text-foreground'>Help & Support</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
