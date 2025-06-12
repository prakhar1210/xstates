"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Fade,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MainComponent = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch countries on mount
  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((res) => setCountries(res.data.map((c: string) => c.trim())))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        )
        .then((res) => setStates(res.data.map((s: string) => s.trim())))
        .catch((err) => console.error("Error fetching states:", err));
    } else {
      setStates([]);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        )
        .then((res) => setCities(res.data.map((c: string) => c.trim())))
        .catch((err) => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  return (
    <div className="flex flex-col items-center m-4 gap-4">
      {/* Dropdowns Row */}
      <div className="flex flex-row justify-center gap-4">
        {/* Country Dropdown */}
        <div className="bg-white p-4 rounded shadow w-[300px]">
          <FormControl fullWidth>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={selectedCountry}
              label="Country"
              onChange={(e: SelectChangeEvent) =>
                setSelectedCountry(e.target.value)
              }
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* State Dropdown */}
        <div className="bg-white p-4 rounded shadow w-[300px]">
          <FormControl fullWidth disabled={!selectedCountry}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={selectedState}
              label="State"
              onChange={(e: SelectChangeEvent) =>
                setSelectedState(e.target.value)
              }
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* City Dropdown */}
        <div className="bg-white p-4 rounded shadow w-[300px]">
          <FormControl fullWidth disabled={!selectedState}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={selectedCity}
              label="City"
              onChange={(e: SelectChangeEvent) =>
                setSelectedCity(e.target.value)
              }
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Selected Location Display */}
      <Fade
        in={
          selectedCountry !== "" && selectedState !== "" && selectedCity !== ""
        }
      >
        <Typography variant="h6" align="center" color="white" className="mt-4">
          You selected {selectedCountry}, {selectedState}, {selectedCity}
        </Typography>
      </Fade>
    </div>
  );
};

export default MainComponent;
