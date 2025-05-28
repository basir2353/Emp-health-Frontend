import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";

const PricingPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showGoldSubscriptionButtons, setShowGoldSubscriptionButtons] =
    useState(false);
  const [showPlatinumSubscriptionButtons, setShowPlatinumSubscriptionButtons] =
    useState(false);
  const [showGoldBox, setShowGoldBox] = useState(true);
  const [showPlatinumBox, setShowPlatinumBox] = useState(true);

  const handleGoldSubscribeClick = () => {
    setShowGoldSubscriptionButtons(true);
    setShowPlatinumSubscriptionButtons(false);
    setShowPlatinumBox(false);
  };

  const handlePlatinumSubscribeClick = () => {
    setShowPlatinumSubscriptionButtons(true);
    setShowGoldSubscriptionButtons(false);
    setShowGoldBox(false);
  };

  const renderSubscriptionButtons = (plan: string) => {
    return (
      <div className="flex justify-center gap-4 mt-2">
        <button className="flex justify-center items-center p-4 w-[146px] h-[32px] bg-[#73D13D] border rounded">
          <span className="font-normal text-base text-white">Accept</span>
        </button>
        <button className="flex justify-center items-center p-4 w-[146px] h-[32px] bg-gray-100 border border-red-500 rounded">
          <span className="font-normal text-base text-red-600">Decline</span>
        </button>
      </div>
    );
  };

  return (
    <Modal
      visible={true}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={null}
    >
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="flex flex-col items-start  h-[632px] p-0 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center p-4">
            <div className="flex">
              <button onClick={onClose} className="absolute top-0 right-0 p-4">
                <CloseOutlined />
              </button>

              <div className="flex justify-between items-center ">
                <h2 className="font-medium text-base leading-24">
                  Insurance Plans
                </h2>
              </div>
            </div>
          </div>
          <hr className="w-full border border-gray-300 mt-2" />

          <div className="flex flex-col items-start px-5 py-4">
            <div className="flex items-center p-0 gap-6">
              <div className="flex flex-col items-center px-5 py-2 gap-2  border-2 border-gray-300 rounded w-[330px] h-[528px]">
                {(showGoldSubscriptionButtons ||
                  showPlatinumSubscriptionButtons) && (
                  <div className="flex items-center p-4 gap-6 absolute -mt-10">
                    <div className="flex items-center px-2 py-1 gap-2 bg-[#282828] rounded">
                      <span className="text-[14px] font-Satoshi font-regular text-white">
                        Current Plan
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center p-0 ">
                  <h3 className="font-normal text-2xl text-black leading-32 mb-5">
                    Silver
                  </h3>
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
                <button className="flex justify-center items-center p-4 mt-2 gap-8 w-[306px] h-[32px] bg-gray-100 border border-gray-200 rounded">
                  <span className="font-normal text-base">Curent plan</span>
                </button>
              </div>

              {showGoldBox && (
                <div className="flex flex-col items-center px-5 py-2 gap-2 bg-white border-2 border-gray-300 rounded w-[330px] h-[528px]">
                  <div className="flex flex-col items-center p-0 ">
                    {showGoldSubscriptionButtons && (
                      <div className="flex items-center p-4 gap-6 absolute -mt-10">
                        <div className="flex items-center px-2 py-1 gap-2 bg-[#282828] rounded">
                          <span className="text-[14px] font-Satoshi font-regular text-white">
                            Requested Plan
                          </span>
                        </div>
                      </div>
                    )}
                    <h3 className="font-normal text-2xl text-black leading-32 mb-5">
                      Gold
                    </h3>
                    <p className="text-lg">Premium</p>

                    <p className="font-medium text-4xl leading-46 mt-2">
                      $150/month
                    </p>
                    <hr className="w-full border border-gray-300 mt-3" />

                    <ul className="font-normal text-base leading-9 list-disc pl-4 mt-2">
                      <li className="mt-1 ">
                        Premium:{" "}
                        <span className="text-black font-bold">
                          $100/month{" "}
                        </span>{" "}
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
                  {!showGoldSubscriptionButtons ? (
                    <button
                      onClick={handleGoldSubscribeClick}
                      className="flex justify-center items-center p-4 mt-2 gap-8 w-[306px] h-[32px] bg-blue-500 border border-blue-500 rounded"
                    >
                      <span className="font-normal text-base text-white">
                        Subscribe
                      </span>
                    </button>
                  ) : (
                    renderSubscriptionButtons("Gold")
                  )}
                </div>
              )}

              {showPlatinumBox && (
                <div className="flex flex-col items-center px-5 py-2 gap-2 bg-white border-2 border-gray-300 rounded w-[330px] h-[528px]">
                  <div className="flex flex-col items-center p-0 ">
                    {showPlatinumSubscriptionButtons && (
                      <div className="flex items-center p-4 gap-6 absolute -mt-10">
                        <div className="flex items-center px-2 py-1 gap-2 bg-[#282828] rounded">
                          <span className="text-[14px] font-Satoshi font-regular text-white">
                            Requested Plan
                          </span>
                        </div>
                      </div>
                    )}
                    <h3 className="font-normal text-2xl text-black leading-32 mb-5">
                      Platinum
                    </h3>
                    <p className="text-lg">Premium</p>

                    <p className="font-medium text-4xl leading-46 mt-2">
                      $250/month
                    </p>
                    <hr className="w-full border border-gray-300 mt-3" />

                    <ul className="font-normal text-base leading-9 list-disc pl-4 mt-2">
                      <li className="mt-1 ">
                        Premium:{" "}
                        <span className="text-black font-bold">
                          $100/month{" "}
                        </span>{" "}
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
                  {!showPlatinumSubscriptionButtons ? (
                    <button
                      onClick={handlePlatinumSubscribeClick}
                      className="flex justify-center items-center p-4 mt-2 gap-8 w-[306px] h-[32px] bg-blue-500 border border-blue-500 rounded"
                    >
                      <span className="font-normal text-base text-white">
                        Subscribe
                      </span>
                    </button>
                  ) : (
                    renderSubscriptionButtons("Platinum")
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PricingPopup;
