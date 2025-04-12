'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

// Application type definition (same as in home page)
type Application = {
  id: number;
  name: string;
  category: string;
  rating: number;
  icon: string;
  url: string;
  description?: string;
  screenshots?: string[];
  developer?: string;
  downloads?: string;
  lastUpdated?: string;
};

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Applications data (expanded from home page)
  const applications: Application[] = [
    {
      id: 1,
      name: 'Instasolver',
      category: 'Management',
      rating: 4.1,
      icon: '/app/app1.png',
      url: 'https://www.instasolver.com',
      description:
        'Quickly solve problems and get instant solutions for your tasks',
      developer: 'Instasolver Inc.',
      downloads: '100K+',
      lastUpdated: '2023-10-15',
      screenshots: [
        '/app/instasolver-1.jpg',
        '/app/instasolver-2.jpg',
        '/app/instasolver-3.jpg'
      ]
    },
    {
      id: 2,
      name: 'OnBoarding',
      category: 'Management',
      rating: 4.5,
      icon: '/app/app2.png',
      url: 'https://www.onboarding.com',
      description:
        'Streamline your employee onboarding process with our comprehensive solution',
      developer: 'OnBoarding Solutions',
      downloads: '50K+',
      lastUpdated: '2023-11-20',
      screenshots: ['/app/onboarding-1.jpg', '/app/onboarding-2.jpg']
    },
    {
      id: 3,
      name: 'Venu Booking',
      category: 'Management',
      rating: 4.4,
      icon: '/app/app3.jpg',
      url: 'https://www.venubooking.com',
      description: 'Find and book venues for your events with ease',
      developer: 'Venue Solutions Ltd',
      downloads: '75K+',
      lastUpdated: '2023-09-05',
      screenshots: ['/app/venue-1.jpg', '/app/venue-2.jpg', '/app/venue-3.jpg']
    },
    {
      id: 4,
      name: 'GPT Manager',
      category: 'Management',
      rating: 4.7,
      icon: '/app/app4.png',
      url: 'https://gptmanager.com',
      description:
        'Manage your AI assistants and automate tasks with GPT technology',
      developer: 'AI Solutions Inc',
      downloads: '200K+',
      lastUpdated: '2023-12-01',
      screenshots: ['/app/gpt-1.jpg', '/app/gpt-2.jpg']
    },
    {
      id: 5,
      name: 'Task Tracker',
      category: 'Productivity',
      rating: 4.3,
      icon: '/app/app1.png',
      url: 'https://tasktracker.com',
      description: 'Keep track of your tasks and boost your productivity',
      developer: 'Productivity Tools',
      downloads: '150K+',
      lastUpdated: '2023-11-10',
      screenshots: ['/app/task-1.jpg', '/app/task-2.jpg']
    },
    {
      id: 6,
      name: 'Meeting Scheduler',
      category: 'Business',
      rating: 4.6,
      icon: '/app/app2.png',
      url: 'https://meetingscheduler.com',
      description: 'Schedule and manage your meetings efficiently',
      developer: 'Business Solutions',
      downloads: '80K+',
      lastUpdated: '2023-10-25',
      screenshots: ['/app/meeting-1.jpg', '/app/meeting-2.jpg']
    }
  ];

  // Filter applications based on search query
  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group applications by category
  const categories = [...new Set(applications.map((app) => app.category))];

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground'>
      <main className='flex-1 px-5 py-6 overflow-y-auto'>
        <h1 className='text-2xl font-bold mb-6'>Applications</h1>

        {/* Search Bar */}
        <div className='relative mb-8'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-muted-foreground' />
          </div>
          <input
            type='text'
            className='block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:ring-ring focus:border-ring bg-background'
            placeholder='Search applications...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery ? (
          // Search Results
          <div className='mb-8'>
            <h2 className='text-xl font-bold mb-4'>Search Results</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {filteredApps.map((app) => (
                <Link
                  href={`/applications/${app.id}`}
                  key={app.id}
                  className='block'
                >
                  <div className='bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-border text-card-foreground'>
                    <div className='flex justify-center mb-3'>
                      <div className='h-16 w-16 rounded-xl overflow-hidden'>
                        <Image
                          src={app.icon}
                          alt={app.name}
                          width={100}
                          height={100}
                          className='h-full w-full object-cover'
                        />
                      </div>
                    </div>
                    <h3 className='text-sm font-medium text-center'>
                      {app.name}
                    </h3>
                    <p className='text-xs text-muted-foreground text-center'>
                      {app.category}
                    </p>
                    <div className='flex items-center justify-center mt-2'>
                      <span className='text-xs text-muted-foreground'>
                        {app.rating}
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-3 h-3 ml-1 text-yellow-500'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Categories
          <>
            {categories.map((category) => (
              <div key={category} className='mb-8'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-xl font-bold'>{category}</h2>
                  <Link
                    href={`/applications/category/${category}`}
                    className='text-primary text-sm'
                  >
                    See all
                  </Link>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {applications
                    .filter((app) => app.category === category)
                    .map((app) => (
                      <Link
                        href={`/applications/${app.id}`}
                        key={app.id}
                        className='block'
                      >
                        <div className='bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-border text-card-foreground'>
                          <div className='flex justify-center mb-3'>
                            <div className='h-16 w-16 rounded-xl overflow-hidden'>
                              <Image
                                src={app.icon}
                                alt={app.name}
                                width={100}
                                height={100}
                                className='h-full w-full object-cover'
                              />
                            </div>
                          </div>
                          <h3 className='text-sm font-medium text-center'>
                            {app.name}
                          </h3>
                          <div className='flex items-center justify-center mt-2'>
                            <span className='text-xs text-muted-foreground'>
                              {app.rating}
                            </span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='w-3 h-3 ml-1 text-yellow-500'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
