import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

const HomeHeroSection = () => {
  return (
    <section className='w-full py-24 px-8'>
          <div className='w-full max-w-7xl flex flex-col items-center mx-auto gap-4'>
               <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold text-black text-center max-w-4xl'>Grow Your Business  <span className='text-yellow-600'>with Consnect</span></h1>
               <p className='text-center text-base font-medium max-w-2xl text-gray-600'>Win more projects, showcase your expertise, and connect with clients and suppliers across the construction ecosystem.</p>
               <div className='flex items-center gap-4'>
                    <Button size={"lg"} className='bg-yellow-600 rounded-full font-medium text-white flex items-center gap-2 hover:bg-yellow-700'>Get Started <span className='p-1 rounded-full'><ArrowRight size={24} /></span></Button>
                    <Button size={"lg"} className='rounded-full' variant={"outline"}>Book A demo</Button>
               </div>
          </div>
    </section>
  )
}

export default HomeHeroSection