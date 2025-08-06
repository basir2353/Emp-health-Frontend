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
    <div className={`flex  max-lg:hidden items-center gap-4 px-4 ${className}`}>
      {/* Mobile search toggle button (visible on very small screens) */}
      <div className="md:hidden">
        <button
          onClick={toggleSearch}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <SearchOutlined className="text-lg" />
        </button>
      </div>

      {/* Search input, hidden on mobile when isSearchVisible is false */}
      <div
        className={`${
          isSearchVisible ? "block" : "hidden"
        } md:block w-full max-w-[300px] sm:max-w-[200px] xs:max-w-[150px]`}
      >
        <Input.Search
          placeholder="Search..."
          onSearch={(value) => console.log(value)}
          className="w-full"
          enterButton
        />
      </div>
    </div>
  );
};

export default RightMenu;