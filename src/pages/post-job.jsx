import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string(),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  salary: z.number().min(0, { message: "Salary needs to greter then 0" }),
  minimum_experience: z.number(),
  noOfOpening: z.number(),
  isRemote: z.boolean(),
  isPartTime: z.boolean(),
});

const PostJobsPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full md:w-[90%] flex flex-col items-center">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
          Post a Job
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-1 md:p-4 pb-0 "
        >
          <Input placeholder="Job Title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Textarea
            placeholder="Job Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <div className="flex flex-nowrap gap-4 flex-col md:flex-row">
            <Input
              type="number"
              placeholder="Salary"
              {...register("salary", { valueAsNumber: true })}
            />
            {errors.salary && (
              <p className="text-red-500">{errors.salary.message}</p>
            )}

            <Input
              type="number"
              placeholder="Experience"
              {...register("minimum_experience", { valueAsNumber: true })}
            />
            {errors.minimum_experience && (
              <p className="text-red-500">
                {errors.minimum_experience.message}
              </p>
            )}
            <Input
              type="number"
              placeholder="No of opening"
              {...register("noOfOpening", { valueAsNumber: true })}
            />
            {errors.noOfOpening && (
              <p className="text-red-500">{errors.noOfOpening.message}</p>
            )}
          </div>
          <div className="flex gap-4 items-center flex-col md:flex-row">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Location" />
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
              )}
            />
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Company">
                      {field.value
                        ? companies?.find(
                            (com) => com.id === Number(field.value)
                          )?.name
                        : "Company"}
                    </SelectValue>
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
              )}
            />
            {/* <AddCompanyDrawer fetchCompanies={fnCompanies} /> */}
          </div>
          <div className="flex gap-4 items-center flex-col md:flex-row">
            <Controller
              name="isRemote"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => field.onChange(value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Work from home" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="isPartTime"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => field.onChange(value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Part time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* <AddCompanyDrawer fetchCompanies={fnCompanies} /> */}
          </div>
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}
          <Label htmlFor="requirements">Requirements</Label>
          <Controller
            id="requirements"
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.requirements && (
            <p className="text-red-500">{errors.requirements.message}</p>
          )}
          {errors.errorCreateJob && (
            <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
          )}
          {errorCreateJob?.message && (
            <p className="text-red-500">{errorCreateJob?.message}</p>
          )}
          {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" variant="blue" size="lg" className="mt-2">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJobsPage;
