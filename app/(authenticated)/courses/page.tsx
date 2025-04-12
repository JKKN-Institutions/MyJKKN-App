'use client';

export default function CoursesPage() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50 text-gray-800'>
      {/* Main Content */}
      <main className='flex-1 px-5 py-6 overflow-y-auto'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>Your Courses</h1>

        <div className='space-y-4'>
          {/* Course Card 1 */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='h-24 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center px-6'>
              <h3 className='text-xl font-bold text-white'>
                Introduction to React
              </h3>
            </div>
            <div className='p-5'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm text-gray-500'>Progress: 60%</span>
                <span className='text-sm font-medium text-blue-600'>
                  12 lessons
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-blue-600 h-2.5 rounded-full'
                  style={{ width: '60%' }}
                ></div>
              </div>
              <div className='mt-4 flex justify-between'>
                <button className='py-2 px-4 bg-blue-500 text-white font-medium text-sm rounded-lg'>
                  Continue
                </button>
                <button className='py-2 px-4 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg'>
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Course Card 2 */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='h-24 bg-gradient-to-r from-teal-500 to-teal-600 flex items-center px-6'>
              <h3 className='text-xl font-bold text-white'>
                Advanced JavaScript
              </h3>
            </div>
            <div className='p-5'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm text-gray-500'>Progress: 25%</span>
                <span className='text-sm font-medium text-teal-600'>
                  8 lessons
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-teal-600 h-2.5 rounded-full'
                  style={{ width: '25%' }}
                ></div>
              </div>
              <div className='mt-4 flex justify-between'>
                <button className='py-2 px-4 bg-teal-500 text-white font-medium text-sm rounded-lg'>
                  Continue
                </button>
                <button className='py-2 px-4 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg'>
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Course Card 3 */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='h-24 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center px-6'>
              <h3 className='text-xl font-bold text-white'>
                UI/UX Design Principles
              </h3>
            </div>
            <div className='p-5'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm text-gray-500'>Progress: 80%</span>
                <span className='text-sm font-medium text-purple-600'>
                  10 lessons
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-purple-600 h-2.5 rounded-full'
                  style={{ width: '80%' }}
                ></div>
              </div>
              <div className='mt-4 flex justify-between'>
                <button className='py-2 px-4 bg-purple-500 text-white font-medium text-sm rounded-lg'>
                  Continue
                </button>
                <button className='py-2 px-4 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg'>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
