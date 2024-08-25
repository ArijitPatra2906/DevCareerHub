function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>
      <h1 className="gradient-title text-3xl font-bold block md:hidden">DCH</h1>
      <h1 className="text-4xl gradient-title font-bold hidden md:block">
        DevCareerHub
      </h1>
    </div>
  );
}

export default Logo;
