import { Button, Card, Empty } from 'antd'
import React from 'react'
import EnrolledCourses from "../../public/images/enrolled-courses.svg";

function CourseCard() {
  return (
    <div>
        <Card
            bordered={false}
            // style={{ width: 610, height: 418, borderRadius: "0px" /}}
            className="w-[610px] h-[418px] max-lg:w-auto max-lg:mb-10"
          >
            <div className="w-96 h-20 flex-col justify-start items-start inline-flex">
              <div className="text-neutral-400 text-2xl font-normal  leading-loose ml-2">
                Enrolled Courses
              </div>

              <div className="w-[594px]  max-lg:w-[375px] py-2 px-1 ml-2 rounded-tl rounded-tr border-b border-neutral-200 justify-between items-start inline-flex">
                <div className="text-black text-sm font-medium  leading-snug ml-2">
                  Report Number
                </div>
                <div className="text-right text-black text-sm font-medium  leading-snug">
                  Status
                </div>
              </div>
            </div>
            <Empty
              image={EnrolledCourses}
              imageStyle={{
                marginTop: 50,
                height: 187,
                marginLeft: "165px",
              }}
              description={
                <span>
                  You are currently not enrolled in any courses. You can enroll
                  in course.
                </span>
              }
            >
              <Button
                type="default"
                style={{ color: "white", backgroundColor: "black" }}
              >
                Enroll Now
              </Button>
            </Empty>
          </Card>
    </div>
  )
}

export default CourseCard