import { ClockCircleOutlined, CheckCircleOutlined, BookOutlined, InfoCircleOutlined, BookFilled, CheckCircleFilled, ClockCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const DashboardBoxes = () => {
  return (
    <div className="flex max-lg:flex-col gap-8">
      {/* Box 1 */}
      <Card className="w-[344px] h-[171px] max-lg:w-auto bg-[#f0f0f0]  px-6 py-4 " bordered={false}>
        <div className="flex  items-center justify-between mb-6">
          <Title level={3} className="text-sm text-neutral-45">Enrolled Courses</Title>
          <div className="w-[12px] h-[12px] bg-neutral-3 flex items-center justify-center rounded-lg">
            <BookFilled  className="text-2xl text-black" />
          </div>
        </div>
        <div className="flex justify-between ">
          <span className="text-6xl text-black">12</span>
          <div className=" bg-cover bg-center bg-no-repeat">
            <BookFilled  className="text-7xl text-white" />

            </div>
        </div>
      </Card>

      {/* Box 2 */}
      <Card className="w-[344px] h-[171px] max-lg:w-auto bg-[#f4ffb8]  px-6 py-4 " bordered={false}>

        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="text-sm text-neutral-45">Completed Courses</Title>
          <div className="w-[12px] h-[12px] bg-polar-green-1 flex items-center justify-center rounded-lg">
          <CheckCircleFilled   className="text-2xl tewxt-green-300" />

          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-6xl text-black">4</span>
          <div className=" bg-cover bg-center bg-no-repeat">
            <CheckCircleFilled   className="text-7xl text-green-300" />

            </div>
        </div>
      </Card>

      {/* Box 3 */}
      <Card className="w-[344px] h-[171px] max-lg:w-auto bg-[#fff1b8]  px-6 py-4 " bordered={false}>
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="text-sm text-neutral-45">Ongoing Courses</Title>
          <div className="w-[12px] h-[12px] bg-calendula-gold-1 flex items-center justify-center rounded-lg">
          <ClockCircleFilled className="text-2xl text-[#faad14]" />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-6xl text-black">6</span>
          <div className=" bg-cover bg-center bg-no-repeat">
          <ClockCircleFilled  className="text-7xl text-[#faad14]" />

            </div>
            </div>
      </Card>

      {/* Box 4 */}
      <Card className="w-[344px] h-[171px] max-lg:w-auto bg-[#ffccc7]  px-6 py-4 " bordered={false}>
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="text-sm text-neutral-45">Haven’t Started</Title>
          <div className="w-[12px] h-[12px] bg-dust-red-1 flex items-center justify-center rounded-lg">
          <InfoCircleFilled className="text-2xl text-[#ff4d4f] " />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-6xl text-black">2</span>
          <div className=" bg-cover bg-transparent bg-no-repeat ">
          <InfoCircleFilled className="text-7xl text-[#ff4d4f]" />

            </div>
            </div>
      </Card>
    </div>
  );
};

export default DashboardBoxes;
