import { Breadcrumb } from "antd";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

interface BreadcrumbItem {
  title: React.ReactNode;
}

interface BreadCrumbProps {
  items: BreadcrumbItem[];
}

export const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return <Breadcrumb items={items} />;
};
