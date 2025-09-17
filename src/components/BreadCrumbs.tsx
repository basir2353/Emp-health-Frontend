import { Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

interface BreadcrumbItem {
  title: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

interface BreadCrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

export const BreadCrumb: React.FC<BreadCrumbProps> = ({ 
  items, 
  showBackButton = true, 
  onBackClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const breadcrumbItems = items.map((item, index) => ({
    title: item.path ? (
      <span 
        className="cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => handleItemClick(item)}
      >
        {item.title}
      </span>
    ) : item.title
  }));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showBackButton && (
        <button
          onClick={handleBackClick}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
          title="Go back"
        >
          <ArrowLeftOutlined className="text-sm" />
        </button>
      )}
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
