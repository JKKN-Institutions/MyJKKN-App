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

  // Fetch user data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClientSupabaseClient();
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Authentication error:', error.message);
          return;
        }

        if (data.user) {
          // Use user's name from metadata if available, otherwise use email
          const name =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0] ||
            'Student';

          setUserName(name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
          <div className='relative rounded-xl p-6 md:p-8 border border-primary/10 shadow-sm group'>
            {/* Background decorative elements */}
            <div className='absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-xl'></div>
            <div className='absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-primary/5 blur-lg'></div>

            <div className='relative flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex-1'>
                <h1 className='text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-3 duration-700'>
                  {isLoading ? (
                    <span className='animate-pulse'>Loading...</span>
                  ) : (
                    <>
                      <div className='flex flex-col items-start gap-2'>
                        hi, {''}
                        <span className='text-lg font-semibold text-rose-600 transition-colors duration-300'>
                          {userName}
                        </span>
                      </div>
                    </>
                  )}
                </h1>
                <p className='text-muted-foreground mt-1 max-w-lg text-sm md:text-base animate-in fade-in slide-in-from-bottom-5 duration-1000'>
                  We&apos;re glad to see you again. Here&apos;s what&apos;s new
                  today. Check out your personalized dashboard.
                </p>
              </div>

              <div className='hidden md:flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-right-3 duration-700'>
                <svg
                  className='w-8 h-8 lg:w-10 lg:h-10 text-primary group-hover:text-primary/90 transition-colors duration-300 group-hover:rotate-12 transform motion-safe:animate-pulse'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                  />
                </svg>
              </div>
            </div>

            {/* Animated decorative dots */}
            <div className='hidden md:block absolute bottom-3 right-6'>
              <div className='flex space-x-1'>
                <div className='w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping-slow'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping-slower'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping-slowest'></div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider */}
        <ImageSlider />

        {/* Marquee for college names */}
        <div className='my-8 py-3 rounded-lg'>
          <Marquee
            className='text-sm md:text-base hover:cursor-pointer gap-4 font-medium text-black'
            pauseOnHover
            repeat={2}
          >
            <span className='flex items-center gap-2 justify-center'>
              <Image
                src='/images/logo.jpeg'
                alt='JKKN Logo'
                width={50}
                height={50}
              />
              JKKN College of Engineering and Technology
            </span>
            <span className='flex items-center gap-2 justify-center mr-4'>
              <Image
                src='/images/logo.jpeg'
                alt='JKKN Logo'
                width={50}
                height={50}
              />
              JKKN College of Applied Sciences
            </span>
          </Marquee>
        </div>

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
