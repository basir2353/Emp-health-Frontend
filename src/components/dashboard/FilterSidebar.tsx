import { Drawer, Button, Radio } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { ReactNode, useEffect, useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterSelect: (gender: string | null, specialty: string | null) => void; // Update callback function
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onFilterSelect,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [selectedGender, setSelectedGender] = useState<string>("other"); // Default to "other"

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty);
  };

  const handleGenderChange = (e: any) => {
    setSelectedGender(e.target.value);
  };

  const isOptionSelected = (specialty: string) => {
    return specialty === selectedSpecialty;
  };

  // Pass selected gender and specialty back to parent component
  useEffect(() => {
    onFilterSelect(
      selectedGender === "other" ? null : selectedGender,
      selectedSpecialty
    );
  }, [selectedGender, selectedSpecialty, onFilterSelect]);

  return (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <CloseCircleOutlined
              onClick={onClose}
              style={{ fontSize: "18px", color: "#999", cursor: "pointer" }}
            />
            <span style={{ marginLeft: 8 }}>Filters</span>
          </div>
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              style={{ marginLeft: 8, background: "black" }}
            >
              Apply
            </Button>
          </div>
        </div>
      }
      placement="right"
      width={500}
      height={1024}
      closable={false}
      onClose={onClose}
      open={isOpen}
    >
      <div style={{ marginBottom: 20 }}>
        <h3 className="text-xl font-bold">Gender: </h3>
        <Radio.Group value={selectedGender} onChange={handleGenderChange}>
          <Radio value="other">All</Radio>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 className="text-xl font-bold">Specialty: </h3>
        <div className="grid grid-cols-4 gap-4 justify-center text-center">
          <span
            className={`btn ${
              isOptionSelected("Cardiology")
                ? "bg-gray-300 cursor-pointer h-[34px] text-xs rounded-3xl"
                : "border  cursor-pointer h-[34px] text-xs rounded-3xl"
            } px-4 py-2`}
            onClick={() => handleSpecialtyClick("Cardiology")}
          >
            Cardiology
          </span>
          <span
            className={`btn ${
              isOptionSelected("Neurology")
                ? "bg-gray-300  cursor-pointer h-[34px] text-xs rounded-3xl"
                : "border  cursor-pointer h-[34px] text-xs rounded-3xl"
            } px-4 py-2`}
            onClick={() => handleSpecialtyClick("Neurology")}
          >
            Neurology
          </span>
          <span
            className={`btn ${
              isOptionSelected("Dermatology")
                ? "bg-gray-300  cursor-pointer h-[34px] text-xs rounded-3xl"
                : "border  cursor-pointer h-[34px] text-xs rounded-3xl"
            } px-4 py-2`}
            onClick={() => handleSpecialtyClick("Dermatology")}
          >
            Dermatology{" "}
          </span>
          <span
            className={`btn ${
              isOptionSelected("Dermatology")
                ? "bg-gray-300   cursor-pointer h-[34px] text-xs rounded-3xl"
                : "border  cursor-pointer h-[34px] text-xs rounded-3xl"
            } px-4 py-2`}
            onClick={() => handleSpecialtyClick("Dermatology")}
          >
            Dermatology{" "}
          </span>
          <span
            className={`btn ${
              isOptionSelected("General Physician")
                ? "bg-gray-300  cursor-pointer  h-[34px] text-xs rounded-3xl"
                : "border  cursor-pointer h-[34px] text-xs rounded-3xl"
            } px-4 `}
            onClick={() => handleSpecialtyClick("General Physician")}
          >
            General Physician
          </span>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterSidebar;
