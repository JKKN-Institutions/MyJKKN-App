'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

// Application type definition
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

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // Applications data (same as in applications page)
  const applications: Application[] = [
    {
      id: 1,
      name: 'Instasolver',
      category: 'Management',
      rating: 4.1,
      icon: '/app/app1.png',
      url: 'https://www.instasolver.com',
      description:
        'Quickly solve problems and get instant solutions for your tasks. Instasolver uses advanced algorithms to provide accurate solutions for various problems across different domains. Whether you need help with calculations, data analysis, or decision-making, Instasolver has got you covered.',
      developer: 'Instasolver Inc.',
      downloads: '100K+',
      lastUpdated: '2023-10-15',
      screenshots: ['/app/insta1.png', '/app/insta2.png']
    },
    {
      id: 2,
      name: 'OnBoarding',
      category: 'Management',
      rating: 4.5,
      icon: '/app/app2.png',
      url: 'https://www.onboarding.com',
      description:
        'Streamline your employee onboarding process with our comprehensive solution. OnBoarding helps HR teams create seamless onboarding experiences for new employees, ensuring they have all the necessary information and resources from day one.',
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
      description:
        'Find and book venues for your events with ease. Venue Booking offers a wide selection of venues for various events, from small meetings to large conferences and celebrations. Browse through available options, check pricing, and make reservations all in one place.',
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
        'Manage your AI assistants and automate tasks with GPT technology. GPT Manager allows you to create, customize, and deploy AI assistants for various tasks. Improve productivity and efficiency by leveraging the power of advanced language models.',
      developer: 'AI Solutions Inc',
      downloads: '200K+',
      lastUpdated: '2023-12-01',
      screenshots: ['/app/gpt-1.jpg', '/app/gpt-2.jpg']
    }
    // Additional applications from the applications page...
  ];

  const app = applications.find((app) => app.id === id);

  if (!app) {
    return <div className='p-8 text-center'>Application not found</div>;
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 text-gray-800'>
      <main className='flex-1 px-5 py-6 overflow-y-auto'>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className='flex items-center text-gray-600 mb-6'
        >
          <ArrowLeft className='h-5 w-5 mr-2' />
          Back
        </button>

        {/* App Header */}
        <div className='flex items-start mb-8'>
          <div className='h-24 w-24 rounded-xl overflow-hidden mr-4 shadow-md'>
            <Image
              src={app.icon}
              alt={app.name}
              width={100}
              height={100}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex-grow'>
            <h1 className='text-2xl font-bold'>{app.name}</h1>
            <p className='text-sm text-teal-600 mb-2'>{app.developer}</p>
            <div className='flex items-center mb-2'>
              <span className='text-sm font-medium mr-2'>{app.rating}</span>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(app.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className='text-xs text-gray-500 ml-2'>
                {app.downloads} downloads
              </span>
            </div>
            <Link href={app.url} className='inline-block'>
              <button className='bg-teal-500 text-white px-6 py-2 rounded-lg flex items-center'>
                <Download className='h-4 w-4 mr-2' />
                Install
              </button>
            </Link>
          </div>
        </div>

        {/* Screenshots */}
        {app.screenshots && app.screenshots.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-lg font-bold mb-4'>Screenshots</h2>
            <div className='flex overflow-x-auto space-x-4 pb-4'>
              {app.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className='flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden shadow-sm'
                >
                  <Image
                    src={screenshot}
                    alt={`${app.name} screenshot ${index + 1}`}
                    width={300}
                    height={200}
                    className='h-full w-full object-cover'
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className='mb-8'>
          <h2 className='text-lg font-bold mb-4'>About this app</h2>
          <p className='text-gray-700'>{app.description}</p>
        </div>

        {/* Additional Information */}
        <div className='mb-8'>
          <h2 className='text-lg font-bold mb-4'>Additional Information</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='text-sm text-gray-500'>Category</h3>
              <p className='text-gray-700'>{app.category}</p>
            </div>
            <div>
              <h3 className='text-sm text-gray-500'>Last Updated</h3>
              <p className='text-gray-700'>{app.lastUpdated}</p>
            </div>
            <div>
              <h3 className='text-sm text-gray-500'>Developer</h3>
              <p className='text-gray-700'>{app.developer}</p>
            </div>
            <div>
              <h3 className='text-sm text-gray-500'>Downloads</h3>
              <p className='text-gray-700'>{app.downloads}</p>
            </div>
          </div>
        </div>

        {/* Similar Apps */}
        <div className='mb-8'>
          <h2 className='text-lg font-bold mb-4'>Similar Apps</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {applications
              .filter((a) => a.category === app.category && a.id !== app.id)
              .slice(0, 4)
              .map((similarApp) => (
                <Link
                  href={`/applications/${similarApp.id}`}
                  key={similarApp.id}
                  className='block'
                >
                  <div className='bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex justify-center mb-3'>
                      <div className='h-16 w-16 rounded-xl overflow-hidden'>
                        <Image
                          src={similarApp.icon}
                          alt={similarApp.name}
                          width={100}
                          height={100}
                          className='h-full w-full object-cover'
                        />
                      </div>
                    </div>
                    <h3 className='text-sm font-medium text-center'>
                      {similarApp.name}
                    </h3>
                    <div className='flex items-center justify-center mt-2'>
                      <span className='text-xs text-gray-600'>
                        {similarApp.rating}
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
      </main>
    </div>
  );
}
