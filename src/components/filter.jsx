// components/FilterComponent.js
import React from "react";
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
import { State } from "country-state-city";

const FilterComponent = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  company_id,
  setCompany_id,
  companies,
  salary,
  setSalary,
  isRemote,
  setIsRemote,
  isPartTime,
  setIsPartTime,
  handleSearch,
  clearFilters,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row w-full gap-2 items-center mb-6"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Profile..."
          name="search-query"
          className="h-10 w-full sm:flex-1 px-4 text-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="h-10 w-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

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
              <SelectItem key={id} value={id}>
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
        value={salary}
        onValueChange={(value) => setSalary(value)}
        max={50000}
        step={5000}
      />

      {(company_id ||
        searchQuery ||
        location ||
        salary[0] > 0 ||
        isRemote ||
        isPartTime) && (
        <Button className="w-full" variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterComponent;
