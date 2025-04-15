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
  ChevronRight,
  Clock,
  Sun,
  Wind,
  Droplet,
  ClipboardList,
  BarChart,
  Bell,
  User,
  HelpCircle,
  Settings,
  CreditCard,
  Users,
  FileText,
  Briefcase,
  ListChecks,
  TrendingUp,
  AlertTriangle,
  CloudRain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { WeatherWidget } from '@/components/weather-widget';

// *** Weather API Types ***
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

// *** New Welcome Message Component ***
const WelcomeMessage = ({
  userName,
  isLoading
}: {
  userName: string;
  isLoading: boolean;
}) => {
  return (
    <div
      className='relative rounded-xl p-6 shadow-sm overflow-hidden flex flex-col justify-center min-h-[180px] text-white w-full'
      style={{
        backgroundImage: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)'
      }}
    >
      {/* Background decorative elements */}
      <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-yellow-500/20 blur-xl opacity-70'></div>
      <div className='absolute top-20 right-10 w-16 h-16 rounded-full bg-orange-500/30 blur-xl opacity-60'></div>
      <div className='absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-orange-600/20 blur-lg opacity-70'></div>
      <div className='absolute bottom-12 left-12 w-12 h-12 rounded-full bg-yellow-400/30 blur-xl opacity-60'></div>

      <div className='relative z-10'>
        <div className='flex items-center gap-2 text-base font-semibold text-white/80 mb-2'>
          <Clock className='h-3.5 w-3.5' />
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

        <h1 className='text-2xl md:text-3xl font-bold text-white'>
          {isLoading ? (
            <div className='h-8 w-48 md:h-9 md:w-64 bg-white/30 rounded-lg animate-pulse'></div>
          ) : (
            <div className='flex flex-col sm:gap-2'>
              <span>Good {getTimeOfDay()},</span>
              <span className='text-white font-semibold break-words'>
                {userName || 'User'}
              </span>
            </div>
          )}
        </h1>

        <p className='text-white/80 text-sm mt-2'>
          Here&apos;s your overview for today.
        </p>
      </div>
    </div>
  );
};

