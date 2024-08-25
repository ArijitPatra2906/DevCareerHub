import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/addCompany";
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
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  salary: z.number(),
  minimum_experience: z.number(),
  noOfOpening: z.number(),
  skills: z.string(),
  isRemote: z
    .boolean()
    .refine((val) => val !== undefined, { message: "Field is required" }),
  isPartTime: z
    .boolean()
    .refine((val) => val !== undefined, { message: "Field is required" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
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
    }).then(() => {
      enqueueSnackbar("Job created successfully!!", {
        variant: "success",
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-4xl md:text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <Input
          placeholder="Add skills comma separated"
          {...register("skills")}
        />
        {errors.skills && (
          <p className="text-red-500">{errors.skills.message}</p>
        )}
        <div className="flex flex-nowrap gap-4 flex-col md:flex-row">
          <div className="w-full flex flex-col gap-2">
            <Input
              type="number"
              placeholder="Salary"
              {...register("salary", { valueAsNumber: true })}
            />
            {errors.salary && (
              <p className="text-red-500">{errors.salary.message}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
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
          </div>
          <div className="w-full flex flex-col gap-2">
            <Input
              type="number"
              placeholder="No of opening"
              {...register("noOfOpening", { valueAsNumber: true })}
            />
            {errors.noOfOpening && (
              <p className="text-red-500">{errors.noOfOpening.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center flex-wrap sm:flex-nowrap">
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
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
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
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>

        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <div className="flex gap-4 items-center flex-col md:flex-row">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="isRemote">Work from home</Label>
            <Controller
              name="isRemote"
              control={control}
              defaultValue={false} // Set default value to false
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => {
                    const booleanValue = value === "true";
                    field.onChange(booleanValue);
                    console.log("Selected value:", typeof booleanValue); // Log the boolean value
                  }}
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
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="isPartTime">Part Time</Label>
            <Controller
              name="isPartTime"
              control={control}
              defaultValue={false} // Set default value to false
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(value) => {
                    const booleanValue = value === "true";
                    field.onChange(booleanValue);
                    console.log("Selected value:", typeof booleanValue); // Log the boolean value
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Part Time" />
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
          </div>
        </div>

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
  );
};

export default PostJob;
