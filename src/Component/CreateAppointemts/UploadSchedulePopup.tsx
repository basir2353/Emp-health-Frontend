import React, { useRef, useState } from "react";
import { Progress } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

const UploadSchedulePopup: React.FC<{ closePopup: () => void }> = ({
  closePopup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate file upload progress
      const totalSize = files[0].size || 1;
      let loaded = 0;
      const interval = setInterval(() => {
        loaded += totalSize / 10;
        if (loaded >= totalSize) {
          clearInterval(interval);
        }
        setUploadProgress(Math.min((loaded / totalSize) * 100, 100));
      }, 200);
      // Simulate completion of upload after 2 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setUploadedFile(files[0]);
      }, 2000);
      // Handle the selected files here
      console.log("Selected files:", files);
    }
  };

  const handleCancelUpload = () => {
    // Reset upload progress and uploaded file
    setUploadProgress(0);
    setUploadedFile(null);
  };

  return (
    <>
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded p-0 w-[443px] h-[402px]">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 px-6">
          <div className="text-lg font-bold">Upload Schedule</div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closePopup}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.0962 5.17606C11.0962 5.09749 11.0319 5.0332 10.9533 5.0332L9.77475 5.03856L7.99975 7.15463L6.22653 5.04035L5.04618 5.03499C4.96761 5.03499 4.90332 5.09749 4.90332 5.17785C4.90332 5.21178 4.91582 5.24392 4.93725 5.2707L7.26046 8.03856L4.93725 10.8046C4.91567 10.8308 4.9037 10.8636 4.90332 10.8975C4.90332 10.9761 4.96761 11.0403 5.04618 11.0403L6.22653 11.035L7.99975 8.91892L9.77296 11.0332L10.9515 11.0386C11.0301 11.0386 11.0944 10.9761 11.0944 10.8957C11.0944 10.8618 11.0819 10.8296 11.0605 10.8028L8.74082 8.03677L11.064 5.26892C11.0855 5.24392 11.0962 5.20999 11.0962 5.17606Z"
                fill="black"
                fillOpacity="0.45"
              />
              <path
                d="M8 0C3.58214 0 0 3.58214 0 8C0 12.4179 3.58214 16 8 16C12.4179 16 16 12.4179 16 8C16 3.58214 12.4179 0 8 0ZM8 14.6429C4.33214 14.6429 1.35714 11.6679 1.35714 8C1.35714 4.33214 4.33214 1.35714 8 1.35714C11.6679 1.35714 14.6429 4.33214 14.6429 8C14.6429 11.6679 11.6679 14.6429 8 14.6429Z"
                fill="black"
                fillOpacity="0.45"
              />
            </svg>
          </button>
        </div>
        <div className="w-[443px] h-[150px] px-5 mt-6">
          {/* Content */}
          <div className="flex flex-col mt-2">
            <div className="flex">
              <div className="w-[40px] h-[40px]">
                {/* Placeholder image */}
                {/* <img
                  src="https://s3-alpha-sig.figma.com/img/f44d/e633/4e73e66c68c799154a5074983b88c268?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HRRR8BQnWOOESDOsgPMIdvbszAv2IjLa3fIp82r5cR29QA2E30JkGo2m8n34fVMmKp5ZJ~1CaFhjh2B8H8oRXmZedY~f81Bw1HUw7hU3aBhXQpXmfyPWNRC0SE9M46NTO~OsaRf84bbyqyPb1aIHgLkpR0KokmCl0lcNes3LmMwi6tPSjtIgh0ZnyL-igJJuJaEXNwz3pZjM9Rr7xrEUNLRXnpxTWHkd8H6ShW7uI~8TIj9B2ZL8-Z67XfURHSg7ni-Qy7~s290w-4WuTO0YNy0JSjNvwlTzu~dnMIAT7cXhToCGT0UPwWfWrZ3aUp2kCaTQogmvnf3HkmTAYd6-tg__"
                  alt="Placeholder"
                /> */}
                <FileExcelOutlined />
              </div>
              <div className="flex flex-col ml-4">
                <div className="text-lg font-bold">Upload Schedule</div>
                <div className="text-sm text-gray-500">
                  Download the template & upload it.
                </div>
              </div>
              <button
                onClick={handleFileUpload}
                className="ml-16 focus:outline-none"
              >
                <svg
                  width="32"
                  height="34"
                  viewBox="0 0 32 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_1200_251)">
                    <rect width="32" height="32" rx="4" fill="black" />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="31"
                      height="31"
                      rx="3.5"
                      stroke="black"
                    />
                    <g clipPath="url(#clip0_1200_251)">
                      <rect
                        width="14"
                        height="14"
                        transform="translate(9 9)"
                        fill="white"
                        fillOpacity="0.01"
                      />
                      <path
                        d="M15.9016 18.3252C15.9133 18.3401 15.9282 18.3522 15.9453 18.3605C15.9623 18.3688 15.981 18.3732 16 18.3732C16.019 18.3732 16.0377 18.3688 16.0547 18.3605C16.0718 18.3522 16.0867 18.3401 16.0984 18.3252L17.8484 16.1111C17.9125 16.0299 17.8547 15.9096 17.75 15.9096H16.5922V10.6221C16.5922 10.5533 16.5359 10.4971 16.4672 10.4971H15.5297C15.4609 10.4971 15.4047 10.5533 15.4047 10.6221V15.908H14.25C14.1453 15.908 14.0875 16.0283 14.1516 16.1096L15.9016 18.3252ZM21.7188 17.7783H20.7812C20.7125 17.7783 20.6562 17.8346 20.6562 17.9033V20.3096H11.3438V17.9033C11.3438 17.8346 11.2875 17.7783 11.2188 17.7783H10.2812C10.2125 17.7783 10.1562 17.8346 10.1562 17.9033V20.9971C10.1562 21.2736 10.3797 21.4971 10.6562 21.4971H21.3438C21.6203 21.4971 21.8438 21.2736 21.8438 20.9971V17.9033C21.8438 17.8346 21.7875 17.7783 21.7188 17.7783Z"
                        fill="white"
                      />
                    </g>
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_1200_251"
                      x="0"
                      y="0"
                      width="32"
                      height="34"
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
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.043 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1200_251"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1200_251"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_1200_251">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(9 9)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div
              className="flex justify-center items-center w-[395px] h-[150px] bg-gray-100 mt-2"
              onClick={handleFileUpload}
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  width="49"
                  height="48"
                  viewBox="0 0 49 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M41.9939 20.9109L41.9845 20.8734L36.7252 7.50937C36.4908 6.75469 35.7923 6.23438 35.0002 6.23438H13.6814C12.8845 6.23438 12.1767 6.76406 11.9517 7.52813L7.03453 20.7562L7.02047 20.7891L7.01109 20.8266C6.95016 21.0562 6.93141 21.2906 6.96422 21.5203C6.95953 21.5953 6.95484 21.6703 6.95484 21.7453V38.8969C6.95608 39.6524 7.25675 40.3765 7.79096 40.9108C8.32517 41.445 9.04936 41.7456 9.80484 41.7469H39.2048C40.7752 41.7469 42.0548 40.4672 42.0595 38.8969V21.7453C42.0595 21.6844 42.0595 21.6234 42.0548 21.5719C42.0736 21.3422 42.0548 21.1219 41.9939 20.9109ZM28.1283 18.8953L28.1142 19.6312C28.0767 21.7359 26.6236 23.1516 24.5002 23.1516C23.4642 23.1516 22.5736 22.8187 21.9314 22.1859C21.2892 21.5531 20.9377 20.6719 20.9189 19.6312L20.9048 18.8953H11.258L14.9845 9.83437H33.697L37.5267 18.8953H28.1283ZM10.5502 22.4953H17.9236C19.0627 25.1719 21.4861 26.7516 24.5048 26.7516C26.0845 26.7516 27.5517 26.3109 28.7377 25.4766C29.7783 24.7453 30.5892 23.7234 31.1142 22.4953H38.4502V38.1469H10.5502V22.4953Z"
                    fill="#1890FF"
                  />
                </svg>

                <div className="text-black text-base mt-6">
                  <p>Click or drag file to this area to upload</p>
                </div>
                <div>
                  <p className="text-base text-gray-600 cursor-pointer ">
                    Please drag & drop the file here or{" "}
                    <span
                      // onClick={handleFileUpload}
                      className="underline text-blue-700"
                    >
                      click here
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          {uploadedFile && (
            <div className="flex items-center mt-4 text-blue-600">
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.1766 2.07461C8.7047 0.602734 6.30783 0.602734 4.83751 2.07461L0.75939 6.14961C0.732827 6.17617 0.718764 6.21211 0.718764 6.24961C0.718764 6.28711 0.732827 6.32305 0.75939 6.34961L1.33595 6.92617C1.36231 6.95241 1.39798 6.96714 1.43517 6.96714C1.47236 6.96714 1.50804 6.95241 1.53439 6.92617L5.61251 2.85117C6.11877 2.34492 6.7922 2.0668 7.50783 2.0668C8.22345 2.0668 8.89689 2.34492 9.40158 2.85117C9.90783 3.35742 10.186 4.03086 10.186 4.74492C10.186 5.46055 9.90783 6.13242 9.40158 6.63867L5.24533 10.7934L4.57189 11.4668C3.9422 12.0965 2.91876 12.0965 2.28908 11.4668C1.98439 11.1621 1.8172 10.7574 1.8172 10.3262C1.8172 9.89492 1.98439 9.49024 2.28908 9.18555L6.41252 5.06367C6.5172 4.96055 6.6547 4.90273 6.80158 4.90273H6.80314C6.95002 4.90273 7.08595 4.96055 7.18908 5.06367C7.29376 5.16836 7.35002 5.30586 7.35002 5.45273C7.35002 5.59805 7.2922 5.73555 7.18908 5.83867L3.81876 9.20586C3.7922 9.23242 3.77814 9.26836 3.77814 9.30586C3.77814 9.34336 3.7922 9.3793 3.81876 9.40586L4.39533 9.98242C4.42168 10.0087 4.45736 10.0234 4.49455 10.0234C4.53174 10.0234 4.56741 10.0087 4.59377 9.98242L7.96251 6.61367C8.27345 6.30273 8.44377 5.89023 8.44377 5.45117C8.44377 5.01211 8.27189 4.59805 7.96251 4.28867C7.32033 3.64648 6.27658 3.64805 5.63439 4.28867L5.23439 4.69023L1.51251 8.41055C1.25991 8.66167 1.05967 8.96045 0.923413 9.28956C0.787158 9.61866 0.717597 9.97154 0.718764 10.3277C0.718764 11.0512 1.00158 11.7309 1.51251 12.2418C2.0422 12.7699 2.73595 13.034 3.4297 13.034C4.12345 13.034 4.8172 12.7699 5.34533 12.2418L10.1766 7.41367C10.8875 6.70117 11.2813 5.75273 11.2813 4.74492C11.2828 3.73555 10.8891 2.78711 10.1766 2.07461Z"
                  fill="black"
                  fillOpacity="0.45"
                />
              </svg>

              <span>{uploadedFile.name}</span>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress
              type="line"
              strokeColor="black"
              percent={uploadProgress}
              showInfo={false}
              style={{ width: "395px" }}
            />
          )}
        </div>
        <div className="flex justify-end mt-28 pt-4 px-6">
          <button
            className="bg-white border-2 border-black px-4 py-2 rounded mr-2"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={closePopup}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadSchedulePopup;
