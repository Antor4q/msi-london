import AboutSection from "../components/Home/About";
import Hero from "../components/Home/Banner";
import CollectionSection from "../components/Home/Collection";
import FeaturedSection from "../components/Home/Featured";
import SourceSection from "../components/Home/Source";


export default function Home() {
  return (
   <div >
   <Hero/>
   <AboutSection/>
   <SourceSection/>
   <CollectionSection/>
   <FeaturedSection/>
   </div>
  );
}
