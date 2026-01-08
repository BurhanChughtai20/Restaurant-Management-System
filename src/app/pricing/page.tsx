import PricingCards from '@/components/PricingCards';
import PricingHero from '@/components/PricingHero'
import TrustedBy from '@/components/TrustedBy';
import React from 'react'

const page = () => {
  return (
    <>
      <PricingHero/>
      <PricingCards/>
      <TrustedBy/>
    </>
  )
}

export default page
