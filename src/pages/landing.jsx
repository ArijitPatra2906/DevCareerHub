import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link, useNavigate } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faqs.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@clerk/clerk-react";
import { enqueueSnackbar } from "notistack";
import { Search, SquarePen } from "lucide-react";

const LandingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handlePostJob = () => {
    if (!user) {
      navigate("/post-job");
    } else {
      if (user && user?.unsafeMetadata?.role === "recruiter") {
        navigate("/post-job");
      } else {
        enqueueSnackbar("Login with a recruiter account for posting jobs!!", {
          variant: "info",
        });
      }
    }
  };

  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Dream Job
          <span className="flex items-center gap-2 sm:gap-6">
            and get hired
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 flex-wrap justify-center">
        <Link to={"/jobs"}>
          <Button
            variant="blue"
            size="xl"
            className="flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Find Jobs</span>
          </Button>
        </Link>
        <Button
          onClick={handlePostJob}
          variant="destructive"
          size="xl"
          className="flex items-center space-x-2"
        >
          <SquarePen className="w-5 h-5" />
          <span> Post a Job</span>
        </Button>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* <img src="/banner.jpeg" className="w-full" /> */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
