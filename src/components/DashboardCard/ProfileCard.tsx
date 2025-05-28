import { Card, Image, Progress } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ProfileImage from '../../public/images/profile.svg';

type OnboardingStep = {
  step: number;
  height?: string | number;
  unit?: string;
  avatar?: string;
  blood_group?: string;
};

// ProfileCard Component
const ProfileCard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name;

  // Fetch dynamic values from 'onboardingSteps' data in localStorage
  const onboardingData: OnboardingStep[] = JSON.parse(localStorage.getItem('onboardingSteps') || '[]');
  const height = onboardingData.find((item: OnboardingStep) => item.step === 1)?.height;
  const blood_group = onboardingData.find((item: OnboardingStep) => item.step === 3)?.blood_group;

  const unit = onboardingData.find((item: OnboardingStep) => item.step === 1)?.unit;
  const avatar = onboardingData.find((item: OnboardingStep) => item.step === 8)?.avatar;

  return (
    <Card bordered={false} className="w-auto md:w-[391px] h-auto md:h-[180px] bg-[#141414]">
      <div className="flex flex-row max-lg:flex-col justify-evenly">
        <div className="w-96 h-24 p-2 rounded justify-between items-center inline-flex mt-4">
          <div className="justify-start items-start gap-2.5 flex">
            <div className="w-28 h-28 rounded-full overflow-hidden">
              {/* Render dynamic avatar if available */}
              <Image
                src={avatar ? avatar : ProfileImage}  // Fallback to default ProfileImage if avatar is not found
                alt="Profile"
                className="w-96 h-96 object-cover"
              />
            </div>
            <div className="flex-col justify-start items-start gap-2 inline-flex">
              <div className="text-white text-xl font-medium leading-7">
                Hello {userName}!
              </div>
              <div className="w-98 justify-start items-start gap-2 inline-flex">
                <div>
                  <span className="text-white text-sm font-medium leading-snug">
                    Blood Group:  {blood_group ? blood_group : 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-white text-sm font-medium leading-snug">
                    Height:
                  </span>
                  <span className="text-white text-sm font-normal leading-snug">
                    {height ? `${height} ${unit}` : 'Not available'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-white text-sm font-medium leading-snug">
                  Weight: 80 KG
                </span>
              </div>
            </div>
          </div>
          <div className="w-8 h-8 px-3.5 py-1 bg-sky-100 rounded shadow border border-zinc-600 justify-center items-center gap-2 flex">
            <div className="bg-white bg-opacity-0 flex-col justify-center items-center inline-flex">
              <div className="w-4 h-4 p-px justify-center items-center inline-flex">
                <EditOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-96 h-16 px-2 flex-col justify-start items-start gap-5 inline-flex mt-3">
        <div className="flex-col justify-start items-start gap-1 flex">
          <div className="text-white text-sm font-medium leading-snug">
            Profile Completion
          </div>
          <div className="w-[375px] max-lg:w-auto h-5 py-1.5 justify-center items-center inline-flex">
            <Progress percent={50} trailColor="white" showInfo={false} />
            <svg
              width="36"
              height="43"
              viewBox="0 0 36 43"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', right: '0', marginTop: '2' }}
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
              <circle
                cx="18.3024"
                cy="17.6364"
                r="5.37074"
                fill="#D9D9D9"
                fillOpacity="0.15"
              />
              <circle
                cx="18.3025"
                cy="17.6356"
                r="7.40511"
                fill="#D9D9D9"
                fillOpacity="0.15"
              />
              <circle
                cx="18.3025"
                cy="17.6361"
                r="9.76499"
                fill="#D9D9D9"
                fillOpacity="0.15"
              />
              <circle
                cx="18.3026"
                cy="17.6365"
                r="12.6131"
                fill="#D9D9D9"
                fillOpacity="0.15"
              />
              <circle
                cx="18.3025"
                cy="17.6361"
                r="14.7289"
                fill="#D9D9D9"
                fillOpacity="0.15"
              />
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
      </div>
    </Card>
  );
};

export default ProfileCard;
