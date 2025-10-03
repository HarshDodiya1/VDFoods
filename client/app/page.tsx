import Hero from "../components/herosection";
import type { Metadata } from "next";
import CTASection from "../components/cta";
import { InfiniteMovingCardsDemo } from "../components/reviews";
import ProductShowcase from "../components/homeproducts-new";
import { WorldMapDemo } from "components/worldmap";
import ReasonsToBuySpices from "components/reason";
import VisionMissionSection from "components/vision";
import { CardCaroursalDemo } from "components/card-scroll";
import ProcessCards from "components/animation";
import ScrollVelocity from "components/ui/textscroll";
import Footer from "components/footer";

export const metadata: Metadata = {
  title: "VD FOODS",
  description: "VD FOODS - Your Trusted Spices Partner",
};

export default function Home() {
  return (
    <div className="">
      <div className="lg:mt-8">
        <Hero />
      </div>
      <div className="px-0 sm:px-10 mb-10">
        <div className="py-10">
          <CardCaroursalDemo />
        </div>
        <ProductShowcase />
      </div>
      <ProcessCards />
      <InfiniteMovingCardsDemo />
      <div className="px-2 lg:px-10 mb-10">
        <WorldMapDemo />
      </div>
      <div className="mb-4">
        <ScrollVelocity
          texts={["vd ♡ foods # vd ♡ foods #", "spices # oils ♡"]}
          velocity={50}
          className="custom-scroll-text bg-gray-800 text-white py-2"
        />
      </div>
      <ReasonsToBuySpices />
      <CTASection />
      <VisionMissionSection />
    </div>
  );
}
