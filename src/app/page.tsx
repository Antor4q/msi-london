import AboutSection from "../components/Home/About";
import Hero from "../components/Home/Banner";
import Brands from "../components/Home/Brands";
import Collection from "../components/Home/Collection";
import FaqSection from "../components/Home/Faqsection";
import FeaturedProducts from "../components/Home/Featured";
import ShopTheLook from "../components/Home/ShopTheLook";
import SourceSection from "../components/Home/Source";
import Testimonials from "../components/Home/Testimonials";


export default function Home() {
  return (
   <div >
   <Hero/>
   <AboutSection/>
   <SourceSection/>
   <Collection/>
   <FeaturedProducts/>
   <Brands/>
   <Testimonials/>
   <ShopTheLook/>
   <FaqSection/>
   </div>
  );
}
