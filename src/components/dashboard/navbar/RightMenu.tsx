import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useState } from "react";

// Type definitions
interface RightMenuProps {
  className?: string;
  mode?: string;

}

const RightMenu: React.FC<RightMenuProps> = ({ className = "", mode }) => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(true);

  // Toggle search bar visibility for very small screens
  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-4 px-2 sm:px-4 ${className}`}>
      {/* Mobile search toggle button (visible on small screens) */}
      <div className="lg:hidden">
        <button
          onClick={toggleSearch}
          className="text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle search"
        >
          <SearchOutlined className="text-lg" />
        </button>
      </div>

      {/* Search input, responsive visibility */}
      <div
        className={`${
          isSearchVisible ? "block" : "hidden"
        } lg:block w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px]`}
      >
        <Input.Search
          placeholder="Search..."
          onSearch={(value) => console.log(value)}
          className="w-full"
          enterButton
          size="small"
        />
      </div>
    </div>
  );
};

export default RightMenu;