// *** New Weather and Quick Access Component ***
const WeatherQuickAccess = () => {
  const quickAccessItems = [
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: Users, label: 'Members', href: '/members' },
    { icon: FileText, label: 'Documents', href: '/documents' },
    { icon: BarChart, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
      {/* Weather Widget */}
      <div className='relative h-full'>
        <WeatherWidget className='relative overflow-hidden z-10 h-full' />
      </div>

      {/* Quick Navigation */}
      <div className='text-card-foreground rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 min-h-[180px] flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
        <h3 className='text-base text-white font-semibold mb-4'>
          Quick Access
        </h3>
        <div className='grid grid-cols-3 gap-3 flex-grow'>
          {quickAccessItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className='flex flex-col items-center justify-center p-3 rounded-lg bg-accent/50  transition-all duration-200 group transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card'
            >
              <item.icon className='h-6 w-6 text-white mb-1.5 group-hover:text-primary-foreground transition-colors duration-200' />
              <span className='text-xs font-medium text-center text-white group-hover:text-primary-foreground transition-colors duration-200'>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Image slider component
const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; // Minimum distance for a swipe

  const slides = [
    {
      id: 1,
      image: '/images/slide1.png',
      title: 'JKKN College of Engineering and Technology'
    },
    {
      id: 2,
      image: '/images/slide2.jpg',
      title: 'JKKN Dental College and Hospital'
    },
    {
      id: 3,
      image: '/images/slide3.png',
      title: 'JKKN College Of Allied Health Science'
    },
    {
      id: 4,
      image: '/images/slide4.png',
      title: 'JKKN College of Pharmacy'
    },
    {
      id: 5,
      image: '/images/slide1.png',
      title: 'JKKN College of Arts and Science'
    },
    {
      id: 6,
      image: '/images/slide2.jpg',
      title: 'JKKN College of Education'
    },
    {
      id: 7,
      image: '/images/slide3.png',
      title: 'JKKN College of Education'
    },
    {
      id: 8,
      image: '/images/slide4.png',
      title: 'Sresakthimayeil Institute of Nursing and Research'
    },
    {
      id: 9,
      image: '/images/slide1.png',
      title: 'JKKN Matriculation Higher Secondary School'
    },
    {
      id: 10,
      image: '/images/slide1.png',
      title: 'Nattraja Vidhyalya'
    }
  ];

  const totalSlides = slides.length;
  const slidesPerViewDesktop = 3;
  const maxDesktopIndex = Math.max(0, totalSlides - slidesPerViewDesktop);
  const maxMobileIndex = totalSlides - 1;

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const isDesktop = window.innerWidth >= 1024;
        const maxIndex = isDesktop ? maxDesktopIndex : maxMobileIndex;
        // If on desktop and only one "page" of slides, don't auto-advance
        if (isDesktop && maxDesktopIndex === 0) return prev;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [maxDesktopIndex, maxMobileIndex, totalSlides]); // Add totalSlides dependency

  // Handle touch events for swipe on mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null); // Reset touch end on new start
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev >= maxMobileIndex ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev <= 0 ? maxMobileIndex : prev - 1));
    }
    // Reset touch points
    setTouchStart(null);
    setTouchEnd(null);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => {
      const isDesktop = window.innerWidth >= 1024;
      const maxIndex = isDesktop ? maxDesktopIndex : maxMobileIndex;
      // Prevent going beyond 0
      return prev <= 0 ? 0 : prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentSlide((prev) => {
      const isDesktop = window.innerWidth >= 1024;
      const maxIndex = isDesktop ? maxDesktopIndex : maxMobileIndex;
      // Prevent going beyond maxIndex
      return prev >= maxIndex ? maxIndex : prev + 1;
    });
  };

  // Determine if buttons should be disabled
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled =
    currentSlide === (isDesktop ? maxDesktopIndex : maxMobileIndex);

  return (
    <div className='mb-8 md:mb-10 lg:mb-12'>
      <div className='relative rounded-2xl overflow-hidden group'>
        {/* Mobile slider (1 slide at a time) */}
        <div
          className='lg:hidden relative w-full h-52 sm:h-64 overflow-hidden rounded-2xl'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className='flex transition-transform duration-500 ease-out h-full'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className='min-w-full h-full relative flex-shrink-0'
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  className='absolute inset-0 w-full h-full object-cover'
                  fill
                  sizes='(max-width: 1023px) 100vw, 33vw'
                  priority={index === 0} // Prioritize only the very first image
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent' />
                <div className='absolute inset-x-0 bottom-0 p-6 z-10 text-white'>
                  <h2 className='text-xl font-bold mb-1'>{slide.title}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile navigation dots */}
          <div className='absolute -bottom-4 left-0 right-0 flex justify-center gap-2 z-20'>
            {slides.map((_, index) => (
              <button
                key={`mobile-dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentSlide === index
                    ? 'bg-lime-600 scale-110'
                    : 'bg-lime-600/50 hover:bg-lime-600/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop slider (multiple slides at a time) */}
        <div className='hidden lg:block relative'>
          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className={cn(
              'absolute left-[-18px] top-1/2 -translate-y-1/2 z-20 bg-card hover:bg-accent text-card-foreground p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:left-4',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:group-hover:left-[-18px]' // Keep disabled button hidden until hover
            )}
            aria-label='Previous slide'
            disabled={isPrevDisabled}
          >
            <ChevronRight className='h-5 w-5 rotate-180' />
          </button>
          <button
            onClick={handleNext}
            className={cn(
              'absolute right-[-18px] top-1/2 -translate-y-1/2 z-20 bg-card hover:bg-accent text-card-foreground p-2.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:right-4',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:group-hover:right-[-18px]' // Keep disabled button hidden until hover
            )}
            aria-label='Next slide'
            disabled={isNextDisabled}
          >
            <ChevronRight className='h-5 w-5' />
          </button>

          {/* Slide Container */}
          <div className='overflow-hidden rounded-xl'>
            <div
              className='flex -mx-2' // Negative margin to counteract padding
              style={{
                width: `${(totalSlides / slidesPerViewDesktop) * 100}%`, // Container width based on total slides
                transform: `translateX(-${
                  (currentSlide * 100) / totalSlides
                }%)`, // Move based on current slide index
                transition: 'transform 0.5s ease-out'
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={`desktop-${slide.id}`}
                  className='px-2 flex-shrink-0' // Padding for gap, prevent shrinking
                  style={{ width: `${100 / totalSlides}%` }} // Each slide takes equal portion of the inner container
                >
                  <div className='relative h-72 rounded-xl overflow-hidden shadow-md group/slide'>
                    <div className='relative w-full h-full rounded-xl overflow-hidden transform transition-transform hover:scale-[1.03] duration-300'>
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        className='absolute inset-0 w-full h-full object-cover'
                        fill
                        sizes='33vw'
                        priority={index < slidesPerViewDesktop} // Prioritize initially visible images
                        loading={
                          index < slidesPerViewDesktop ? 'eager' : 'lazy'
                        }
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
                      <div className='absolute inset-x-0 bottom-0 p-5 z-10 text-white'>
                        <h2 className='text-xl font-bold mb-1'>
                          {slide.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop navigation dots */}
          <div className='flex justify-center gap-2 mt-8'>
            {/* Create dots only if there's more than one page */}
            {maxDesktopIndex > 0 &&
              Array.from({ length: maxDesktopIndex + 1 }).map((_, index) => (
                <button
                  key={`desktop-dot-${index}`}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-primary scale-110'
                      : 'bg-primary/20 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide group ${index + 1}`}
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
      icon: BookOpen,
      color: 'blue',
      href: '/category/academic'
    },
    {
      id: 2,
      name: 'Finance',
      icon: DollarSign,
      color: 'emerald',
      href: '/category/finance'
    },
    {
      id: 3,
      name: 'Library',
      icon: Library,
      color: 'purple',
      href: '/category/library'
    },
    {
      id: 4,
      name: 'Events',
      icon: Calendar,
      color: 'orange',
      href: '/category/events'
    }
  ];

  // Define color themes for categories
  const colorThemes = {
    blue: {
      gradient: 'from-blue-500/15 to-blue-600/15',
      border: 'border-blue-500/30 hover:border-blue-500/50',
      shadow: 'shadow-blue-500/10 group-hover:shadow-blue-500/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconText: 'text-blue-600 dark:text-blue-400',
      hoverIconBg: 'group-hover:bg-blue-500',
      hoverIconText: 'group-hover:text-white',
      hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
    },
    emerald: {
      gradient: 'from-emerald-500/15 to-emerald-600/15',
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      shadow: 'shadow-emerald-500/10 group-hover:shadow-emerald-500/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconText: 'text-emerald-600 dark:text-emerald-400',
      hoverIconBg: 'group-hover:bg-emerald-500',
      hoverIconText: 'group-hover:text-white',
      hoverText:
        'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
    },
    purple: {
      gradient: 'from-purple-500/15 to-purple-600/15',
      border: 'border-purple-500/30 hover:border-purple-500/50',
      shadow: 'shadow-purple-500/10 group-hover:shadow-purple-500/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconText: 'text-purple-600 dark:text-purple-400',
      hoverIconBg: 'group-hover:bg-purple-500',
      hoverIconText: 'group-hover:text-white',
      hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
    },
    orange: {
      gradient: 'from-orange-500/15 to-orange-600/15',
      border: 'border-orange-500/30 hover:border-orange-500/50',
      shadow: 'shadow-orange-500/10 group-hover:shadow-orange-500/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconText: 'text-orange-600 dark:text-orange-400',
      hoverIconBg: 'group-hover:bg-orange-500',
      hoverIconText: 'group-hover:text-white',
      hoverText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400'
    }
  };

  return (
    <div className='mb-8 md:mb-10 lg:mb-12'>
      <h2 className='text-xl md:text-2xl font-bold mb-5 md:mb-6 text-foreground'>
        Explore Categories
      </h2>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6'>
        {categories.map((category) => {
          const theme = colorThemes[category.color as keyof typeof colorThemes];
          return (
            <Link
              href={category.href}
              key={category.id}
              className='group relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />
              {/* Main Card Content */}
              <div
                className={cn(
                  'bg-card/80 backdrop-blur-sm border rounded-xl p-5 md:p-6 flex flex-col items-center justify-center aspect-square transition-all duration-300',
                  theme.border,
                  theme.shadow
                )}
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    'p-3 md:p-4 rounded-full mb-3 transition-all duration-300',
                    theme.iconBg,
                    theme.iconText,
                    theme.hoverIconBg,
                    theme.hoverIconText // Hover styles for icon
                  )}
                >
                  <category.icon className='h-6 w-6 md:h-7 md:w-7' />
                </div>
                {/* Category Name */}
                <span
                  className={cn(
                    'text-sm md:text-base font-medium text-center text-foreground transition-colors duration-300',
                    theme.hoverText // Hover style for text
                  )}
                >
                  {category.name}
                </span>
              </div>
            </Link>
          );
        })}
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
  url: string; // URL to the application page or external site
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
    <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm border border-border/30'>
      <ul className='divide-y divide-border'>
        {displayedApps.map((app, index) => (
          <li key={app.id}>
            <Link
              href={app.url} // Link to the application URL
              target='_blank' // Open external links in new tab
              rel='noopener noreferrer'
              className='flex items-center p-4 hover:bg-accent/60 transition-colors group duration-200'
            >
              {/* Index Number (optional, shown on larger screens) */}
              <div className='flex-shrink-0 w-8 text-muted-foreground font-medium text-center mr-3 hidden sm:block'>
                {index + 1}
              </div>
              {/* App Icon */}
              <div className='flex-shrink-0 h-12 w-12 md:h-14 md:w-14 shadow bg-background rounded-lg overflow-hidden mr-4 transform transition-transform duration-200 group-hover:scale-105'>
                <Image
                  src={app.icon}
                  alt={`${app.name} icon`}
                  width={64}
                  height={64}
                  className='h-full w-full object-cover'
                />
              </div>
              {/* App Name & Category */}
              <div className='flex-grow min-w-0'>
                <h3 className='text-base font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200'>
                  {app.name}
                </h3>
                <p className='text-sm text-muted-foreground truncate'>
                  {app.category}
                </p>
              </div>
              {/* Rating */}
              <div className='flex items-center ml-3 pl-3 border-l border-border/50 shrink-0'>
                <Star className='h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current mr-1' />
                <span className='text-sm md:text-base font-medium'>
                  {app.rating.toFixed(1)}
                </span>
              </div>
              {/* Chevron Icon */}
              <ChevronRight className='h-5 w-5 ml-2 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1' />
            </Link>
          </li>
        ))}
      </ul>

      {/* View All Link */}
      {applications.length > limit && (
        <Link
          href='/applications' // Link to view all applications page
          className='flex items-center justify-center p-4 text-primary font-medium hover:bg-accent/60 transition-colors text-sm'
        >
          View All Applications
          <ChevronRight className='h-4 w-4 ml-1' />
        </Link>
      )}
    </div>
  );
};

