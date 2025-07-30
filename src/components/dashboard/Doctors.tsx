import React, { useState, useEffect } from "react";
import { Input, Button, Image, Col, Row } from "antd";
import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
import { BreadCrumb } from "../BreadCrumbs";
import Sidebar from "./Sidebar";
import FilterSidebar from "./FilterSidebar";
import DrAlishaKane from "../../public/images/Alisha.svg";
import DrMaria from "../../public/images/Maria.svg";
import DrAkhtar from "../../public/images/Akhtar.svg";
import DrAndrew from "../../public/images/Andrew.svg";
import axios from "axios";

interface Doctor {
  name: string;
  profession: string;
  education: string;
  experience: string;
  available_hours: string;
  image: string;
  gender: string;
}

export const available_doctors: Doctor[] = [
  {
    name: "Dr. Maria Summers",
    profession: "Neurologist",
    education: "M.B.B.S., F.C.P.S. (Neurology)",
    experience: "8 Years",
    available_hours: "5:00 PM - 9:00 PM",
    image: DrMaria,
    gender: "female",
  },
  {
    name: "Dr. Akhtar Javed",
    profession: "General Physician",
    education: "MBBS, MCPS (Medicine)",
    experience: "5 Years",
    available_hours: "1:00 PM - 6:00 PM",
    image: DrAkhtar,
    gender: "male",
  },
  {
    name: "Dr. Andrew Smith",
    profession: "Cardiology, Interventional Cardiologist",
    education:
      "M.B.B.S., Dip. Cardiology, M.D Cardio, MESC (Europe), MACC (USA)",
    experience: "7 Years",
    available_hours: "3:00 PM - 7:00 PM",
    image: DrAndrew,
    gender: "male",
  },
  {
    name: "Dr. Alisha Kane",
    profession: "Dermatologist, Aesthetic Physician",
    education:
      "M.B.B.S., MSc Clinical Dermatology, Diploma in Aesthetic Medicine",
    experience: "10 Years",
    available_hours: "1:00 PM - 7:00 PM",
    image: DrAlishaKane,
    gender: "female",
  },
];

interface ApiDoctor {
  _id: string;
  name: string;
  education?: string;
  department?: string;
  experience?: string;
  workingHours?: { start: string; end: string };
  gender?: string;
}

const mapApiDoctorToDoctor = (apiDoctor: ApiDoctor): Doctor => {
  // Default image assignment based on gender or department
  let defaultImage = DrMaria;
  if (apiDoctor.gender === "male") {
    defaultImage = DrAkhtar;
  } else if (apiDoctor.department?.toLowerCase().includes("dermatology")) {
    defaultImage = DrAlishaKane;
  } else if (apiDoctor.department?.toLowerCase().includes("cardiology")) {
    defaultImage = DrAndrew;
  }

  return {
    name: apiDoctor.name,
    profession: apiDoctor.department || "General Physician",
    education: apiDoctor.education || "N/A",
    experience: apiDoctor.experience ? `${apiDoctor.experience} Years` : "N/A",
    available_hours: apiDoctor.workingHours
      ? `${apiDoctor.workingHours.start} - ${apiDoctor.workingHours.end}`
      : "N/A",
    image: defaultImage,
    gender: apiDoctor.gender || "other",
  };
};

export const Doctors = () => {
  const { Search } = Input;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>("other");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Add state for all doctors (API + static)
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(available_doctors);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://empolyee-backedn.onrender.com/api/all-doctors");
        if (response.data && Array.isArray(response.data.doctors)) {
          const apiDoctors: ApiDoctor[] = response.data.doctors;
          const mappedDoctors = apiDoctors.map(mapApiDoctorToDoctor);
          
          setAllDoctors([...mappedDoctors, ...available_doctors]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Fallback to static doctors only
        setAllDoctors(available_doctors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    openSidebar();
  };

  const openFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const closeFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const openSidebar = () => {
    setSelectedDate(Date);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSelectedDate(Date);
    setIsSidebarOpen(false);
  };

  const handleFilterSelect = (
    gender: string | null,
    specialty: string | null
  ) => {
    setSelectedGender(gender);
    setSelectedSpecialty(specialty);
  };

  // Filter from allDoctors instead of available_doctors
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
      <div className="justify-start pt-2 items-center bg-gray-100 h-screen px-10">
        <div className="flex justify-center items-center h-64">
          <div>Loading doctors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-start pt-2 items-center bg-gray-100 h-screen px-10">
      <BreadCrumb items={breadcrumbs} />
      <div className="w-full inline-flex justify-between items-start pt-5">
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

        <div>
          <Button
            type="primary"
            block
            onClick={openSidebar}
            style={{ background: "black" }}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      <div className="w-full inline-flex justify-between items-start pt-7">
        <div className="text-black text-3xl font-medium leading-10 ml-7">
          Available Doctors!! ({filteredDoctors.length})
        </div>
        <div className="flex gap-2 mr-3">
          <Search placeholder="Search Location..." style={{ width: 200 }} />
          <Button
            type="default"
            icon={<FilterOutlined />}
            onClick={openFilterSidebar}
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="w-[1407px] flex justify-start items-start mt-3 ml-5">
        <Row gutter={[16, 16]}>
          {filteredDoctors.map((doctor, index) => (
            <Col key={index} span={6}>
              <div className="w-[331px] h-[280px] border border-gray-300 rounded px-4 py-4 flex flex-col justify-between">
                <div>
                  <div className="flex">
                    <Image
                      preview={false}
                      width={60}
                      style={{ borderRadius: "50%" }}
                      className="border-2 border-black"
                      src={doctor.image}
                    />
                    <div className="mt-4 text-xl ml-3 font-semibold">
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
                <div className="border-b-2 w-[299px]"></div>
                <div className="flex">
                  <div className="flex gap-2">
                    <div className="text-sm text-gray-500">Experience</div>
                    <div>{doctor.experience}</div>
                  </div>
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() => handleBookAppointment(doctor)}
                  style={{ backgroundColor: "black" }}
                >
                  Book Appointment
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Sidebar
         isedit={false}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          selectedDoctor={selectedDoctor}
          selectedDate={selectedDate}
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