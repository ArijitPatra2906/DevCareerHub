import { getSingleJobByID, updateHiringStatus } from "@/api/apiJobs";
import ApplicationCard from "@/components/applicationCard";
import { ApplyJob } from "@/components/applyJob";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJobByID, {
    job_id: id,
  });

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  const extractSkills = (skillsString) => {
    return skillsString
      .split(",") // Split the string into an array by commas
      .map((skill) => skill.trim()) // Trim any extra whitespace from each skill
      .filter((skill) => skill); // Remove any empty strings
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location} (
          {job?.isRemote ? "Work from home" : "On site"})
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applications
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      {/* TODO: handleStatusChange is not working */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">Experince</h2>
      {job?.minimum_experience > 0 ? (
        <p className="sm:text-lg">
          Minimum {job?.minimum_experience}+ Years of experience needed for this
          role
        </p>
      ) : (
        <p className="sm:text-lg">Freshers also can apply for this job.</p>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">No of opening</h2>
      <p className="sm:text-lg">{job?.noOfOpening}</p>
      {job?.skills && (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold">Skills required</h2>
          <div className="flex flex-wrap gap-4">
            {extractSkills(job?.skills).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">Key responsibilities</h2>

      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg" // add global ul styles - tutorial
      />
      <h2 className="text-2xl sm:text-3xl font-bold">
        About {job?.company?.name}
      </h2>
      <p className="sm:text-lg">{job?.company?.about}</p>

      {job?.recruiter_id !== user?.id && (
        <ApplyJob
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;
