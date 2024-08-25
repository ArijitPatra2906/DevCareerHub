import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./applicationCard";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { getApplications } from "@/api/apiApplications";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <BarLoader className="my-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.length ? (
        applications?.map((application) => {
          return (
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate={true}
            />
          );
        })
      ) : (
        <div className="text-center">No Applications Found!!</div>
      )}
    </div>
  );
};

export default CreatedApplications;
