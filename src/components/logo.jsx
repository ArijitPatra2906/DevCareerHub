import { Briefcase } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Briefcase className="w-8 h-8 text-blue-500" />
      <h1 className="gradient-title text-3xl font-bold md:hidden">DCH</h1>
      <h1 className="text-4xl gradient-title font-bold hidden md:block">
        DevCareerHub
      </h1>
    </div>
  );
}

export default Logo;
