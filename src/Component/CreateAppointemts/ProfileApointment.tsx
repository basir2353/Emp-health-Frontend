import { Card, Image, Progress } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React from 'react';

const ProfileAppointment = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    name = 'User',
    bloodGroup = 'N/A',
    height = 'N/A',
    weight = 'N/A',
    profileImage,
    profileCompletion = 50,
  } = user;

  return (
    <Card bordered={false} className="w-full md:w-[391px] h-auto md:h-[180px] bg-[#480CE8]">
      <div className="flex flex-row max-lg:flex-col justify-evenly">
        <div className="w-96 p-2 mt-4 flex gap-4 items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <Image
              src={
                profileImage ||
                "https://s3-alpha-sig.figma.com/img/f6c2/1a01/339fa5a6ea8e27a29cf41729f0337f02?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A0x4cnoG-2oBzj2~DhDyi90h7P1mx7BFCpr1Gg5cHWeZjuC7kRSJDau3Cz2mIraB~KMRucXEkdffC3impYKUjfQYDoRL-XJh1gNSGchhIa7TDMW54itvcIuJqZqk2ouXnBy9L~NoCoN4h102E1aOkjR5pqDu4TD-lT91QTsGIE7fYjYqF7Kfgq6umEURdoZAw-toCIgwbZ-eWFsUWHTEiAS8Tqkn07xhr6olWLFypoAOGwO1UDXol8ZZ0oQLBiYXaqtrIO1nuZbee8D4kCcKBUhQMCn8qMwtVM8zqMHYHod1ZNJVmN36gN06wQ8GlfHV2XcrmXi0arnY1cF2UBEitg__"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 text-white">
            <div className="text-xl font-medium leading-7">Hello {name}!</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium">Blood Group: </span>
                <span>{bloodGroup}</span>
              </div>
              <div>
                <span className="font-medium">Height: </span>
                <span>{height}</span>
              </div>
              <div>
                <span className="font-medium">Weight: </span>
                <span>{weight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-8 h-8 px-3.5 py-1 bg-sky-100 rounded shadow border border-zinc-600 flex justify-center items-center">
            <EditOutlined />
          </div>
        </div>
      </div>

      <div className="w-96 mt-3 px-2 flex flex-col gap-2">
        <div className="text-white text-sm font-medium">Profile Completion</div>
        <div className="relative w-full h-5 flex items-center">
          <Progress
            percent={profileCompletion}
            trailColor="white"
            strokeColor="#52c41a"
            showInfo={false}
            className="w-full"
          />
          <svg
            width="36"
            height="43"
            viewBox="0 0 36 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-0"
          >
            <path
              d="M28.3843 27.7178H8.22046V38.0854C8.22046 40.2528 10.4484 41.705 12.4314 40.8301L17.3593 38.656C18.1526 38.3061 19.0585 38.3164 19.8435 38.6844L24.111 40.6848C26.1004 41.6173 28.3843 40.1655 28.3843 37.9684V27.7178Z"
              fill="#D46B08"
            />
            <circle cx="18.3024" cy="17.6359" r="17.4142" fill="#FFDE99" />
            <circle
              cx="18.3025"
              cy="17.6358"
              r="15.5811"
              fill="url(#paint0_linear_332_8971)"
            />
            <circle cx="18.3024" cy="17.6364" r="5.37074" fill="#D9D9D9" fillOpacity="0.15" />
            <circle cx="18.3025" cy="17.6356" r="7.40511" fill="#D9D9D9" fillOpacity="0.15" />
            <circle cx="18.3025" cy="17.6361" r="9.76499" fill="#D9D9D9" fillOpacity="0.15" />
            <circle cx="18.3026" cy="17.6365" r="12.6131" fill="#D9D9D9" fillOpacity="0.15" />
            <circle cx="18.3025" cy="17.6361" r="14.7289" fill="#D9D9D9" fillOpacity="0.15" />
            <path
              d="M13.7197 17.636L16.7713 20.9967L22.8851 14.2754"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_332_8971"
                x1="32.5088"
                y1="17.6358"
                x2="2.72131"
                y2="17.6358"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFAE00" />
                <stop offset="1" stopColor="#FF8C00" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ProfileAppointment;
