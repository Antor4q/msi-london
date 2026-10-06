import AboutSection from "../components/Home/About";
import Hero from "../components/Home/Banner";
import Brands from "../components/Home/Brands";
import Collection from "../components/Home/Collection";
import FeaturedProducts from "../components/Home/Featured";
import SourceSection from "../components/Home/Source";


export default function Home() {
  return (
   <div >
   <Hero/>
   <AboutSection/>
   <SourceSection/>
   <Collection/>
   <FeaturedProducts/>
   <Brands/>
   </div>
  );
}
