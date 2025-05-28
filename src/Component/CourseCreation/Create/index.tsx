import { LeftCircleOutlined, LeftOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Row } from "antd";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const templates = [
    { title: "Blank Course", cover: "/course-creation/1.jpg" },
    { title: "Mental health course quiz", cover: "/course-creation/2.jpg" },
  ];

  return (
    <div className="flex flex-col p-4">
      <div className="mt-4 h-5 justify-start items-center pl-3  ">
        <Row>
          <Col className="gutter-row flex justify-between items-center right-0">
            <div className="">
              <LeftCircleOutlined className="text-black text-3xl" />
            </div>
            <div className="text-black text-3xl ml-1 font-medium">
              Create Course
            </div>
          </Col>
        </Row>
        <Breadcrumb
          className=""
          items={[
            {
              title: "Wellness",
            },

            {
              title: <a href="">Courses</a>,
            },
            {
              title: <a href="">Create Course</a>,
            },
          ]}
        />
      </div>
      <Search
        placeholder="Search template..."
        onSearch={(value) => console.log(value)}
        style={{ width: 500 }}
        className="mt-20"
      />
      <h1 className="my-6 text-xl font-bold">Templates</h1>
      <div className="flex flex-wrap gap-6 cursor-pointer">
        {templates.map((template) => (
          <div onClick={() => navigate("/wellness/course/design")}>
            <img
              src={template.cover}
              className="max-w-[190px] min-w-[190px] max-h-[268px] min-h-[267px] bg-[white] object-contain mb-2 rounded-[4px] box-content"
              style={{ border: "1px solid rgb(217, 217, 217)" }}
            />
            <span className="overflow-hidden">{template.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
