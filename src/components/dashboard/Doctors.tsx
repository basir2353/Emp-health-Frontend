import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Col, Row } from "antd";
import { ArrowLeftOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import { BreadCrumb } from "../BreadCrumbs";
import Sidebar from "./Sidebar";
import FilterSidebar from "./FilterSidebar";
import axios from "axios";
import dayjs from "dayjs";

interface Doctor {
  name: string;
  profession: string;
  education: string;
  experience: string;
  available_hours: string;
  gender: string;
  new_date?: string;
  date: string;
}

interface ApiDoctor {
  _id: string;
  name: string;
  education?: string;
  department?: string;
  experience?: string;
  workingHours?: { start: string; end: string; date: string };
  gender?: string;
  date?: string;
  new_date?: string;
}

const mapApiDoctorToDoctor = (apiDoctor: ApiDoctor): Doctor => {
  return {
    name: apiDoctor.name,
    profession: apiDoctor.department || "General Physician",
    education: apiDoctor.education || "N/A",
    experience: apiDoctor.experience ? `${apiDoctor.experience} Years` : "N/A",
    available_hours: apiDoctor.workingHours
      ? `${apiDoctor.workingHours.start} - ${apiDoctor.workingHours.end}`
      : "N/A",
    new_date: apiDoctor?.workingHours?.date,
    gender: apiDoctor.gender || "other",
    date: apiDoctor.date || "2025-08-02",
  };
};

export const Doctors = () => {
  const { Search } = Input;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>("other");
  const [selectedDates, setSelectedDates] = useState<string[] | null>(null); // Updated to array for consistency
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/all-doctors");
        if (response.data && Array.isArray(response.data.doctors)) {
          const apiDoctors: ApiDoctor[] = response.data.doctors;
          const mappedDoctors = apiDoctors.map(mapApiDoctorToDoctor);
          setAllDoctors(mappedDoctors);
          console.log(mappedDoctors, 'mappedDoctors'); // Log mappedDoctors for debugging
        } else {
          setAllDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setAllDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor: Doctor) => {
    console.log(doctor, 'hhh');
    setSelectedDoctor(doctor);
    // Set selectedDates to the doctor's new_date (as an array for Sidebar compatibility)
    setSelectedDates(doctor.new_date ? [doctor.new_date] : null);
    openSidebar();
  };

  const openFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const closeFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    // Optionally reset selectedDates on close
    setSelectedDates(null);
  };

  const handleFilterSelect = (
    gender: string | null,
    specialty: string | null
  ) => {
    setSelectedGender(gender);
    setSelectedSpecialty(specialty);
  };

  // Function to get initials from doctor's name
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 0) return "";
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const filteredDoctors = allDoctors.filter((doctor) => {
    if (selectedSpecialty && doctor.profession !== selectedSpecialty) {
      return false;
    }
    if (
      selectedGender &&
      selectedGender !== "other" &&
      doctor.gender !== selectedGender
    ) {
      return false;
    }
    return true;
  });

  const breadcrumbs = [
    {
      title: <a href="/health">Home</a>,
    },
    {
      title: <a href="">Health</a>,
    },
    {
      title: <a href="/appointments">Appointment</a>,
    },
    {
      title: "Create Appointment",
    },
  ];

  if (isLoading) {
    return (
      <div className="justify-start pt-2 items-center bg-gray-100 h-screen px-4">
        <div className="flex justify-center items-center h-64">
          <div>Loading doctors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-start pt-2 items-center bg-gray-100 min-h-screen px-4 md:px-10">
      <BreadCrumb items={breadcrumbs} />

      {/* Top Action Row */}
      <div className="w-full flex justify-between items-start pt-5 max-sm:flex-col max-sm:gap-4">
        <div
          className="text-black flex justify-center items-center"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          <ArrowLeftOutlined />
        </div>

        <Button
          type="primary"
          block
          onClick={openSidebar}
          style={{ background: "black", width: "176px" }}
          className="max-lg:w-full w-44"
        >
          Book Appointment
        </Button>
      </div>

      {/* Heading + Search Row */}
      <div className="w-full flex justify-between items-start pt-7 max-sm:flex-col max-sm:gap-3">
        <div className="text-black text-2xl md:text-3xl font-medium ml-2 md:ml-7">
          Available Doctors!! ({filteredDoctors.length})
        </div>

        <div className="flex gap-2 mr-2 flex-wrap max-sm:flex-col max-sm:w-full">
          <Search placeholder="Search Location..." style={{ width: 200 }} />
          <Button
            type="default"
            icon={<FilterOutlined />}
            onClick={openFilterSidebar}
            className="max-sm:w-full"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="w-full flex justify-start items-start mt-6 px-2">
        <Row gutter={[16, 16]} className="w-full">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={6}>
                <div className="w-full min-h-[280px] border border-gray-300 rounded px-4 py-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center">
                      <Avatar
                        size={60}
                        style={{
                          backgroundColor: "#1890ff",
                          border: "2px solid black",
                        }}
                        icon={<UserOutlined />}
                        className="border-2 border-black"
                      >
                        {getInitials(doctor.name)}
                      </Avatar>
                      <div className="ml-3 mt-4 text-xl font-semibold">
                        {doctor.name}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-4">
                      {doctor.profession}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {doctor.education}
                    </div>
                  </div>

                  <div className="border-b-2 w-full my-2"></div>

                  <div className="flex gap-2">
                    <div className="text-sm text-gray-500">Experience:</div>
                    <div>{doctor.experience}</div>
                  </div>

                  <Button
                    type="primary"
                    block
                    onClick={() => handleBookAppointment(doctor)}
                    style={{ backgroundColor: "black" }}
                    className="mt-4"
                  >
                    Book Appointment
                  </Button>
                </div>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="text-center text-gray-500">
                No doctors available matching the selected filters.
              </div>
            </Col>
          )}
        </Row>
      </div>

      {/* Sidebars */}
      <Sidebar
        isedit={false}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        selectedDoctor={selectedDoctor}
        selectedDates={selectedDates} // Updated prop name to match SidebarProps
      />
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={closeFilterSidebar}
        onFilterSelect={handleFilterSelect}
      />
    </div>
  );
};

export default Doctors;