import Search from "antd/es/input/Search";

const RightMenu = (props: any) => {
  return (
    <>
      <div className="flex gap-4">
        <Search
          placeholder="Search..."
          onSearch={(value) => console.log(value)}
          style={{ width: 300 }}
        />
      </div>
    </>
  );
};

export default RightMenu;
