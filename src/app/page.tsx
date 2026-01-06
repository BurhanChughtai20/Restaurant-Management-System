import Capabilities from '@/components/Capabilities'
import RestaurantLeadersHub from '@/components/RestaurantLeadersHub'
import { HeroSectionOne } from '@/components/HeroSection'
 const page = () => {
  return (
    <div>
      <HeroSectionOne/>
      <Capabilities/>
      <RestaurantLeadersHub/>
    </div>
  )
}

export default page
