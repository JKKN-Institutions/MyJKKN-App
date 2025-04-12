'use client';

export default function NotificationsPage() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50 text-gray-800'>
      {/* Main Content */}
      <main className='flex-1 px-5 py-6 overflow-y-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Notifications</h1>
          <button className='text-sm text-teal-600 font-medium'>
            Mark all as read
          </button>
        </div>

        <div className='space-y-4'>
          {/* Unread Notification */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border-l-4 border-teal-500 border-t border-r border-b '>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-bold text-gray-800'>
                  Assignment Due Tomorrow
                </h3>
                <span className='text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full'>
                  New
                </span>
              </div>
              <p className='text-gray-600 mb-2'>
                Your &quot;Advanced JavaScript&quot; assignment is due tomorrow
                at 11:59 PM.
              </p>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500'>Today, 10:30 AM</span>
                <button className='text-sm text-teal-600 font-medium'>
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Unread Notification */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border-l-4 border-blue-500 border-t border-r border-b'>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-bold text-gray-800'>
                  New Course Available
                </h3>
                <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                  New
                </span>
              </div>
              <p className='text-gray-600 mb-2'>
                A new course &quot;Introduction to Machine Learning&quot; is now
                available for enrollment.
              </p>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500'>
                  Yesterday, 3:45 PM
                </span>
                <button className='text-sm text-blue-600 font-medium'>
                  Enroll Now
                </button>
              </div>
            </div>
          </div>

          {/* Read Notification */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-medium text-gray-700'>
                  Grade Posted
                </h3>
              </div>
              <p className='text-gray-600 mb-2'>
                Your grade for &quot;UI/UX Design Principles&quot; midterm exam
                has been posted.
              </p>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500'>2 days ago</span>
                <button className='text-sm text-gray-600 font-medium'>
                  View Grade
                </button>
              </div>
            </div>
          </div>

          {/* Read Notification */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-medium text-gray-700'>
                  System Maintenance
                </h3>
              </div>
              <p className='text-gray-600 mb-2'>
                The student portal will be undergoing maintenance this weekend
                from 2 AM to 5 AM.
              </p>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500'>3 days ago</span>
                <button className='text-sm text-gray-600 font-medium'>
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Read Notification */}
          <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100'>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-medium text-gray-700'>
                  Course Feedback
                </h3>
              </div>
              <p className='text-gray-600 mb-2'>
                Please provide feedback for your recently completed
                &quot;Introduction to React&quot; course.
              </p>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500'>1 week ago</span>
                <button className='text-sm text-gray-600 font-medium'>
                  Give Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
