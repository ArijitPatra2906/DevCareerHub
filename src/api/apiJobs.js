import supabaseClient from "@/utils/supabase";

// Fetch All Jobs
export async function getJobs(
  token,
  { location, company_id, salary, searchQuery }
) {
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select("*,company: companies(name,logo)");
  // .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (salary) {
    query = query.gte("salary", salary);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Fetch Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_job")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    try {
      const { data, error: insertError } = await supabase
        .from("saved_job")
        .insert([saveData])
        .select();

      if (insertError) {
        console.error("Error saving job:", insertError);
        return data;
      }

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