// Quick Links Component
const QuickLinks = () => {
  const links = [
    { href: '/profile', icon: User, label: 'My Profile' },
    { href: '/courses', icon: Briefcase, label: 'My Courses' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/help', icon: HelpCircle, label: 'Help & Support' }
  ];

  return (
    <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm border border-border/30'>
      <ul className='divide-y divide-border'>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='flex items-center p-4 hover:bg-accent/60 transition-colors group duration-200'
            >
              {/* Icon */}
              <span className='w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 flex-shrink-0'>
                <link.icon className='h-5 w-5' />
              </span>
              {/* Label */}
              <span className='text-foreground font-medium group-hover:text-primary transition-colors duration-200 flex-grow'>
                {link.label}
              </span>
              {/* Chevron */}
              <ChevronRight className='h-5 w-5 ml-2 text-muted-foreground/60 group-hover:text-primary transition-colors duration-200 transform group-hover:translate-x-1' />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Announcement Card Component (Optional, can be used if structure repeats often)
const AnnouncementCard = ({
  title,
  image,
  excerpt,
  href
}: {
  title: string;
  image: string;
  excerpt: string;
  href: string;
}) => {
  return (
    <div className='bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/30 group transform hover:-translate-y-1 flex flex-col'>
      <div className='relative h-48 md:h-56 overflow-hidden'>
        <Image
          src={image}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          fill
          sizes='(max-width: 767px) 100vw, 50vw'
          loading='lazy'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
      </div>
      <div className='p-5 flex flex-col flex-grow'>
        <h3 className='text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200'>
          {title}
        </h3>
        <p className='text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow'>
          {excerpt}
        </p>
        <Link
          href={href}
          className='inline-flex items-center text-primary font-medium text-sm hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded mt-auto self-start'
        >
          Read More
          <ChevronRight className='h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform' />
        </Link>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    let isMounted = true; // Flag to prevent state update on unmounted component

    const fetchUserData = async () => {
      // Set loading true only if component is mounted
      if (isMounted) setIsLoading(true);

      try {
        const supabase = createClientSupabaseClient();
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        // Stop if component unmounted during async call
        if (!isMounted) return;

        if (authError || !authData?.user) {
          console.error(
            'Error fetching auth user or no user found:',
            authError?.message
          );
          setUserName('Guest');
          return; // Keep loading false (set in finally)
        }

        const user = authData.user;
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        // Stop if component unmounted
        if (!isMounted) return;

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116: Row not found
          console.error('Error fetching user profile:', profileError.message);
          // Decide how to handle profile fetch error, maybe keep loading or use default
          setUserName(user.email?.split('@')[0] || 'User'); // Fallback if profile fetch fails
        } else if (profileData?.full_name) {
          setUserName(profileData.full_name);
        } else {
          console.log(
            'User profile not found or name is missing, using default.'
          );
          // Fallback to part of email or a generic name
          setUserName(user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Unexpected error in fetchUserData:', error);
          setUserName('Guest'); // Fallback on unexpected error
        }
      } finally {
        // Ensure loading is set to false only if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Available applications data
  const applications: Application[] = [
    // Using placeholder URLs for demo
    {
      id: 1,
      name: 'Instasolver',
      category: 'Management',
      rating: 4.1,
      icon: '/app/app1.png',
      url: '#'
    },
    {
      id: 2,
      name: 'OnBoarding',
      category: 'Management',
      rating: 4.5,
      icon: '/app/app2.png',
      url: '#'
    },
    {
      id: 3,
      name: 'Venue Booking',
      category: 'Logistics',
      rating: 4.4,
      icon: '/app/app3.jpg',
      url: '#'
    },
    {
      id: 4,
      name: 'GPT Manager',
      category: 'AI Tools',
      rating: 4.7,
      icon: '/app/app4.png',
      url: '#'
    },
    {
      id: 5,
      name: 'Data Analyser',
      category: 'Analytics',
      rating: 4.9,
      icon: '/app/app5.png',
      url: '#'
    } // Ensure this icon exists
  ];

  // Dummy Announcements Data
  const announcements = [
    {
      id: 1,
      title: 'New Semester Guidelines',
      image: '/images/bg11.png',
      excerpt:
        'Important updates regarding the upcoming semester schedule, course registration, and academic policies are now available.',
      href: '/announcements/semester-guidelines'
    },
    {
      id: 2,
      title: 'Upcoming Campus Events',
      image: '/images/bg12.jpg',
      excerpt:
        "Check out the exciting lineup of events, workshops, and activities happening on campus this month. Don't miss out!",
      href: '/announcements/campus-events'
    }
  ];

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground'>
      {/* Main Content */}
      <main className='flex-1 px-4 py-6 md:px-6 lg:px-8 md:py-8 max-w-7xl mx-auto w-full'>
        {/* Top Section: Welcome, Weather, Quick Access */}
        <section className='mb-8 md:mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
          <div className='lg:col-span-1 flex'>
            <WelcomeMessage userName={userName} isLoading={isLoading} />
          </div>
          <div className='lg:col-span-2 flex'>
            <WeatherQuickAccess />
          </div>
        </section>

        {/* Image Slider */}
        <section className='mb-8 md:mb-10 lg:mb-12'>
          <h2 className='text-xl md:text-2xl font-bold mb-5 md:mb-6 text-foreground'>
            Our Institutions
          </h2>
          <ImageSlider />
        </section>

        {/* Two-column layout for main content + sidebar */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start'>
          {/* Main content column */}
          <div className='lg:col-span-2 flex flex-col gap-8 md:gap-10 lg:gap-12'>
            {/* Category Grid */}
            <CategoryGrid />

            {/* Announcements Section */}
            <section>
              <h2 className='text-xl md:text-2xl font-bold mb-5 md:mb-6 text-foreground'>
                Latest Announcements
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    title={announcement.title}
                    image={announcement.image}
                    excerpt={announcement.excerpt}
                    href={announcement.href}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar column */}
          <div className='lg:col-span-1 flex flex-col gap-8 md:gap-10 lg:gap-12'>
            {/* Available Applications Section */}
            <section>
              <h2 className='text-xl md:text-2xl font-bold mb-5 md:mb-6 text-foreground'>
                Available Applications
              </h2>
              {/* Limit to 4 apps for sidebar */}
              <ApplicationList applications={applications} limit={4} />
            </section>

            {/* Quick Links Card */}
            <section>
              <h2 className='text-xl md:text-2xl font-bold mb-5 md:mb-6 text-foreground'>
                Quick Links
              </h2>
              <QuickLinks />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
