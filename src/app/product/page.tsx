import LuvyFeaturesSection from '@/components/LuvyFeaturesSection'
import { ProductHero } from '@/components/ProductHero'
import ProductShowDataImgComponent from '@/components/ProductShowDataImgComponent'
 import React from 'react'

const page = () => {
  return (
    <>
     <ProductHero/> 
     <ProductShowDataImgComponent/>
     <LuvyFeaturesSection/>
    </>
  )
}

export default page
