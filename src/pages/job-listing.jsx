import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import FilterComponent from "@/components/filter";
import JobCard from "@/components/jobCard";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [salary, setSalary] = useState([0]);
  const [isRemote, setIsRemote] = useState(false);
  const [isPartTime, setIsPartTime] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    salary,
    searchQuery,
    isRemote,
    isPartTime,
  });

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [
    isLoaded,
    location,
    company_id,
    searchQuery,
    salary,
    isRemote,
    isPartTime,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setSalary([0]);
    setIsRemote(false);
    setIsPartTime(false);
  };

  if (!isLoaded) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div className="px-0 md:px-4 lg:px-16 mt-8">
      <h1 className="gradient-title font-extrabold text-3xl sm:text-5xl lg:text-6xl text-center pb-0 md:pb-8">
        Latest Jobs
      </h1>
      <div className="flex justify-between items-center gap-1 pb-8 md:pb-0">
        <Button
          size="lg"
          variant={"destructive"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 md:hidden"
        >
          <Filter size={22} /> Filter
        </Button>
      </div>
      <div className="mt-0 md:mt-8 flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full hidden p-4 lg:w-1/3 md:flex items-center bg-black flex-col h-fit pb-8 rounded-lg">
          <h1 className="flex gap-2 mb-4 font-bold text-lg items-center">
            <Filter size={22} />
            Filters
          </h1>

          <FilterComponent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            location={location}
            setLocation={setLocation}
            company_id={company_id}
            setCompany_id={setCompany_id}
            companies={companies}
            salary={salary}
            setSalary={setSalary}
            isRemote={isRemote}
            setIsRemote={setIsRemote}
            isPartTime={isPartTime}
            setIsPartTime={setIsPartTime}
            handleSearch={handleSearch}
            clearFilters={clearFilters}
          />
        </div>

        <Drawer open={showFilters}>
          <DrawerContent className="p-4">
            <h1 className="flex gap-2 mb-4 font-bold text-lg items-center">
              <Filter size={22} />
              Filters
            </h1>
            <FilterComponent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              location={location}
              setLocation={setLocation}
              company_id={company_id}
              setCompany_id={setCompany_id}
              companies={companies}
              salary={salary}
              setSalary={setSalary}
              isRemote={isRemote}
              setIsRemote={setIsRemote}
              isPartTime={isPartTime}
              setIsPartTime={setIsPartTime}
              handleSearch={handleSearch}
              clearFilters={clearFilters}
            />
            <div className="mt-6 flex flex-col gap-4">
              <Button
                className="w-full"
                variant="blue"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
              <Button
                className="w-full mt-2"
                variant="secondary"
                onClick={() => setShowFilters(false)}
              >
                Close
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="w-full lg:w-2/3">
          {loadingJobs && (
            <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
          )}

          {!loadingJobs && (
            <div className="grid grid-cols-1 gap-4">
              {jobs?.length ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedInit={job?.saved?.length > 0}
                  />
                ))
              ) : (
                <div className="text-center">No Jobs Found!!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;
