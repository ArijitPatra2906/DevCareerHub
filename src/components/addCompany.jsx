import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";
import { Textarea } from "./ui/textarea";
import { addNewCompany } from "@/api/apiCompanies";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  about: z.string().min(1, { message: "About is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only images are allowed",
      }
    ),
});
const AddCompany = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex flex-col gap-2 p-4 pb-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full">
                <Input placeholder="Company name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <Input
                  type="file"
                  accept="image/*"
                  className=" file:text-gray-500"
                  {...register("logo")}
                />
                {errors.logo && (
                  <p className="text-red-500">{errors.logo.message}</p>
                )}
              </div>
            </div>
            <Textarea
              placeholder="About the company"
              rows={5}
              {...register("about")}
            />
            {errors.about && (
              <p className="text-red-500">{errors.about.message}</p>
            )}{" "}
          </div>
          <div className="flex gap-4 mt-2">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
              className="w-40"
            >
              Add
            </Button>
            <DrawerClose>
              <Button type="button" variant="secondary" className="w-40">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </form>
        <DrawerFooter>
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompany;
