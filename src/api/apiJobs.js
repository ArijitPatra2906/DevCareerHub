import supabaseClient from "@/utils/supabase";

// Fetch All Jobs
export async function getJobs(
  token,
  { location, company_id, salary, searchQuery, isRemote, isPartTime }
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

  if (isRemote) {
    query = query.eq("isRemote", isRemote);
  }

  if (isPartTime) {
    query = query.eq("isPartTime", isPartTime);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
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

// Read single job by id
export async function getSingleJobByID(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo,about), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  try {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("jobs")
      .update({ isOpen })
      .eq("id", job_id)
      .select();

    if (error) {
      console.error("Error Updating Hiring Status:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

// - post job
export async function addNewJob(token, _, jobData) {
  try {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
      .from("jobs")
      .insert([jobData])
      .select();

    if (error) {
      console.error(error);
      throw new Error("Error Creating Job");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Fetch Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_job")
    .select("*, job: jobs(*, company: companies(name,logo))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}
