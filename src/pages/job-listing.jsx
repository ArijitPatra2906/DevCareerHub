import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/jobCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { City, State } from "country-state-city";
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
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div className="px-4 sm:px-8 lg:px-16">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl lg:text-6xl text-center pb-8">
        Latest Jobs
      </h1>
      <div className="mt-8 flex flex-col lg:flex-row w-full gap-6">
        <div className="w-full p-4 lg:w-1/3 flex items-center bg-black flex-col h-fit pb-8 rounded-lg">
          <h1 className="flex gap-2 mb-4 font-bold text-lg items-center">
            <Filter size={22} />
            Filters
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full gap-2 items-center mb-6"
          >
            <Input
              type="text"
              placeholder="Search Jobs by Profile..."
              name="search-query"
              className="h-10 w-full sm:flex-1 px-4 text-md"
            />
            <Button
              type="submit"
              className="h-10 w-full sm:w-28"
              variant="blue"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-col gap-6 w-full">
            <Select
              value={location}
              onValueChange={(value) => setLocation(value)}
              className="w-full"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={company_id}
              onValueChange={(value) => setCompany_id(value)}
              className="w-full"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({ name, id }) => (
                    <SelectItem key={name} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="work-from-home"
                checked={isRemote}
                onCheckedChange={(checked) => setIsRemote(checked)}
              />
              <label
                htmlFor="work-from-home"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Work From Home
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="part-time"
                checked={isPartTime}
                onCheckedChange={(checked) => setIsPartTime(checked)}
              />
              <label
                htmlFor="part-time"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Part Time
              </label>
            </div>
            <Label htmlFor="salary">Desired minimum monthly salary (₹)</Label>
            <Slider
              id="salary"
              value={salary} // Control the value of the Slider with salary state
              onValueChange={(value) => setSalary(value)}
              max={50000}
              step={5000}
            />
          </div>

          {(company_id ||
            searchQuery ||
            location ||
            salary[0] > 0 ||
            isRemote ||
            isPartTime) && (
            <Button
              className="w-full sm:w-1/2 mt-4"
              variant="destructive"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>

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
                <div className="text-center">No Jobs Found 😢</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;
