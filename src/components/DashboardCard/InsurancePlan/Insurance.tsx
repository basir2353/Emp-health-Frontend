import { useState } from "react";
import { toast } from "react-toastify";
import FamilySidebar from "../../../Component/CreateAppointemts/FamilyDetailsSidebarProps";
import { useEffectAsync } from "../../../utils/react";
interface AvailablePlans {
  type: string;
  price: number;
  duration: string;
  premium_package_price: number;
  premium_package_duration: string;
  deductible_package_price: number;
  deductible_package_duration: string;
  co_payments: number;
  specialist_discount: number;
  family_package: number;
  individual_package: number;
  status: boolean;
}

interface InsuranceDetail {
  id: number;
  carier: string;
  policy_type: string;
}

interface PersonalDetail {
  id: number;
  name: string;
  age: number;
  dob: string;
  gender: string;
}

interface FamilyDetail {
  id: number;
  name: string;
  relation: string;
  dob: string;
  gender: string;
  covered: true;
}

interface InsurancePlan {
  id: number;
  insurance_details: InsuranceDetail;
  personal_details: PersonalDetail;
  family_details: FamilyDetail[];
}

const Insurance = () => {
  const [isFamilySidebarOpen, setIsFamilySidebarOpen] = useState(false);
  const [plans, setPlans] = useState<AvailablePlans[]>([]);
  const [insurance, setInsurance] = useState<InsurancePlan[]>([]);

  const openFamilySidebar = () => {
    setIsFamilySidebarOpen(true);
  };

  const closeFamilySidebar = () => {
    setIsFamilySidebarOpen(false);
  };

  useEffectAsync(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/available_plans`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setPlans(await response.json());
      } else {
        toast.error("Failed to post data!", {
          position: "top-right",
        });
      }

      const insurance_plan = await fetch(
        `${process.env.REACT_APP_API_URL}/insurance_plan`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (insurance_plan.ok) {
        setInsurance(await insurance_plan.json());
      } else {
        toast.error("Failed to get Insurance data!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Error posting data!", {
        position: "top-right",
      });
      console.error("Error posting data:", error);
      // Handle error as needed
    }
  }, []);
  return (
    <div className="">
      <div className="flex max-lg:flex-col  items-start  p-0   bg-white ">
        <div className=" ">
          <div className="flex flex-col justify-between  w-[437px] max-lg:w-auto h-[243px] bg-white rounded border border-gray-300 gap-16  p-3 my-4 mx-4 ">
            <div className="flex flex-col text-left gap-1 ">
              <div className=" font-Satoshi font-normal text-14 text-black">
                Upgrade Requests
              </div>
              <div className="flex flex-row justify-center items-center  bg-neutral-300 rounded w-[103px] h-[32px]">
                <div className="font-Satoshi font-normal text-black mr-2">
                  3
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-[6px] h-[6px]">
                    <div className="w-[6px] h-[6px] bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="font-Satoshi font-normal text-black ml-2">
                    Pending
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 mb-8 bg-red-200 rounded-md p-3">
                <div className=" font-Satoshi font-medium text-24 text-black">
                  Genworth Life Insurance
                </div>
                <div className="flex flex-row justify-between items-center ">
                  <div className="flex-col flex">
                    <div className=" font-Satoshi font-normal text-14 text-black">
                      Policy Type
                    </div>
                    <div>Corporate</div>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-center items-start">
                      <div className=" font-Satoshi font-normal text-16 text-black">
                        Carier
                      </div>
                      <div>Genworth Life Insurance</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row  items-center  ml-48 gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between w-[437px] max-lg:w-auto h-[196px] bg-white rounded border border-gray-300 my-4 mx-4 ">
            <div className="flex flex-col gap-5 w-full h-full bg-blue-100 border border-blue-300 rounded p-2">
              <div className="flex items-center justify-between gap-44 w-full h-[28px]">
                <div className="w-[334px] h-[28px] font-Satoshi font-medium text-20 text-gray-800">
                  Your Information
                </div>
              </div>
              <div className="flex flex-wrap ">
                {/* First Item */}
                <div className="flex flex-col  gap-1 ml-2 ">
                  <div className="font-Satoshi font-normal text-14 text-gray-400">
                    Name
                  </div>
                  <div className="font-Satoshi font-normal text-16 text-gray-800">
                    John Doe
                  </div>
                </div>
                {/* Second Item */}
                <div className="flex flex-col  gap-1 ml-12">
                  <div className="font-Satoshi font-normal text-14 text-gray-400">
                    Age
                  </div>
                  <div className="font-Satoshi font-normal text-16 text-gray-800">
                    35 years
                  </div>
                </div>
                {/* Third Item */}
                <div className="flex flex-col gap-1 ml-12">
                  <div className="font-Satoshi font-normal text-14 text-gray-400">
                    Carrier
                  </div>
                  <div className="font-Satoshi font-normal text-16 text-gray-800">
                    Genworth Life Insurance
                  </div>
                </div>
              </div>
              <div className="flex mt-3">
                <div className="flex flex-col ml-2 ">
                  <div className="font-Satoshi font-normal text-14 text-gray-400">
                    Date of Birth
                  </div>
                  <div className="font-Satoshi font-normal text-16 text-gray-800">
                    05/10/1989
                  </div>
                </div>
                <div className="flex flex-col  ml-10">
                  <div className="font-Satoshi font-normal text-14 text-gray-400">
                    Gender
                  </div>
                  <div className="font-Satoshi font-normal text-16 text-gray-800">
                    Male
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between max-lg:w-auto w-[437px] h-[281px] bg-white rounded border border-gray-300 p-2 my-4 mx-4">
            <div className="flex flex-col  w-full h-full">
              <div className="flex flex-col  w-full ">
                <div className="flex justify-between items-start ">
                  <div className="flex items-center text-xl text-satoshi m text-neutral-8">
                    Family Details
                  </div>
                  <button
                    onClick={openFamilySidebar}
                    className="flex items-center  bg-neutral-1 border border-gray-300 shadow-button-secondary rounded"
                  >
                    <span className="text-satoshi px-3 py-1 font-regular text-character-title">
                      Edit Details
                    </span>{" "}
                  </button>
                </div>
                <div className="flex flex-col  ">
                  <div className="flex flex-wrap ">
                    <div className="flex flex-col ">
                      <div className="flex flex-col ">
                        <span className=" text-satoshi font-medium text-character-secondary">
                          Total Dependents
                        </span>{" "}
                        <div className="flex items-center ">
                          <div className="flex flex-col justify-center items-start p-0.5 h-full">
                            <span className=" text-satoshi font-regular text-character-title">
                              3
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-start  w-full ">
                        <div className=" flex items-center text-satoshi font-medium text-neutral-8">
                          Dependents Details
                        </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start  w-full bg-blue-200 px-2 py-1 rounded">
                          <span className=" text-satoshi font-medium text-black">
                            Name
                          </span>{" "}
                          <span className=" text-satoshi font-medium text-black mr-20">
                            Relation
                          </span>{" "}
                        </div>
                        <div className="flex justify-between items-start  w-full  border-b border-neutral-3  py-2">
                          <span className=" text-satoshi font-regular text-black">
                            Patricia Willis
                          </span>{" "}
                          <span className=" text-satoshi font-regular text-black  mr-28">
                            Wife
                          </span>{" "}
                        </div>
                        <div className="flex justify-between  w-full py-2 border-b border-neutral-3 ">
                          <span className="text-satoshi font-regular text-black">
                            Rosy Willis
                          </span>{" "}
                          <span className=" text-satoshi font-regular text-black  mr-20">
                            Daughter
                          </span>{" "}
                        </div>
                        <div className="flex justify-between items-start  w-full py-2 border-b border-neutral-3">
                          <span className="w-113 h-22 text-satoshi font-regular text-black">
                            Benjamin Willis
                          </span>{" "}
                          <span className="w-24 h-22 text-satoshi font-regular text-black mr-12">
                            Son
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start my-4">
          <div className="flex max-lg:flex-col items-center p-0 gap-6">
            
            <div className="flex flex-col r px-5 py-2 gap-2 bg-black text-white border-2 border-gray-300 rounded w-[330px] max-lg:w-auto h-[528px]">
              <div className="flex justify-between">
                <h3 className="font-normal text-2xl  leading-32 mb-5">Gold</h3>
                <svg
                  width="28"
                  height="30"
                  viewBox="0 0 28 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_1292_10097)">
                    <rect width="28" height="28" rx="4" fill="white" />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="27"
                      height="27"
                      rx="3.5"
                      stroke="#D9D9D9"
                    />
                    <g clipPath="url(#clip0_1292_10097)">
                      <rect
                        width="14"
                        height="14"
                        transform="translate(7 7)"
                        fill="white"
                        fillOpacity="0.01"
                      />
                      <path
                        d="M8.75 13.9844C8.75 14.0993 8.77263 14.2131 8.81661 14.3192C8.86058 14.4254 8.92503 14.5218 9.00628 14.6031C9.08753 14.6843 9.18399 14.7488 9.29015 14.7928C9.39631 14.8367 9.51009 14.8594 9.625 14.8594C9.73991 14.8594 9.85369 14.8367 9.95985 14.7928C10.066 14.7488 10.1625 14.6843 10.2437 14.6031C10.325 14.5218 10.3894 14.4254 10.4334 14.3192C10.4774 14.2131 10.5 14.0993 10.5 13.9844C10.5 13.8695 10.4774 13.7557 10.4334 13.6495C10.3894 13.5434 10.325 13.4469 10.2437 13.3657C10.1625 13.2844 10.066 13.22 9.95985 13.176C9.85369 13.132 9.73991 13.1094 9.625 13.1094C9.51009 13.1094 9.39631 13.132 9.29015 13.176C9.18399 13.22 9.08753 13.2844 9.00628 13.3657C8.92503 13.4469 8.86058 13.5434 8.81661 13.6495C8.77263 13.7557 8.75 13.8695 8.75 13.9844ZM13.125 13.9844C13.125 14.2164 13.2172 14.439 13.3813 14.6031C13.5454 14.7672 13.7679 14.8594 14 14.8594C14.2321 14.8594 14.4546 14.7672 14.6187 14.6031C14.7828 14.439 14.875 14.2164 14.875 13.9844C14.875 13.7523 14.7828 13.5298 14.6187 13.3657C14.4546 13.2016 14.2321 13.1094 14 13.1094C13.7679 13.1094 13.5454 13.2016 13.3813 13.3657C13.2172 13.5298 13.125 13.7523 13.125 13.9844ZM17.5 13.9844C17.5 14.2164 17.5922 14.439 17.7563 14.6031C17.9204 14.7672 18.1429 14.8594 18.375 14.8594C18.6071 14.8594 18.8296 14.7672 18.9937 14.6031C19.1578 14.439 19.25 14.2164 19.25 13.9844C19.25 13.7523 19.1578 13.5298 18.9937 13.3657C18.8296 13.2016 18.6071 13.1094 18.375 13.1094C18.1429 13.1094 17.9204 13.2016 17.7563 13.3657C17.5922 13.5298 17.5 13.7523 17.5 13.9844Z"
                        fill="black"
                        fillOpacity="0.85"
                      />
                    </g>
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_1292_10097"
                      x="0"
                      y="0"
                      width="28"
                      height="30"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="2" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.016 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1292_10097"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1292_10097"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_1292_10097">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(7 7)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col items-center p-0 ">
                <p className="text-lg">Premium</p>

                <p className="font-medium text-4xl leading-46 mt-2">
                  $150/month
                </p>
                <hr className="w-full border border-gray-300 mt-3" />

                <ul className="font-normal text-base leading-9 list-disc pl-4 mt-2">
                  <li className="mt-1 ">
                    Premium: <span className="">$100/month </span>{" "}
                  </li>
                  <li className="mt-1 ">
                    Deductible:
                    <span className="font-bold"> $750/year</span>
                  </li>
                  <li className="mt-1 ">
                    Co-payments:{" "}
                    <span className="font-bold">
                      $30 for primary care, 30%{" "}
                    </span>
                    for specialists
                  </li>
                  <li className="mt-1 ">
                    Out-of-Pocket Max:
                    <span className=" font-bold">
                      $4,000 (individual), $8,000 (family){" "}
                    </span>{" "}
                  </li>
                  <li className="mt-1 ">
                    Additional: Limited vision, moderate-sized network
                  </li>
                </ul>
              </div>
              <button className="flex max-lg:flex-col justify-center items-center p-4 -ml-2 gap-8 max-lg:w-auto w-[306px] h-[32px] bg-gray-100 border border-gray-200 rounded">
                <span className="text-black font-normal text-base">Active</span>
              </button>
            </div>

            <div className="flex flex-col  px-5 py-2 gap-2 bg-white border-2 border-gray-300 rounded w-[330px] max-lg:w-auto h-[528px]">
              <h3 className="font-normal text-2xl text-left text-black leading-32 mb-5">
                Silver
              </h3>
              <div className="flex flex-col items-center p-0 ">
                <p className="text-lg">Premium</p>

                <p className="font-medium text-4xl leading-46 mt-2">
                  $100/month
                </p>
                <hr className="w-full border border-gray-300 mt-3" />

                <ul className="font-normal text-base leading-9 list-disc pl-4 mt-2">
                  <li className="mt-1 ">
                    Premium:{" "}
                    <span className="text-black font-bold">$100/month </span>{" "}
                  </li>
                  <li className="mt-1 ">
                    Deductible:
                    <span className="text-black font-bold"> $750/year</span>
                  </li>
                  <li className="mt-1 ">
                    Co-payments:{" "}
                    <span className="text-black font-bold">
                      $30 for primary care, 30%{" "}
                    </span>
                    for specialists
                  </li>
                  <li className="mt-1 ">
                    Out-of-Pocket Max:
                    <span className="text-black font-bold">
                      $4,000 (individual), $8,000 (family){" "}
                    </span>{" "}
                  </li>
                  <li className="mt-1 ">
                    Additional: Limited vision, moderate-sized network
                  </li>
                </ul>
              </div>
              <button className="flex justify-center items-center p-4 -ml-2 w-[306px] max-lg:w-auto  h-[32px] bg-black border  rounded">
                <span className="font-normal text-base text-white">
                  Request to Upgrade
                </span>
              </button>
            </div>
            <div className="flex flex-col  px-5 py-2 gap-2 bg-white border-2 border-gray-300 rounded w-[330px] max-lg:w-auto h-[528px]">
              <h3 className="font-normal text-2xl text-black leading-32 mb-5">
                Platinum
              </h3>
              <div className="flex flex-col items-center p-0 ">
                <p className="text-lg">Premium</p>

                <p className="font-medium text-4xl leading-46 mt-2">
                  $250/month
                </p>
                <hr className="w-full border border-gray-300 mt-3" />

                <ul className="font-normal text-base leading-9 list-disc pl-4 mt-2">
                  <li className="mt-1 ">
                    Premium:{" "}
                    <span className="text-black font-bold">$100/month </span>{" "}
                  </li>
                  <li className="mt-1 ">
                    Deductible:
                    <span className="text-black font-bold"> $750/year</span>
                  </li>
                  <li className="mt-1 ">
                    Co-payments:{" "}
                    <span className="text-black font-bold">
                      $30 for primary care, 30%{" "}
                    </span>
                    for specialists
                  </li>
                  <li className="mt-1 ">
                    Out-of-Pocket Max:
                    <span className="text-black font-bold">
                      $4,000 (individual), $8,000 (family){" "}
                    </span>{" "}
                  </li>
                  <li className="mt-1">
                    Additional: Limited vision, moderate-sized network
                  </li>
                </ul>
              </div>
              <button className="flex justify-center items-center p-4 -ml-2 gap-8 w-[306px] max-lg:w-auto  h-[32px] bg-black rounded">
                <span className="font-normal text-base text-white">
                  Request to Upgrade
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <FamilySidebar
        isOpen={isFamilySidebarOpen}
        onClose={closeFamilySidebar}
      />
    </div>
  );
};

export default Insurance;
